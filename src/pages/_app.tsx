import "@/styles/globals.css";
import "@/firebase";
import Progress from "nextjs-progressbar";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Progress options={{ showSpinner: false }} color="#B5D200" />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
