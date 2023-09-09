import {
  ValidateTokenReturnType,
  ValidateToken,
} from "@/utils/api/validateToken";
import Layout from "@/components/Layout";
import WithAuth from "@/hocs/withAuth";
import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import Tab from "@/components/Tab";
import type { GetServerSidePropsContext } from "next";
import type { NexysComponentProps } from "@/types";

export default function AdminPage(props: NexysComponentProps) {
  return (
    <Layout {...props} withoutLayout>
      <WithAuth {...props}>
        <Navbar />
        <Tab id="admintab">
          <Tab.TabView activeTitle="users" nonActiveTitle="users" id="users">
            <div>halo</div>
          </Tab.TabView>
          <Tab.TabView
            activeTitle="projects"
            nonActiveTitle="projects"
            id="projects"
          >
            <div>halo2</div>
          </Tab.TabView>
        </Tab>
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
      if (!validate.data.isAdmin) {
        ctx.res.writeHead(302, { Location: "/" });
        ctx.res.end();
        return { props: { validate } };
      }
      return { props: { validate } };
    } else {
      ctx.res.writeHead(302, { Location: "/" });
      ctx.res.end();
      return { props: { validate } };
    }
  }
  return { props: { validate } };
}
