import { withAuth } from "next-auth/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { publicPages } from "@/utils/publicpath";
import authOptions from "./lib/auth";

export default withAuth(
   function middleware(req: NextRequest) {
      const { pathname } = req.nextUrl;
      const token = req.nextauth?.token;

      if (token && pathname == "/register") {
         return NextResponse.redirect(new URL("/", req.url));
      }
      // Check for public paths first
      if (
         publicPages.some(
            (path) => pathname === path || pathname.startsWith(path + "/")
         )
      ) {
         return NextResponse.next();
      }

      // Admin-only routes
      if (pathname.startsWith("/admin")) {
         if (!token) {
            return NextResponse.redirect(
               new URL(
                  "/login?callbackUrl=" + encodeURIComponent(pathname),
                  req.url
               )
            );
         }

         if (token.role !== "admin") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
         }
      }

      return NextResponse.next();
   },
   {
      jwt: { decode: authOptions.jwt?.decode },
      callbacks: {
         authorized: ({ token, req }) => {
            const { pathname } = req.nextUrl;
            // Allow public pages without authentication
            if (
               publicPages.some(
                  (path) => pathname === path || pathname.startsWith(path + "/")
               )
            ) {
               return true;
            }

            // Require authentication for all other routes
            return !!token;
         },
      },
      pages: {
         signIn: "/login",
      },
   }
);

// More specific matcher for better performance
export const config = {
   matcher: [
      "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
      "/admin/:path*",
   ],
};
