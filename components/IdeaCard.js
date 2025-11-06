"use client";

import Link from "next/link";
import { Heart, Edit, Trash2, MoreVertical } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import FavoriteButton from "./FavoriteButton";

export default function IdeaCard({ idea, showFavorite = true }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isOwner = session?.user?.id === idea.author?._id?.toString();
  console.log(
    isOwner,
    session?.user?.id,
    idea.author?._id?.toString(),
    idea._id
  );

  const handleDelete = async () => {
    console.log("Deleting idea with ID:", idea._id);
    if (!confirm("Are you sure you want to delete this idea?")) return;

    setIsDeleting(true);
    try {
      console.log(idea.author);

      const res = await fetch(`/api/ideas/${idea._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        router.refresh();
      } else {
        alert("Failed to delete idea");
      }
    } catch (error) {
      console.error("Error deleting idea:", error);
      alert("Error deleting idea");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition-shadow flex flex-col justify-between relative">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
          {idea.category}
        </span>

        <div className="flex items-center gap-2">
          {showFavorite && <FavoriteButton ideaId={idea._id} />}

          {isOwner && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="cursor-pointer p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />

                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                    <Link
                      href={`/ideas/edit/${idea._id}`}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowMenu(false)}
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Link>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        handleDelete();
                      }}
                      disabled={isDeleting}
                      className="cursor-pointer flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <Link href={`/ideas/${idea._id}`}>
        <h3 className="text-lg font-semibold text-gray-900 hover:text-purple-700 transition-colors">
          {idea.title}
        </h3>
      </Link>
      <p className="text-gray-600 text-sm mt-2 line-clamp-3">
        {idea.description}
      </p>

      {idea.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {idea.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 text-sm text-gray-500">
        <span>by {idea.author?.name || "Unknown"}</span>
      </div>
    </div>
  );
}
