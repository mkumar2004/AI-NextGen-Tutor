import { NextResponse } from "next/server";
import { stackServerApp  } from "@/stack";

export async function middleware(request) {
  // Pass the request into stackServerApp
  const user = await stackServerApp.getUser(request);

  if (!user) {
    return NextResponse.redirect(new URL("/handler/sign-in", request.url));
  }

  return NextResponse.next();
}


export const config = {
  // You can add your own route protection logic here
  // Make sure not to protect the root URL, as it would prevent users from accessing static Next.js files or Stack's /handler path
  matcher: ['/dashboard/:path*'],
};