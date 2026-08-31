"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import axios from "axios";
import { Mail, Lock, KeyRound, X } from "lucide-react";
import { api } from "@/service/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

// --- Validation Schemas ---
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(4, { message: "Password must be at least 4 characters." }),
});

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

const resetPasswordSchema = z.object({
  otp: z.string().length(6, { message: "Reset code must be exactly 6 characters." }),
  newPassword: z.string().min(4, { message: "Password must be at least 4 characters." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function AdminLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  // --- State Management ---
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [resetStep, setResetStep] = useState<1 | 2>(1);
  const [resetEmail, setResetEmail] = useState<string>("");

  // --- Form Hooks ---
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const forgotForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const resetForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // --- Form Submit Handlers ---

  // Main Login Handler
  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      const response = await api.post("/auth/login", data);
      const { token, role, firstName } = response.data;

      if (role !== "admin") {
        toast.error("Access denied. Admin privileges are required.");
        return;
      }

      setAuth(token, role, firstName);
      toast.success(`Login successful! Welcome ${firstName}`);
      router.push("/dashboard");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Unable to sign in. Please try again.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  // Forgot Password Handler (Send OTP)
  const onForgotSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      const response = await api.post("/auth/forgot-password", data);
      setResetEmail(data.email); 
      setResetStep(2); 
      toast.success(response.data.message || "Reset code sent successfully.");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to send reset code.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  // Reset Password Handler (Verify OTP & Change Password)
  const onResetSubmit = async (data: ResetPasswordFormValues) => {
    try {
      const payload = {
        email: resetEmail,
        otp: data.otp,
        newPassword: data.newPassword,
      };

      const response = await api.post("/auth/reset-password", payload);
      
      toast.success(response.data.message || "Password reset successful!");
      
      setIsDrawerOpen(false);
      setTimeout(() => {
        setResetStep(1);
        setResetEmail("");
        forgotForm.reset();
        resetForm.reset();
      }, 500);

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to reset password.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  // Helper to close drawer and reset form state
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => {
      setResetStep(1);
      forgotForm.reset();
      resetForm.reset();
    }, 500);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-50 relative overflow-hidden">
      {/* --- Left Side: Background Image --- */}
      <div className="relative hidden lg:block bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/login.jpg"
          alt="Login Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 flex flex-col justify-end h-full p-12 text-white">
          <span className="text-sm font-semibold tracking-wider uppercase text-yellow-400 mb-2">
            Teen-Angle Admin Portal
          </span>
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            Admin Management Portal
          </h2>
          <p className="text-slate-300 max-w-md text-sm leading-relaxed">
            Secure backend control center for inventory, order processing, and comprehensive e-commerce administration.
          </p>
        </div>
      </div>

      {/* --- Right Side: Login Form --- */}
      <div className="flex items-center justify-center p-8 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg border-2 border-slate-200 relative bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://res.cloudinary.com/doujmzgn3/image/upload/v1788105918/ChatGPT_Image_Aug_30_2026_09_33_38_PM_iskos8.png"
                alt="Teen-Angle Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Teen-Angle
              </h1>
              <p className="text-sm text-slate-500">
                Please enter your credentials to access the admin dashboard.
              </p>
            </div>
          </div>

          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <div className="relative flex items-center">
                <input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  {...loginForm.register("email")}
                  className="w-full py-3 pr-10 bg-transparent border-b border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-yellow-500 text-sm transition-colors"
                />
                <Mail className="absolute right-0 w-5 h-5 text-yellow-600 pointer-events-none" />
              </div>
              {loginForm.formState.errors.email && (
                <p className="text-xs text-red-600 font-medium mt-1">
                  {loginForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(true)}
                  className="text-sm font-semibold text-slate-600 hover:text-yellow-600 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative flex items-center">
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...loginForm.register("password")}
                  className="w-full py-3 pr-10 bg-transparent border-b border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-yellow-500 text-sm transition-colors"
                />
                <Lock className="absolute right-0 w-5 h-5 text-yellow-600 pointer-events-none" />
              </div>
              {loginForm.formState.errors.password && (
                <p className="text-xs text-red-600 font-medium mt-1">
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loginForm.formState.isSubmitting}
              className="w-full py-3 px-4 rounded-lg bg-yellow-500 text-slate-950 font-semibold hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-sm"
            >
              {loginForm.formState.isSubmitting ? "Authenticating..." : "Sign in to Dashboard"}
            </button>
          </form>
        </div>
      </div>

      {/* --- Forgot Password Drawer (Slide-in UI) --- */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={handleCloseDrawer}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full lg:w-1/2 max-w-2xl bg-white z-50 shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex-1 flex flex-col p-8 sm:p-16 lg:p-20 pt-16 sm:pt-24 lg:pt-32 overflow-y-auto">
          
          <div className="flex items-start justify-between mb-8">
            <div>
              <span className="text-xs font-bold tracking-widest text-yellow-500 uppercase mb-2 block">
                Teen-Angle
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {resetStep === 1 ? "Reset Password" : "Enter OTP & New Password"}
              </h2>
            </div>
            <button
              onClick={handleCloseDrawer}
              className="p-2 -mr-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="w-full max-w-md lg:ml-8">
            <p className="text-slate-500 mb-10 text-sm leading-relaxed">
              {resetStep === 1
                ? "Enter your registered email address below. We'll send you a 6-digit verification code to reset your password."
                : `Please enter the 6-digit code sent to ${resetEmail} along with your new password.`}
            </p>

            {/* Request OTP Form */}
            {resetStep === 1 ? (
              <form onSubmit={forgotForm.handleSubmit(onForgotSubmit)} className="space-y-8">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Email address
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="email"
                      placeholder="admin@example.com"
                      {...forgotForm.register("email")}
                      className="w-full py-3 pr-10 bg-transparent border-b border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-yellow-500 text-sm transition-colors"
                    />
                    <Mail className="absolute right-0 w-5 h-5 text-yellow-600 pointer-events-none" />
                  </div>
                  {forgotForm.formState.errors.email && (
                    <p className="text-xs text-red-600 font-medium mt-1">
                      {forgotForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={forgotForm.formState.isSubmitting}
                  className="w-full py-3.5 px-4 rounded-lg bg-yellow-500 text-slate-950 font-semibold hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-colors disabled:opacity-50 text-sm shadow-sm"
                >
                  {forgotForm.formState.isSubmitting ? "Sending..." : "Send Verification Code"}
                </button>
              </form>
            ) : (
              // Verify OTP and Reset Password Form
              <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-8">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Reset Code (OTP)
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="123456"
                      {...resetForm.register("otp")}
                      className="w-full py-3 pr-10 bg-transparent border-b border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-yellow-500 text-sm transition-colors tracking-widest"
                    />
                    <KeyRound className="absolute right-0 w-5 h-5 text-yellow-600 pointer-events-none" />
                  </div>
                  {resetForm.formState.errors.otp && (
                    <p className="text-xs text-red-600 font-medium mt-1">
                      {resetForm.formState.errors.otp.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    New Password
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="password"
                      placeholder="••••••••"
                      {...resetForm.register("newPassword")}
                      className="w-full py-3 pr-10 bg-transparent border-b border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-yellow-500 text-sm transition-colors"
                    />
                    <Lock className="absolute right-0 w-5 h-5 text-yellow-600 pointer-events-none" />
                  </div>
                  {resetForm.formState.errors.newPassword && (
                    <p className="text-xs text-red-600 font-medium mt-1">
                      {resetForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={resetForm.formState.isSubmitting}
                  className="w-full py-3.5 px-4 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-colors disabled:opacity-50 text-sm shadow-sm"
                >
                  {resetForm.formState.isSubmitting ? "Resetting..." : "Confirm & Reset Password"}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setResetStep(1);
                      resetForm.reset();
                    }}
                    className="text-sm font-medium text-slate-500 hover:text-yellow-600 transition-colors"
                  >
                    Change Email Address
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}