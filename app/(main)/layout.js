import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import BackgroundDesign from "../components/BackgroundDesign"; // 🔹 New Component

export const metadata = {
  title: "JGEC Vault",
  description: "Academic Archive System",
};

export default function RootLayout({ children }) {
  return (
    <div className="flex h-screen w-full bg-white dark:bg-black/10 overflow-hidden relative">
      
      <BackgroundDesign />

      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 relative h-screen z-10">
        <Header />

        <main className="flex-1 overflow-y-auto overflow-x-hidden relative z-0 custom-scrollbar">
          <div className="w-full relative">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}