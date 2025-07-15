 import {db} from "../connect.js";
 import jwt from "jsonwebtoken";    
 import moment from "moment";

 export const getPosts = (req, res) => {

    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not authenticated to get posts!");

    jwt.verify(token, "secretkey", (err,userInfo) => {
        if(err) return res.status(403).json("Token is not valid. Please log in!");
    
    const q = `SELECT p.*,u.id as userid, name, profilePic FROM posts as p
    JOIN users as u on (u.id = p.userid)
    LEFT JOIN relationships as r on (p.userid = r.followedUserId)
    WHERE r.followerUserId = ? OR p.userid = ?
    ORDER BY p.createdat DESC`;

    db.query(q,[userInfo.id,userInfo.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
    });
 };


 export const addPosts = (req, res) => {

    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not authenticated!");

    jwt.verify(token, "secretkey", (err,userInfo) => {
        if(err) return res.status(403).json("Token is not valid!");
    
    const q = "INSERT INTO posts (`desc`, `img`, `createdat`, `userid`) VALUES (?)";

    const values = [
        req.body.desc,
        req.body.img,
        moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        userInfo.id
    ]

    db.query(q,[values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Post has been created.");
    });
    });
 };