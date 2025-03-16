// /app/api/aurinko/getToken
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { db } from "@/app/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      console.log("No valid session in getToken");
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Parse the request body
    const body = await req.json();
    const code = body.code;

    if (!code) {
      console.log("No code provided in request body");
      return NextResponse.json(
        { message: "No code provided" },
        { status: 400 }
      );
    }

    console.log("Received code:", code);

    // Exchange the code for a token
    const tokenResponse = await axios.post(
      `https://api.aurinko.io/v1/auth/token/${code}`,
      {},
      {
        auth: {
          username: process.env.AURINKO_CLIENT_ID as string,
          password: process.env.AURINKO_CLIENT_SECRET as string,
        },
      }
    );

    const token = tokenResponse.data.accessToken;
    console.log("Received token:", token ? "Valid token" : "No token");

    // Get account details with the token
    const accountResponse = await axios.get(
      "https://api.aurinko.io/v1/account",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const accountDetails = accountResponse.data;
    console.log("Account details:", accountDetails.email);

    // Save to database
    const emailAccount = await db.emailAccount.upsert({
      where: { token: token },
      create: {
        id: session.user.id + "-" + new Date().getTime(),
        userId: session.user.id,
        token: token,
        provider: "Aurinko",
        emailAddress: accountDetails.email,
        name: accountDetails.name || accountDetails.email,
      },
      update: {
        token: token,
        emailAddress: accountDetails.email,
        name: accountDetails.name || accountDetails.email,
      },
    });

    console.log("Email account saved:", emailAccount.id);

    return NextResponse.json(
      { message: "Added account successfully", accountId: emailAccount.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in getToken:", error);

    if (axios.isAxiosError(error)) {
      console.error("Error details:", error.response?.data);
      return NextResponse.json(
        { message: "Failed to fetch token", error: error.response?.data },
        { status: error.response?.status || 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Failed to process", error: String(error) },
        { status: 500 }
      );
    }
  }
}
