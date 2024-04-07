const { userModel } = require("../model/user.js");
const { tweetModel } = require("../model/tweet.js");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const axios = require("axios");
const { checkIfEmailExist, signToken } = require("../common/index.js");

const getAllUsers = async (req, res, next) => {
  try {
    const limit = parseFloat(req.query.limit, 10) || 10;
    const page = parseInt(req.query.page, 10) || 1;

    const customLabels = {
      totalDocs: "itemCount",
      docs: "results",
      limit: "perPage",
      page: "currentPage",
      nextPage: "next",
      prevPage: "prev",
      totalPages: "pageCount",
      pagingCounter: "slNo",
      meta: "paginator",
    };
    const options = {
      page: page,
      limit: limit,
      customLabels: customLabels,
    };
    const users = await userModel.paginate({}, options);
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

const googleLogin = asyncHandler(async (req, res) => {
  const code = req.query.code;
  //Exchange code for token and get user info (Email, name)
  const { data } = await axios.post("https://oauth2.googleapis.com/token", {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_SECRET,
    code: code,
    redirect_uri: process.env.GOOGLE_REDIRECT,
    grant_type: "authorization_code",
  });
  const { access_token, id_token } = data;
  const response = await axios.get(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: { Authorization: `Bearer ${access_token}` },
    }
  );
  const userprofile = response.data;
  // Check if email exist and create new user
  const ifExist = await checkIfEmailExist(userprofile.email);
  if (ifExist) {
    const existingUser = await userModel.findOne({ email: userprofile.email });
    const token = signToken(
      existingUser.id,
      existingUser.email,
      existingUser.usernames
    );
    return res.status(200).json({ token });
  }
  // Register
  const newUser = new userModel({
    username: userprofile.email,
    email: userprofile.email,
    profileType: "sso",
  });
  const result = await newUser.save();
  const token = signToken(result.id, result.email, result.usernames);

  return res.status(200).json({ token });
});

const handleGoogleLogin = asyncHandler(async (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT}&response_type=code&scope=profile email`;
  res.redirect(url);
});

const getTweetsByUserId = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const users = await userModel
    .findById(id)
    .populate("tweets")
    .select("tweets");
  res.send(users);
});

const getUserById = async (req, res) => {
  let user = await userModel.findById(req.params.id).exec();
  res.send(user);
};

const deleteById = async (req, res) => {
  const result = await userModel.deleteOne({ _id: req.params.id });
  res.send(result);
};

const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new userModel({
    username: username,
    email: email,
    password: hashedPassword,
    profileType: "normal",
  });
  const result = await newUser.save();
  result.password = "";
  res.send(result);
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({
    email: email,
  });
  //Compare password
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ error: "Password or email incorrect!" });
  }
  //Return JWT to client
  const token = signToken(user._id, user.email, user.username);
  return res.status(200).json({ token });
});

const updateById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const updatedUser = await userModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.send(updatedUser);
});

module.exports = {
  getAllUsers,
  getUserById,
  deleteById,
  createUser,
  updateById,
  getTweetsByUserId,
  loginUser,
  googleLogin,
  handleGoogleLogin,
};
