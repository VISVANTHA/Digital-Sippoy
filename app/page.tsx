import { getItems } from "@/lib/db";
import ItemsForm from "./items-form";

export const dynamic = "force-dynamic";

export default async function Home() {
  const items = await getItems();

  return (
    <main className="page">
      <h1>Digital-Sippoy Items</h1>
      <p className="subtitle">
        A minimal CRUD fixture: Next.js App Router API route + JSON file store.
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