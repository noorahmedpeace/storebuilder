"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export function DomainSearch() {
  const [query, setQuery] = useState("");

  function check() {
    const q = query.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    if (!q) return;
    const url = `https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(q)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="flex gap-2">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && check()}
        placeholder="myshop.com"
        className="h-10 flex-1 rounded-lg border border-zinc-300 bg-white px-3 outline-none focus:border-zinc-900"
      />
      <button
        type="button"
        onClick={check}
        className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#143c3a] px-4 text-sm font-semibold text-white transition hover:bg-[#0f2c2a]"
      >
        <Search size={15} /> Check on Namecheap
      </button>
    </div>
  );
}
