import { Analytics } from "@vercel/analytics/next";
import AnalyticsProvider from '@/components/AnalyticsProvider';
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="font-sans">
        <AnalyticsProvider />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
