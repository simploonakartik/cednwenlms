const mongoose  = require("mongoose")

const connectDB=async()=>{
    try {
        await mongoose.connect("mongodb+srv://kartikp:ZXcB4IpQQQvxyatm@creadcluster.1uap9.mongodb.net/cread")
        console.log("databasee connection successful")
    } catch (error) {
        console.log(error)
    }
}
module.exports = connectDB;