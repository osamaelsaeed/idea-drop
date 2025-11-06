import { notFound } from "next/navigation";
import { Heart, User, Calendar } from "lucide-react";
import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import Idea from "@/models/Idea";
import FavoriteButton from "@/components/FavoriteButton";

async function getIdea(id) {
  await dbConnect();
  const idea = await Idea.findById(id)
    .populate("author", "name email image")
    .lean();

  if (!idea) return null;
  return JSON.parse(JSON.stringify(idea));
}

export default async function IdeaDetailPage({ params }) {
  const { id } = await params;
  console.log(id + " osama");

  const idea = await getIdea(id);

  if (!idea) {
    notFound();
  }

  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <Link
        href="/"
        className="text-purple-600 hover:text-purple-800 font-medium mb-6 inline-block"
      >
        ← Back to all ideas
      </Link>

      <div className="bg-white rounded-2xl shadow-md p-8">
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-full">
            {idea.category}
          </span>
          <FavoriteButton ideaId={idea._id} initialFavorited={false} />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">{idea.title}</h1>
        <p className="text-gray-700 mb-6 leading-relaxed">{idea.description}</p>

        {idea.tags && idea.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {idea.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-gray-500 text-sm border-t pt-4">
          <div className="flex items-center gap-3">
            <User size={16} />
            <span>{idea.author?.name || "Unknown"}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>{new Date(idea.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center gap-2">
            <Heart size={16} className="text-red-500" />
            <span>{idea.likes || 0}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
