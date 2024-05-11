import { NextResponse } from "next/server";
import connect from "@/lib/connectDB";
import User from "@/models/userModel";
import bcrypt from 'bcrypt'; // Import bcrypt for password hashing
connect();

export async function GET(req) {
    const data = await User.find()
    return NextResponse.json({ "data": data })
}

export async function POST(req) {
    try {
        const data = await req.json();
        const { name, email,username, password } = data;
        // Validate input data
        if (!name || !email || !username|| !password) {
            return NextResponse.json({ 'error': "Name, email, and password are required fields." }, { status: 400 });
        }
        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create a new user instance and save it to the database
        const user = new User({ name, email,username, password: hashedPassword });
        const savedUser = await user.save();
        return NextResponse.json({ 'message': "User Registered Successfully", 'user': savedUser });
    } catch (error) {
        console.error("Error during user registration:", error);
        return NextResponse.json({ 'error': "Something went wrong during user registration." }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        // Parse the request body
        const requestBody = await req.json();
        // Destructure the username and password fields directly
        const { username, password, ...updateData } = requestBody;
        // Validate input data (optional)
        if (!username || !password) {
            return NextResponse.json({ 'error': "Username and password are required." }, { status: 400 });
        }

        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a copy of the remaining fields
        const updatedUser = { ...updateData, username, password: hashedPassword };
        // Update user document based on username
        const result = await User.findOneAndUpdate(
            { username },
            updatedUser,
            { new: true }
        );
        if (!result) {
            return NextResponse.json({ 'error': "User not found." }, { status: 404 });
        }
        return NextResponse.json({ 'message': "User updated successfully", 'user': result });
    } catch (error) {
        console.error("Error during user update:", error);
        return NextResponse.json({ 'error': "Something went wrong during user update." }, { status: 500 });
    }
}

export async function DELETE(req){
    try {
        const data = await req.json()
        const {username} = data

        if (!username) {
            return NextResponse.json({"Message":"Please Provide Username"})
        }
        const deletedData = await User.findOneAndDelete({username})

        if(!deletedData){
            return NextResponse.json({"Message":"Username is invalid"})
        }
        return NextResponse.json({ "Message": "User deleted successfully" });

    } catch (error) {
        console.error("Error during user deletion:", error);
        return NextResponse.json({"Message":"Something Went wrong"},{status:500})
    }

}

export async function PATCH(req) {
    try {
        // Parse the request body
        const requestBody = await req.json();
        // Destructure the username and password fields directly
        const { username, password, ...updateData } = requestBody;
        // Validate input data (optional)
        if (!username || !password) {
            return NextResponse.json({ 'error': "Username and password are required." }, { status: 400 });
        }

        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a copy of the remaining fields
        const updatedUser = { ...updateData, username, password: hashedPassword };
        // Update user document based on username
        const result = await User.findOneAndUpdate(
            { username },
            updatedUser,
            { new: true }
        );
        if (!result) {
            return NextResponse.json({ 'error': "User not found." }, { status: 404 });
        }
        return NextResponse.json({ 'message': "User updated successfully", 'user': result });
    } catch (error) {
        console.error("Error during user update:", error);
        return NextResponse.json({ 'error': "Something went wrong during user update." }, { status: 500 });
    }
}