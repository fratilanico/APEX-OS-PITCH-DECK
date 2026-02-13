import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/Markdown";
import {
  Plus,
  Send,
  Trash2,
  MessageSquare,
  Loader2,
  ArrowLeft,
  Sparkles,
  User,
  StopCircle,
} from "lucide-react";
import { useLocation } from "wouter";
import { useState, useRef, useEffect, useCallback } from "react";
import { nanoid } from "nanoid";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { UIMessage } from "ai";

function getTextFromParts(msg: UIMessage): string {
  return msg.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

export default function ChatPage({ chatId }: { chatId?: string }) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const chatsQuery = trpc.chat.list.useQuery();
  const createChatMutation = trpc.chat.create.useMutation();
  const deleteChatMutation = trpc.chat.delete.useMutation();
  const saveMsgMutation = trpc.chat.saveMessages.useMutation();
  const utils = trpc.useUtils();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [showSidebar, setShowSidebar] = useState(false);

  // Parse query params for exercise context
  const params = new URLSearchParams(window.location.search);
  const track = params.get("track") || undefined;
  const moduleId = params.get("module") || undefined;
  const exerciseId = params.get("exercise") || undefined;

  const [input, setInput] = useState("");

  const {
    messages,
    sendMessage,
    status,
    stop,
    setMessages,
  } = useChat({
    id: chatId,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest({ messages: msgs, id }) {
        return {
          body: {
            message: msgs[msgs.length - 1],
            messages: msgs,
            chatId: chatId || id,
            track,
            moduleId,
            exerciseId,
          },
        };
      },
    }),
    onFinish: ({ messages: finalMessages }) => {
      if (chatId && finalMessages.length > 0) {
        saveMsgMutation.mutate({
          chatId,
          messages: finalMessages.map((m) => ({
            id: m.id,
            role: m.role,
            parts: m.parts,
          })),
        });
      }
    },
    onError: (error: Error) => {
      console.error("Chat error:", error);
    },
  });

  const isStreaming = status === "streaming";
  const isSubmitted = status === "submitted";
  const isLoading = isStreaming || isSubmitted;

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const chats = chatsQuery.data || [];

  const startNewChat = async () => {
    const newId = nanoid();
    await createChatMutation.mutateAsync({ chatId: newId, title: "New Chat" });
    utils.chat.list.invalidate();
    setLocation(`/app/chat/${newId}`);
  };

  const handleDeleteChat = async (id: string) => {
    await deleteChatMutation.mutateAsync({ chatId: id });
    utils.chat.list.invalidate();
    if (chatId === id) {
      setLocation("/app/chat");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userText = input.trim();

    if (!chatId) {
      const newId = nanoid();
      await createChatMutation.mutateAsync({ chatId: newId, title: userText.slice(0, 60) });
      utils.chat.list.invalidate();
      setLocation(`/app/chat/${newId}?q=${encodeURIComponent(userText)}`);
      return;
    }

    sendMessage({ parts: [{ type: "text", text: userText }] });
    setInput("");
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  // Handle initial query from URL
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    if (q && chatId && messages.length === 0) {
      sendMessage({ parts: [{ type: "text", text: q }] });
      // Clean the URL
      window.history.replaceState(null, "", `/app/chat/${chatId}`);
    }
  }, [chatId]);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] sm:h-screen">
      {/* Chat sidebar - desktop */}
      <div className="hidden md:flex w-64 border-r border-border/30 flex-col bg-card/30">
        <div className="p-3 border-b border-border/30">
          <Button
            onClick={startNewChat}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-1.5" /> New Chat
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {chats.map((chat) => (
            <div
              key={chat.chatId}
              className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors ${
                chatId === chat.chatId
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
              onClick={() => setLocation(`/app/chat/${chat.chatId}`)}
            >
              <MessageSquare className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate flex-1">{chat.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteChat(chat.chatId);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile sidebar toggle */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowSidebar(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-background border-r border-border/30 flex flex-col">
            <div className="p-3 border-b border-border/30 flex items-center justify-between">
              <Button onClick={startNewChat} size="sm" className="bg-primary text-primary-foreground">
                <Plus className="h-4 w-4 mr-1.5" /> New Chat
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowSidebar(false)}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
              {chats.map((chat) => (
                <div
                  key={chat.chatId}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm cursor-pointer ${
                    chatId === chat.chatId ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent/50"
                  }`}
                  onClick={() => {
                    setLocation(`/app/chat/${chat.chatId}`);
                    setShowSidebar(false);
                  }}
                >
                  <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate flex-1">{chat.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="h-14 border-b border-border/30 flex items-center px-4 gap-3 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setShowSidebar(true)}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-medium text-foreground text-sm">
              {chatId ? "AI Chat" : "Start a new conversation"}
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full p-6">
              <div className="text-center max-w-md">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 glow-emerald">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  AI App Buddy
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  Ask me anything about AI tools, prompt engineering, or start a guided exercise.
                  I'll provide structured, formatted responses with code examples.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    "How do I write effective prompts?",
                    "Explain AI for sales teams",
                    "Show me a Python code example",
                    "What are AI best practices?",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={async () => {
                        if (!chatId) {
                          const newId = nanoid();
                          await createChatMutation.mutateAsync({
                            chatId: newId,
                            title: suggestion.slice(0, 60),
                          });
                          utils.chat.list.invalidate();
                          setLocation(`/app/chat/${newId}?q=${encodeURIComponent(suggestion)}`);
                        } else {
                          sendMessage({ parts: [{ type: "text", text: suggestion }] });
                        }
                      }}
                      className="text-left text-xs rounded-lg border border-border/40 bg-card/50 p-3 hover:bg-card hover:border-border transition-colors text-muted-foreground"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto p-4 space-y-6">
              {messages.map((msg, msgIdx) => {
                const textContent = getTextFromParts(msg);
                const isLastMsg = msgIdx === messages.length - 1;

                return (
                  <div key={msg.id} className="flex gap-3">
                    <div className="shrink-0 mt-1">
                      {msg.role === "user" ? (
                        <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                          <User className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ) : (
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Sparkles className="h-4 w-4 text-primary" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="text-xs font-medium text-muted-foreground mb-1.5">
                        {msg.role === "user" ? user?.name || "You" : "AI App Buddy"}
                      </div>
                      {msg.role === "user" ? (
                        <div className="text-foreground/90 text-sm leading-relaxed whitespace-pre-wrap">
                          {textContent}
                        </div>
                      ) : (
                        <div className="text-sm">
                          {msg.parts.map((part, partIdx) => {
                            if (part.type === "text") {
                              if (!part.text && isStreaming && isLastMsg) {
                                return (
                                  <div key={partIdx} className="flex items-center gap-2 text-muted-foreground">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Thinking...
                                  </div>
                                );
                              }
                              return (
                                <Markdown
                                  key={partIdx}
                                  isAnimating={isStreaming && isLastMsg}
                                >
                                  {part.text}
                                </Markdown>
                              );
                            }
                            return null;
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {isSubmitted && (
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm pt-1">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-border/30 p-4 shrink-0">
          <form onSubmit={onSubmit} className="max-w-3xl mx-auto">
            <div className="relative flex items-end rounded-xl border border-border/50 bg-card/50 focus-within:border-primary/50 transition-colors">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about AI tools and techniques..."
                rows={1}
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm px-4 py-3 resize-none focus:outline-none max-h-32 min-h-[44px]"
                style={{ height: "auto" }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = Math.min(target.scrollHeight, 128) + "px";
                }}
              />
              <div className="p-2">
                {isLoading ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={stop}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <StopCircle className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!input.trim()}
                    className="h-8 w-8 p-0 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-30"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              AI responses are for learning purposes. Always verify important information.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
