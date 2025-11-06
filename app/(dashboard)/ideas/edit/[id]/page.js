import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Idea from "@/models/Idea";
import EditIdeaForm from "@/components/EditIdeaForm";

async function getIdea(id, userId) {
  await dbConnect();

  const idea = await Idea.findById(id)
    .populate("author", "name email image")
    .lean();

  if (!idea || !idea.author) return null;

  if (idea.author._id.toString() !== userId) {
    return null;
  }

  return JSON.parse(JSON.stringify(idea));
}

export default async function EditIdeaPage({ params }) {
  const { id } = await params;

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const idea = await getIdea(id, user.id);

  if (!idea) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Edit Your Idea
        </h2>
        <p className="text-gray-600">Update your project idea details</p>
      </div>

      <EditIdeaForm idea={idea} />
    </div>
  );
}
