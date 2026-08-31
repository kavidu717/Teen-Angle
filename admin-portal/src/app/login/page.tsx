"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import axios from "axios";
import { Mail, Lock } from "lucide-react";
import { api } from "@/service/api";

const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(4, {
    message: "Password must be at least 4 characters.",
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await api.post("/auth/login", data);

      const { token, role, firstName } = response.data;

      if (role !== "admin") {
        toast.error("Access denied. Admin privileges are required.");
        return;
      }

      toast.success(`Login successful! Welcome ${firstName}`);
      console.log("Authentication token:", token);

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Unable to sign in. Please try again.";

        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-50">
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-1">
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-slate-700"
              >
                Email address
              </label>
              <div className="relative flex items-center">
                <input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  {...register("email")}
                  className="w-full py-3 pr-10 bg-transparent border-b border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-yellow-500 text-sm transition-colors"
                />
                <Mail className="absolute right-0 w-5 h-5 text-yellow-600 pointer-events-none" />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600 font-medium mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className="w-full py-3 pr-10 bg-transparent border-b border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-yellow-500 text-sm transition-colors"
                />
                <Lock className="absolute right-0 w-5 h-5 text-yellow-600 pointer-events-none" />
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 font-medium mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-lg bg-yellow-500 text-slate-950 font-semibold hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-sm"
            >
              {isSubmitting ? "Authenticating..." : "Sign in to Dashboard"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}