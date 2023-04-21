import { useRouter } from "next/router";

import { ValidateToken } from "@/utils/api/validateToken";
import type { ValidateTokenReturnType } from "@/utils/api/validateToken";
import type { GetServerSidePropsContext } from "next";
import type { NexysComponentProps } from "@/types";

export default function ProjectPage(props: NexysComponentProps) {
  const router = useRouter();

  return (
    <div>
      <h1>Project Page</h1>
      <div>{router.query.id?.toString()}</div>
    </div>
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
