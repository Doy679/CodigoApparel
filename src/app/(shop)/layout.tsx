import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatSupport from "@/components/ChatSupport";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <ChatSupport />
    </>
  );
}
