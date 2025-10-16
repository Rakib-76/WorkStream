

import { NextResponse } from "next/server";
import dbConnect, { collectionNameObj } from "../../../lib/dbConnect";

// GET - Get tasks by projectId
export async function GET(request) {
    
    

    try {
        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('projectId'); 

        //  projectId not found then return
        if (!projectId) {
           
            return NextResponse.json({ 
                success: false, 
                message: "Missing projectId in query parameters" 
            }, { status: 400 });
        }
        
        const taskCollection = dbConnect(collectionNameObj.taskCollection);
        
        //  MongoDB querry
        const tasks = await taskCollection
            .find({ projectId: projectId }) 
            .sort({ createdAt: -1 })
            .toArray();

        // if success then return the data
        return NextResponse.json({ success: true, data: tasks });
        
    } catch (error) {
 
        console.error("Error fetching tasks:", error);

        return NextResponse.json(
            { success: false, message: "Failed to fetch tasks due to server error" },
            { status: 500 }
        );
    }
}

