import type { Metadata } from "next";
import { Toaster } from 'react-hot-toast';
import { getServerSession } from 'next-auth/next';
import { authOptions} from "./api/auth/[...nextauth]/auth-options"
import AuthProvider from "./api/auth/[...nextauth]/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { inter, lexendDeca } from "@/app/fonts";
import NextProgress from '@/components/next-progress';
import GlobalDrawer from "@/app/shared/drawer-views/container";
import GlobalModal from "@/app/shared/modal-views/container";
import { cn } from "@/utils/class-names";
import {ReactQueryProvider} from "@/utils/reactQuery";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "App Name",
  description: "Write your app description",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const session = await getServerSession(authOptions);

  return (
    <html
      // 💡 Prevent next-themes hydration warning
      suppressHydrationWarning
    >
      <body
        // 💡 Prevent hydration warnings caused by third-party extensions, such as Grammarly.
        suppressHydrationWarning
        className={cn(inter.variable, lexendDeca.variable, "font-inter")}
      >
        <AuthProvider session={session}>
        <ReactQueryProvider>
        <ThemeProvider>
          <NextProgress />
            {children}
          <Toaster  position="top-right"/>
          <GlobalDrawer />
          <GlobalModal />
        </ThemeProvider>
        </ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
