// import { type NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";
// import { env } from "@/env.mjs";
// import isEqual from "lodash/isEqual";
// import { pagesOptions } from "./pages-options";

// export const authOptions: NextAuthOptions = {
//   // debug: true,
//   pages: {
//     ...pagesOptions,
//   },
//   session: {
//     strategy: "jwt",
//     maxAge: 30 * 24 * 60 * 60, // 30 days
//   },
//   callbacks: {
//     //**  SESSION **//
//     async session({ session, token }) {
//       return {
//         ...session,
//         ...token,
//       };
//     },

//     //**  JWT **//
//     async jwt({ token, user,account  }) {

//       // if (account && user) {
//       //   token.access = user.access; // Store access token
//       // }
//       // return token;
//       if (account && user) {
//         // return user as JWT
//         token.user = user; // Store the user object in the token
//       }
//       return token;
//     },

//     async redirect({ url, baseUrl }) {
//       const parsedUrl = new URL(url, baseUrl);

//       if (parsedUrl.searchParams.has("callbackUrl")) {
//         return `${baseUrl}${parsedUrl.searchParams.get("callbackUrl")}`;
//       }

//       // Always redirect to /dashboard after login
//       if (url === `${baseUrl}/signin`) {
//         return `${baseUrl}/profile`;
//       }

//       // Default redirect behavior
//       if (parsedUrl.origin === baseUrl) {
//         return url;
//       }

//       return baseUrl;
//     },
//   },
//   providers: [
//     CredentialsProvider({
//       id: "credentials",
//       name: "Credentials",
//       credentials: {},
//       async authorize(credentials: any) {
//         // You need to provide your own logic here that takes the credentials
//         // submitted and returns either a object representing a user or value
//         // that is false/null if the credentials are invalid

//         try {
//           const res = await fetch(
//             `${process.env.NEXT_PUBLIC_API_BASE_URL}/jobseeker/login`,
//             {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({
//                 email: credentials?.email,
//                 password: credentials?.password,
//               }),
//             }
//           );

//           const user = await res.json();
          
//           if (res.ok && user) {
//             return {
//               ...user,
//               // accessToken: user.accessToken, // Return accessToken with the user object
//             };
//           } else {
//             throw new Error(user?.non_field_errors || "Login failed");
//           }
//         } catch (error: any) {
//           throw new Error(error || "Network or server error");
//         }

//       },
//     }),
//     // GoogleProvider({
//     //   clientId: env.GOOGLE_CLIENT_ID || '',
//     //   clientSecret: env.GOOGLE_CLIENT_SECRET || '',
//     //   allowDangerousEmailAccountLinking: true,
//     // }),
//   ],
// };


import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { env } from "@/env.mjs";
import isEqual from "lodash/isEqual";
import { pagesOptions } from "./pages-options";

export const authOptions: NextAuthOptions = {
  pages: {
    ...pagesOptions,
  },
  session: {
    strategy: "jwt",
    // maxAge: 30 * 24 * 60 * 60, // 30 days
    maxAge: 2 * 60 * 60, // 2 hours
  },
  callbacks: {
    //**  SESSION **//
    async session({ session, token }) {
      // Check if the token is still valid based on its expiration time
      const currentTime = Math.floor(Date.now() / 1000);

      if (token.expires && token.expires < currentTime) {
        // If token is expired, return null session (invalidating it)
        return null;
      }

      return {
        ...session,
        ...token,
      };
    },

    //**  JWT **//
    async jwt({ token, user, account }) {
      // If a user just signed in, add the expiration time to the token
      if (account && user) {
        // token.expires = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // Token valid for 30 days
        token.expires = Math.floor(Date.now() / 1000) +  2 * 60 * 60; // Token valid for 2 hours
        token.user = user;
      }

      // Return token without changes if it's not a new session
      return token;
    },

    async redirect({ url, baseUrl }) {
      const parsedUrl = new URL(url, baseUrl);

      if (parsedUrl.searchParams.has("callbackUrl")) {
        return `${baseUrl}${parsedUrl.searchParams.get("callbackUrl")}`;
      }

      // Always redirect to /profile after login
      if (url === `${baseUrl}/signin`) {
        return `${baseUrl}/profile`;
      }

      // Default redirect behavior
      if (parsedUrl.origin === baseUrl) {
        return url;
      }

      return baseUrl;
    },
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {},
      async authorize(credentials: any) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/jobseeker/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials?.email,
                password: credentials?.password,
              }),
            }
          );

          const user = await res.json();
          
          if (res.ok && user) {
            return {
              ...user,
            };
          } else {
            throw new Error(user?.non_field_errors || "Login failed");
          }
        } catch (error: any) {
          throw new Error(error || "Network or server error");
        }
      },
    }),
    // GoogleProvider({
    //   clientId: env.GOOGLE_CLIENT_ID || '',
    //   clientSecret: env.GOOGLE_CLIENT_SECRET || '',
    //   allowDangerousEmailAccountLinking: true,
    // }),
  ],
};
