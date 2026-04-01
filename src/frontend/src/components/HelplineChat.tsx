import { MessageCircle, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { SupportTicket, User } from "../App";

interface HelplineChatProps {
  user: User | null;
  supportTickets: SupportTicket[];
  onSendSupportMessage: (
    ticketId: string | null,
    username: string,
    displayName: string,
    text: string,
  ) => void;
}

export function HelplineChat({
  user,
  supportTickets,
  onSendSupportMessage,
}: HelplineChatProps) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestMessage, setGuestMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const myTicket = user
    ? supportTickets.find((t) => t.username === user.username)
    : null;

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [open]);

  function sendMessage() {
    if (!text.trim() || !user) return;
    onSendSupportMessage(
      myTicket?.id ?? null,
      user.username,
      user.name,
      text.trim(),
    );
    setText("");
  }

  function sendGuestMessage() {
    if (!guestName.trim() || !guestMessage.trim()) return;
    const guestUsername = `guest_${Date.now()}`;
    onSendSupportMessage(
      null,
      guestUsername,
      guestName.trim(),
      guestMessage.trim(),
    );
    setGuestName("");
    setGuestMessage("");
  }

  const openTicketCount = supportTickets.filter(
    (t) => t.status === "open",
  ).length;

  return (
    <>
      {/* Floating chat button */}
      <button
        type="button"
        data-ocid="helpline.open_modal_button"
        aria-label="Open helpline chat"
        onClick={() => setOpen((v) => !v)}
        className="group fixed bottom-24 right-6 z-50 flex items-center gap-2"
      >
        <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
          Live Support
        </span>
        <span className="absolute inset-0 rounded-full bg-indigo-500 opacity-40 animate-ping" />
        <span
          className="relative flex h-14 w-14 items-center justify-center rounded-full shadow-lg shadow-indigo-500/40 transition-transform duration-200 group-hover:scale-110"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.55 0.25 280), oklch(0.45 0.28 265))",
          }}
        >
          <MessageCircle className="h-7 w-7 text-white" />
          {openTicketCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white">
              {openTicketCount}
            </span>
          )}
        </span>
      </button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            data-ocid="helpline.modal"
            className="fixed bottom-40 right-6 z-50 flex flex-col rounded-2xl overflow-hidden shadow-2xl"
            style={{
              width: "min(380px, calc(100vw - 3rem))",
              height: "500px",
              background: "oklch(0.11 0.08 285)",
              border: "1px solid oklch(0.25 0.1 285)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.55 0.25 280), oklch(0.45 0.28 265))",
              }}
            >
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-400 border-2 border-indigo-600" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Online Support</p>
                  <p className="text-white/70 text-[10px]">We reply quickly</p>
                </div>
              </div>
              <button
                type="button"
                data-ocid="helpline.close_button"
                onClick={() => setOpen(false)}
                className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>

            {/* Subtitle */}
            <div
              className="px-4 py-2 text-[11px] text-center shrink-0"
              style={{
                background: "oklch(0.14 0.08 285)",
                color: "oklch(0.60 0.08 285)",
              }}
            >
              We&apos;ll reply shortly. For instant help, contact WhatsApp{" "}
              <a
                href="https://wa.me/923155527774"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold"
                style={{ color: "oklch(0.75 0.2 150)" }}
              >
                03155527774
              </a>
            </div>

            {/* Body */}
            {user ? (
              <>
                {/* Messages area */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {!myTicket || myTicket.messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2">
                      <MessageCircle
                        className="h-10 w-10"
                        style={{ color: "oklch(0.35 0.08 285)" }}
                      />
                      <p
                        className="text-sm text-center"
                        style={{ color: "oklch(0.50 0.06 285)" }}
                      >
                        Start a conversation with our support team
                      </p>
                    </div>
                  ) : (
                    myTicket.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.from === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className="max-w-[75%] rounded-2xl px-3 py-2 text-sm"
                          style={{
                            background:
                              msg.from === "user"
                                ? "linear-gradient(135deg, oklch(0.75 0.22 75), oklch(0.65 0.25 60))"
                                : "oklch(0.20 0.10 285)",
                            color:
                              msg.from === "user"
                                ? "oklch(0.15 0.05 75)"
                                : "white",
                          }}
                        >
                          {msg.from === "admin" && (
                            <p
                              className="text-[10px] font-bold mb-0.5"
                              style={{ color: "oklch(0.65 0.2 195)" }}
                            >
                              Support
                            </p>
                          )}
                          <p>{msg.text}</p>
                          <p className="text-[9px] mt-0.5 opacity-70">
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div
                  className="p-3 shrink-0"
                  style={{ borderTop: "1px solid oklch(0.22 0.08 285)" }}
                >
                  <div className="flex gap-2">
                    <input
                      type="text"
                      data-ocid="helpline.input"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && !e.shiftKey && sendMessage()
                      }
                      placeholder="Type your message..."
                      className="flex-1 rounded-xl px-3 py-2 text-sm outline-none"
                      style={{
                        background: "oklch(0.18 0.08 285)",
                        border: "1px solid oklch(0.28 0.1 285)",
                        color: "white",
                      }}
                    />
                    <button
                      type="button"
                      data-ocid="helpline.submit_button"
                      onClick={sendMessage}
                      disabled={!text.trim()}
                      className="h-9 w-9 rounded-xl flex items-center justify-center transition-colors disabled:opacity-40"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.55 0.25 280), oklch(0.45 0.28 265))",
                      }}
                    >
                      <Send className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Guest form */
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <p
                  className="text-sm"
                  style={{ color: "oklch(0.65 0.06 285)" }}
                >
                  Send us a message and we&apos;ll get back to you as soon as
                  possible.
                </p>
                <div className="space-y-1.5">
                  <label
                    htmlFor="guest-name"
                    className="text-xs font-bold"
                    style={{ color: "oklch(0.65 0.06 285)" }}
                  >
                    Your Name
                  </label>
                  <input
                    id="guest-name"
                    type="text"
                    data-ocid="helpline.input"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full rounded-xl px-3 py-2 text-sm outline-none"
                    style={{
                      background: "oklch(0.18 0.08 285)",
                      border: "1px solid oklch(0.28 0.1 285)",
                      color: "white",
                    }}
                  />
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="guest-message"
                    className="text-xs font-bold"
                    style={{ color: "oklch(0.65 0.06 285)" }}
                  >
                    Message
                  </label>
                  <textarea
                    id="guest-message"
                    data-ocid="helpline.textarea"
                    value={guestMessage}
                    onChange={(e) => setGuestMessage(e.target.value)}
                    placeholder="Describe your issue..."
                    rows={4}
                    className="w-full rounded-xl px-3 py-2 text-sm outline-none resize-none"
                    style={{
                      background: "oklch(0.18 0.08 285)",
                      border: "1px solid oklch(0.28 0.1 285)",
                      color: "white",
                    }}
                  />
                </div>
                <button
                  type="button"
                  data-ocid="helpline.submit_button"
                  onClick={sendGuestMessage}
                  disabled={!guestName.trim() || !guestMessage.trim()}
                  className="w-full py-2.5 rounded-xl font-bold text-sm text-white transition-opacity disabled:opacity-40"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.55 0.25 280), oklch(0.45 0.28 265))",
                  }}
                >
                  Send Message
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
