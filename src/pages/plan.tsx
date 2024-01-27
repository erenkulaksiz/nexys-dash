import Head from "next/head";
import { useState } from "react";

import { MdOutlineDone } from "react-icons/md";
import { IoMdHeart } from "react-icons/io";
import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import { ValidateToken } from "@/utils/api/validateToken";
import WithAuth from "@/hocs/withAuth";
import { useAuthStore } from "@/stores/authStore";
import type { GetServerSidePropsContext } from "next";
import type { ValidateTokenReturnType } from "@/utils/api/validateToken";
import type { NexysComponentProps } from "@/types";

const plans = [
  {
    id: "free",
    text: "Free",
    priceMonthly: "0",
    priceAnnually: "0",
    projectLimit: "2",
    logUsageLimit: "2.000",
    batchLimit: "100",
  },
  {
    id: "basic",
    text: "Basic",
    priceMonthly: "5",
    priceAnnually: "3",
    projectLimit: "5",
    logUsageLimit: "10.000",
    batchLimit: "2.000",
  },
  {
    id: "pro",
    text: "Pro",
    priceMonthly: "20",
    priceAnnually: "10",
    isMostPopular: true,
    projectLimit: "50",
    logUsageLimit: "100.000",
    batchLimit: "100.000",
  },
  {
    id: "enterprise",
    text: "Enterprise",
    projectLimit: "Unlimited",
    logUsageLimit: "Unlimited",
    batchLimit: "Unlimited",
  },
];

function SubscriptionCard({
  id,
  isMostPopular = false,
  isBilledMonthly = true,
  text,
  priceMonthly,
  priceAnnually,
  projectLimit,
  logUsageLimit,
  batchLimit,
}: {
  id: string;
  text?: string;
  isMostPopular?: boolean;
  isBilledMonthly?: boolean;
  priceMonthly?: string;
  priceAnnually?: string;
  projectLimit?: string;
  logUsageLimit?: string;
  batchLimit?: string;
}) {
  return (
    <div className="flex flex-col p-4 border-[1px] border-neutral-200 dark:border-dark-border rounded-lg relative">
      {isMostPopular && (
        <div className="flex flex-row items-center gap-1 absolute -right-6 -top-4 bg-white dark:bg-black p-1 px-3 rounded-full border-[1px] border-neutral-200 dark:border-dark-border z-20">
          <IoMdHeart />
          <div>Most Popular</div>
        </div>
      )}
      <div className="text-xl font-semibold">{text} Plan</div>
      <div className="flex flex-row items-end mt-2">
        <div className="text-4xl font-bold">
          {id == "enterprise"
            ? "Contact"
            : isBilledMonthly
            ? `$${priceMonthly}`
            : `$${priceAnnually}`}
        </div>
        {id != "enterprise" && (
          <div className="text-xl text-neutral-400">/month</div>
        )}
      </div>
      <div className="mt-2">
        Billed {isBilledMonthly ? "monthly" : "annually"}
      </div>
      <Button className="mt-4">
        {id == "enterprise" ? "Contact" : "Upgrade Plan"}
      </Button>
      <div className="mt-4">
        <ul>
          <li className="flex flex-row items-center">
            <MdOutlineDone />
            <div className="flex flex-row gap-1 ml-1">
              <span className="font-semibold">{projectLimit}</span>
              <span>Projects</span>
            </div>
          </li>
          <li className="flex flex-row items-center">
            <MdOutlineDone />
            <div className="flex flex-row gap-1 ml-1">
              <span className="font-semibold">{logUsageLimit}</span>
              <span>Log Usage</span>
            </div>
          </li>
          <li className="flex flex-row items-center">
            <MdOutlineDone />
            <div className="flex flex-row gap-1 ml-1">
              <span className="font-semibold">{batchLimit}</span>
              <span>Batches</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default function PlanPage(props: NexysComponentProps) {
  const validatedUser = useAuthStore((state) => state.validatedUser);
  const [billRecurrence, setBillRecurrence] = useState<string>("yearly");

  return (
    <Layout {...props}>
      <WithAuth {...props}>
        <Head>
          <title>{"Nex · Subscription"}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Navbar />
        <Container>
          <div className="flex flex-row items-center text-2xl rounded-lg my-4 p-6 gap-1 justify-start w-full border-[1px] border-neutral-200 dark:border-dark-border">
            <div className="font-semibold">Your</div>
            <div className="font-semibold first-letter:uppercase">
              {validatedUser?.subscription?.type || "Free"}
            </div>
            <div className="font-semibold">Plan</div>
            <div className="ml-2 text-green-400 dark:text-green-700 text-sm flex flex-row items-center py-1 rounded-full px-2 border-[1px] border-green-400 dark:border-green-700">
              <MdOutlineDone />
              <div>Active</div>
            </div>
          </div>
          <div className="flex flex-row items-center text-lg rounded-lg my-4 p-6 gap-1 justify-start w-full border-[1px] border-neutral-200 dark:border-dark-border">
            Plans are inactive and you need to contact erenkulaksz@gmail.com to
            upgrade. We are yet still building the platform.
          </div>
          <div className="flex flex-col items-center gap-4 justify-center w-full">
            <div className="flex flex-row gap-1 p-1 rounded-lg border-[1px] border-neutral-200 dark:border-dark-border">
              <button
                className={
                  billRecurrence == "monthly"
                    ? "dark:bg-black bg-white rounded-[6px] p-2 font-semibold border-[1px] border-neutral-200 dark:border-dark-border"
                    : "p-2 font-semibold"
                }
                onClick={() => setBillRecurrence("monthly")}
              >
                Monthly Billing
              </button>
              <button
                className={
                  billRecurrence == "yearly"
                    ? "dark:bg-black bg-white rounded-[6px] p-2 font-semibold border-[1px] border-neutral-200 dark:border-dark-border"
                    : "p-2 font-semibold"
                }
                onClick={() => setBillRecurrence("yearly")}
              >
                Yearly Billing
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 sm:grid-cols-4 gap-4 w-full">
              {plans.map(
                ({
                  id,
                  isMostPopular,
                  text,
                  priceAnnually,
                  priceMonthly,
                  logUsageLimit,
                  batchLimit,
                  projectLimit,
                }) => (
                  <SubscriptionCard
                    key={id}
                    isMostPopular={isMostPopular}
                    text={text}
                    priceAnnually={priceAnnually}
                    priceMonthly={priceMonthly}
                    logUsageLimit={logUsageLimit}
                    batchLimit={batchLimit}
                    id={id}
                    projectLimit={projectLimit}
                    isBilledMonthly={billRecurrence == "monthly"}
                  />
                )
              )}
            </div>
          </div>
        </Container>
      </WithAuth>
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
