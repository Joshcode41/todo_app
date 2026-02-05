import connectDB from "@/lib/database";
import Todo from "@/models/Todo.model";
import { NextResponse } from "next/server";

export async function GET(request,{ params }) {
    const {id} = await params
    console.log(id)
    await connectDB()
    const todo = await Todo.findById(id)
    console.log(todo)
    return NextResponse.json({
        todo: todo
    })
}