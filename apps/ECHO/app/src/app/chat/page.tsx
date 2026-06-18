"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { sanitizeConversation } from "@/lib/response-safety";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

const STORAGE_KEY = "echo:v2:chat-history";

const initialMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content: "Bonjour Mathieu. Que veux-tu examiner ?"
  }
];

function createMessage(role: ChatRole, content: string): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    role,
    content
  };
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ChatMessage[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          const safeMessages = sanitizeConversation(parsed);

          setMessages(safeMessages.length > 0 ? safeMessages : initialMessages);
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }

    setHasLoadedStorage(true);
  }, []);

  useEffect(() => {
    if (hasLoadedStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [hasLoadedStorage, messages]);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages, isLoading]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const content = input.trim();
    if (!content || isLoading) {
      return;
    }

    const history = sanitizeConversation(
      messages.filter((message) => message.id !== "welcome")
    )
      .slice(-8)
      .map((message) => ({
        role: message.role,
        content: message.content
      }));

    const userMessage = createMessage("user", content);
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: content,
          history
        })
      });

      const data = (await response.json().catch(() => ({}))) as {
        reply?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "ECHO n’a pas pu répondre.");
      }

      if (typeof data.reply !== "string" || !data.reply.trim()) {
        throw new Error("ECHO n’a pas renvoyé de réponse finale.");
      }

      setMessages([
        ...nextMessages,
        createMessage("assistant", data.reply.trim())
      ]);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Erreur inconnue pendant l’appel à Ollama.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  function clearHistory() {
    setMessages(initialMessages);
    setError(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <main className="min-h-screen px-4 py-4 text-zinc-100 sm:px-6">
      <section className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl gap-4 lg:grid-cols-[300px_1fr]">
        <aside className="rounded-lg border border-echo-line bg-echo-panel/95 p-5 shadow-cockpit">
          <Link href="/" className="text-sm text-echo-cyan hover:text-white">
            ← Accueil
          </Link>

          <div className="mt-8 space-y-3">
            <p className="text-sm text-zinc-400">Session locale</p>
            <h1 className="text-4xl font-semibold text-white">ECHO</h1>
            <p className="leading-7 text-zinc-400">
              Historique temporaire stocké dans ce navigateur. PostgreSQL reste
              prévu pour la V2.1.
            </p>
          </div>

          <div className="mt-8 space-y-3 border-t border-echo-line pt-5 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-zinc-500">Ollama</span>
              <span className="text-echo-amber">localhost:11434</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-zinc-500">Modèle</span>
              <span className="text-echo-green">gemma3:1b</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-zinc-500">Cloud</span>
              <span className="text-zinc-300">aucun</span>
            </div>
          </div>

          <button
            type="button"
            onClick={clearHistory}
            className="mt-8 w-full rounded-lg border border-echo-line px-4 py-3 text-sm text-zinc-300 transition hover:border-echo-cyan hover:text-white"
          >
            Effacer l’historique local
          </button>
        </aside>

        <div className="flex min-h-[70vh] flex-col rounded-lg border border-echo-line bg-black/42 shadow-cockpit">
          <div className="flex items-center justify-between gap-4 border-b border-echo-line px-4 py-4 sm:px-5">
            <div>
              <p className="text-sm text-zinc-400">Chat privé local</p>
              <h2 className="text-xl font-semibold text-white">
                Dialogue avec ECHO
              </h2>
            </div>
            <div className="rounded-lg border border-echo-line px-3 py-2 text-sm text-zinc-300">
              V2 locale
            </div>
          </div>

          <div
            ref={listRef}
            className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-5"
          >
            {messages.map((message) => (
              <article
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`message-content max-w-[92%] rounded-lg border px-4 py-3 leading-7 sm:max-w-[78%] ${
                    message.role === "user"
                      ? "border-echo-cyan/40 bg-echo-cyan/12 text-white"
                      : "border-echo-line bg-echo-panel text-zinc-200"
                  }`}
                >
                  {message.content}
                </div>
              </article>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-lg border border-echo-line bg-echo-panel px-4 py-3 text-zinc-400">
                  ECHO réfléchit...
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="mx-4 mb-3 rounded-lg border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-100 sm:mx-5">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="border-t border-echo-line p-4 sm:p-5"
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Écris à ECHO..."
                rows={2}
                className="min-h-16 flex-1 resize-none rounded-lg border border-echo-line bg-echo-panel px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-echo-cyan"
              />
              <button
                type="submit"
                disabled={isLoading || input.trim().length === 0}
                className="rounded-lg bg-echo-cyan px-6 py-3 font-semibold text-echo-ink transition hover:bg-white disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
              >
                Envoyer
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
