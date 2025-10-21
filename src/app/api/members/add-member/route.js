// pages/api/members/add-member.js

// প্রয়োজনীয় মডিউল ইম্পোর্ট করুন
import dbConnect from '../../../lib/dbConnect'; // আপনার ডাটাবেস কানেকশন ইউটিলিটি
import Project from '../../../models/Project'; // আপনার Project Mongoose Model

export default async function handler(req, res) {
  // ১. মেথড চেক
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  // ২. ডাটাবেস কানেকশন
  await dbConnect();

  const { projectId, memberEmail } = req.body;
  
  // ইনপুট ভ্যালিডেশন
  if (!projectId || !memberEmail) {
    return res.status(400).json({ success: false, message: 'Missing projectId or memberEmail' });
  }

  try {
    // ৩. মেম্বারকে Project-এর members Array তে যোগ করুন
    // $addToSet ব্যবহার করা হয়েছে, যাতে একই memberEmail দুইবার যোগ না হয়।
    const result = await Project.findByIdAndUpdate(
      projectId,
      { $addToSet: { members: memberEmail } },
      { new: true, runValidators: true } // new: true আপডেটেড ডকুমেন্ট রিটার্ন করে
    );

    if (!result) {
      // যদি projectId ভুল হয় বা Project খুঁজে না পাওয়া যায়
      return res.status(404).json({ success: false, message: 'Project not found with the given ID.' });
    }

    // ৪. সফল রেসপন্স
    res.status(200).json({ success: true, message: `Member ${memberEmail} added successfully to project ${projectId}.` });

  } catch (error) {
    console.error("MEMBER ADDITION ERROR:", error);
    // সার্ভার ত্রুটির ক্ষেত্রে 500 রেসপন্স
    res.status(500).json({ success: false, message: 'Server error: Could not add member.', error: error.message });
  }
}