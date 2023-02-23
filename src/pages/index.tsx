import Head from "next/head";

import Button from "@/components/Button";
import Navbar from "@/components/Navbar";
import Layout from "@/components/Layout";

export default function Home() {
  return (
    <>
      <Head>
        <title>Nexys Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Layout withoutLayout>
        <Button>test</Button>
      </Layout>
    </>
  );
}
