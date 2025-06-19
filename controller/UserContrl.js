const USER = require("../models/UserModel");

const PostuserDataControl = async (req, res) => {
  try {
    const {
      userName,
      employeeId,
      emailId,
      password,
      jobrole,
      mobileNo,
      location,
    } = req.body;
    const user = new USER({
      userName,
      employeeId,
      emailId,
      password,
      jobrole,
      mobileNo,
      location,
    });
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.log("Error in PostuserDataControl:", error);
  }
};
const GetuserDataControl = async (req, res) => {
  try {
    const user = await USER.find();
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in GetuserDataControl:", error);
  }
};
const PutuserDataControl = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await USER.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in PutuserDataControl:", error);
  }
};
const DeleteuserDataControl = async (req, res) => {
  try {
    const { id } = req.params;
    await USER.findByIdAndDelete(id);
    res.status(200).send("Product deleted");
  } catch (error) {
    console.log("Error in DeleteuserDataControl:", error);
  }
};

module.exports = {
  PostuserDataControl,
  GetuserDataControl,
  PutuserDataControl,
  DeleteuserDataControl,
};
