import prisma from "@/app/utils/connect";
import { auth } from "@clerk/nextjs";
import { error } from "console";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;

    const post = await prisma.task.findUnique({
      where: {
        id,
      },
    });

    if (!post) {
      return NextResponse.json(
        { message: "Post not found", error },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (err) {
    return NextResponse.json({ message: "GET Error", err }, { status: 500 });
  }
};

export const PATCH = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const body = await req.json();

    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized", status: 401 });
    }

    const { title, description, date, completed, important } = body;

    const { id } = params;

    const updateTask = await prisma.task.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        date,
        isCompleted: completed,
        isImportant: important,
        userId,
      },
    });

    if (!updateTask) {
      return NextResponse.json(
        { message: "Post not found", error },
        { status: 404 }
      );
    }

    return NextResponse.json(updateTask);
  } catch (err) {
    return NextResponse.json({ message: "update Error", err }, { status: 500 });
  }
};
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    const { id } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const task = await prisma.task.delete({
      where: {
        id,
      },
    });
    console.log("Task deleted", task);
    return NextResponse.json(task);
  } catch (error) {
    console.log("ERROR DELETING TASK: ", error);
    return NextResponse.json({ error: "Error deleting task", status: 500 });
  }
}
