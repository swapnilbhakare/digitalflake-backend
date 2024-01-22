import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { Category } from "../models/category.model.js";

const addCategory = asyncHandler(async (req, res) => {
  // Taking fields from user
  const { name, description, status } = req.body;

  // Checking fields are filled or not
  if (
    [name, description, status].some(
      (field) => field == null || field.trim() === ""
    )
  ) {
    const errors = ["All fields are required"];
    throw new ApiError(400, "All fields are required", errors);
  }

  // Storing category object - creating entry in the database
  const category = await Category.create({
    name,
    description,
    status,
  });

  // Checking for created category
  if (!category) {
    throw new ApiError(500, "Something went wrong while storing category");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, category, "Category added successfully"));
});

const updateCategory = asyncHandler(async (req, res) => {
  const { _id, name, description, status } = req.body;

  try {
    // Use findByIdAndUpdate to find and update the category by ID

    const updatedCategory = await Category.findByIdAndUpdate(
      _id,
      {
        name,
        description,
        status,
      },
      { new: true, runValidators: true }
    );

    // Checking  if the category was not found
    if (!updatedCategory) {
      throw new ApiError(404, "Category not found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedCategory, "Category updated successfully")
      );
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw new ApiError(500, "Internal Server Error", [error.message]);
    }
  }
});
const deleteCategory = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const deletedCategory = await Category.findOneAndDelete({
    _id,
  });

  if (!deletedCategory) {
    throw new ApiError(404, "Category not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, deletedCategory, "Category deleted successfully")
    );
});

const fetchCategory = asyncHandler(async (req, res) => {
  const fetchedCategories = await Category.find();
  if (!fetchedCategories) {
    throw new ApiError(404, "categoreis  not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, fetchedCategories, "All  categories  successfully")
    );
});

export { addCategory, updateCategory, deleteCategory, fetchCategory };
