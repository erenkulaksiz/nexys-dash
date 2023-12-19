import "@/styles/globals.css";
import "@/firebase";
import { useEffect } from "react";
import Progress from "nextjs-progressbar";
import { ThemeProvider } from "next-themes";
import { version } from "@/utils";
import { nexys } from "@/utils/nexys";
import type { AppProps, NextWebVitalsMetric } from "next/app";

nexys.init();

export function reportWebVitals(metric: NextWebVitalsMetric) {
  if (metric.label === "web-vital") {
    nexys.metric(metric);
  }
}

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    nexys.configure((config) => {
      config.setAppVersion(version);
      config.setPlatform("web");
    });
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Progress options={{ showSpinner: false }} color="#B5D200" />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
