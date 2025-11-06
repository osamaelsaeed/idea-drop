import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  idea: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Idea",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

FavoriteSchema.index({ user: 1, idea: 1 }, { unique: true });

export default mongoose.models.Favorite ||
  mongoose.model("Favorite", FavoriteSchema);
