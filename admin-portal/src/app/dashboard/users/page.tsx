"use client";

import { useEffect, useState } from "react";
import { api } from "@/service/api";
import { toast } from "sonner";
import { Trash2, User, ShieldAlert, BadgeCheck } from "lucide-react";
import axios from "axios";

// Define the User TypeScript interface based on expected backend data
interface UserType {
  _id: string;
  firstName: string;
  lastName?: string;
  email: string;
  role: string;
  isVerified: boolean;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      // Ensure this endpoint matches your backend route (e.g., "/users" or "/api/users")
      const response = await api.get("/users"); 
      
      // Based on our controller, the data is inside response.data.data
      setUsers(response.data.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to fetch users.");
      } else {
        toast.error("An unexpected error occurred while fetching users.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    // Add a simple confirmation before deleting
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${userName}? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/users/${userId}`);
      toast.success("User deleted successfully.");
      
      // Remove the deleted user from the local state to update the UI instantly
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to delete user.");
      } else {
        toast.error("An unexpected error occurred while deleting the user.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black tracking-tight">
          User Management
        </h1>
        <div className="bg-white px-4 py-2 rounded-lg border border-neutral-200 shadow-sm text-sm font-semibold text-neutral-600">
          Total Users: {users.length}
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-neutral-500 font-medium">
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-neutral-200 text-neutral-500 text-xs uppercase tracking-wider font-semibold">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-white/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 flex-shrink-0">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-black text-sm">
                            {user.firstName} {user.lastName || ""}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          user.role === "admin"
                            ? "bg-black text-white"
                            : "bg-neutral-100 text-neutral-700"
                        }`}
                      >
                        {user.role === "admin" && <ShieldAlert className="w-3 h-3" />}
                        <span className="capitalize">{user.role}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center space-x-1 text-sm font-medium ${
                          user.isVerified ? "text-green-600" : "text-neutral-400"
                        }`}
                      >
                        {user.isVerified ? (
                          <>
                            <BadgeCheck className="w-4 h-4" />
                            <span>Verified</span>
                          </>
                        ) : (
                          <span>Pending</span>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(user._id, user.firstName)}
                        disabled={user.role === "admin"} // Prevent deleting other admins directly if needed
                        className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={user.role === "admin" ? "Cannot delete admin" : "Delete user"}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}