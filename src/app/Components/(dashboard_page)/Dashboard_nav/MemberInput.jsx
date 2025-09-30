"use client";
import { useState } from "react";
import { X } from "lucide-react";
export function MemberInput() {
  const fakeUsers = [
    { email: "alice@example.com" },
    { email: "bob@example.com" },
    { email: "charlie@example.com" },
    { email: "david@example.com" },
    { email: "eva@example.com" },
  ];

  const [query, setQuery] = useState("");
  const [members, setMembers] = useState([]);

  const filtered = fakeUsers.filter((u) =>
    u.email.toLowerCase().includes(query.toLowerCase())
  );

  const addMember = (email) => {
    if (!members.includes(email)) {
      setMembers([...members, email]);
      setQuery("");
    }
  };

  const removeMember = (email) => {
    setMembers(members.filter((m) => m !== email));
  };

  return (
    <div className="relative">
      {/* Selected Members */}
      <div className="flex flex-wrap gap-2 mb-2">
        {members.map((m) => (
          <span
            key={m}
            className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm animate-fadeIn"
          >
            {m}
            <button
              onClick={() => removeMember(m)}
              className="ml-1 text-red-500 hover:text-red-700"
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>

      {/* Search Box */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by email..."
        className="w-full rounded-xl border px-3 py-2 text-sm dark:bg-gray-800 focus:ring-2 focus:ring-primary transition"
      />

      {/* Dropdown */}
      {query && (
        <ul className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg border max-h-40 overflow-y-auto animate-fadeIn">
          {filtered.length > 0 ? (
            filtered.map((u) => (
              <li
                key={u.email}
                onClick={() => addMember(u.email)}
                className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {u.email}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-sm text-gray-500">No results</li>
          )}
        </ul>
      )}
    </div>
  );
}
