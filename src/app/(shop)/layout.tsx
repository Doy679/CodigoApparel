import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatSupport from "@/components/ChatSupport";
import ClientLayout from "@/components/ClientLayout";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientLayout>
      <Header />
      {children}
      <Footer />
      <ChatSupport />
    </ClientLayout>
  );
}
