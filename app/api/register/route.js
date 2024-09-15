import { connectToDb } from "@/lib/connectToDb";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/user";

export const POST = async (req, res) => {
  try {
    //getting the loaded body values
    const { email, password, username } = await req.json();
    //connecting to db
    await connectToDb();
    //checking if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }
    //hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //creating a new user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      username,
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        data: {
          newUser,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
};
