const express = require("express");
const cors = require("cors");
const conn = require("./db/connectionDb");
// const app = express();
const router = require("./routes/userRouter");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const { app, server } = require("./socket/index");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});
app.use("/api", router);

const port = process.env.PORT || 8080;

conn().then(() => {
  server.listen(port, () => console.log(`Server running on port ${port}`));
});
