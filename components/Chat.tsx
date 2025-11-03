"use client";
import { useEffect, useRef, useState } from "react";

export default function Chat({ applicationId }: { applicationId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  async function load() {
    const res = await fetch(`/api/messages?applicationId=${applicationId}`);
    if (res.ok) setMessages(await res.json());
  }
  async function send() {
    if (!text.trim()) return;
    await fetch("/api/messages", { method: "POST", body: JSON.stringify({ applicationId, content: text }) });
    setText(""); await load();
    setTimeout(()=>listRef.current?.scrollTo({ top: 99999, behavior: "smooth" }), 50);
  }
  useEffect(()=>{ load(); }, [applicationId]);

  return (
    <div className="card">
      <h4 className="font-semibold mb-2">Chat</h4>
      <div ref={listRef} className="h-48 overflow-y-auto space-y-2 mb-3 pr-1">
        {messages.map((m)=>(
          <div key={m.id} className="text-sm">
            <span className="text-white/50">{new Date(m.created_at).toLocaleString()} · </span>
            <span>{m.content}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input className="input" value={text} onChange={e=>setText(e.target.value)} placeholder="Type a message…" />
        <button onClick={send} className="btn btn-primary">Send</button>
      </div>
    </div>
  );
}
