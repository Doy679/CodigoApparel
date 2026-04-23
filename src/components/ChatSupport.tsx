"use client";

import { MessageCircle, X, Send, HelpCircle, Home, MessageSquare, Truck } from "lucide-react";
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
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("Message");
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Onboarding States
  const [isSigned, setIsSigned] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "", email: "", contact: "" });

  const { chats, addChatMessage } = useAdminStore();

  const [chatId] = useState(() => {
    if (typeof window !== "undefined") {
      let storedId = localStorage.getItem("cdg-chat-id");
      if (!storedId) {
        storedId = "session-" + Math.random().toString(36).substr(2, 9);
        localStorage.setItem("cdg-chat-id", storedId);
        return storedId;
      }
      return storedId;
    }
    return "";
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      const stored = localStorage.getItem("cdg-user-info");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.name && parsed.email && parsed.contact) {
            setUserInfo(parsed);
            setIsSigned(true);
          }
        } catch {
          localStorage.removeItem("cdg-user-info");
        }
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInfo.name && userInfo.email && userInfo.contact) {
      localStorage.setItem("cdg-user-info", JSON.stringify(userInfo));
      setIsSigned(true);

      // Send initial welcome message
      const welcomeMsg: Message = {
        id: "welcome-" + Math.random().toString(36).substr(2, 9),
        text: `CONNECTED. WELCOME ${userInfo.name.toUpperCase()}. HOW CAN WE HELP YOU DECODE YOUR STYLE TODAY?`,
        sender: "bot",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      addChatMessage(chatId, welcomeMsg, userInfo);
    }
  };

  // Get messages for THIS session
  const messages = useMemo(() => {
    if (!isSigned) return [];
    const currentChat = chats.find((c) => c.id === chatId);
    return currentChat ? currentChat.messages : [];
  }, [chats, chatId, isSigned]);

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

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300"
        >
          <MessageCircle size={24} />
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        </button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-0 right-0 w-[320px] md:w-[360px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-100 flex flex-col"
            style={{ height: "550px" }}
          >
            {/* Header */}
            <div className="bg-black text-white p-5 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/10 flex items-center justify-center rounded-full italic font-black text-[10px] border border-white/20">
                    CDG
                  </div>
                  <div>
                    <h3 className="text-[11px] font-black uppercase tracking-widest leading-none text-white">
                      CODIGO SUPPORT
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                      <p className="text-[8px] font-black text-neutral-400 uppercase tracking-widest">
                        Active Now
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white opacity-40 hover:opacity-100 transition-opacity"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-grow bg-white p-4 overflow-y-auto custom-scrollbar flex flex-col">
              {!isSigned ? (
                <div className="space-y-4">
                  <div className="border-l-4 border-black pl-3 py-1">
                    <p className="text-[11px] font-black uppercase tracking-widest text-black leading-tight">
                      Identify Yourself
                    </p>
                    <p className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5">
                      Establish secure connection
                    </p>
                  </div>

                  <form onSubmit={handleSignIn} className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[7px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-1">
                        Name / Alias
                      </label>
                      <input
                        required
                        placeholder="NAME"
                        value={userInfo.name}
                        onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                        className="w-full bg-neutral-50 border-2 border-neutral-100 p-2.5 text-[10px] font-black uppercase tracking-widest focus:border-black outline-none transition-all placeholder:text-neutral-300"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[7px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-1">
                        Gmail Address
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="EMAIL@GMAIL.COM"
                        value={userInfo.email}
                        onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                        className="w-full bg-neutral-50 border-2 border-neutral-100 p-2.5 text-[10px] font-black uppercase tracking-widest focus:border-black outline-none transition-all placeholder:text-neutral-300"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[7px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-1">
                        Contact Number
                      </label>
                      <div className="flex gap-2">
                        <div className="flex items-center gap-2 bg-neutral-900 text-white px-2.5 py-2.5 shrink-0">
                          <span className="text-sm">🇵🇭</span>
                          <span className="text-[8px] font-black">+63</span>
                        </div>
                        <input
                          required
                          type="tel"
                          placeholder="NUMBER"
                          value={userInfo.contact}
                          onChange={(e) => setUserInfo({ ...userInfo, contact: e.target.value })}
                          className="flex-grow bg-neutral-50 border-2 border-neutral-100 p-2.5 text-[10px] font-black uppercase tracking-widest focus:border-black outline-none transition-all placeholder:text-neutral-300"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 pt-1">
                      <input
                        type="checkbox"
                        id="news"
                        className="w-3.5 h-3.5 rounded-none border-2 border-neutral-200 accent-black cursor-pointer"
                      />
                      <label
                        htmlFor="news"
                        className="text-[8px] font-black uppercase tracking-widest text-neutral-500 cursor-pointer"
                      >
                        Join Newsletter
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={!userInfo.name || !userInfo.email || !userInfo.contact}
                      className={`w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] italic transition-all mt-2 ${
                        userInfo.name && userInfo.email && userInfo.contact
                          ? "bg-black text-white cursor-pointer hover:bg-neutral-800 shadow-xl"
                          : "bg-neutral-100 text-neutral-300 cursor-not-allowed"
                      }`}
                    >
                      Start Decoding
                    </button>
                  </form>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {messages.map((msg, index) => (
                    <motion.div
                      key={`${msg.id}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-[90%] p-3 text-[10px] font-black uppercase tracking-tight leading-relaxed italic ${
                          msg.sender === "user"
                            ? "bg-black text-white"
                            : "bg-neutral-100 text-black border border-neutral-200"
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[6px] font-black text-neutral-300 mt-1 uppercase tracking-widest px-1">
                        {msg.sender === "admin" ? "ADMIN" : msg.sender === "bot" ? "AI" : "YOU"} •{" "}
                        {msg.time}
                      </span>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <div className="bg-neutral-50 p-2 px-4 rounded-full self-start">
                      <span className="text-[8px] font-black text-neutral-300 animate-pulse">
                        DECODING...
                      </span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Chat Input - Only when signed in */}
            {isSigned && (
              <div className="p-4 bg-white border-t border-neutral-100 shrink-0">
                <div className="flex items-center gap-2 bg-neutral-50 border-2 border-neutral-100 p-1.5 pl-4 focus-within:border-black transition-all">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend(inputValue)}
                    placeholder="TYPE MESSAGE..."
                    className="flex-grow bg-transparent text-[10px] font-black uppercase tracking-widest outline-none py-2"
                  />
                  <button
                    onClick={() => handleSend(inputValue)}
                    disabled={!inputValue.trim()}
                    className="w-9 h-9 bg-black text-white flex items-center justify-center hover:bg-neutral-800 transition-colors disabled:opacity-20"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Navigation Bar */}
            <div className="bg-neutral-50 border-t border-neutral-100 flex items-center justify-around py-4 shrink-0">
              {[
                { label: "Home", icon: Home },
                { label: "Message", icon: MessageSquare },
                { label: "Track", icon: Truck },
                { label: "Help", icon: HelpCircle }
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => setActiveTab(item.label)}
                  className={`flex flex-col items-center gap-1.5 transition-all ${
                    activeTab === item.label
                      ? "text-black scale-110"
                      : "text-neutral-300 hover:text-neutral-500"
                  }`}
                >
                  <item.icon
                    size={18}
                    className={activeTab === item.label ? "stroke-[3px]" : "stroke-[2px]"}
                  />
                  <span className="text-[8px] font-black uppercase tracking-widest">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
