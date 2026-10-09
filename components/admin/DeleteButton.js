"use client";

export default function DeleteButton() {
  return (
    <button
      type="submit"
      onClick={(event) => {
        if (!window.confirm("Delete this article permanently? This cannot be undone.")) event.preventDefault();
      }}
      className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 transition hover:bg-red-50"
    >
      Delete
    </button>
  );
}
