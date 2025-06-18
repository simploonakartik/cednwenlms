const wareHouseLogin = require("../models/wareHousemodel");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "my_jwt-token";

const register = async (req, res) => {
  try {
    const user = new wareHouseLogin(req.body);
    const savedUser = await user.save();
    res.status(201).json({ message: "Registration successful", user: savedUser });
  } catch (error) {
    res.status(500).json({ message: "Error during registration", error });
  }
};

const login = async (req, res) => {
  try {
    const user = await wareHouseLogin.findOne(req.body);
    if (!user) {
      return res.status(404).json({ message: "Invalid username or password" });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error during login", error });
  }
};

module.exports = { login, register };
