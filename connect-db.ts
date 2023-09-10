import * as mongoose from 'mongoose';
require('dotenv').config();
import colors from 'colors';

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL ?? "");
        console.log("[+] Connect successfully");
    } catch (err) {
        console.log(colors.red("[!] Cannot connect to database"));
    }
}
