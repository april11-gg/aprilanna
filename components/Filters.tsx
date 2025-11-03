"use client";
import { useState } from "react";

export type Filters = {
  genre?: string;
  minPrice?: number;
  maxPrice?: number;
  date?: string;
  location?: string;
  minCapacity?: number;
};

export default function Filters({ onChange }: { onChange: (f: Filters)=>void }) {
  const [f, setF] = useState<Filters>({});
  function set<K extends keyof Filters>(k: K, v: Filters[K]) {
    const nf = { ...f, [k]: v };
    setF(nf); onChange(nf);
  }
  return (
    <div className="card space-y-3">
      <h3 className="font-semibold">Match filters</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input className="input" placeholder="Genre" onChange={e=>set("genre", e.target.value)} />
        <input className="input" placeholder="Location" onChange={e=>set("location", e.target.value)} />
        <input className="input" type="date" onChange={e=>set("date", e.target.value)} />
        <input className="input" type="number" placeholder="Min price" onChange={e=>set("minPrice", e.target.value?Number(e.target.value):undefined)} />
        <input className="input" type="number" placeholder="Max price" onChange={e=>set("maxPrice", e.target.value?Number(e.target.value):undefined)} />
        <input className="input" type="number" placeholder="Min capacity" onChange={e=>set("minCapacity", e.target.value?Number(e.target.value):undefined)} />
      </div>
    </div>
  );
}
