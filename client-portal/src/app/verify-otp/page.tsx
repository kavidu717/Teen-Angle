"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { API } from "@/service/axios";
import { toast } from "sonner";
import { ShieldCheck, Key } from "lucide-react";

function VerifyOtpContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const emailFromUrl = searchParams.get("email") || "";

    const [email, setEmail] = useState(emailFromUrl);
    const [otp, setOtp] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const payload = {
                email,
                otp
            };

            const response = await API.post("/auth/verify-otp", payload);

            setSuccessMessage(response.data.message);
            toast.success(response.data.message || "OTP verified successfully!");

            setTimeout(() => {
                router.push("/login");
            }, 2000);

        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const errorMsg = err.response?.data?.message || "OTP verification failed.";
                setError(errorMsg);
                toast.error(errorMsg);
            } else if (err instanceof Error) {
                setError(err.message);
                toast.error(err.message);
            } else {
                setError("An unexpected error occurred.");
                toast.error("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen w-full bg-white text-black items-center justify-center p-6">
            <div className="w-full max-w-md mx-auto">
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 bg-gray-50 flex items-center justify-center border border-gray-200">
                        <ShieldCheck className="w-8 h-8 text-black" />
                    </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-2 text-center">Verify OTP.</h1>
                <p className="text-gray-500 mb-8 text-sm font-medium tracking-wide text-center">
                    Enter the 6-digit code sent to<br/>
                    <b className="text-black">{email || "your email"}</b>
                </p>

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div>
                        <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-2 text-center" htmlFor="otp">OTP Code</label>
                        <div className="relative max-w-xs mx-auto">
                            <Key className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                id="otp"
                                type="text"
                                className="w-full bg-gray-50 border border-gray-200 text-black pl-12 pr-4 py-3 focus:outline-none focus:border-black transition-colors tracking-[0.5em] text-center font-bold text-lg"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="------"
                                maxLength={6}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white font-bold uppercase tracking-widest py-4 hover:bg-gray-800 transition-colors disabled:opacity-50 mt-8"
                    >
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                </form>

            </div>
        </div>
    );
}

export default function VerifyOtpPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyOtpContent />
        </Suspense>
    );
}