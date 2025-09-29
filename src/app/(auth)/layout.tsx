import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12 md:py-24">
            {children}
        </main>
        <Footer />
    </div>
  );
}
