import IdeaCard from "@/components/IdeaCard";
import dbConnect from "@/lib/mongodb";
import Idea from "@/models/Idea";

async function getIdeas() {
  await dbConnect();
  const ideas = await Idea.find({})
    .populate("author", "name email image")
    .sort({ createdAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(ideas));
}

export default async function HomePage() {
  const ideas = await getIdeas();

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Explore Ideas</h1>
        <p className="text-gray-600 mt-2">
          Discover amazing project ideas from the community
        </p>
      </div>
      {ideas.length === 0 ? (
        <p className="text-center text-gray-500">
          No ideas yet. Be the first to share one!
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map((idea) => (
            <IdeaCard key={idea._id} idea={idea} />
          ))}
        </div>
      )}
    </section>
  );
}
