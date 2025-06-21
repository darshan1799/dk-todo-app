import { taskModel } from "@/models/taskModel";
import { authOptions } from "@/utils/AuthOptions";
import connectToDb from "@/utils/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized!" }, { status: 404 });
  }
  const data = await params;
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
    const res = await taskModel.deleteOne({ _id: id });
    if (res.deletedCount > 0) {
      return NextResponse.json(
        { message: "task Deleted Successfully !" },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ error: "please reload and try again!" });
    }
  } catch (err) {
    return NextResponse.json(
      { error: "Something Wents Wrong!" },
      { status: 401 }
    );
  }
}
