"use client";

import { useAdminStore } from "@/store/useAdminStore";
import {
  MessageSquare,
  CheckCircle2,
  Search,
  Send,
  Shield,
  Plus,
  Trash2,
  Edit3,
  X,
  Check,
  Mail,
  Phone
} from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";

export default function AdminConcerns() {
  const { chats, resolveChat, addChatMessage, updateChat, deleteChat, createChat } =
    useAdminStore();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // States for CRUD
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedChatId, chats]);

  const filteredChats = useMemo(() => {
    return chats.filter(
      (c) =>
        c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || c.id.includes(searchTerm)
    );
  }, [chats, searchTerm]);

  const selectedChat = useMemo(() => {
    return chats.find((c) => c.id === selectedChatId);
  }, [chats, selectedChatId]);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedChatId && replyText.trim()) {
      addChatMessage(selectedChatId, {
        id: Math.random().toString(36).substr(2, 9),
        text: replyText.toUpperCase(),
        sender: "admin",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      });
      setReplyText("");
      toast.success("Reply sent.");
    }
  };

  const handleCreateNewChat = () => {
    createChat("NEW CUSTOMER");
    toast.success("New conversation started.");
  };

  const handleDeleteChat = (id: string) => {
    if (window.confirm("ARE YOU SURE YOU WANT TO PERMANENTLY DELETE THIS CONVERSATION?")) {
      deleteChat(id);
      setSelectedChatId(null);
      toast.success("Conversation deleted.");
    }
  };

  const handleUpdateName = () => {
    if (selectedChatId && newName.trim()) {
      updateChat(selectedChatId, { customerName: newName.toUpperCase() });
      setIsEditingName(false);
      toast.success("Customer name updated.");
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col py-6">
      <div className="flex-grow flex bg-white border border-neutral-100 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 flex flex-col border-r border-neutral-100 bg-neutral-50/30">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black uppercase italic tracking-tighter">Inbox</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCreateNewChat}
                  className="p-2 hover:bg-black hover:text-white transition-all rounded-full"
                  title="New Conversation"
                >
                  <Plus size={16} />
                </button>
                <div className="bg-black text-white text-[8px] font-black px-2 py-1 rounded-full">
                  {chats.filter((c) => c.status === "open").length} OPEN
                </div>
              </div>
            </div>
            <div className="relative">
              <Search
                size={12}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="SEARCH MESSAGES..."
                className="w-full bg-white border border-neutral-100 py-3 pl-10 pr-4 text-[9px] font-black uppercase tracking-widest outline-none focus:ring-1 focus:ring-black transition-all"
              />
            </div>
          </div>

          <div className="flex-grow overflow-y-auto divide-y divide-neutral-50">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => {
                  setSelectedChatId(chat.id);
                  setIsEditingName(false);
                }}
                className={`w-full p-6 text-left transition-all hover:bg-white flex items-start gap-4 ${selectedChatId === chat.id ? "bg-white shadow-[inset_4px_0_0_0_#000]" : ""}`}
              >
                <div className="relative shrink-0">
                  <div className="w-10 h-10 bg-neutral-100 flex items-center justify-center rounded-full italic font-black text-[10px]">
                    {chat.customerName.substring(0, 2).toUpperCase()}
                  </div>
                  {chat.status === "open" && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                  )}
                </div>
                <div className="flex-grow min-w-0 space-y-1">
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-[10px] font-black uppercase tracking-widest truncate">
                      {chat.customerName}
                    </h4>
                    <span className="text-[7px] font-bold text-neutral-300 uppercase shrink-0">
                      {chat.lastUpdate}
                    </span>
                  </div>
                  <p
                    className={`text-[10px] uppercase tracking-tight truncate ${chat.status === "open" && selectedChatId !== chat.id ? "font-black text-black" : "font-medium text-neutral-400"}`}
                  >
                    {chat.lastMessage}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-grow flex flex-col bg-white relative">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-neutral-50 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-full italic font-black text-xs">
                    {selectedChat.customerName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    {isEditingName ? (
                      <div className="flex items-center gap-2">
                        <input
                          autoFocus
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleUpdateName()}
                          className="border-b border-black outline-none text-xs font-black uppercase tracking-widest"
                        />
                        <button onClick={handleUpdateName}>
                          <Check size={14} className="text-green-500" />
                        </button>
                        <button onClick={() => setIsEditingName(false)}>
                          <X size={14} className="text-red-500" />
                        </button>
                      </div>
                    ) : (
                      <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                        {selectedChat.customerName}
                        <button
                          onClick={() => {
                            setIsEditingName(true);
                            setNewName(selectedChat.customerName);
                          }}
                          className="opacity-0 group-hover:opacity-100 hover:text-neutral-400 transition-all"
                        >
                          <Edit3 size={10} />
                        </button>
                        {selectedChat.status === "resolved" && (
                          <CheckCircle2 size={12} className="text-green-500" />
                        )}
                      </h3>
                    )}
                    <div className="flex flex-col gap-1 mt-1">
                      <div className="flex items-center gap-3">
                        <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                        <p className="text-[7px] font-bold text-neutral-400 uppercase tracking-widest">
                          Customer ID: {selectedChat.id}
                        </p>
                      </div>
                      {(selectedChat.email || selectedChat.contact) && (
                        <div className="flex items-center gap-4">
                          {selectedChat.email && (
                            <div className="flex items-center gap-1.5 opacity-60">
                              <Mail size={8} />
                              <span className="text-[7px] font-black uppercase tracking-widest">
                                {selectedChat.email}
                              </span>
                            </div>
                          )}
                          {selectedChat.contact && (
                            <div className="flex items-center gap-1.5 opacity-60">
                              <Phone size={8} />
                              <span className="text-[7px] font-black uppercase tracking-widest">
                                {selectedChat.contact}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => resolveChat(selectedChat.id)}
                    className={`px-4 py-2 text-[8px] font-black uppercase tracking-[0.2em] transition-all border ${selectedChat.status === "resolved" ? "bg-green-50 border-green-100 text-green-600" : "bg-white border-neutral-100 text-neutral-400 hover:border-black hover:text-black"}`}
                  >
                    {selectedChat.status === "resolved" ? "RESOLVED" : "MARK AS RESOLVED"}
                  </button>
                  <button
                    onClick={() => handleDeleteChat(selectedChat.id)}
                    className="p-2 text-neutral-300 hover:text-red-600 transition-colors"
                    title="Delete Conversation"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div
                ref={scrollRef}
                className="flex-grow p-8 overflow-y-auto bg-neutral-50/30 flex flex-col gap-6"
              >
                <div className="flex flex-col items-center justify-center py-10 opacity-20">
                  <Shield size={32} className="mb-4 text-black" />
                  <p className="text-[8px] font-black uppercase tracking-[0.4em]">
                    Secure Connection Established
                  </p>
                </div>

                {selectedChat.messages.map((msg, i) => {
                  const isLastInGroup =
                    i === selectedChat.messages.length - 1 ||
                    selectedChat.messages[i + 1].sender !== msg.sender;
                  return (
                    <div
                      key={`${msg.id}-${i}`}
                      className={`flex flex-col ${msg.sender === "admin" ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-[65%] p-4 text-[10px] font-bold uppercase tracking-tight leading-relaxed ${
                          msg.sender === "admin"
                            ? "bg-black text-white rounded-2xl rounded-tr-none"
                            : msg.sender === "bot"
                              ? "bg-neutral-800 text-white rounded-2xl rounded-tl-none opacity-60"
                              : "bg-white border border-neutral-100 text-black shadow-sm rounded-2xl rounded-tl-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                      {isLastInGroup && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-[6px] font-black text-neutral-300 uppercase tracking-widest">
                            {msg.sender === "admin"
                              ? "YOU"
                              : msg.sender === "bot"
                                ? "AI ASSISTANT"
                                : "CUSTOMER"}
                          </span>
                          <span className="text-[6px] font-black text-neutral-200">•</span>
                          <span className="text-[6px] font-black text-neutral-300 uppercase tracking-widest">
                            {msg.time}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Message Input */}
              <div className="p-6 bg-white border-t border-neutral-50">
                <form
                  onSubmit={handleSendReply}
                  className="flex items-center gap-4 bg-neutral-50 border border-neutral-100 rounded-2xl p-2 pl-6 focus-within:ring-1 focus-within:ring-black transition-all"
                >
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="TYPE YOUR MESSAGE..."
                    className="flex-grow bg-transparent py-3 text-[10px] font-black uppercase tracking-widest outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!replyText.trim()}
                    className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-xl hover:bg-neutral-800 transition-all disabled:opacity-20 shadow-lg"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center p-20 text-center gap-6">
              <div className="w-20 h-20 bg-neutral-50 flex items-center justify-center rounded-full">
                <MessageSquare size={32} className="text-neutral-200" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black uppercase italic tracking-tighter">
                  Select a Conversation
                </h3>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest max-w-[250px]">
                  Pick a client from the inbox to start decoding their concern.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
