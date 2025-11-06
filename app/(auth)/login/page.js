"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Lightbulb, Mail, Github } from "lucide-react";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <Lightbulb className="h-12 w-12 text-yellow-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Idea Drop</h1>
          <p className="text-gray-600">
            Share and discover amazing project ideas
          </p>
        </div>
        <button
          onClick={() => signIn("google", { callbackUrl })}
          className="cursor-pointer w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
        >
          <Mail className="h-5 w-5 text-red-500" />
          Continue with Google
        </button>

        <button
          onClick={() => signIn("github", { callbackUrl })}
          className="cursor-pointer w-full flex items-center justify-center gap-3 bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium"
        >
          <Github className="h-5 w-5" />
          Continue with GitHub
        </button>

        <p className="text-center text-sm text-gray-500">
          By continuing, you agree to our{" "}
          <a href="#" className="underline hover:text-gray-700">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-gray-700">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
