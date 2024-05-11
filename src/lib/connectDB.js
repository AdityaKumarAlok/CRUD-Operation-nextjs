import mongoose from "mongoose";

export default async function connect(){
    try {
        mongoose.connect(process.env.MONGO_URL)
        const connection = mongoose.connection
        connection.on('connected',()=>{
            console.log("Mongo Db Connected");
        })
        connection.on('error',(err)=>{
            console.log("Mongo Db Connection error, Please Make sure db is up and running" + err);
            process.exit()
        })
    } catch (error) {
        console.log("Database connection failed");
        console.log(error);
    }
}