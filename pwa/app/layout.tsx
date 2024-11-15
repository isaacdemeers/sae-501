"use client";
import "../styles/globals.css";
import { Inter } from "next/font/google";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { toast } = useToast();
  const [cookieStatus, setCookieStatus] = useState(
    localStorage.getItem("cookie-accepted") === "true"
  );

  useEffect(() => {
    if (!cookieStatus) {
      toast({
        title: "Nous utilisons des cookies",
        description:
          "Ce site utilise des cookies pour améliorer votre expérience de navigation.",
        action: (
          <div className="flex flex-col gap-1">
            <ToastAction
              altText="Accepter"
              onClick={() => handleCookieChoice(true)}
            >
              Accepter
            </ToastAction>
            <ToastAction
              altText="Refuser"
              onClick={() => handleCookieChoice(false)}
            >
              Refuser
            </ToastAction>
          </div>
        ),
      });
    }
  }, [cookieStatus, toast]);

  function handleCookieChoice(accepted: boolean) {
    setCookieStatus(true);
    localStorage.setItem("cookie-accepted", accepted ? "true" : "false");
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
