import mongoose from "mongoose";

const connectDatabase = async () => {
   try {
    await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        
        }).then(con => {
            console.log(`MongoDB Database connected with HOST: ${con.connection.host}`)
        })
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}
module.exports = connectDatabase;