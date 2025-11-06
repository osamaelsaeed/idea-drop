import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import Idea from "@/models/Idea";
import { getCurrentUser } from "@/lib/auth";

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function GET(_request, { params }) {
  const { id } = await params;

  try {
    await dbConnect();

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid ID format" },
        { status: 400 }
      );
    }

    const idea = await Idea.findById(id).populate("author", "name email image");

    if (!idea) {
      return NextResponse.json(
        { success: false, error: "Idea not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: idea });
  } catch (error) {
    console.error("GET Idea Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;

  try {
    const user = await getCurrentUser();
    if (!user)
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );

    await dbConnect();

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid ID format" },
        { status: 400 }
      );
    }

    const idea = await Idea.findById(id);
    if (!idea)
      return NextResponse.json(
        { success: false, error: "Idea not found" },
        { status: 404 }
      );

    const authorId = idea.author._id
      ? idea.author._id.toString()
      : idea.author.toString();
    if (authorId !== user.id)
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );

    const updatedData = await request.json();
    const updatedIdea = await Idea.findByIdAndUpdate(id, updatedData, {
      new: true,
    }).populate("author", "name email image");

    return NextResponse.json({ success: true, data: updatedIdea });
  } catch (error) {
    console.error("PUT Idea Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(_request, { params }) {
  const { id } = await params;

  try {
    const user = await getCurrentUser();
    if (!user)
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );

    await dbConnect();

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid ID format" },
        { status: 400 }
      );
    }

    const idea = await Idea.findById(id);
    if (!idea)
      return NextResponse.json(
        { success: false, error: "Idea not found" },
        { status: 404 }
      );

    const authorId = idea.author._id
      ? idea.author._id.toString()
      : idea.author.toString();
    if (authorId !== user.id)
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );

    await idea.deleteOne();

    return NextResponse.json({
      success: true,
      message: "Idea deleted successfully",
    });
  } catch (error) {
    console.error("DELETE Idea Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
