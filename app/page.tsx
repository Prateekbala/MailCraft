"use client";
import { signIn } from "@/auth";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
export default function SignIn() {
  const router = useRouter();

  return (
    <div>
      <button
        type="submit"
        className="bg-amber-400 font-bold text-black rounded p-2 m-5 hover:cursor-pointer hover:bg-amber-200"
        onClick={() => router.push("/login")}
      >
        LOGIN
      </button>
    </div>
  );
}
