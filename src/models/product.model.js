import mongoose, { Schema } from "mongoose";

const productSchema = Schema({
  name: {
    type: String,
    trim: true,
    index: true,
  },

  packSize: {
    type: String,
    trim: true,
    index: true,
  },
  mrp: {
    type: Number,
    trim: true,
    index: true,
  },
  productImage: {
    type: String,
  },
  status: {
    type: String,
    trim: true,
    index: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
});

export const Product = mongoose.model("Product", productSchema);
