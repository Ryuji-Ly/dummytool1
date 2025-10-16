"use client";

import { signIn, signOut } from "next-auth/react";

interface AuthButtonProps {
  isAuthenticated: boolean;
  userName?: string | null;
}

export default function AuthButton({ isAuthenticated, userName }: AuthButtonProps) {
  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">
          Welcome, {userName || "User"}!
        </span>
        <button
          onClick={() => signOut()}
          className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-4"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("keycloak")}
      className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm h-10 px-4"
    >
      Sign In with Keycloak
    </button>
  );
}
