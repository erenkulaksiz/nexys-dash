import Head from "next/head";
import LoadingOverlay from "@/components/LoadingOverlay";

export function LoadingState() {
  return (
    <>
      <Head>
        <title>Nex · Loading...</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <LoadingOverlay />
    </>
  );
}
