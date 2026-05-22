import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
  title: String,
  body: String,
  goal: String,
  audience: [String],

  image: {
    type: String, // URL or path to uploaded image
    default: null
  },

  poll: {
    question: String,
    options: [String],
    votes: [{
      optionIndex: Number,
      count: { type: Number, default: 0 }
    }]
  },

  variant: {
    type: String, // A or B
  },

  metrics: {
    saves: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    applyClicks: { type: Number, default: 0 }
  },

  isWinner: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

export default mongoose.model("ContentPost", contentSchema);
