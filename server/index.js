import express from "express";
import cors from "cors";
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


app.listen(8800, () => {
    console.log("Server is running on port 8800")
});