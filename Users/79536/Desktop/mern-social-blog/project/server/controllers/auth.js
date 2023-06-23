import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import User from "../models/User.js"

/* REGISTER USER */
export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body;

        const salt = await bcrypt.genSalt()
        const hashPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashPassword,
            picturePath,
            friends,
            location,
            occupation,
            viewProfile: Math.floor(Math.random() * 1000),
            impressions: Math.floor(Math.random() * 1000)
        })

        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
    } catch (e) {
        res.status(500).json({ error: e.message})
    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email })

        if (!user) {
            return res.status(400).json({ message: "User does not exist"})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid login or password"})
        }

        const token = jwt.sign({ id: user._id}, process.env.JVT_SECRET)

        res.status(200).json({ token, user })

    } catch (e) {
        
    }
}