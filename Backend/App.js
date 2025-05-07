import express from "express";
import dotenv from "dotenv";
import path from "path";

dotenv.config();
const __dirname = path.resolve();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "/Client/dist")));


// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is Running on port ${port}!!!`);
});
