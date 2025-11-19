import "server-only";

import { StackServerApp } from "@stackframe/stack";

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
});

// <UserButton className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg shadow-md hover:scale-105 transition-transform" />