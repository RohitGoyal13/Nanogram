import {db} from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {

    if (!req.body.username || !req.body.password || !req.body.email || !req.body.name) {
        return res.status(400).json("Missing required fields");
    }
    // Check User if exists
    const q = "Select * from users where username = ?"

    db.query(q,[req.body.username], (err,data) => {
        if(err) return res.status(500).json(err)
        if(data.length) return res.status(409).json("User already exists!")
            // Create a new user
        
            // Hash Password
        
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(req.body.password, salt);
        
            const insertQuery = "INSERT INTO users(`username`,`email`,`password`,`name`) VALUES (?)";

            const values = [
                req.body.username,
                req.body.email,
                hashedPassword,
                req.body.name
            ]

            db.query(insertQuery,[values], (err,data) => {
               if(err) return res.status(500).json(err)
                return res.status(200).json("User has been created.")
            })
    })
}

export const login = (req, res) => {
      const q = "SELECT * FROM users WHERE username = ?"

      db.query(q,[req.body.username], (err,data) => {
        if(err) return res.status(500).json(err);
        if(data.length === 0) return res.status(404).json("User not found!");

        const checkPassword = bcrypt.compareSync(req.body.password, data[0].password);

        if(!checkPassword) return res.status(400).json("Wrong password or username!")

        const token = jwt.sign({id:data[0].id} , "secretkey");

        const {password, ...others} = data[0];

        res.cookie("accessToken", token, {
            httpOnly: true,
      })
      .status(200)
      .json(others);
      });
}
export const logout = (req, res) => {
        res.clearCookie("accessToken", {
            sameSite: "none",
            secure : true,
        }).status(200).json("User has been logged out successfully.") 
}