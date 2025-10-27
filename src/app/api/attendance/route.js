import { NextResponse } from "next/server";
import dbConnect, { collectionNameObj } from "../../../lib/dbConnect";
import { message } from "antd";

// Get attendence by projectId

export async function GET (req) {
    try{
        const{ searchParams } = new URL(req.url);
        const projectId = searchParams.get("projectId");
        if(!projectId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Missing projectId in query parameters",
                },
                {status:400}
            )
        }

        const taskCollection = dbConnect(collectionNameObj.taskCollection);

        // MongDB query : only project based tasks
        const tasks = await taskCollection
        .find({projectId})
        .project({
            title:1,
            startDate: 1,
            creatorEmail: 1,
            attendance:1,
        })
        .sort({createdAt : -1})
        .toArray();

        // Just return success + data 

        return NextResponse.json({
            success:true,
            data:tasks,
        });

    }catch( error ){
        console.error("Error fethcing attendance", error);
        return NextResponse.json(
            {
                success:false,
                message:"Failed to fetch attendance due to server error"
            },
            { status:500 }
        );
    }
}