import { Lightbulb, Heart } from "lucide-react";
import Link from "next/link";

export default function EmptyState({ type = "ideas" }) {
  const config = {
    ideas: {
      icon: Lightbulb,
      message: "You haven't created any ideas yet",
      action: "Create your first idea →",
      link: "/ideas/new",
    },
    favorites: {
      icon: Heart,
      message: "You haven't liked any ideas yet",
      action: "Explore ideas →",
      link: "/",
    },
  };

  const { icon: Icon, message, action, link } = config[type];

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center text-gray-600">
      <Icon className="w-12 h-12 text-purple-500 mb-4" />
      <p className="text-lg font-medium mb-2">{message}</p>
      <Link
        href={link}
        className="text-purple-600 font-semibold hover:text-purple-800 transition-colors"
      >
        {action}
      </Link>
    </div>
  );
}
