"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X, User } from "lucide-react";

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMobileMenuOpen]);

    return (
        <>
            {/* Main Header - Full Width Black Glass Effect */}
            <header className="sticky top-0 z-40 w-full bg-black/80 border-b border-white/10 backdrop-blur-md">
                {/* Changed from max-w-7xl to w-full with wider padding for edge-to-edge layout */}
                <nav className="w-full px-6 lg:px-16 h-20 flex items-center justify-between transition-all duration-300">

                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-2xl md:text-3xl font-black tracking-tighter uppercase text-white">
                            Teen-Angle.
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <ul className="hidden lg:flex items-center space-x-12 flex-1 justify-center">
                        <li><Link href="/" className="text-xs font-bold tracking-[0.2em] uppercase text-white/70 hover:text-white transition-colors">Home</Link></li>
                        <li><Link href="/shop" className="text-xs font-bold tracking-[0.2em] uppercase text-white/70 hover:text-white transition-colors">Shop</Link></li>
                        <li><Link href="/about" className="text-xs font-bold tracking-[0.2em] uppercase text-white/70 hover:text-white transition-colors">About Us</Link></li>
                        <li><Link href="/contact" className="text-xs font-bold tracking-[0.2em] uppercase text-white/70 hover:text-white transition-colors">Contact Us</Link></li>
                    </ul>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center justify-end space-x-8">
                        <Link href="/login" className="flex items-center space-x-2 text-xs font-bold tracking-[0.2em] uppercase text-white/70 hover:text-white transition-colors">
                            <User className="w-4 h-4" />
                            <span>Login</span>
                        </Link>
                        <Link href="/register" className="px-6 py-2 border border-white/50 text-xs font-bold tracking-[0.2em] uppercase text-white hover:bg-white hover:text-black transition-all">
                            Register
                        </Link>
                        <Link href="/cart" className="relative flex items-center group">
                            <ShoppingBag className="w-5 h-5 text-white/90 group-hover:text-white transition-colors" />
                            <span className="absolute -top-1.5 -right-2 flex items-center justify-center w-4 h-4 bg-white text-black text-[9px] font-bold rounded-full shadow-sm">0</span>
                        </Link>
                    </div>

                    {/* Mobile Toggle & Cart */}
                    <div className="flex lg:hidden items-center space-x-6">
                        <Link href="/cart" className="relative flex items-center">
                            <ShoppingBag className="w-6 h-6 text-white" />
                            <span className="absolute -top-1.5 -right-2 flex items-center justify-center w-4 h-4 bg-white text-black text-[9px] font-bold rounded-full shadow-sm">0</span>
                        </Link>
                        <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
                            <Menu className="w-7 h-7" />
                        </button>
                    </div>
                </nav>
            </header>

            {/* Mobile Menu Backdrop */}
            <div
                className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 lg:hidden ${isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={toggleMobileMenu}
            ></div>

            {/* Mobile Menu Drawer */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-[80%] max-w-sm bg-[#0a0a0a] flex flex-col transition-transform duration-300 ease-in-out lg:hidden ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Menu Header with X button */}
                <div className="px-6 h-20 flex items-center justify-between border-b border-white/10">
                    <span className="text-lg font-bold tracking-widest uppercase text-white">
                        Menu
                    </span>
                    <button onClick={toggleMobileMenu} className="text-white hover:text-white/70 focus:outline-none transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Menu Links */}
                <div className="flex-1 overflow-y-auto py-8 px-6 flex flex-col space-y-6">
                    <div className="flex flex-col space-y-6">
                        <Link href="/" onClick={toggleMobileMenu} className="text-sm font-bold tracking-widest uppercase text-white hover:text-white/70 transition-colors">
                            Home
                        </Link>
                        <Link href="/shop" onClick={toggleMobileMenu} className="text-sm font-bold tracking-widest uppercase text-white hover:text-white/70 transition-colors">
                            Shop
                        </Link>
                    </div>

                    <div className="w-full h-px bg-white/10 my-4"></div>

                    <div className="flex flex-col space-y-6">
                        <Link href="/about" onClick={toggleMobileMenu} className="text-xs font-semibold tracking-widest uppercase text-white/70 hover:text-white transition-colors">
                            About Us
                        </Link>
                        <Link href="/contact" onClick={toggleMobileMenu} className="text-xs font-semibold tracking-widest uppercase text-white/70 hover:text-white transition-colors">
                            Contact Us
                        </Link>
                        <Link href="/login" onClick={toggleMobileMenu} className="text-xs font-semibold tracking-widest uppercase text-white/70 hover:text-white transition-colors">
                            Login
                        </Link>
                        <Link href="/register" onClick={toggleMobileMenu} className="text-xs font-semibold tracking-widest uppercase text-white/70 hover:text-white transition-colors">
                            Register
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}