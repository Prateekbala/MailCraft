// /app/api/aurinko/callback
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const params = req.nextUrl.searchParams;
  const status = params.get("status");
  if (!status)
    return NextResponse.json(
      { message: "Aurinko Account linking failed" },
      { status: 401 }
    );

  const code = params.get("code");
  if (!code)
    return NextResponse.json({ message: "No code received" }, { status: 401 });

  try {
    // Pass the code from the URL to your getToken endpoint
    const tokenResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_URL}/api/aurinko/getToken`,
      { code },
      {
        headers: {
          "Content-Type": "application/json",
          // Pass the session cookie to maintain authentication
          Cookie: req.headers.get("cookie") || "",
        },
      }
    );

    // Redirect to a success page
    return NextResponse.redirect(new URL("/email", req.url));
  } catch (error) {
    console.error("Error getting token:", error);
    // Redirect to error page
    return NextResponse.redirect(new URL("/email/error", req.url));
  }
}
