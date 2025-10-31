import { NextResponse } from "next/server";
import dbConnect,{collectionNameObj} from "../../../../lib/dbConnect";
import { ObjectId } from "mongodb";

// update attendance for a specific task and date
export async function PUT (req) {
    try{
        const {taskId, date, status } = await req.json();
        if(!taskId || !date || !status) {
            return NextResponse.json(
                { success: false, message:"taskId, data & status required"},
                {status:  400 }
            );
        }
        const taskCollection = await dbConnect(collectionNameObj.taskCollection);

        // Find task first
        const task = await taskCollection.findOne({_id:new ObjectId(taskId)});
        if(!task) {
            return NextResponse.json(
                { success: false, message:'Task not found'},
                {status:404}
            );
        }

        // Update attendane array
        let newAttendance = task.attendance || [];
        const index = newAttendance.findIndex((a) => a.date === date);

        if(index > -1) {
            // update existing date
            newAttendance[index].status = status;
        }else{
            // Add new date
              newAttendance.push({date, status });
        }


        // save back
        await taskCollection.updateOne(
            { _id: new ObjectId(taskId) },
            { $set:{ attendance:newAttendance, lastUpdated: new Date()}}

        );
        return NextResponse.json({success:true, data: newAttendance});

    }catch(err){
        console.error("Attendance update error",err);
        return NextResponse.json(
            { success: false, message: "Server error"},
            { status: 500}
        );
    }
}