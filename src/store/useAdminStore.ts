import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { products as initialProducts, Product } from "@/data/products";
import { COMMUNITY_IMAGES as initialCommunityImages } from "@/data/site-content";

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot" | "admin";
  time: string;
}

interface Conversation {
  id: string;
  customerName: string;
  email?: string;
  contact?: string;
  lastMessage: string;
  lastUpdate: string;
  status: "open" | "resolved";
  messages: ChatMessage[];
}

interface Order {
  id: string;
  customer: string;
  items: number;
  total: number;
  status: string;
  time: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "order" | "stock" | "chat" | "info";
  read: boolean;
}

interface AdminState {
  products: Product[];
  orders: Order[];
  communityImages: string[];
  chats: Conversation[];
  notifications: Notification[];

  // Product Actions
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Community Actions
  addCommunityImage: (image: string) => void;
  removeCommunityImage: (image: string) => void;

  // Chat Actions
  addChatMessage: (
    chatId: string,
    message: ChatMessage,
    customerInfo?: { name: string; email: string; contact: string }
  ) => void;
  resolveChat: (chatId: string) => void;
  updateChat: (chatId: string, updates: Partial<Conversation>) => void;
  deleteChat: (chatId: string) => void;
  createChat: (customerName: string) => void;

  // Order Actions
  addOrder: (order: Order) => void;

  // Notification Actions
  addNotification: (notification: Omit<Notification, "id" | "read">) => void;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;

  // Clear State
  reset: () => void;

  // Stats calculations
  getStats: () => {
    totalRevenue: string;
    totalOrders: number;
    totalCustomers: number;
    avgOrderValue: string;
    lowStockCount: number;
    openConcerns: number;
  };
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      products: initialProducts,
      orders: [
        {
          id: "#CDG-8921",
          customer: "Miguel R.",
          items: 2,
          total: 1598,
          status: "Processing",
          time: "2 mins ago"
        },
        {
          id: "#CDG-8920",
          customer: "Sofia L.",
          items: 1,
          total: 799,
          status: "Shipped",
          time: "45 mins ago"
        },
        {
          id: "#CDG-8919",
          customer: "Andre C.",
          items: 3,
          total: 2397,
          status: "Delivered",
          time: "2 hours ago"
        }
      ],
      communityImages: initialCommunityImages,
      chats: [],
      notifications: [
        {
          id: "1",
          title: "Low Stock Alert",
          message: "Limited Edition Hoodie is down to 2 units.",
          time: "5 mins ago",
          type: "stock",
          read: false
        },
        {
          id: "2",
          title: "New Customer Concern",
          message: "Miguel R. started a new chat.",
          time: "15 mins ago",
          type: "chat",
          read: false
        }
      ],

      setProducts: (products) => set({ products }),

