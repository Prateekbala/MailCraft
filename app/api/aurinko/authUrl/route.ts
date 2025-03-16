// /app/api/aurinko/authUrl
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const serviceType = searchParams.get("serviceType") as "Google" | "office365";

  if (!serviceType) {
    return NextResponse.json(
      { error: "Service type is required" },
      { status: 400 }
    );
  }

  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const newParam = new URLSearchParams({
    clientId: process.env.AURINKO_CLIENT_ID as string,
    serviceType: serviceType as string,
    scopes: "Mail.Read Mail.ReadWrite Mail.Send Mail.Drafts Mail.All",
    responseType: "code",
    returnUrl: `${process.env.NEXT_PUBLIC_URL}/api/aurinko/callback`,
  });

  const authUrl = `https://api.aurinko.io/v1/auth/authorize?${newParam.toString()}`;

  // No need to fetch the URL here, just return it to the client
  // The client will navigate to this URL, which will redirect back to our callback
  return NextResponse.json({ url: authUrl });
}
