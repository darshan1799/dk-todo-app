import { taskModel } from "@/models/taskModel";
import { authOptions } from "@/utils/AuthOptions";
import connectToDb from "@/utils/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized!" }, { status: 404 });
  }
  try {
    const plannedDate = new Date(request.nextUrl.searchParams.get("date"))
      .toISOString()
      .split("T")[0];
    await connectToDb();

    const tasks = await taskModel.find({
      userEmail: session.user.email,
      plannedDate,
    });
    return NextResponse.json(tasks, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: "Something went Wrong!" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized!" }, { status: 404 });
  }
  const data = await request.json();
  if (!data.task || !data.plannedDate || !data.userEmail) {
    return NextResponse.json({ error: "Missing Fields!" }, { status: 401 });
  }
  try {
    await connectToDb();
    const res = await taskModel.create({
      ...data,
    });
    if (res) {
      return NextResponse.json(
        { error: "Task Added Successfully!" },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { error: "something wents wrong try again!" },
        { status: 201 }
      );
    }
  } catch (e) {
    return NextResponse.json(
      { error: "Internal Server Error!", e_message: e.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized!" }, { status: 404 });
  }
  const data = await request.json();
  if (!data.id) {
    return NextResponse.json({ error: "Missing Fields!" }, { status: 401 });
  }

  try {
    await connectToDb();

    const id = new mongoose.Types.ObjectId(data.id);
    const task = await taskModel.findById(id);
    if (!task) {
      return NextResponse.json({ error: "please reload and try again!" });
    }
    const res = await taskModel.updateOne(
      { _id: id },
      {
        $set: {
          completed: data.completed,
        },
      }
    );

    if (res.modifiedCount > 0) {
      return NextResponse.json(
        { message: "task Updated Successfully!" },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ error: "please reload and try again!" });
    }
  } catch (err) {
    return NextResponse.json(
      { error: "Something Wents Wrong!", err: err.message },
      { status: 401 }
    );
  }
}
