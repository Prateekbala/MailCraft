"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { error } from "console";
export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    try {
      setLoading(true);

      try {
        const response = await axios.get(
          "/api/aurinko/authUrl?serviceType=Google"
        );
      } catch (error) {
        console.log(
          "error inn dashboard while fetching axios get auth url",
          error
        );
      }
    } catch (error) {
      console.error("Failed to get Aurinko URL:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div>Hello succesfully authenticatd the email through code</div>
      <button
        type="submit"
        className="bg-amber-400 font-bold text-black rounded p-2 m-5 hover:cursor-pointer hover:bg-amber-200"
        onClick={async () => await signOut({ callbackUrl: "/" })}
      >
        signout
      </button>
    </div>
  );
}
