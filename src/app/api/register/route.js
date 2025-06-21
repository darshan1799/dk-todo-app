import { userModel } from "@/models/userModel";
import connectToDb from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, password, name } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email or password is missing" },
        { status: 400 }
      );
    }

    await connectToDb();
    const isExist = await userModel.findOne({ email: email });

    if (isExist) {
      return NextResponse.json(
        { error: "Email already exists!" },
        { status: 400 }
      );
    }

    await userModel.create({
      email: email,
      password: password,
      name: name,
    });

    return NextResponse.json(
      { message: "user registered successfully!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "failed to register" }, { status: 500 });
  }
}
