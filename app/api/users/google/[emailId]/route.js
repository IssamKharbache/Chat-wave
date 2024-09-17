import { connectToDb } from "@/lib/connectToDb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export const POST = async (req, { params: { emailId } }) => {
  try {
    await connectToDb();
    const { username, email } = await req.json();
    const userExist = await User.findOne({ email: emailId });

    if (!userExist) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }
    const updateUser = await User.findOneAndUpdate(
      { email: emailId },
      {
        username,
        email,
      }
    );
    return NextResponse.json(
      {
        message: "success",
        data: updateUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "error" }, { status: 400 });
  }
};

export const GET = async (req, { params: { emailId } }) => {
  try {
    await connectToDb();
    const user = await User.findOne({ email: emailId });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }
    return NextResponse.json(
      {
        message: "success",
        data: user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "error" }, { status: 400 });
  }
};
