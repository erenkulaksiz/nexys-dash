import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <head>
        <meta name="application-name" content="Nexys" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Nexys" />
        <meta name="description" content="Log. Track. Improve." />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#2B5797" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
        />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://dash.nexys.app" />
        <meta name="twitter:title" content="Nexys" />
        <meta name="twitter:description" content="Log. Track. Improve." />
        <meta name="twitter:creator" content="@erencode" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Nexys" />
        <meta property="og:description" content="Log. Track. Improve." />
        <meta property="og:site_name" content="Nexys" />
        <meta property="og:url" content="https://dash.nexys.app" />
      </head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
