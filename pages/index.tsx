import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { getToken } from "next-auth/jwt";
import { authOptions } from "@/lib/auth";
import { getItems, type Item } from "@/lib/db";
import ItemsForm from "@/components/items-form";
import SignOutButton from "@/components/sign-out-button";

export const getServerSideProps: GetServerSideProps<{
  items: Item[];
}> = async (context) => {
  const token = await getToken({ req: context.req, secret: authOptions.secret });
  if (!token) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  const items = await getItems();
  return { props: { items } };
};

export default function Home({
  items,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main className="page">
      <Head>
        <title>Digital-Sippoy</title>
        <meta
          name="description"
          content="Testbed reference app for the Testable code-scanning platform"
        />
      </Head>
      <div className="page-header">
        <h1>Digital-Sippoy Items</h1>
        <SignOutButton />
      </div>
      <p className="subtitle">
        A minimal CRUD fixture: Next.js Pages Router API route + JSON file
        store.
      </p>

      <ItemsForm />

      <ul className="items-list">
        {items.map((item) => (
          <li key={item.id}>
            <span className="item-name">{item.name}</span>
            <span className="item-date">
              {new Date(item.createdAt).toLocaleString()}
            </span>
          </li>
        ))}
        {items.length === 0 && <li className="empty">No items yet.</li>}
      </ul>
    </main>
  );
}
