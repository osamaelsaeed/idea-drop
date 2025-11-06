import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Idea from "@/models/Idea";
import User from "@/models/User";

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const user = await User.findById(params.id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const ideas = await Idea.find({ author: params.id })
      .populate("author", "name email image")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: ideas });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
