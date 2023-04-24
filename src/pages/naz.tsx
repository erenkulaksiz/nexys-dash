import Head from "next/head";
import Image from "next/image";
import ConfettiExplosion from "react-confetti-explosion";

import Navbar from "@/components/Navbar";
import Layout from "@/components/Layout";
import Container from "@/components/Container";
import { ValidateToken } from "@/utils/api/validateToken";
import type { GetServerSidePropsContext } from "next";
import type { ValidateTokenReturnType } from "@/utils/api/validateToken";
import type { NexysComponentProps } from "@/types";

import Ne from "@/public/images/ne.jpeg";

export default function Naz(props: NexysComponentProps) {
  return (
    <Layout withoutLayout {...props}>
      <Head>
        <title>{"Naz <3"}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Navbar />
      <main className="h-full">
        <Container>
          <div className="flex flex-col pb-2 pt-2 justify-center">
            <h1 className="text-3xl font-semibold">{"Naz'ı çok seviyorum."}</h1>
            <h2 className="text-neutral-400">{"Öyle böyle değil lan."}</h2>
          </div>

          <ConfettiExplosion
            force={0.8}
            duration={5000}
            particleCount={250}
            width={1920}
          />
          <Image src={Ne} alt="Naz" width={200} className="rounded-lg" />

          <div className="flex flex-col py-2 pb-2 pt-2 text-xl justify-center">
            <span>
              Seni sana, seni ne kadar sevdiğimi falan anlatamam. Öyle böyle bir
              güzellik değil tarif edilemez. Çok seviyorum sevgilim. {"<3"}
            </span>
          </div>
        </Container>
      </main>
    </Layout>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  let validate = {} as ValidateTokenReturnType;
  if (ctx.req) {
    validate = await ValidateToken({ token: ctx.req.cookies.auth });
    if (validate.success) {
      if (!validate.data.emailVerified) {
        ctx.res.writeHead(302, { Location: "/auth/verify" });
        ctx.res.end();
        return { props: { validate } };
      }
      return { props: { validate } };
    }
  }
  return { props: { validate } };
}
