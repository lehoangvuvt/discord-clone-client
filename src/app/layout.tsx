import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import ReduxProvider from "@/redux/ReduxProvider";
import AuthHandler from "@/components/AuthHandler";
import StyledComponentsRegistry from "./registry";
import "./global.css";

const font = Open_Sans({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Chat App",
  description: "Chat App",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <ReduxProvider>
          <AuthHandler />
          <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        </ReduxProvider>
      </body>
    </html>
  );
}
