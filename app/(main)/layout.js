import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export const metadata = {
  title: "JGEC Vault",
  description: "Academic Archive System",
};

export default function RootLayout({ children }) {
  return (
        <div className="flex h-screen">

          {/* Sidebar */}
          <Sidebar />

          {/* Right Side */}
          <div className="flex flex-col flex-1">

            {/* Fixed Header */}
            <Header />

              {children}

          </div>
        </div>
  );
}