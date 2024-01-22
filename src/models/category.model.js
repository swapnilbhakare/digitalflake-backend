import mongoose, { Schema } from "mongoose";

const categorySchema = Schema({
  name: {
    type: String,
    trim: true,
    index: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  status: {
    type: String,
    trim: true,
    required: true,
  },
});

export const Category = mongoose.model("Category", categorySchema);
