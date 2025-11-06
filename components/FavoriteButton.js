"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";

export default function FavoriteButton({ ideaId, initialFavorited = false }) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/users/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ideaId }),
      });

      const data = await res.json();

      if (data.success) {
        setFavorited(data.favorited);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className="p-2 rounded-full transition-colors hover:bg-gray-100 disabled:opacity-50"
      title={favorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={`w-5 h-5 transition-colors ${
          favorited
            ? "fill-pink-500 text-pink-500"
            : "text-gray-400 hover:text-pink-500"
        }`}
      />
    </button>
  );
}
