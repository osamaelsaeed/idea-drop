"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Lightbulb, Plus, User, LogOut } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav className="flex items-center justify-between bg-white shadow-sm px-6 py-3">
      <div className="flex items-center gap-2 text-purple-700 font-semibold text-xl">
        <Lightbulb className="w-6 h-6" />
        Idea Drop
      </div>

      <div className="flex items-center gap-6">
        <Link
          href="/"
          className={`px-4 py-2 rounded-lg transition-colors ${
            pathname === "/"
              ? "bg-purple-100 text-purple-700 font-medium"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Home
        </Link>

        <Link
          href="/ideas/new"
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            pathname === "/ideas/new"
              ? "bg-purple-100 text-purple-700 font-medium"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Plus className="w-4 h-4" />
          Add Idea
        </Link>

        <Link
          href="/profile"
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            pathname === "/profile"
              ? "bg-purple-100 text-purple-700 font-medium"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <User className="w-4 h-4" />
          Profile
        </Link>
      </div>

      {session && (
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="p-2 text-gray-600 hover:text-red-600 transition-colors"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      )}
    </nav>
  );
}
