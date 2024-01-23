import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const options = {
  httpOnly: true,
  secure: true,
};

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    // finding user id

    const user = await User.findById(userId);
    // generating access and refresh token
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // storing refresh toekn in database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    // returning access and refresh tokens
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generation refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // taking user details from frontend
  const { email, fullName, password } = req.body;

  // validating fields should be not empty
  if ([fullName, email, password].some((field) => field?.trim() === "")) {
    const errors = ["All fields are required"];
    throw new ApiError(400, "All fields are required", errors);
  }

  // checking if user already exits : uemail

  const existedUser = await User.findOne({
    $or: [{ email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exits");
  }

  // cheking if a prifle image is provided or not
  const profileLocalPath = req.file ? req.file.path : null;

  if (
    req.files &&
    Array.isArray(req.files.profileImage) &&
    req.files.profileImage.length > 0
  ) {
    profileLocalPath = req.files.profileImage[0].path;
  }
  const profileImage = await uploadOnCloudinary(profileLocalPath);

  // creating user object- creating entry in database
  const user = await User.create({
    fullName,
    email,
    password,
    profileImage: profileImage?.url || "",
  });
  // removing  password and refresh token field from response

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //   cheking for user creation
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // returning response else returning error
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registerd Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // getting the data from req.body

  const { email, password } = req.body;
  // cheking email

  if (!email) {
    throw new ApiError(400, "Email required");
  }

  // finding the user in db

  const user = await User.findOne({
    $or: [{ email }],
  });

  // cheking user exit or not
  if (!user) {
    throw new ApiError(404, "User dose not exist");
  }
  // cheking password

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  // access and refresh token

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  // sending cookies
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged In Sucessfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findOneAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200), {}, "User logged Out");
});

export { registerUser, loginUser, logoutUser };
