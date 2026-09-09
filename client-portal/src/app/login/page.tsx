"use client"

import { API } from "@/service/axios";
import { useState } from "react"
import axios from "axios";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthstore";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";


export default function LoginPage() {

    const router = useRouter();

    const setAuth = useAuthStore((state) => state.setAuth);

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            const payload = {
                email,
                password
            }

            const response = await API.post("/auth/login", payload)

            if (response.data.token) {
                const { token, ...userData } = response.data;
                setAuth(userData, token);

            }

            setSuccessMessage("Login successful! Redirecting...");
            toast.success("Login successful! Redirecting...");

            setTimeout(() => {
                router.push("/");
            }, 1500);

        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const errorMsg = err.response?.data?.message || "Invalid email or password. Please try again.";
                setError(errorMsg);
                toast.error(errorMsg);
            } else if (err instanceof Error) {
                setError(err.message);
                toast.error(err.message);
            } else {
                setError("An unexpected error occurred.");
                toast.error("An unexpected error occurred.");
            }

            setLoading(false);
        }

    }


    return (
        <div className="flex flex-col md:flex-row min-h-screen w-full bg-white text-black">
            {/* Left Image Section */}
            <div 
                className="w-full md:w-1/2 h-64 md:h-auto bg-cover bg-center"
                style={{ backgroundImage: `url('https://res.cloudinary.com/doujmzgn3/image/upload/v1788941160/lucid-origin_A_sleek_and_luxurious_modern_minimalist_login_page_background_featuring_a_high-e-0_xtaa6m.jpg')` }}
            >
            </div>

            {/* Right Form Section */}
            <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12">
                <div className="w-full max-w-md mx-auto">
                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-2">Login.</h1>
                    <p className="text-gray-500 mb-8 text-sm font-medium tracking-wide">Welcome back to Teen-Angle.</p>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-2" htmlFor="email">email</label>
                            <div className="relative">
                                <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    id="email"
                                    type="email"
                                    className="w-full bg-gray-50 border border-gray-200 text-black pl-12 pr-4 py-3 focus:outline-none focus:border-black transition-colors"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)} 
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-2" htmlFor="password">password</label>
                            <div className="relative">
                                <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    className="w-full bg-gray-50 border border-gray-200 text-black pl-12 pr-12 py-3 focus:outline-none focus:border-black transition-colors"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)} 
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors focus:outline-none"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white font-bold uppercase tracking-widest py-4 hover:bg-gray-800 transition-colors disabled:opacity-50 mt-4"
                        >
                            {loading ? "Logging in..." : "login"}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-gray-200 pt-6">
                        <p className="text-gray-500 text-sm font-medium tracking-wide">
                            Don't have an account?{" "}
                            <Link href="/register" className="text-black font-bold tracking-widest uppercase hover:underline transition-all">
                                Register
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    )

}