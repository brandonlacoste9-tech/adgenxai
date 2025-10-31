# Database Schema

**Phase-2 PR-1: Supabase**

## Goal
Replace mock reads with Supabase queries (views/RPC) and real-time channels.

## TODO
- [ ] Define database schema with RLS policies
- [ ] Create SQL views for common queries
- [ ] Implement RPC functions for complex operations
- [ ] Set up real-time channels
- [ ] Add TypeScript types from database
- [ ] Integration tests with Supabase
- [ ] Document RLS assumptions

## Schema Overview
```sql
-- Tables
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own campaigns"
  ON campaigns FOR SELECT
  USING (auth.uid() = user_id);
```
