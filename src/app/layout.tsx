'use client';

import { useEffect } from 'react';
import { Analytics } from "@vercel/analytics/next";
import { initPostHog, capturePageView } from "@/lib/posthog";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    // 初始化 PostHog
    initPostHog();
    
    // 捕获页面浏览事件
    capturePageView();
  }, []);

  return (
    <html lang="zh-CN">
      <body className="font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
