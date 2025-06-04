import mongoose from "mongoose";

export async function db() {
    const Url = process.env.ATLAS_URL

    try {
        if(!Url){
            return console.log('mongo Url missing ')
        }
        const conn = await mongoose.connect(Url)
        if(conn){
            return console.log('mongodb has connected')
        }
        console.log("mongo db is't connected")
    } catch (e) {
        console.log(e)
    }
}