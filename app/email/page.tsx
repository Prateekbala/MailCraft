"use client";
import { signOut } from "next-auth/react";

export default function SignIn() {
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
