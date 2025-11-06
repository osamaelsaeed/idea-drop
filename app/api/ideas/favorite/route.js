import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Favorite from "@/models/Favorite";
import Idea from "@/models/Idea";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const { ideaId } = await request.json();
    if (!ideaId) {
      return NextResponse.json(
        { success: false, error: "Idea ID is required" },
        { status: 400 }
      );
    }

    const existingFavorite = await Favorite.findOne({
      user: user.id,
      idea: ideaId,
    });

    if (existingFavorite) {
      await Favorite.findByIdAndDelete(existingFavorite._id);
      await Idea.findByIdAndUpdate(ideaId, { $inc: { likes: -1 } });

      return NextResponse.json({ success: true, favorited: false });
    } else {
      await Favorite.create({
        user: user.id,
        idea: ideaId,
      });
      await Idea.findByIdAndUpdate(ideaId, { $inc: { likes: 1 } });

      return NextResponse.json({ success: true, favorited: true });
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
