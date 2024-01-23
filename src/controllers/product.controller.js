import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Product } from "../models/product.model.js";
import mongoose from "mongoose";
import { Category } from "../models/category.model.js";
const addProduct = asyncHandler(async (req, res) => {
  // Taking fields from user
  const { name, packSize, mrp, status, category } = req.body;

  // Checking fields are filled or not
  if (
    [name, packSize, mrp, status, category].some(
      (field) => field == null || field.trim() === ""
    )
  ) {
    const errors = ["All fields are required"];
    throw new ApiError(400, "All fields are required", errors);
  }

  // cheking if a product image is provided or not
  let productLocalPath = req.file ? req.file.path : null;

  if (
    req.files &&
    Array.isArray(req.files.productImage) &&
    req.files.productImage.length > 0
  ) {
    productLocalPath = req.files.productImage.path;
  }

  const cleanedCategory = category.replace(/"/g, "");
  // Fetching the category from the database based on categoryId

  const findedCategory = await Category.findById(cleanedCategory);

  if (!findedCategory) {
    throw new ApiError(404, "Category not found");
  }

  // Uploading the product image to Cloudinary
  const productImage = await uploadOnCloudinary(productLocalPath);

  // Storing product object - creating entry in the database
  const product = await Product.create({
    name,
    packSize,
    mrp,
    productImage: productImage?.url || "",
    status,
    category: findedCategory._id,
  });

  // Checking for created product

  if (!product) {
    throw new ApiError(500, "Something went wrong while storing product");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, product, "Product added successfully"));
});

const updateProduct = asyncHandler(async (req, res) => {
  const { _id, ...updateFields } = req.body;

  const categoryObject =
    typeof updateFields.category === "object"
      ? updateFields.category
      : JSON.parse(updateFields.category);

  try {
    // Checking if product exists
    const existingProduct = await Product.findById(_id);
    if (!existingProduct) {
      throw new ApiError(404, "Product not found");
    }

    // Checking if a new product image is provided
    let updatedProductImage = existingProduct.productImage;
    let newProductImage = req.file ? req.file.path : null;

    if (
      req.files &&
      Array.isArray(req.files.productImage) &&
      req.files.productImage.length > 0
    ) {
      newProductImage = req.files.productImage[0].path;
    }

    // Uploading the new product image to Cloudinary
    if (newProductImage) {
      updatedProductImage = await uploadOnCloudinary(newProductImage);
    }

    // Use findByIdAndUpdate to find and update the product by ID
    const updatedProduct = await Product.findByIdAndUpdate(
      _id,
      {
        ...updateFields,
        category: categoryObject._id,

        productImage: updatedProductImage?.url || existingProduct.productImage,
      },
      { new: true, runValidators: true }
    );

    // Checking if the product was not found
    if (!updatedProduct) {
      throw new ApiError(404, "Product not found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedProduct, "Product updated successfully")
      );
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw new ApiError(500, "Internal Server Error", [error.message]);
    }
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const deletedProduct = await Product.findOneAndDelete({
    _id,
  });

  if (!deletedProduct) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedProduct, "Product deleted successfully"));
});

const fetchProducts = asyncHandler(async (req, res) => {
  const fetchedProducts = await Product.find().populate({
    path: "category",
    select: "name",
  });
  if (!fetchedProducts) {
    throw new ApiError(404, "Products not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, fetchedProducts, "All products successfully"));
});

export { addProduct, updateProduct, deleteProduct, fetchProducts };
