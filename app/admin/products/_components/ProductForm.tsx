"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ADMIN_EMAIL } from "@/lib/constants";

type ProductFormProps = {
  mode: "create" | "edit";
  product?: {
    _id: string;
    title: string;
    description: string;
    price: number;
    images: string[];
    category: string;
  };
};

export default function ProductForm({ mode, product }: ProductFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(product?.title ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [images, setImages] = useState((product?.images ?? []).join(", "));
  const [category, setCategory] = useState(product?.category ?? "");
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    const payload = {
      title,
      description,
      price: parseFloat(price),
      images: images
        .split(",")
        .map((img) => img.trim())
        .filter(Boolean),
      category,
    };

    const endpoint = mode === "create" ? "/api/products" : `/api/products/${product?._id}`;
    const method = mode === "create" ? "POST" : "PUT";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Unable to save product" }));
      setStatus(error.error || "Unable to save product");
      setIsSubmitting(false);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  };

  const handleDelete = async () => {
    if (!product?._id) return;
    setIsSubmitting(true);
    setStatus(null);

    const response = await fetch(`/api/products/${product._id}`, { method: "DELETE" });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Unable to delete product" }));
      setStatus(error.error || "Unable to delete product");
      setIsSubmitting(false);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-200">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Admin: {ADMIN_EMAIL}</p>
          <h1 className="text-2xl font-semibold text-white">{mode === "create" ? "Create" : "Edit"} product</h1>
        </div>
        {mode === "edit" && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isSubmitting}
            className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/20"
          >
            Delete
          </button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-300">
          <span className="block text-xs uppercase tracking-[0.2em] text-slate-400">Title</span>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-white/30"
            placeholder="Product title"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-300">
          <span className="block text-xs uppercase tracking-[0.2em] text-slate-400">Category</span>
          <input
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-white/30"
            placeholder="Category"
          />
        </label>
      </div>

      <label className="space-y-2 text-sm text-slate-300">
        <span className="block text-xs uppercase tracking-[0.2em] text-slate-400">Description</span>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[120px] w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-white/30"
          placeholder="Tell customers about this product"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-300">
          <span className="block text-xs uppercase tracking-[0.2em] text-slate-400">Price</span>
          <input
            required
            type="number"
            min={0}
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-white/30"
            placeholder="0.00"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-300">
          <span className="block text-xs uppercase tracking-[0.2em] text-slate-400">Images (comma separated URLs)</span>
          <textarea
            value={images}
            onChange={(e) => setImages(e.target.value)}
            className="min-h-[60px] w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-white/30"
            placeholder="https://example.com/image.jpg, https://example.com/second.jpg"
          />
        </label>
      </div>

      {status && <p className="text-sm text-red-300">{status}</p>}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white"
        >
          {isSubmitting ? "Saving..." : mode === "create" ? "Create product" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/30"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
