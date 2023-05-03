import Link from "next/link";
import Head from "next/head";
import { MdHome } from "react-icons/md";
import Button from "@/components/Button";

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Nex · 404</title>
      </Head>
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h1 className="text-7xl font-semibold">404</h1>
        <span>{"We couln't find this page."}</span>
        <Link href="/">
          <Button className="px-4" size="h-10">
            <MdHome size={24} />
            <span className="ml-1">Home</span>
          </Button>
        </Link>
      </div>
    </>
  );
}
