import type { Handler } from '@netlify/functions';

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>ChatKit Integration Guide</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    :root {
      color-scheme: light dark;
      font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      line-height: 1.6;
    }
    body {
      margin: 0;
      background: linear-gradient(135deg, #091540, #1f3c88);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3rem 1.5rem;
    }
    main {
      background: rgba(255, 255, 255, 0.96);
      color: #111827;
      max-width: 960px;
      width: 100%;
      border-radius: 18px;
      box-shadow: 0 32px 80px rgba(15, 23, 42, 0.35);
      padding: clamp(2rem, 2vw + 1rem, 3.5rem);
    }
    h1 {
      font-size: clamp(2rem, 5vw, 2.75rem);
      margin-bottom: 0.75rem;
    }
    p.lede {
      font-size: 1.125rem;
      color: #4b5563;
      margin-bottom: 2rem;
    }
    section + section {
      margin-top: 2.5rem;
      border-top: 1px solid rgba(79, 70, 229, 0.25);
      padding-top: 2.5rem;
    }
    h2 {
      font-size: clamp(1.5rem, 3vw, 1.9rem);
      color: #312e81;
    }
    .steps {
      display: grid;
      gap: 1.5rem;
      margin: 1.25rem 0;
      list-style: none;
      counter-reset: step;
      padding: 0;
    }
    .steps li {
      position: relative;
      padding-left: 3.5rem;
      background: rgba(79, 70, 229, 0.08);
      border-radius: 14px;
      padding: 1.5rem 1.5rem 1.5rem 3.5rem;
      box-shadow: inset 0 0 0 1px rgba(79, 70, 229, 0.25);
    }
    .steps li::before {
      counter-increment: step;
      content: counter(step);
      position: absolute;
      left: 1.1rem;
      top: 1.25rem;
      width: 1.8rem;
      height: 1.8rem;
      border-radius: 999px;
      background: #4f46e5;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }
    code, pre {
      font-family: 'Fira Code', 'Source Code Pro', monospace;
      background: rgba(15, 23, 42, 0.9);
      color: #f8fafc;
      border-radius: 10px;
    }
    pre {
      overflow-x: auto;
      padding: 1rem 1.25rem;
      margin: 1rem 0;
    }
    .resources {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      margin-top: 1.5rem;
    }
    .resource-card {
      background: rgba(255, 255, 255, 0.9);
      border-radius: 12px;
      padding: 1.25rem;
      box-shadow: 0 10px 35px rgba(79, 70, 229, 0.18);
      border: 1px solid rgba(99, 102, 241, 0.2);
    }
    a {
      color: #4338ca;
      text-decoration: none;
      font-weight: 600;
    }
    a:hover {
      text-decoration: underline;
    }
    .cta {
      margin-top: 2.5rem;
      padding: 1.75rem;
      border-radius: 16px;
      background: rgba(99, 102, 241, 0.12);
      border: 1px dashed rgba(79, 70, 229, 0.4);
    }
    .cta strong {
      display: block;
      font-size: 1.1rem;
      margin-bottom: 0.75rem;
    }
  </style>
</head>
<body>
  <main>
    <h1>ChatKit Embedding Ritual</h1>
    <p class="lede">Summon ChatKit into your product in three movements—craft a workflow, open a session, then weave the widget into your UI. Each stanza below mirrors the official guide, tuned for the AdgenXAI sensory cortex.</p>

    <section>
      <h2>1. Compose an Agent Workflow</h2>
      <p>Design your agent within <a href="https://platform.openai.com/agent" target="_blank" rel="noopener">Agent Builder</a>. The workflow ID you receive becomes the anchor for every chat session. Keep it safe; you will pass it to the session creation API when birthing a new ChatKit client secret.</p>
    </section>

    <section>
      <h2>2. Forge Your ChatKit Session Endpoint</h2>
      <ol class="steps">
        <li>
          <strong>Generate a client secret on the server.</strong>
          <p>Wrap the <code>openai.chatkit.sessions.create</code> call inside a serverless ritual. FastAPI is shown here, though any backend vessel will do.</p>
          <pre><code class="language-python">from fastapi import FastAPI
from openai import OpenAI

app = FastAPI()
openai = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

@app.post("/api/chatkit/session")
def create_chatkit_session():
    session = openai.chatkit.sessions.create({
        "workflow": {"id": "wf_..."},
        # Optional: pass user metadata, files, tools
    })
    return {"client_secret": session.client_secret}
</code></pre>
        </li>
        <li>
          <strong>Exchange device identity for a secret.</strong>
          <p>The frontend asks this endpoint for a fresh client secret, delivering a device or user identifier so you can thread sessions.</p>
          <pre><code class="language-typescript">export async function getChatKitSessionToken(deviceId: string) {
  const res = await fetch("https://api.openai.com/v1/chatkit/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "OpenAI-Beta": "chatkit_beta=v1",
      Authorization: \`Bearer \${process.env.VITE_OPENAI_API_SECRET_KEY}\`,
    },
    body: JSON.stringify({
      workflow: { id: "wf_68df4b13b3588190a09d19288d4610ec0df388c3983f58d1" },
      user: deviceId,
    }),
  });

  const { client_secret } = await res.json();
  return client_secret;
}
</code></pre>
        </li>
        <li>
          <strong>Install the ChatKit bindings.</strong>
          <p>Add <code>@openai/chatkit-react</code> to your dependencies and load the hosted script. The CDN bundle keeps the widget evergreen.</p>
          <pre><code class="language-bash">npm install @openai/chatkit-react
<!-- in your HTML head -->
&lt;script src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js" async&gt;&lt;/script&gt;
</code></pre>
        </li>
        <li>
          <strong>Render the widget.</strong>
          <p>Mount the component or use the vanilla script API. Refresh logic allows long-lived sessions.</p>
          <pre><code class="language-tsx">import { ChatKit, useChatKit } from "@openai/chatkit-react";

export function MyChat() {
  const { control } = useChatKit({
    api: {
      async getClientSecret(existing) {
        if (existing) {
          // refresh logic here
        }
        const res = await fetch("/api/chatkit/session", { method: "POST" });
        const { client_secret } = await res.json();
        return client_secret;
      },
    },
  });

  return &lt;ChatKit control={control} className="h-[600px] w-[320px]" /&gt;;
}
</code></pre>
          <pre><code class="language-javascript">const chatkit = document.getElementById("my-chat");

chatkit.setOptions({
  api: {
    async getClientSecret(currentClientSecret) {
      if (!currentClientSecret) {
        const res = await fetch("/api/chatkit/start", { method: "POST" });
        const { client_secret } = await res.json();
        return client_secret;
      }

      const res = await fetch("/api/chatkit/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentClientSecret }),
      });
      const { client_secret } = await res.json();
      return client_secret;
    },
  },
});
</code></pre>
        </li>
      </ol>
    </section>

    <section>
      <h2>3. Iterate with Widgets, Themes, and Tools</h2>
      <p>When your embed is alive, explore the wider ChatKit ecosystem: craft custom themes, add widgets, and wire in tool invocations. Evaluate your agent with structured feedback loops.</p>
      <div class="resources">
        <div class="resource-card">
          <strong>Docs on GitHub</strong>
          <p><a href="https://openai.github.io/chatkit-python" target="_blank" rel="noopener">Authentication, storage, and server patterns</a>.</p>
        </div>
        <div class="resource-card">
          <strong>Python SDK</strong>
          <p><a href="https://github.com/openai/chatkit-python" target="_blank" rel="noopener">Extend your backend with storage and tools</a>.</p>
        </div>
        <div class="resource-card">
          <strong>JS SDK</strong>
          <p><a href="https://github.com/openai/chatkit-js" target="_blank" rel="noopener">Build custom browser integrations</a>.</p>
        </div>
        <div class="resource-card">
          <strong>Widget Builder</strong>
          <p><a href="https://widgets.chatkit.studio" target="_blank" rel="noopener">Browse and compose interface widgets</a>.</p>
        </div>
      </div>
    </section>

    <section class="cta">
      <strong>Next Steps</strong>
      <p>When you are satisfied with your ChatKit ritual, measure its insight with <a href="https://platform.openai.com/docs/guides/agent-evals" target="_blank" rel="noopener">agent evals</a>, or graduate to the advanced integration path to run ChatKit within your own observatory.</p>
    </section>
  </main>
</body>
</html>`;

export const handler: Handler = async () => ({
  statusCode: 200,
  headers: {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'public, max-age=300'
  },
  body: html
});