      addProduct: (product) =>
        set((state) => {
          const newNotification: Notification = {
            id: Math.random().toString(36).substr(2, 9),
            title: "New Product Added",
            message: `${product.name} has been added to the catalog.`,
            time: "Just now",
            type: "info",
            read: false
          };
          return {
            products: [product, ...state.products],
            notifications: [newNotification, ...state.notifications]
          };
        }),

      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p))
        })),

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id)
        })),

      addCommunityImage: (image) =>
        set((state) => ({
          communityImages: [image, ...state.communityImages]
        })),

      removeCommunityImage: (image) =>
        set((state) => ({
          communityImages: state.communityImages.filter((img) => img !== image)
        })),

      addChatMessage: (chatId, message, customerInfo) =>
        set((state) => {
          const existingChat = state.chats.find((c) => c.id === chatId);
          const newNotifications = [...state.notifications];

          // Trigger a notification if the sender is user OR if it's a new chat session starting
          if (message.sender === "user" || (!existingChat && message.sender === "bot")) {
            const isNewChat = !existingChat;
            newNotifications.unshift({
              id: Math.random().toString(36).substr(2, 9),
              title: isNewChat ? "New Customer Connected" : "New Customer Concern",
              message: isNewChat
                ? `${customerInfo?.name || "A user"} started a session.`
                : `${customerInfo?.name || "A user"} sent a message: "${message.text.substring(0, 30)}..."`,
              time: "Just now",
              type: "chat",
              read: false
            });
          }

          if (existingChat) {
            // Prevent duplicate messages by ID
            if (existingChat.messages.some((m) => m.id === message.id)) {
              return state;
            }
            return {
              notifications: newNotifications,
              chats: state.chats.map((c) =>
                c.id === chatId
                  ? {
                      ...c,
                      lastMessage: message.text,
                      lastUpdate: "Just now",
                      messages: [...c.messages, message],
                      status: "open" // Ensure it becomes open if a user replies
                    }
                  : c
              )
            };
          } else {
            return {
              notifications: newNotifications,
              chats: [
                {
                  id: chatId,
                  customerName: customerInfo?.name || "Anonymous User",
                  email: customerInfo?.email,
                  contact: customerInfo?.contact,
                  lastMessage: message.text,
                  lastUpdate: "Just now",
                  status: "open",
                  messages: [message]
                },
                ...state.chats
              ]
            };
          }
        }),

      resolveChat: (chatId) =>
        set((state) => ({
          chats: state.chats.map((c) => (c.id === chatId ? { ...c, status: "resolved" } : c))
        })),

      updateChat: (chatId, updates) =>
        set((state) => ({
          chats: state.chats.map((c) => (c.id === chatId ? { ...c, ...updates } : c))
        })),

      deleteChat: (chatId) =>
        set((state) => ({
          chats: state.chats.filter((c) => c.id !== chatId)
        })),

      createChat: (customerName) =>
        set((state) => {
          const chatId = "manual-" + Math.random().toString(36).substr(2, 9);
          return {
            chats: [
              {
                id: chatId,
                customerName: customerName || "New Customer",
                lastMessage: "Conversation started by Admin",
                lastUpdate: "Just now",
                status: "open",
                messages: [
                  {
                    id: "init-" + Math.random().toString(36).substr(2, 9),
                    text: "CONVERSATION INITIALIZED BY ADMIN.",
                    sender: "admin",
                    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  }
                ]
              },
              ...state.chats
            ]
          };
        }),

      addOrder: (order) =>
        set((state) => {
          const newNotification: Notification = {
            id: Math.random().toString(36).substr(2, 9),
            title: "New Order Placed",
            message: `${order.customer} placed an order for ${order.items} item(s) - ₱${order.total.toLocaleString()}.`,
            time: "Just now",
            type: "order",
            read: false
          };
          return {
            orders: [order, ...state.orders],
            notifications: [newNotification, ...state.notifications]
          };
        }),

      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            {
              ...notification,
              id: Math.random().toString(36).substr(2, 9),
              read: false
            },
            ...state.notifications
          ]
        })),

      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
        })),

      clearNotifications: () => set({ notifications: [] }),

      reset: () =>
        set({
          products: initialProducts,
          orders: [
            {
              id: "#CDG-8921",
              customer: "Miguel R.",
              items: 2,
              total: 1598,
              status: "Processing",
              time: "2 mins ago"
            },
            {
              id: "#CDG-8920",
              customer: "Sofia L.",
              items: 1,
              total: 799,
              status: "Shipped",
              time: "45 mins ago"
            },
            {
              id: "#CDG-8919",
              customer: "Andre C.",
              items: 3,
              total: 2397,
              status: "Delivered",
              time: "2 hours ago"
            }
          ],
          communityImages: initialCommunityImages,
          chats: [],
          notifications: [
            {
              id: "1",
              title: "Low Stock Alert",
              message: "Limited Edition Hoodie is down to 2 units.",
              time: "5 mins ago",
              type: "stock",
              read: false
            },
            {
              id: "2",
              title: "New Customer Concern",
              message: "Miguel R. started a new chat.",
              time: "15 mins ago",
              type: "chat",
              read: false
            }
          ]
        }),

      getStats: () => {
        try {
          const { products, orders, chats } = get();

          const safeProducts = Array.isArray(products) ? products : [];
          const safeOrders = Array.isArray(orders) ? orders : [];
          const safeChats = Array.isArray(chats) ? chats : [];

          const totalRevenue = safeOrders.reduce((acc, order) => acc + (order.total || 0), 0);
          const lowStockCount = safeProducts.filter((p) => p && (p.stock || 0) <= 5).length;
          const openConcerns = safeChats.filter((c) => c && c.status === "open").length;

          return {
            totalRevenue: `₱${totalRevenue.toLocaleString()}`,
            totalOrders: safeOrders.length,
            totalCustomers: 1240, // Mocked for now
            avgOrderValue: `₱${Math.round(totalRevenue / (safeOrders.length || 1)).toLocaleString()}`,
            lowStockCount,
            openConcerns
          };
        } catch (error) {
          console.error("Error calculating stats:", error);
          return {
            totalRevenue: "₱0",
            totalOrders: 0,
            totalCustomers: 0,
            avgOrderValue: "₱0",
            lowStockCount: 0,
            openConcerns: 0
          };
        }
      }
    }),
    {
      name: "codigo-admin-storage",
      storage: createJSONStorage(() => localStorage)
    }
  )
);

// Enable Cross-Tab Synchronization
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === "codigo-admin-storage") {
      useAdminStore.persist.rehydrate();
    }
  });
}
