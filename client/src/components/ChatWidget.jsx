import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';

const SUGGESTIONS = [
  'Show me frontend jobs',
  'Resume tips for junior devs',
  'How does HireIQ work?',
  'Career advice for switching fields',
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  const send = async (text) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMsg = { role: 'user', content };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setErr('');
    setLoading(true);

    try {
      const { data } = await api.post('/chat', {
        message: content,
        history: messages,
      });
      setMessages([...next, { role: 'assistant', content: data.reply }]);
    } catch (e) {
      setErr(e.response?.data?.error || 'Something went wrong. Please try again.');
      setMessages(next);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const reset = () => {
    setMessages([]);
    setErr('');
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open assistant"
          className="fixed z-[60] bottom-5 right-5 sm:bottom-6 sm:right-6 w-14 h-14 rounded-full bg-brand-600 hover:bg-brand-700 text-white grid place-items-center shadow-lg shadow-brand-500/40 transition-all hover:scale-105 active:scale-95"
        >
          <ChatIcon />
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white" />
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed z-[60] bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[400px] h-[100dvh] sm:h-[600px] sm:max-h-[calc(100dvh-3rem)] flex flex-col bg-white sm:rounded-2xl border border-gray-200 shadow-2xl shadow-brand-500/15 overflow-hidden" style={{ animation: 'var(--animate-fade-up)' }}>
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-brand-600 to-brand-700 text-white">
            <div className="w-9 h-9 rounded-full bg-white/15 grid place-items-center backdrop-blur-sm">
              <SparkleIcon />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold leading-tight">HireIQ Assistant</div>
              <div className="text-[11px] text-white/80 leading-tight inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                Online · Powered by AI
              </div>
            </div>
            {messages.length > 0 && (
              <button onClick={reset} title="New chat" className="text-white/80 hover:text-white p-1.5 rounded-md hover:bg-white/10 transition-colors">
                <RefreshIcon />
              </button>
            )}
            <button onClick={() => setOpen(false)} aria-label="Close" className="text-white/80 hover:text-white p-1.5 rounded-md hover:bg-white/10 transition-colors">
              <CloseIcon />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-4" style={{ background: '#f0f0f8' }}>
            {messages.length === 0 && (
              <div className="space-y-4">
                <BotMessage>
                  Hi! I'm the HireIQ Assistant. I can help you find jobs, polish your resume, explain how the platform works, or share career advice. What can I help with?
                </BotMessage>
                <div className="space-y-2">
                  <div className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold px-1">Try asking</div>
                  <div className="grid grid-cols-1 gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="text-left text-sm px-3.5 py-2.5 rounded-lg border border-brand-100 bg-white hover:bg-brand-50 hover:border-brand-200 text-gray-700 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.map((m, i) =>
              m.role === 'user' ? (
                <UserMessage key={i}>{m.content}</UserMessage>
              ) : (
                <BotMessage key={i}>{m.content}</BotMessage>
              )
            )}

            {loading && (
              <div className="flex items-end gap-2">
                <BotAvatar />
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <Dot delay="0s" />
                    <Dot delay="0.15s" />
                    <Dot delay="0.3s" />
                  </div>
                </div>
              </div>
            )}

            {err && (
              <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                {err}
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="px-3 py-3 border-t border-gray-200 bg-white"
          >
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask about jobs, resumes, or careers…"
                rows={1}
                className="flex-1 resize-none max-h-32 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100/50 transition-colors"
                style={{ minHeight: '42px' }}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed text-white grid place-items-center transition-colors flex-shrink-0"
                aria-label="Send"
              >
                <SendIcon />
              </button>
            </div>
            <div className="text-[10px] text-gray-400 mt-1.5 text-center">
              AI may make mistakes. Verify important details.
            </div>
          </form>
        </div>
      )}
    </>
  );
}

function UserMessage({ children }) {
  return (
    <div className="flex justify-end">
      <div className="bg-brand-600 text-white rounded-2xl rounded-br-sm px-3.5 py-2.5 text-sm max-w-[85%] whitespace-pre-wrap break-words leading-relaxed">
        {children}
      </div>
    </div>
  );
}

function BotMessage({ children }) {
  return (
    <div className="flex items-end gap-2">
      <BotAvatar />
      <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-sm max-w-[85%] text-gray-800 leading-relaxed">
        <RichText text={typeof children === 'string' ? children : ''} fallback={children} />
      </div>
    </div>
  );
}

function RichText({ text, fallback }) {
  if (typeof text !== 'string') return fallback;
  // Linkify /jobs and /jobs/123, /register etc
  const parts = text.split(/(\/(?:jobs(?:\/\d+)?|register|login|post-job|dashboard\/(?:jobseeker|recruiter)))/g);
  return (
    <span className="whitespace-pre-wrap break-words">
      {parts.map((p, i) =>
        /^\/[a-z]/.test(p) ? (
          <Link key={i} to={p} className="text-brand-700 font-medium hover:underline">
            {p}
          </Link>
        ) : (
          <React.Fragment key={i}>{p}</React.Fragment>
        )
      )}
    </span>
  );
}

function BotAvatar() {
  return (
    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 grid place-items-center text-white flex-shrink-0 shadow-sm">
      <SparkleIcon size={14} />
    </div>
  );
}

function Dot({ delay }) {
  return (
    <span
      className="w-1.5 h-1.5 rounded-full bg-brand-400 inline-block"
      style={{ animation: 'chatDot 1.2s ease-in-out infinite', animationDelay: delay }}
    />
  );
}

function ChatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function SparkleIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.5 5.5L20 10l-5.5 2.5L12 18l-2.5-5.5L4 10l5.5-2.5z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}
