// 📁 /app/api/add-member/route.js
export async function PUT(request) {
  try {
    const body = await request.json();
    console.log("🟢 Received PUT request!");
    console.log("Body:", body);

    // শুধু ডেমো রেসপন্স ফেরত দিচ্ছি
    return Response.json(
      { success: true, message: "Request received successfully!", body },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error in PUT route:", error);
    return Response.json(
      { success: false, message: "Failed to process request", error: error.message },
      { status: 500 }
    );
  }
}
