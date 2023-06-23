import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]

        if (!token) {
            return res.status(403).send("Access denied")
        }

        const verified = jwt.verify(token, process.env.JVT_SECRET)

        req.user = verified
        next()
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
}