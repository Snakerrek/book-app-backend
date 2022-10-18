const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    res.status(200).json({
      message: "Account succesfully created!",
      registerSuccessful: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

const isPasswordCorrect = async (id, password) => {
  const dbEntry = await User.findById(id);
  if (!dbEntry) {
    return false;
  } else {
    const isCorrect = await bcrypt.compare(password, dbEntry.password);
    return isCorrect;
  }
};

const loginUser = async (req, res) => {
  const userLoggingIn = req.body;
  const dbEntry = await User.findOne({ username: userLoggingIn.username });
  if (!dbEntry) {
    return res.status(400).json({
      message: "Invalid Username or Password",
    });
  }
  const isPasswordCorrect = await bcrypt.compare(
    userLoggingIn.password,
    dbEntry.password
  );

  if (!isPasswordCorrect) {
    return res.status(400).json({
      message: "Invalid Username or Password",
    });
  }
  const payload = {
    id: dbEntry._id,
    userName: dbEntry.username,
  };
  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: 86400 },
    (err, token) => {
      if (err) return res.status(500).json({ message: err });
      return res.status(200).json({
        message: "Success",
        token: "Bearer " + token,
      });
    }
  );
};

const verifyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"]?.split(" ")[1];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err)
        return res.status(500).json({
          isLoggedIn: false,
          message: "Failed To Authenticate",
        });
      req.user = {};
      req.user.id = decoded.id;
      req.user.username = decoded.username;
      next();
    });
  } else {
    res
      .status(400)
      .json({ message: "Incorrect Token Given", isLoggedIn: false });
  }
};

exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.verifyJWT = verifyJWT;
exports.isPasswordCorrect = isPasswordCorrect;
