const User = require('../models/user')
const { verifyToken } = require('@clerk/backend')

exports.protect = async (req,res,next) => {
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            let token = req.headers.authorization.split(" ")[1]
            const session = await verifyToken(token, {
                secretKey: process.env.CLERK_SECRET_KEY,
            })
            req.user = await User.findOne({ clerkId: session.sub })
            next()
        } catch (error) {
            return res.status(401).json({ message: 'Unauthorized! invalid token' })
        }
    } else{
        return res.status(401).json({ message: 'Unauthorized! token not provided' })
    }
}

exports.admin = async (req,res,next) => {
    if(req.user && req.user.role === 'admin'){
        next()
    } else{
        return res.status(403).json({ message: 'Access denied! only admins can do this action' })
    }
}