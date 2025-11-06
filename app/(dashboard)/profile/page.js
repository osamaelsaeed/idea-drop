import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import IdeaCard from "@/components/IdeaCard";
import EmptyState from "@/components/EmptyState";
import dbConnect from "@/lib/mongodb";
import Idea from "@/models/Idea";
import Favorite from "@/models/Favorite";
import User from "@/models/User";

async function getUserData(userId) {
  await dbConnect();

  const user = await User.findById(userId).lean();

  const userIdeas = await Idea.find({ author: userId })
    .populate("author", "name email image")
    .sort({ createdAt: -1 })
    .lean();

  const favorites = await Favorite.find({ user: userId })
    .populate({
      path: "idea",
      populate: { path: "author", select: "name email image" },
    })
    .lean();

  const favoriteIdeas = favorites.map((fav) => fav.idea).filter(Boolean);

  return {
    user: JSON.parse(JSON.stringify(user)),
    userIdeas: JSON.parse(JSON.stringify(userIdeas)),
    favoriteIdeas: JSON.parse(JSON.stringify(favoriteIdeas)),
  };
}

export default async function ProfilePage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const { user, userIdeas, favoriteIdeas } = await getUserData(session.user.id);

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <section className="text-center mb-10">
        {user.image ? (
          <img
            src={user.image}
            alt={user.name}
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto mb-4 flex items-center justify-center text-3xl">
            👤
          </div>
        )}
        <h1 className="text-2xl font-semibold">{user.name}</h1>
        <p className="text-gray-600">{user.email}</p>
        <p className="text-gray-500 text-sm">
          Member since {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          My Ideas ({userIdeas.length})
        </h2>
        {userIdeas.length === 0 ? (
          <EmptyState message="You haven't shared any ideas yet." />
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {userIdeas.map((idea) => (
              <IdeaCard key={idea._id} idea={idea} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">
          Liked Ideas ({favoriteIdeas.length})
        </h2>
        {favoriteIdeas.length === 0 ? (
          <EmptyState message="You haven't liked any ideas yet." />
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {favoriteIdeas.map((idea) => (
              <IdeaCard key={idea._id} idea={idea} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
