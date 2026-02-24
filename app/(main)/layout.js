import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export const metadata = {
  title: "JGEC Vault",
  description: "Academic Archive System",
};

export default function RootLayout({ children }) {
  return (
    <div className="flex h-screen w-full bg-white/97 dark:bg-black overflow-hidden">
      
      {/* Sidebar: 
        Logic inside the component handles mobile (full screen) 
        and desktop (sticky left) 
      */}
      <Sidebar />

      {/* Main Content Area: 
        'min-w-0' is critical here—it prevents the children 
        from pushing the sidebar off-screen on smaller windows.
      */}
      <div className="flex flex-col flex-1 min-w-0 relative h-screen">
        
        {/* Fixed Header: 
          Adjust its internal padding/z-index to match the Sidebar's mobile toggle.
        */}
        <Header />

        {/* Children Container:
          - overflow-y-auto: Independent scrolling from the sidebar.
          - mt-16 lg:mt-0: Clears the Mobile Header bar (if your Sidebar/Header adds one).
        */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative z-0 custom-scrollbar">
          <div className="w-full">
            {children}
          </div>
        </main>
        
      </div>
    </div>
  );
}