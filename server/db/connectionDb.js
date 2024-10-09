const mongoose = require("mongoose");
const { dbname } = require("../contants");

const conn = async () => {
  try {
    const connectdb = await mongoose.connect(
      `${process.env.MONGO_URL}/${dbname}`
    );
    console.log(`Database connected: ${connectdb.connection.host}`);
  } catch (e) {
    console.log(e);
  }
};
module.exports = conn;
