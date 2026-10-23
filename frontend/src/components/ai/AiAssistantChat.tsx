import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  X,
  Send,
  RotateCcw,
  BookOpen,
  AlertCircle,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { aiService } from '../../services/aiService';
import { ChatMessage } from '../../types/ai';
import { useAuth } from '../../context/AuthContext';

const SUGGESTED_PROMPTS = [
  'Recommend beginner-friendly programming books',
  'Which books are available right now?',
  'Find books about Artificial Intelligence',
  'What are the library borrowing rules and limits?',
  'Compare Clean Code and Effective Java',
];

interface AiAssistantChatProps {
  isOpen?: boolean;
  onClose?: () => void;
  standalone?: boolean;
}

export const AiAssistantChat: React.FC<AiAssistantChatProps> = ({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  standalone = false,
}) => {
  const { user } = useAuth();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const handleClose = controlledOnClose || (() => setInternalIsOpen(false));

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = sessionStorage.getItem('slms_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [minimized, setMinimized] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Sync to session storage
  useEffect(() => {
    sessionStorage.setItem('slms_chat_history', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen && !minimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, minimized]);

  const handleSend = async (messageToSend?: string) => {
    const text = (messageToSend || input).trim();
    if (!text || loading) return;

    setError(null);
    setInput('');

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    try {
      const history = newMessages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await aiService.sendMessage({
        message: text,
        history,
      });

      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRateLimited: res.isRateLimited,
        matchedBooks: res.matchedBooks,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Failed to reach AI service';
      setError(errMsg);

      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Unable to complete request:** ${errMsg}\n\nPlease check your network or try again. All catalog search and book operations remain available.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([]);
    setError(null);
    sessionStorage.removeItem('slms_chat_history');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Format assistant message text (render headers, bold, bullet points)
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed text-slate-200">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1.5" />;

          // Header ###
          if (line.startsWith('### ')) {
            return (
              <h4 key={idx} className="font-bold text-white text-sm sm:text-base mt-2 mb-1 flex items-center gap-1.5 text-brand-300">
                {line.replace('### ', '')}
              </h4>
            );
          }

          // Bullet point
          if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* ')) {
            const raw = line.slice(2);
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="text-brand-400 font-bold shrink-0 mt-0.5">•</span>
                <span>{renderInlineMarkdown(raw)}</span>
              </div>
            );
          }

          return <p key={idx}>{renderInlineMarkdown(line)}</p>;
        })}
      </div>
    );
  };

  // Parse inline **bold** and `code`
  const renderInlineMarkdown = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1 py-0.5 rounded bg-slate-800 text-brand-300 font-mono text-xs border border-slate-700">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  const chatCard = (
    <div className="flex flex-col h-full bg-slate-900/95 backdrop-blur-xl border border-slate-700/70 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-brand-900/40 via-slate-900 to-indigo-950/40 border-b border-slate-700/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 text-white shadow-lg shadow-brand-500/25">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">Library AI Assistant</h3>
              <span className="px-1.5 py-0.5 rounded-full bg-brand-500/15 text-brand-300 text-[10px] font-semibold border border-brand-500/30">
                Groq AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Grounded in real library catalog & rules</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={handleClearHistory}
              title="Clear conversation"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
          {!standalone && (
            <>
              <button
                type="button"
                onClick={() => setMinimized((m) => !m)}
                title={minimized ? 'Expand' : 'Minimize'}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${minimized ? 'rotate-180' : ''}`} />
              </button>
              <button
                type="button"
                onClick={handleClose}
                title="Close assistant"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {!minimized && (
        <>
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="py-6 px-2 text-center space-y-4">
                <div className="inline-flex p-3 rounded-2xl bg-brand-500/10 border border-brand-500/25 text-brand-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    Hello, {user?.fullName || 'Reader'}!
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                    I am your AI Library Assistant. Ask me to find books, check availability, compare titles, or explain library borrowing rules.
                  </p>
                </div>

                <div className="pt-2 text-left">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">
                    Suggested Questions:
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {SUGGESTED_PROMPTS.map((prompt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSend(prompt)}
                        className="text-left text-xs text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-brand-500/40 rounded-xl px-3 py-2 transition-all flex items-center justify-between group"
                      >
                        <span className="truncate">{prompt}</span>
                        <Sparkles className="w-3 h-3 text-slate-500 group-hover:text-brand-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-md ${
                      msg.role === 'user'
                        ? 'bg-brand-600 text-white rounded-br-xs'
                        : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-bl-xs'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      renderFormattedContent(msg.content)
                    ) : (
                      <p className="text-xs sm:text-sm whitespace-pre-wrap">{msg.content}</p>
                    )}

                    {/* Matched Books Cards in Assistant Response */}
                    {msg.role === 'assistant' && msg.matchedBooks && msg.matchedBooks.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-700/60 space-y-2">
                        <p className="text-[11px] font-semibold text-brand-300 flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          Catalog Matches:
                        </p>
                        <div className="grid grid-cols-1 gap-1.5">
                          {msg.matchedBooks.map((b) => (
                            <Link
                              key={b.id}
                              to={`/books/${b.id}`}
                              className="block p-2 rounded-lg bg-slate-900/70 border border-slate-700/50 hover:border-brand-500/50 hover:bg-slate-900 transition-colors text-left group"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="text-xs font-semibold text-white group-hover:text-brand-300 transition-colors">
                                    {b.title}
                                  </p>
                                  <p className="text-[11px] text-slate-400">{b.author}</p>
                                </div>
                                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-brand-400 shrink-0 mt-0.5" />
                              </div>
                              <div className="flex items-center gap-2 mt-1.5 text-[10px]">
                                <span
                                  className={`px-1.5 py-0.5 rounded ${
                                    b.availableCopies > 0
                                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                      : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                                  }`}
                                >
                                  {b.availableCopies > 0 ? `${b.availableCopies} available` : 'Checked out'}
                                </span>
                                {b.shelfLocation && (
                                  <span className="text-slate-400">Shelf: {b.shelfLocation}</span>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
                </div>
              ))
            )}

            {loading && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-800/80 border border-slate-700/50 max-w-[70%]">
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs text-slate-400 ml-1">Consulting catalog...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-slate-900/90 border-t border-slate-700/60">
            {error && (
              <div className="mb-2 p-2 rounded-lg bg-rose-500/10 border border-rose-500/25 flex items-center justify-between text-xs text-rose-300">
                <span className="flex items-center gap-1.5 truncate">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {error}
                </span>
                <button
                  type="button"
                  onClick={() => handleSend()}
                  className="underline ml-2 text-rose-200 hover:text-white shrink-0 font-medium"
                >
                  Retry
                </button>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-end gap-2"
            >
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about books, authors, or rules... (Enter to send)"
                  rows={1}
                  maxLength={1000}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 resize-none max-h-24"
                />
              </div>

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2 sm:p-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:hover:bg-brand-600 text-white shadow-lg shadow-brand-500/20 transition-all shrink-0 flex items-center justify-center cursor-pointer"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500 px-1">
              <span>Catalog Grounded • Groq Cloud</span>
              <span>{input.length}/1000</span>
            </div>
          </div>
        </>
      )}
    </div>
  );

  if (standalone) {
    return <div className="h-[600px] max-w-2xl mx-auto">{chatCard}</div>;
  }

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setInternalIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-500 text-white shadow-xl shadow-brand-500/30 hover:shadow-brand-500/50 hover:scale-105 active:scale-95 transition-all duration-200 border border-brand-400/30 cursor-pointer"
          aria-label="Open AI Library Assistant"
        >
          <Sparkles className="w-5 h-5 animate-spin [animation-duration:6s]" />
          <span className="text-sm font-semibold tracking-wide">Library AI</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      )}

      {/* Floating Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[95vw] sm:w-[420px] max-w-[440px] h-[540px] transition-all duration-200">
          {chatCard}
        </div>
      )}
    </>
  );
};
