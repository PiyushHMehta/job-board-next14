const { default: mongoose } = require("mongoose")

const connectToDB = async () => {
    const uri = process.env.MONGO_URI
    mongoose.connect(uri).then(console.log('Connected to database')).catch(e => console.log(e))
}

export default connectToDB