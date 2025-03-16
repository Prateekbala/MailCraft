"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    try {
      setLoading(true);

      // Get the Aurinko auth URL
      const response = await axios.get(
        "/api/aurinko/authUrl?serviceType=Google"
      );

      // Check if we got a URL back
      if (response.data && response.data.url) {
        // Redirect the user to the Aurinko authorization page
        window.location.href = response.data.url;
      } else {
        console.error("No auth URL returned from API");
      }
    } catch (error) {
      console.error("Failed to get Aurinko URL:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="submit"
        className="bg-amber-400 font-bold text-black rounded p-2 m-5 hover:cursor-pointer hover:bg-amber-200"
        onClick={async () => await signOut({ callbackUrl: "/" })}
      >
        Sign Out
      </button>

      <button
        type="submit"
        className="bg-amber-800 font-bold text-black rounded p-2 m-5 hover:cursor-pointer hover:bg-amber-200"
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? "Loading..." : "Connect Email Account"}
      </button>
    </div>
  );
}
