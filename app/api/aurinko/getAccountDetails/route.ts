// // /app/api/aurinko/getAccountDetails

// import { NextRequest, NextResponse } from "next/server";
// import axios from "axios";

// export async function POST(req: NextRequest) {
//   try {
//     const { accessToken } = await req.json();

//     if (!accessToken) {
//       return NextResponse.json(
//         { error: "Access token is required" },
//         { status: 400 }
//       );
//     }

//     const response = await axios.get("https://api.aurinko.io/v1/account", {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     return NextResponse.json(response.data);
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.error("Error fetching account details:", error.response?.data);
//       return NextResponse.json(
//         { error: error.response?.data || "Failed to fetch account details" },
//         { status: error.response?.status || 500 }
//       );
//     }
//     console.error("Unexpected error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
