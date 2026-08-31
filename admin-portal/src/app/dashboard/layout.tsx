"use client";

import AuthGuard from "@/components/AuthGuard";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Users, Settings, LogOut, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { firstName, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Category", href: "/dashboard/category", icon: Settings },
    { name: "Products", href: "/dashboard/products", icon: ShoppingBag },
    { name: "Users", href: "/dashboard/users", icon: Users },
    { name: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-yellow-400 text-white flex flex-col shadow-xl z-20">
          <div className="h-20 flex items-center px-6 border-b border-slate-800 space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm border border-slate-700 relative bg-white flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://res.cloudinary.com/doujmzgn3/image/upload/v1788105918/ChatGPT_Image_Aug_30_2026_09_33_38_PM_iskos8.png"
                alt="Teen-Angle Logo"
                className="w-full h-full object-cover"
              />
            </div>
            
            <span className="text-2xl font-bold tracking-tight text-white">
              Teen-Angle
            </span>
          </div>
          
          <nav className="flex-1 p-4 space-y-2 mt-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3  transition-colors ${
                    isActive
                      ? "bg-yellow-600 text-slate-950 font-bold shadow-sm"
                      : "text-slate-900 hover:bg-yellow-800 hover:text-white font-medium"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              Admin Control Center
            </h2>
            <div className="flex items-center space-x-6">
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-slate-900">
                  {firstName}
                </span>
                <span className="text-xs font-medium text-slate-500">
                  Administrator
                </span>
              </div>
              <div className="h-8 w-px bg-slate-200"></div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-50 text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors text-sm font-semibold border border-slate-200 hover:border-red-100"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </header>

          {/* Dynamic Page Content */}
          <main className="flex-1 p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}