import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";
import Video, { IVideo } from "@/models/video";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function Get() {
    try {
        await connectToDatabase()
        const videos = await Video.find({}).sort({ createdAt: -1 }).
            lean()

        if (!videos || videos.length === 0) {
            return NextResponse.json([], { status: 200 })

        }
        return NextResponse.json(
            { error: "Failed to fetch videos" },
            { status: 500 }
        );
    } catch (eroor) {

    }

}


export async function POST() {

    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
        await connectToDatabase()

        const body: IVideo = await request.json()
        if (
            !body.title ||
            !body.description ||
            !body.videoUrl ||
            !body.thumbnailUrl
        ) {
            return NextResponse.json(
                { error: "missing required fields" },
                { status: 400 }
            );
        }
        const videoData = {
            ...body,
            controls: body?.controls ?? true,
            transformation: {
                height: 1920,
                width: 1080,
                quality: body.transformation?.quality ?? 100
            },
        };


        const newVideo = await Video.create(videoData)
        return NextResponse.json(newVideo)

    } catch (error) {
        return NextResponse.json({ error: " faild to create Video" }, { status: 401 });
    }
}
