import Head from "next/head";
import ConfettiExplosion from "react-confetti-explosion";

import Navbar from "@/components/Navbar";
import Layout from "@/components/Layout";
import Container from "@/components/Container";
import { ValidateToken } from "@/utils/api/validateToken";
import type { GetServerSidePropsContext } from "next";
import type { ValidateTokenReturnType } from "@/utils/api/validateToken";
import type { NexysComponentProps } from "@/types";

export default function Naz(props: NexysComponentProps) {
  return (
    <Layout withoutLayout {...props}>
      <Head>
        <title>{"Nex · Naz <3"}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="h-full overflow-y-auto overflow-x-hidden">
        <Navbar />
        <Container className="flex flex-col items-center">
          <div className="flex flex-col pb-10 pt-2 justify-center">
            <h1 className="text-6xl font-bold">{"Sevgilim."}</h1>
          </div>

          <ConfettiExplosion
            force={0.8}
            duration={5000}
            particleCount={250}
            width={1920}
          />

          <div className="flex flex-row relative">
            <img
              src="/images/ne/ne1.jpg"
              alt="Naz"
              width={300}
              className="rounded-lg object-cover rotate-2 hover:-rotate-6 transition-all ease-in-out"
            />
            <img
              src="/images/ne/ne2.jpg"
              alt="Naz"
              width={400}
              className="rounded-lg object-cover -rotate-6 hover:rotate-2 transition-all ease-in-out"
            />
            <img
              src="/images/ne/ne3.jpg"
              alt="Naz"
              width={300}
              className="rounded-lg object-cover rotate-2 hover:-rotate-12 transition-all ease-in-out"
            />
          </div>

          <div className="flex flex-row relative">
            <img
              src="/images/ne/ne4.jpg"
              alt="Naz"
              width={200}
              className="rounded-lg object-cover rotate-4 hover:-rotate-12 transition-all ease-in-out"
            />
            <img
              src="/images/ne/ne5.jpg"
              alt="Naz"
              width={200}
              className="rounded-lg object-cover -rotate-3 hover:rotate-6 transition-all ease-in-out"
            />
            <img
              src="/images/ne/ne6.jpg"
              alt="Naz"
              width={200}
              className="rounded-lg object-cover rotate-12 hover:-rotate-12 transition-all ease-in-out"
            />
          </div>

          <div className="flex flex-row relative">
            <img
              src="/images/ne/ne7.jpg"
              alt="Naz"
              width={200}
              className="rounded-lg object-cover rotate-1 hover:-rotate-6 transition-all ease-in-out"
            />
            <img
              src="/images/ne/ne8.jpg"
              alt="Naz"
              width={200}
              className="rounded-lg object-cover -rotate-3 hover:rotate-6 transition-all ease-in-out"
            />
          </div>

          <div className="flex flex-col py-2 pb-10 pt-2 gap-2 justify-center">
            <span className="text-4xl">
              {
                "Seni seviyorum. Seni seviyorum. Seni seviyorum. Seni seviyorum. Bunu yapay zeka yazdı. Şaka bir yana, seni gerçekten çok seviyorum. Bunu artık yapay zeka bile algılayıp kod önerisinde seni seviyorum'u öneriyorsa, bence bizden olmuştur."
              }
            </span>
            <span>
              {
                "Bu arada, söylememe gerek var mı bilmiyorum ama o kadar güzelsin ki. Gerçekten."
              }
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
