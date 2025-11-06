import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Idea from "@/models/Idea";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const ideas = await Idea.find(query)
      .populate("author", "name email image")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: ideas });
  } catch (error) {
    console.error("Error fetching ideas:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

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

    const { title, description, category, tags } = await request.json();

    const newIdea = await Idea.create({
      title,
      description,
      category,
      tags,
      author: user.id,
    });

    return NextResponse.json({ success: true, data: newIdea }, { status: 201 });
  } catch (error) {
    console.error("Error creating idea:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
