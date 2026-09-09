"use client"

import { API } from "@/service/axios"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import Link from "next/link"
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"



export default function RegisterPage() {

    const router = useRouter();

    const [firstName, setfirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);


    const handelSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null);
        setLoading(true);

        try {
            const payload = {
                firstName,
                lastName,
                email,
                password
            }

            console.log(payload)
            const response = await API.post("/auth/register", payload)

            setSuccessMessage(response.data.message);
            toast.success(response.data.message || "Registration successful!");
            setTimeout(() => {
                router.push(`/verify-otp?email=${encodeURIComponent(email)}`)
            }, 1500)
        }
        catch (err: unknown) {

            if (axios.isAxiosError(err)) {
                const errorMsg = err.response?.data?.message || "Registration failed. Please try again.";
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
                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-2">Register.</h1>
                    <p className="text-gray-500 mb-8 text-sm font-medium tracking-wide">Create an account to join Teen-Angle.</p>

                    <form onSubmit={handelSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-2" htmlFor="firstName">firstname</label>
                            <div className="relative">
                                <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    id="firstName"
                                    type="text"
                                    className="w-full bg-gray-50 border border-gray-200 text-black pl-12 pr-4 py-3 focus:outline-none focus:border-black transition-colors"
                                    value={firstName}
                                    onChange={(e) => setfirstName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-2" htmlFor="lastName">lastname</label>
                            <div className="relative">
                                <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    id="lastName"
                                    type="text"
                                    className="w-full bg-gray-50 border border-gray-200 text-black pl-12 pr-4 py-3 focus:outline-none focus:border-black transition-colors"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </div>

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
                            {loading ? "Registering..." : "register"}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-gray-200 pt-6">
                        <p className="text-gray-500 text-sm font-medium tracking-wide">
                            Already have an account?{" "}
                            <Link href="/login" className="text-black font-bold tracking-widest uppercase hover:underline transition-all">
                                Login
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    )

}