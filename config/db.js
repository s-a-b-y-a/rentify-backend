const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("Database connected!")
    } catch (error) {
        console.error("Failed to connect to the Database",error.message)
        process.exit(1)
    }
}

module.exports = connectDB