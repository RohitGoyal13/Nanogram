import express from "express";
import cors from "cors";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/post.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import cookieParser from "cookie-parser";

import multer from "multer";

const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", true);
    next();
});
app.use(express.json());
app.use(cookieParser());
app.use(cors(
    {
        origin: "http://localhost:3000",
        credentials: true,
    }
))

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../client/social/public/upload')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    }
  })
  const upload = multer({ storage: storage })

app.post("/server/upload", upload.single("file"),(req, res) =>{
    const file= req.file;
  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
    res.status(200).json(file.filename);
})

app.use("/server/auth", authRoutes);
app.use("/server/users", userRoutes);
app.use("/server/posts", postRoutes);
app.use("/server/comments", commentRoutes);
app.use("/server/likes", likeRoutes);



app.listen(8800, () => {
    console.log("Server is running on port 8800")
});