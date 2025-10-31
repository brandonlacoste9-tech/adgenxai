# Database Schema Documentation

This document describes the Supabase database schema for AdGenXAI.

## Overview

AdGenXAI uses Supabase for authentication, data persistence, and real-time features. The schema is designed with Row Level Security (RLS) to ensure data isolation per user/organization.

## Schema Setup

### Quick Start

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Open the SQL Editor in your Supabase dashboard
3. Run the SQL scripts below to create tables and enable RLS

## Tables

### Users Table

Extends Supabase Auth users with profile information.

```sql
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  org_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can only see their own profile
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);
```

### Agents Table

Stores AI agent configurations and performance data.

```sql
CREATE TABLE IF NOT EXISTS public.agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  model TEXT DEFAULT 'gpt-4o-mini',
  system_prompt TEXT,
  is_active BOOLEAN DEFAULT true,
  conversation_count INTEGER DEFAULT 0,
  success_rate DECIMAL(5,2) DEFAULT 0,
  avg_response_time DECIMAL(5,2) DEFAULT 0,
  last_active_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- Users can only see their own agents
CREATE POLICY "Users can view own agents"
  ON public.agents FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own agents
CREATE POLICY "Users can create own agents"
  ON public.agents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own agents
CREATE POLICY "Users can update own agents"
  ON public.agents FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own agents
CREATE POLICY "Users can delete own agents"
  ON public.agents FOR DELETE
  USING (auth.uid() = user_id);
```

### Conversations Table

Stores conversation history and metadata.

```sql
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  title TEXT,
  status TEXT DEFAULT 'active', -- active, completed, archived
  message_count INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  cost DECIMAL(10,6) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Users can only see their own conversations
CREATE POLICY "Users can view own conversations"
  ON public.conversations FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own conversations
CREATE POLICY "Users can create own conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own conversations
CREATE POLICY "Users can update own conversations"
  ON public.conversations FOR UPDATE
  USING (auth.uid() = user_id);
```

### Messages Table

Stores individual messages within conversations.

```sql
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- system, user, assistant
  content TEXT NOT NULL,
  tokens INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Users can only see messages from their own conversations
CREATE POLICY "Users can view own messages"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

-- Users can create messages in their own conversations
CREATE POLICY "Users can create own messages"
  ON public.messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );
```

### Badges Table

Stores achievement badges and rituals.

```sql
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  criteria JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- No RLS needed - badges are public
```

### User Badges Table

Tracks which badges users have earned.

```sql
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Enable RLS
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Users can only see their own badges
CREATE POLICY "Users can view own badges"
  ON public.user_badges FOR SELECT
  USING (auth.uid() = user_id);
```

## Views

### Agent Performance Summary

A view for aggregating agent performance metrics.

```sql
CREATE OR REPLACE VIEW agent_performance_summary AS
SELECT
  a.id,
  a.name,
  a.user_id,
  COUNT(DISTINCT c.id) as conversation_count,
  COALESCE(AVG(c.total_tokens), 0) as avg_tokens_per_conversation,
  COALESCE(SUM(c.cost), 0) as total_cost,
  a.success_rate,
  a.avg_response_time,
  a.last_active_at
FROM public.agents a
LEFT JOIN public.conversations c ON c.agent_id = a.id
GROUP BY a.id, a.name, a.user_id, a.success_rate, a.avg_response_time, a.last_active_at;
```

## Indexes

Create indexes for better query performance:

```sql
-- Index on user_id for faster user-based queries
CREATE INDEX IF NOT EXISTS idx_agents_user_id ON public.agents(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_agent_id ON public.conversations(agent_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON public.user_badges(user_id);

-- Index on timestamps for sorting
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON public.conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);
```

## Functions

### Update Timestamp Function

Automatically update `updated_at` timestamps:

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at column
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON public.agents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## Row Level Security (RLS) Best Practices

1. **Always enable RLS** on tables containing user data
2. **Use auth.uid()** to reference the current authenticated user
3. **Scope by user_id** for user-specific data
4. **Scope by org_id** for organization-level sharing (future)
5. **Use policies for each operation** (SELECT, INSERT, UPDATE, DELETE)

## Migration Guide

To apply this schema to your Supabase project:

1. Copy each SQL block into the Supabase SQL Editor
2. Run them in order (tables first, then views, then indexes, then functions/triggers)
3. Verify that RLS is enabled on all user tables
4. Test policies by creating test records

## Security Notes

- **Never expose service role key** to the client
- **Use anon key** for client-side operations (respects RLS)
- **Validate all inputs** before inserting into database
- **Use parameterized queries** to prevent SQL injection
- **Audit RLS policies** regularly to ensure proper isolation

## Future Enhancements

- [ ] Add organization/team support with `org_id` scoping
- [ ] Add real-time subscriptions for live updates
- [ ] Add analytics tables for usage tracking
- [ ] Add webhook event log table
- [ ] Add file storage integration for avatars/uploads
- [ ] Add full-text search indexes for conversations
