"use client";

import { MessageCircle, X, Send, Package, RefreshCw, HelpCircle } from "lucide-react";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminStore } from "@/store/useAdminStore";
import { useSession } from "next-auth/react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot" | "admin";
  time: string;
}

const generateHumanizedReply = (input: string) => {
  const text = input.toLowerCase();

  // Response Pools for variety
  const greetings = [
    "WELCOME TO THE COLLECTIVE. HOW CAN WE DECODE YOUR STYLE TODAY?",
    "EYES ON THE STREET. WHAT'S ON YOUR MIND?",
    "CONNECTED. HOW CAN CODIGO SUPPORT YOU TODAY?",
    "YOU'VE REACHED THE CORE. WHAT DO YOU NEED?"
  ];

  const fallback = [
    "I HEAR YOU. OUR TEAM IS CURRENTLY DECODING THAT REQUEST. WE'LL GET BACK TO YOU SOON.",
    "THAT'S A SPECIFIC VIBE. LET ME PASS THIS TO THE DESIGNERS AT THE CORE.",
    "GOT IT. WE'RE ON THE CASE. STAY TUNED TO THE FREQUENCY.",
    "COPIED. PROCESSING YOUR INTEL NOW."
  ];

  // Keyword Logic
  if (
    text.includes("hi") ||
    text.includes("hello") ||
    text.includes("hey") ||
    text.includes("yo")
  ) {
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  if (text.includes("price") || text.includes("cost") || text.includes("how much")) {
    return "ALL PIECES ARE PRICED ACCORDING TO THE CRAFT AND CODE. YOU CAN SEE THE LIVE TAGS IN THE CATALOG. QUALITY OVER HYPE.";
  }

  if (text.includes("shipping") || text.includes("deliver") || text.includes("where")) {
    return "WE SHIP NATIONWIDE. 3-7 DAYS FOR METRO MANILA, 5-10 FOR THE PROVINCES. WE ENSURE YOUR PIECE ARRIVES SECURE.";
  }

  if (
    text.includes("size") ||
    text.includes("fit") ||
    text.includes("small") ||
    text.includes("large")
  ) {
    return "OUR CUT IS SIGNATURE OVERSIZED. CHECK THE SIZE GUIDE IN THE PRODUCT PAGES. IF YOU WANT IT TIGHTER, SIZE DOWN. IF YOU WANT THE STREET LOOK, GO TRUE.";
  }

  if (text.includes("restock") || text.includes("available") || text.includes("sold out")) {
    return "DROPS ARE LIMITED. ONCE THE CODE IS GONE, IT'S GONE. FOLLOW OUR SOCIALS TO CATCH THE NEXT FREQUENCY.";
  }

  if (text.includes("thanks") || text.includes("thank you") || text.includes("ok")) {
    return "RESPECT. WE'RE HERE IF YOU NEED MORE INTEL.";
  }

  return fallback[Math.floor(Math.random() * fallback.length)];
};

export default function ChatSupport() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Onboarding States with initializers to avoid effect-based setState
  const [isSigned, setIsSigned] = useState(() => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("cdg-user-info");
    }
    return false;
  });

  const [userInfo, setUserInfo] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cdg-user-info");
      return stored ? JSON.parse(stored) : { name: "", email: "", contact: "" };
    }
    return { name: "", email: "", contact: "" };
  });

  useEffect(() => {
    if (session?.user && !isSigned) {
      const newUserInfo = {
        name: session.user.name || "Customer",
        email: session.user.email || "",
        contact: "Registered User"
      };

      // Update state in next tick to avoid cascading render warning
      setTimeout(() => {
        setUserInfo(newUserInfo);
        setIsSigned(true);
        localStorage.setItem("cdg-user-info", JSON.stringify(newUserInfo));
      }, 0);
    }
  }, [session, isSigned]);

  const { chats, addChatMessage } = useAdminStore();

  const [chatId] = useState(() => {
    if (typeof window !== "undefined") {
      let storedId = localStorage.getItem("cdg-chat-id");
      if (!storedId) {
        storedId = "session-" + Math.random().toString(36).substr(2, 9);
        localStorage.setItem("cdg-chat-id", storedId);
      }
      return storedId;
    }
    return "";
  });

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInfo.name && userInfo.email && userInfo.contact) {
      localStorage.setItem("cdg-user-info", JSON.stringify(userInfo));
      setIsSigned(true);

      // Send initial welcome message with customer info
      const welcomeMsg: Message = {
        id: "welcome-" + Math.random().toString(36).substr(2, 9),
        text: `WELCOME ${userInfo.name.toUpperCase()}. HOW CAN WE HELP YOU DECODE YOUR STYLE TODAY?`,
        sender: "bot",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      addChatMessage(chatId, welcomeMsg, userInfo);
    }
  };

  // Get messages for THIS session from the store
  const messages = useMemo(() => {
    const currentChat = chats.find((c) => c.id === chatId);
    return currentChat ? currentChat.messages : [];
  }, [chats, chatId]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen || messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  const addMessage = useCallback(
    (text: string, sender: "user" | "bot" | "admin") => {
      const newMessage = {
        id: Math.random().toString(36).substr(2, 9),
        text: text.toUpperCase(),
        sender,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      addChatMessage(chatId, newMessage, userInfo);
    },
    [chatId, userInfo, addChatMessage]
  );

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    addMessage(text, "user");
    setInputValue("");

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const reply = generateHumanizedReply(text);
      addMessage(reply, "bot");
    }, 1800);
  };

  const handleQuickAction = (action: string) => {
    addMessage(action, "user");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let reply = "";
      if (action === "Track My Order")
        reply = "ORDER STATUS: PROCESSING. EXPECT DELIVERY WITHIN 3-7 DAYS FOR METRO MANILA.";
      if (action === "Return Policy")
        reply = "RETURNS: 7-DAY FIT GUARANTEE. ITEMS MUST BE UNWORN WITH ORIGINAL TAGS ATTACHED.";
      if (action === "Size Help")
        reply =
          "FIT GUIDE: SIGNATURE OVERSIZED CUT. WE RECOMMEND YOUR TRUE SIZE FOR THE STREET LOOK, OR SIZE DOWN FOR STANDARD FIT.";

      addMessage(reply || "REQUEST RECEIVED.", "bot");
    }, 1000);
  };

  const quickActions = [
    { label: "Track My Order", icon: Package },
    { label: "Return Policy", icon: RefreshCw },
    { label: "Size Help", icon: HelpCircle }
  ];

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 group"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X size={20} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle size={20} />
            </motion.div>
          )}
        </AnimatePresence>
        {!isOpen && (
          <span className="absolute top-0 right-0 w-2.5 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-16 right-0 w-[300px] md:w-[340px] bg-white border border-neutral-100 shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-black text-white p-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 flex items-center justify-center rounded-full italic font-black text-[10px]">
                  CDG
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest leading-none text-white">
                    CODIGO SUPPORT
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span>
                    <p className="text-[7px] font-bold text-neutral-400 uppercase tracking-widest">
                      Active Now
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Area / Onboarding Form */}
            <div className="h-[320px] bg-neutral-50 p-4 overflow-y-auto flex flex-col gap-4">
              {!isSigned ? (
                <div className="flex flex-col h-full justify-center">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="text-center mb-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">
                        Join the Collective
                      </h4>
                      <p className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest mt-1">
                        Identify yourself to start the chat
                      </p>
                    </div>
                    <div className="space-y-3">
                      <input
                        required
                        placeholder="NAME"
                        value={userInfo.name}
                        onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                        className="w-full bg-white border border-neutral-100 p-3 text-[9px] font-bold uppercase tracking-widest outline-none focus:border-black transition-colors"
                      />
                      <input
                        required
                        type="email"
                        placeholder="EMAIL (GMAIL)"
                        value={userInfo.email}
                        onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                        className="w-full bg-white border border-neutral-100 p-3 text-[9px] font-bold uppercase tracking-widest outline-none focus:border-black transition-colors"
                      />
                      <input
                        required
                        type="tel"
                        placeholder="CONTACT NUMBER"
                        value={userInfo.contact}
                        onChange={(e) => setUserInfo({ ...userInfo, contact: e.target.value })}
                        className="w-full bg-white border border-neutral-100 p-3 text-[9px] font-bold uppercase tracking-widest outline-none focus:border-black transition-colors"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-black text-white py-4 text-[9px] font-black uppercase tracking-[0.3em] italic hover:bg-neutral-800 transition-all shadow-lg"
                    >
                      Start Decoding
                    </button>
                  </form>
                </div>
              ) : (
                <>
                  {messages.map((msg, index) => (
                    <motion.div
                      key={`${msg.id}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-[85%] p-3 text-[9px] font-bold uppercase tracking-tight leading-relaxed ${
                          msg.sender === "user"
                            ? "bg-black text-white"
                            : msg.sender === "admin"
                              ? "bg-neutral-900 text-white shadow-xl"
                              : "bg-white border border-neutral-100 text-black shadow-sm"
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[6px] font-black text-neutral-300 mt-1 uppercase tracking-widest">
                        {msg.sender === "admin"
                          ? "OFFICIAL ADMIN"
                          : msg.sender === "bot"
                            ? "AI ASSISTANT"
                            : "YOU"}{" "}
                        • {msg.time}
                      </span>
                    </motion.div>
                  ))}

                  {isTyping && (
                    <div className="flex items-start">
                      <div className="bg-white border border-neutral-100 p-3 flex gap-1 items-center shadow-sm">
                        <span className="w-1 h-1 bg-neutral-300 rounded-full animate-bounce"></span>
                        <span className="w-1 h-1 bg-neutral-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-1 h-1 bg-neutral-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Quick Actions & Input - Only show if signed in */}
            {isSigned && (
              <div className="p-3 border-t border-neutral-100 bg-white space-y-3">
                {messages.length < 3 && (
                  <div className="flex flex-wrap gap-1.5">
                    {quickActions.map((action) => (
                      <button
                        key={action.label}
                        onClick={() => handleQuickAction(action.label)}
                        className="flex items-center gap-2 bg-neutral-50 border border-neutral-100 px-2.5 py-1.5 hover:bg-neutral-100 transition-colors"
                      >
                        <action.icon size={10} className="text-neutral-400" />
                        <span className="text-[7px] font-black uppercase tracking-widest">
                          {action.label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend(inputValue)}
                    placeholder="TYPE YOUR MESSAGE..."
                    className="flex-grow text-[9px] font-bold uppercase tracking-widest outline-none py-2 bg-transparent"
                  />
                  <button
                    onClick={() => handleSend(inputValue)}
                    disabled={!inputValue.trim()}
                    className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-xl hover:bg-neutral-800 transition-colors"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Branding Footer */}
            <div className="py-2 bg-neutral-50 text-center border-t border-neutral-100">
              <span className="text-[6px] font-black uppercase tracking-[0.4em] text-neutral-300">
                Powered by Codigo Intelligence
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
