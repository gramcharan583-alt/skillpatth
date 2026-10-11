import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  KeyboardEvent,
} from 'react';
import {
  Send,
  Loader2,
  Bot,
  User,
  RotateCcw,
  Trash2,
  Copy,
  Check,
  AlertCircle,
  Sparkles,
  MessageSquarePlus,
  ChevronDown,
  X,
  Info,
} from 'lucide-react';
import { StudentProfile, ChatMessage, ChatConversation } from '../types';

// ─── Constants ─────────────────────────────────────────────────────────────

const EXAMPLE_PROMPTS = [
  'Create a 30-day learning plan for my career goal.',
  'Suggest projects based on my branch and academic year.',
  'Explain what REST APIs are in simple terms with examples.',
  'Help me prepare for a technical internship interview.',
  'Analyze my roadmap and recommend my next 3 actions.',
  'What DSA topics should I focus on for FAANG placements?',
  'How do I write a strong engineering resume?',
  'Explain dynamic programming with a coding example.',
];

const STORAGE_KEY = 'skillpath_ai_conversations';
const MAX_CONVERSATIONS = 20;
const MAX_HISTORY_FOR_API = 10; // messages sent to backend per request
const MAX_INPUT_CHARS = 3000;

// ─── Helpers ───────────────────────────────────────────────────────────────

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

function loadConversations(): ChatConversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ChatConversation[];
  } catch {
    return [];
  }
}

