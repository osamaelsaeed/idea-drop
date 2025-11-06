import IdeaForm from "@/components/IdeaForm";

export default function NewIdeaPage() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Share Your Idea</h1>
        <p className="text-gray-600 mt-2">
          Let the community know about your amazing project idea
        </p>
      </div>
      <IdeaForm />
    </section>
  );
}
