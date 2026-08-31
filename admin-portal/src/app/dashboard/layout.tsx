"use client";

import { useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Users, Settings, LogOut, ShoppingBag, FolderKanban, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { firstName, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Category", href: "/dashboard/category", icon: FolderKanban },
    { name: "Products", href: "/dashboard/products", icon: ShoppingBag },
    { name: "Users", href: "/dashboard/users", icon: Users },
    { name: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <AuthGuard>
      {/* Outer container locked to screen height and overflow hidden */}
      <div className="h-screen bg-neutral-100 flex overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside 
          className={`fixed inset-y-0 left-0 w-64 bg-black text-white flex flex-col z-50 h-full flex-shrink-0 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="h-20 flex items-center justify-between px-6 border-b border-neutral-800 space-x-3 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm border border-neutral-700 relative bg-white flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://res.cloudinary.com/doujmzgn3/image/upload/v1788105918/ChatGPT_Image_Aug_30_2026_09_33_38_PM_iskos8.png"
                  alt="Teen-Angle Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Teen-Angle
              </span>
            </div>
            <button 
              className="md:hidden p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-white text-black font-bold shadow-sm"
                      : "text-neutral-400 hover:bg-neutral-900 hover:text-white font-medium"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Right Side Container (Header + Scrollable Main Content) */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden w-full">
          {/* Top Header (Fixed at top of right section) */}
          <header className="h-20 bg-white border-b border-neutral-200 flex items-center justify-between px-4 md:px-8 shadow-sm z-10 flex-shrink-0">
            <div className="flex items-center space-x-4">
              <button 
                className="md:hidden p-2 rounded-lg bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="text-lg md:text-xl font-bold text-black tracking-tight hidden sm:block">
                Admin Control Center
              </h2>
            </div>
            
            <div className="flex items-center space-x-4 md:space-x-6">
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-black">
                  {firstName || "Admin"}
                </span>
                <span className="text-xs font-medium text-neutral-500">
                  Administrator
                </span>
              </div>
              <div className="h-8 w-px bg-neutral-200 hidden sm:block"></div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 md:px-4 md:py-2 rounded-lg bg-white text-neutral-600 hover:bg-black hover:text-white transition-all duration-200 text-sm font-semibold border border-neutral-200 hover:border-black shadow-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </header>

          {/* Scrollable Dynamic Page Content Area */}
          <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-neutral-50">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}