function saveConversations(convs: ChatConversation[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(convs.slice(0, MAX_CONVERSATIONS)));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

function generateTitle(text: string): string {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  return cleaned.length > 55 ? cleaned.slice(0, 52) + '…' : cleaned;
}

function buildStudentContext(profile: StudentProfile | null): string {
  if (!profile) return '';
  return [
    `Name: ${profile.name}`,
    `Academic Year: ${profile.academicYear} Year B.Tech`,
    `Engineering Branch: ${profile.branch}`,
    `Career Goal: ${profile.careerGoal}`,
    `Skill Level: ${profile.skillLevel}`,
    `Weekly Study Hours: ${profile.weeklyStudyHours} hours/week`,
    profile.targetCompany ? `Target Company/Sector: ${profile.targetCompany}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

// ─── Markdown Renderer ──────────────────────────────────────────────────────

/**
 * Safe, no-dependency markdown renderer.
 * Renders: headings, bold, italic, inline code, code blocks,
 * bullet lists, numbered lists, blockquotes, and horizontal rules.
 * Does NOT use dangerouslySetInnerHTML. Returns React nodes.
 */
function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      nodes.push(
        <div key={`cb-${i}`} className="my-2 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
          {lang && (
            <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400 border-b border-slate-200 dark:border-slate-700 select-none">
              {lang}
            </div>
          )}
          <pre className="p-3 bg-slate-50 dark:bg-slate-900 text-sm font-mono text-slate-800 dark:text-slate-200 overflow-x-auto leading-relaxed whitespace-pre">
            <code>{codeLines.join('\n')}</code>
          </pre>
        </div>
      );
      continue;
    }

    // Headings
    if (/^#{1,4} /.test(line)) {
      const level = line.match(/^(#+)/)?.[1].length ?? 1;
      const content = line.replace(/^#+\s+/, '');
      const cls = [
        'text-xl font-bold mt-4 mb-1 text-slate-900 dark:text-white',
        'text-lg font-bold mt-3 mb-1 text-slate-800 dark:text-slate-100',
        'text-base font-semibold mt-2 mb-1 text-slate-800 dark:text-slate-100',
        'text-sm font-semibold mt-2 mb-0.5 text-slate-700 dark:text-slate-200',
      ][Math.min(level - 1, 3)];
      nodes.push(<p key={`h-${i}`} className={cls}>{renderInline(content)}</p>);
      i++;
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      nodes.push(<hr key={`hr-${i}`} className="my-3 border-slate-200 dark:border-slate-700" />);
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      nodes.push(
        <blockquote key={`bq-${i}`} className="my-2 pl-3 border-l-4 border-indigo-400 dark:border-indigo-600 text-slate-600 dark:text-slate-400 italic text-sm">
          {quoteLines.map((ql, qi) => (
            <p key={qi}>{renderInline(ql)}</p>
          ))}
        </blockquote>
      );
      continue;
    }

    // Unordered list
    if (/^[-*+] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*+] /.test(lines[i])) {
        items.push(lines[i].replace(/^[-*+] /, ''));
        i++;
      }
      nodes.push(
        <ul key={`ul-${i}`} className="my-1.5 ml-4 space-y-0.5 list-disc marker:text-indigo-500">
          {items.map((it, idx) => (
            <li key={idx} className="text-sm leading-relaxed">{renderInline(it)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered list
    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ''));
        i++;
      }
      nodes.push(
        <ol key={`ol-${i}`} className="my-1.5 ml-4 space-y-0.5 list-decimal marker:text-indigo-500">
          {items.map((it, idx) => (
            <li key={idx} className="text-sm leading-relaxed">{renderInline(it)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // Empty line — just a spacer
    if (line.trim() === '') {
      nodes.push(<div key={`sp-${i}`} className="h-1" />);
      i++;
      continue;
    }

    // Regular paragraph
    nodes.push(
      <p key={`p-${i}`} className="text-sm leading-relaxed my-0.5">
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return nodes;
}

/** Renders inline markdown: bold, italic, inline code, and links */
function renderInline(text: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  // Pattern: **bold**, *italic*, `code`, [label](url)
  const pattern = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|\[([^\]]+)\]\((https?:\/\/[^)]+)\))/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) {
      tokens.push(text.slice(last, match.index));
    }

    if (match[2]) {
      // **bold**
      tokens.push(<strong key={match.index} className="font-semibold">{match[2]}</strong>);
    } else if (match[3]) {
      // *italic*
      tokens.push(<em key={match.index}>{match[3]}</em>);
    } else if (match[4]) {
      // `code`
      tokens.push(
        <code key={match.index} className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[12px] text-indigo-700 dark:text-indigo-300">
          {match[4]}
        </code>
      );
    } else if (match[5] && match[6]) {
      // [label](url)
      tokens.push(
        <a
          key={match.index}
          href={match[6]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 dark:text-indigo-400 underline hover:no-underline"
        >
          {match[5]}
        </a>
      );
    }
    last = match.index + match[0].length;
  }

  if (last < text.length) {
    tokens.push(text.slice(last));
  }

  return tokens;
}

// ─── Message Bubble ──────────────────────────────────────────────────────────

function MessageBubble({
  msg,
  onCopy,
  copiedId,
}: {
  msg: ChatMessage;
  onCopy: (id: string, content: string) => void;
  copiedId: string | null;
}) {
  const isUser = msg.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start group mb-4`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm ${
          isUser
            ? 'bg-gradient-to-br from-indigo-500 to-blue-600'
            : 'bg-gradient-to-br from-violet-500 to-purple-700'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Bubble */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[80%]`}>
        <div
          className={`relative px-4 py-3 rounded-2xl shadow-sm ${
            isUser
              ? 'bg-indigo-600 text-white rounded-tr-sm'
              : msg.isError
              ? 'bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-tl-sm'
              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-sm'
          }`}
        >
          {isUser ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
          ) : msg.isError ? (
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
          ) : (
            <div className="prose-sm max-w-none">{renderMarkdown(msg.content)}</div>
          )}
        </div>

        {/* Actions row */}
        <div className={`flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">
            {formatTime(msg.timestamp)}
          </span>
          {!isUser && !msg.isError && (
            <button
              onClick={() => onCopy(msg.id, msg.content)}
              className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title="Copy answer"
            >
              {copiedId === msg.id ? (
                <><Check className="w-3 h-3 text-emerald-500" /><span className="text-emerald-500">Copied!</span></>
              ) : (
                <><Copy className="w-3 h-3" /><span>Copy</span></>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Typing Indicator ───────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex gap-3 items-start mb-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm bg-gradient-to-br from-violet-500 to-purple-700">
        <Bot className="w-4 h-4" />
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map(n => (
            <span
              key={n}
              className="w-2 h-2 rounded-full bg-indigo-400 dark:bg-indigo-500 animate-bounce"
              style={{ animationDelay: `${n * 150}ms` }}
            />
          ))}
          <span className="ml-1 text-xs text-slate-400 dark:text-slate-500">SkillPath AI is thinking…</span>
        </div>
      </div>
    </div>
  );
}

// ─── Conversation Sidebar ───────────────────────────────────────────────────

function ConvSidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
  onClose,
}: {
  conversations: ChatConversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-800">
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
          Conversations
        </span>
        <button
          onClick={onClose}
          className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 lg:hidden"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* New Chat */}
      <div className="p-2">
        <button
          onClick={onNew}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-950 border border-indigo-200 dark:border-indigo-800/60 transition-colors"
        >
          <MessageSquarePlus className="w-4 h-4" />
          New Chat
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {conversations.length === 0 && (
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-6 px-3">
            No conversations yet. Start by asking a question!
          </p>
        )}
        {conversations.map(conv => (
          <div
            key={conv.id}
            className={`group relative flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-colors ${
              activeId === conv.id
                ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-100'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            onClick={() => onSelect(conv.id)}
          >
            <span className="flex-1 text-xs font-medium truncate">{conv.title}</span>
            <button
              onClick={e => { e.stopPropagation(); onDelete(conv.id); }}
              className="flex-shrink-0 p-0.5 rounded opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all"
              title="Delete conversation"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

interface AskAIPageProps {
  profile: StudentProfile | null;
  roadmapTasks?: { title: string; status: string }[];
  skills?: { name: string; status: string }[];
  projects?: { title: string; status?: string }[];
}

export const AskAIPage: React.FC<AskAIPageProps> = ({
  profile,
  roadmapTasks = [],
  skills = [],
  projects = [],
}) => {
  const [conversations, setConversations] = useState<ChatConversation[]>(() =>
    loadConversations()
  );
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const activeConversation = conversations.find(c => c.id === activeConvId) ?? null;
  const messages = activeConversation?.messages ?? [];

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    saveConversations(conversations);
  }, [conversations]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
    }
  }, [inputText]);

  // ── Build context string sent to backend ─────────────────────────────────
  function buildContext(): string {
    const base = buildStudentContext(profile);
    const completedTasks = roadmapTasks.filter(t => t.status === 'Completed').map(t => t.title);
    const inProgressTasks = roadmapTasks.filter(t => t.status === 'In Progress').map(t => t.title);
    const completedSkills = skills.filter(s => s.status === 'Completed').map(s => s.name);
    const myProjects = projects.filter(p => p.status).map(p => `${p.title} (${p.status})`);

    const extras: string[] = [];
    if (completedTasks.length)
      extras.push(`Completed roadmap tasks: ${completedTasks.slice(0, 10).join(', ')}`);
    if (inProgressTasks.length)
      extras.push(`In-progress tasks: ${inProgressTasks.slice(0, 5).join(', ')}`);
    if (completedSkills.length)
      extras.push(`Completed skills: ${completedSkills.slice(0, 10).join(', ')}`);
    if (myProjects.length)
      extras.push(`Projects: ${myProjects.slice(0, 8).join(', ')}`);

    return [base, ...extras].filter(Boolean).join('\n');
  }

  // ── Send message ─────────────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      setInputText('');
      setApiError(null);

      // Create or use existing conversation
      let convId = activeConvId;
      let conv = conversations.find(c => c.id === convId);

      if (!conv) {
        const newConv: ChatConversation = {
          id: generateId(),
          title: generateTitle(trimmed),
          messages: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        convId = newConv.id;
        conv = newConv;
        setConversations(prev => [newConv, ...prev]);
        setActiveConvId(convId);
      }

      // Add user message
      const userMsg: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: trimmed,
        timestamp: new Date().toISOString(),
      };

      setConversations(prev =>
        prev.map(c =>
          c.id === convId
            ? { ...c, messages: [...c.messages, userMsg], updatedAt: new Date().toISOString() }
            : c
        )
      );

      setIsLoading(true);

      // Build history for API (excluding the current user message)
      const currentMessages = conv.messages;
      const historyForApi = currentMessages.slice(-MAX_HISTORY_FOR_API).map(m => ({
        role: m.role === 'user' ? 'user' : 'model' as 'user' | 'model',
        text: m.content,
      }));

      // Call backend
      abortRef.current = new AbortController();
      try {
        const endpoint = '/.netlify/functions/gemini-chat';
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: abortRef.current.signal,
          body: JSON.stringify({
            message: trimmed,
            history: historyForApi,
            studentContext: buildContext(),
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          const errText = data.error || `Server error (HTTP ${res.status})`;
          throw new Error(errText);
        }

        const assistantMsg: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toISOString(),
        };

        setConversations(prev =>
          prev.map(c =>
            c.id === convId
              ? {
                  ...c,
                  messages: [...c.messages, assistantMsg],
                  updatedAt: new Date().toISOString(),
                }
              : c
          )
        );
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return;

        const msg =
          err instanceof Error
            ? err.message
            : 'An unexpected error occurred. Please try again.';

        const errorMsg: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: msg,
          timestamp: new Date().toISOString(),
          isError: true,
        };

        setConversations(prev =>
          prev.map(c =>
            c.id === convId
              ? { ...c, messages: [...c.messages, errorMsg], updatedAt: new Date().toISOString() }
              : c
          )
        );
        setApiError(msg);
      } finally {
        setIsLoading(false);
        abortRef.current = null;
        textareaRef.current?.focus();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeConvId, conversations, isLoading, profile, roadmapTasks, skills, projects]
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputText);
    }
  };

  const handleNewChat = () => {
    setActiveConvId(null);
    setInputText('');
    setApiError(null);
    setShowSidebar(false);
  };

  const handleSelectConv = (id: string) => {
    setActiveConvId(id);
    setApiError(null);
    setShowSidebar(false);
  };

  const handleDeleteConv = (id: string) => {
    setShowClearConfirm(id);
  };

  const confirmDelete = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConvId === id) setActiveConvId(null);
    setShowClearConfirm(null);
  };

  const handleCopy = async (id: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback for older browsers
    }
  };

  const handleRetry = () => {
    const lastUser = [...messages].reverse().find(m => m.role === 'user');
    if (lastUser) {
      // Remove the last error message and retry
      setConversations(prev =>
        prev.map(c =>
          c.id === activeConvId
            ? { ...c, messages: c.messages.filter(m => !m.isError) }
            : c
        )
      );
      sendMessage(lastUser.content);
    }
  };

  const handleStop = () => {
    abortRef.current?.abort();
    setIsLoading(false);
  };

  // ── Render ───────────────────────────────────────────────────────────────
  const showWelcome = messages.length === 0 && !isLoading;

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── Conversation Sidebar (desktop always visible, mobile toggle) ── */}
      <div
        className={`fixed inset-0 z-40 lg:static lg:z-auto flex lg:block transition-all ${
          showSidebar ? 'pointer-events-auto' : 'pointer-events-none lg:pointer-events-auto'
        }`}
      >
        {/* Mobile backdrop */}
        {showSidebar && (
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}

        {/* Sidebar panel */}
        <div
          className={`relative w-64 flex-shrink-0 h-full transition-transform lg:translate-x-0 ${
            showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <ConvSidebar
            conversations={conversations}
            activeId={activeConvId}
            onSelect={handleSelectConv}
            onNew={handleNewChat}
            onDelete={handleDeleteConv}
            onClose={() => setShowSidebar(false)}
          />
        </div>
      </div>

      {/* ── Main Chat Area ─────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 bg-slate-50 dark:bg-slate-950">
        {/* Chat Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm flex-shrink-0">
          <button
            onClick={() => setShowSidebar(prev => !prev)}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
          </button>

          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white shadow-sm">
            <Bot className="w-4 h-4" />
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold text-slate-900 dark:text-white">
              {activeConversation?.title ?? 'Ask SkillPath AI'}
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {profile
                ? `${profile.name} • ${profile.branch}, ${profile.academicYear} Year`
                : 'AI-powered career & technical mentor for B.Tech students'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Gemini AI
            </div>

            {messages.length > 0 && (
              <button
                onClick={handleNewChat}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
                title="Start a new conversation"
              >
                <MessageSquarePlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New Chat</span>
              </button>
            )}
          </div>
        </div>

        {/* Delete confirmation overlay */}
        {showClearConfirm && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Delete Conversation?</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">This action cannot be undone.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowClearConfirm(null)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmDelete(showClearConfirm)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {showWelcome ? (
            <WelcomeView
              profile={profile}
              onPromptClick={p => sendMessage(p)}
            />
          ) : (
            <div className="max-w-3xl mx-auto">
              {messages.map(msg => (
                <MessageBubble
                  key={msg.id}
                  msg={msg}
                  onCopy={handleCopy}
                  copiedId={copiedId}
                />
              ))}
              {isLoading && <TypingIndicator />}

              {/* Retry button after error */}
              {!isLoading && messages.at(-1)?.isError && (
                <div className="flex justify-center mt-2">
                  <button
                    onClick={handleRetry}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-950 border border-indigo-200 dark:border-indigo-800/60 rounded-xl transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Retry
                  </button>
                </div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="max-w-3xl mx-auto">
            {/* Global error banner */}
            {apiError && (
              <div className="mb-3 flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{apiError}</span>
                <button
                  onClick={() => setApiError(null)}
                  className="ml-auto flex-shrink-0 hover:text-red-900"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={e =>
                    setInputText(e.target.value.slice(0, MAX_INPUT_CHARS))
                  }
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything about engineering, projects, placements, or career…"
                  disabled={isLoading}
                  rows={1}
                  className="w-full resize-none rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm px-4 py-3 pr-16 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 dark:focus:border-indigo-500 disabled:opacity-60 transition-all overflow-hidden"
                  style={{ minHeight: '48px', maxHeight: '160px' }}
                />
                {/* Character counter */}
                {inputText.length > MAX_INPUT_CHARS * 0.8 && (
                  <span className="absolute right-12 bottom-3 text-[10px] text-slate-400">
                    {inputText.length}/{MAX_INPUT_CHARS}
                  </span>
                )}
              </div>

              {/* Send / Stop button */}
              {isLoading ? (
                <button
                  onClick={handleStop}
                  className="flex-shrink-0 w-11 h-11 rounded-xl bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow-sm"
                  title="Stop generation"
                >
                  <span className="w-3.5 h-3.5 rounded-sm bg-white" />
                </button>
              ) : (
                <button
                  onClick={() => sendMessage(inputText)}
                  disabled={!inputText.trim()}
                  className="flex-shrink-0 w-11 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors shadow-sm"
                  title="Send message (Enter)"
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>

            <p className="mt-2 text-center text-[10px] text-slate-400 dark:text-slate-600">
              Press <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">Enter</kbd> to send ·{' '}
              <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">Shift+Enter</kbd> for new line ·
              SkillPath AI may make mistakes — verify important facts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Welcome View ─────────────────────────────────────────────────────────────

function WelcomeView({
  profile,
  onPromptClick,
}: {
  profile: StudentProfile | null;
  onPromptClick: (p: string) => void;
}) {
  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center text-center py-8 px-4">
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 mb-5">
        <Sparkles className="w-8 h-8" />
      </div>

      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
        Hi{profile ? `, ${profile.name.split(' ')[0]}` : ''}! I'm your SkillPath AI
      </h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md leading-relaxed mb-6">
        Ask me anything about engineering subjects, technical skills, projects, internships, or
        placements. I'll help you find your next step.
        {profile && (
          <span className="block mt-1 font-medium text-indigo-600 dark:text-indigo-400">
            Context: {profile.branch} • {profile.academicYear} Year • {profile.careerGoal}
          </span>
        )}
      </p>

      {/* Info pill */}
      {!profile && (
        <div className="flex items-center gap-2 mb-5 px-4 py-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl text-xs text-amber-700 dark:text-amber-400">
          <Info className="w-3.5 h-3.5 flex-shrink-0" />
          Complete onboarding for personalized, context-aware answers.
        </div>
      )}

      {/* Example prompts */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
        {EXAMPLE_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            onClick={() => onPromptClick(prompt)}
            className="text-left px-4 py-3 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800/70 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-700 dark:hover:text-indigo-300 border border-slate-200 dark:border-slate-700/60 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all shadow-sm hover:shadow-md"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
