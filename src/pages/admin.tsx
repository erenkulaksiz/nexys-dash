import JSONPretty from "react-json-pretty";
import {
  ValidateTokenReturnType,
  ValidateToken,
} from "@/utils/api/validateToken";
import Layout from "@/components/Layout";
import WithAuth from "@/hocs/withAuth";
import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import Tab from "@/components/Tab";
import LoadingOverlay from "@/components/LoadingOverlay";
import Table from "@/components/Table";
import useAdmin from "@/hooks/useAdmin";
import { useAuthStore } from "@/stores/authStore";
import { formatDateToHuman } from "@/utils";
import { nexys } from "@/utils/nexys";
import { useAdminStore, setPageType } from "@/stores/adminStore";
import type { GetServerSidePropsContext } from "next";
import type { NexysComponentProps } from "@/types";

export default function AdminPage(props: NexysComponentProps) {
  const authUser = useAuthStore((state) => state.user);
  const pageType = useAdminStore((state) => state.pageType);
  const loading = useAdminStore((state) => state.loading);
  const uid = props?.validate?.data?.uid || authUser?.uid;
  const admin = useAdmin({ uid, pageType });
  const totalPages = Math.ceil(admin?.data?.data?.usersLength / 10);

  return (
    <Layout {...props}>
      <WithAuth {...props}>
        <Navbar />
        <Container className="pb-4">
          <Tab
            id="admintab"
            onTabChange={({ id }) => setPageType(id as "users" | "projects")}
          >
            <Tab.TabView activeTitle="users" nonActiveTitle="users" id="users">
              {loading && !admin?.data?.data?.users ? (
                <LoadingOverlay />
              ) : (
                <div className="mt-2 flex flex-col gap-2">
                  {/*<Pager
                      currentPage={1}
                      totalPages={totalPages}
                      perPage={10}
                      onPageClick={() => {}}
                      onNextClick={() => {}}
                      onPreviousClick={() => {}}
                    />*/}
                  <Table
                    columns={[
                      "username",
                      "email",
                      "createdAt",
                      "provider",
                      "uid",
                      "emailVerified",
                      "subscriptionType",
                      "subscriptionBoughtAt",
                      "subscriptionExpiresAt",
                    ]}
                    data={admin?.data?.data?.users?.map((user: any) => {
                      return {
                        ...user,
                        createdAt: formatDateToHuman({
                          date: user.createdAt,
                          output:
                            "{DAY}/{MONTHDATE}/{YEAR} {HOURS}:{MINUTES}:{SECONDS}",
                        }),
                        emailVerified: user.emailVerified ? "true" : "false",
                        subscriptionType: user.subscription?.type,
                        subscriptionBoughtAt: user.subscription?.boughtAt
                          ? formatDateToHuman({
                              date: user.subscription?.boughtAt,
                              output:
                                "{DAY}/{MONTHDATE}/{YEAR} {HOURS}:{MINUTES}:{SECONDS}",
                            })
                          : "",
                        subscriptionExpiresAt: user.subscription?.expiresAt
                          ? formatDateToHuman({
                              date: user.subscription?.expiresAt,
                              output:
                                "{DAY}/{MONTHDATE}/{YEAR} {HOURS}:{MINUTES}:{SECONDS}",
                            })
                          : "",
                      };
                    })}
                  />
                </div>
              )}
            </Tab.TabView>
            <Tab.TabView
              activeTitle="projects"
              nonActiveTitle="projects"
              id="projects"
            >
              <div>halo2</div>
            </Tab.TabView>
            <Tab.TabView activeTitle="nexys" nonActiveTitle="nexys" id="nexys">
              <JSONPretty
                className="text-xs mt-2"
                data={nexys.getLogPoolLogs()}
              ></JSONPretty>
            </Tab.TabView>
          </Tab>
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
