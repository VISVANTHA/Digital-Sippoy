import { useRouter } from "next/router";
import { useState, type FormEvent } from "react";

export default function ItemsForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to create item");
      }
      setName("");
      router.replace(router.asPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="items-form">
      <input
        type="text"
        name="name"
        placeholder="New item name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={submitting}
        required
      />
      <button type="submit" disabled={submitting}>
        {submitting ? "Adding..." : "Add item"}
      </button>
      {error && <p className="items-form-error">{error}</p>}
    </form>
  );
}
