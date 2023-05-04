import "@/styles/globals.css";
import "@/firebase";
import Progress from "nextjs-progressbar";
import { ThemeProvider } from "next-themes";
import { nexys } from "@/utils/nexys";
import { version } from "@/utils";
import type { AppProps } from "next/app";
import type { NextWebVitalsMetric } from "next/app";

export function reportWebVitals(metric: NextWebVitalsMetric) {
  nexys.metric(metric);
}

export default function App({ Component, pageProps }: AppProps) {
  nexys.configure((config) => config.setAppVersion(version));

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Progress options={{ showSpinner: false }} color="#B5D200" />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
