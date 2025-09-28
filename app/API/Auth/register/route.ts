import { connectToDatabase } from "@/lib/db";
import User from "@/models/user";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json()

        if (!email || !password) {
            return NextResponse.json(
                { error: "email and password are requird" },
                { status: 400 }
            )
        }
        await connectToDatabase()

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return NextResponse.json(
                { error: "User  already registered " },
                { status: 400 }
            )

        }
        await User.create({
            email,
            password,

        });

        return NextResponse.json(
            { message: "user registered successfully" },
            { status: 400 }

        );

    } catch (error) {
        console.error("Registration error", error);
        return NextResponse.json(
            { error: "failed to register user" },
            { status: 400 }
        );
    }
}