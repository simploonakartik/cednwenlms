const manageroleData = require("../models/manageroleDataModel")

const manageroleDataController1 = async (req, res) => {
    try {
        const managerole = new manageroleData(req.body);
        const savedmanagerole = await managerole.save();
        res.status(201).json(savedmanagerole);
    } catch (error) {
        console.error("Error creating Job Role:", error);
        res.status(500).send("Server error");
    }
};
 
const manageroleDataController2 = async (req, res) => {
    try {
        const manageroles = await manageroleData.find();
        res.status(200).json(manageroles);
    } catch (error) {
        console.error("Error fetching Job Roles:", error);
        res.status(500).send("Server error");
    }
};

const manageroleDataController3 = async (req, res) => {
    try {
        const { id } = req.params;
        const updatejobrole = await manageroleData.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.status(200).json(updatejobrole);
    } catch (error) {
        console.error("Error updating Job Role:", error);
        res.status(500).send("Server error");
    }
};

const manageroleDataController4 = async (req, res) => {
    try {
        const { id } = req.params;
        await manageroleData.findByIdAndDelete(id);
        res.status(200).send("Job Role deleted");
    } catch (error) {
        console.error("Error deleting Job ROle:", error);
        res.status(500).send("Server error");
    }
};

module.exports = {
    manageroleDataController1,
    manageroleDataController2,
    manageroleDataController3,
    manageroleDataController4
};
