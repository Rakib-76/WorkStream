import SuccessClient from './SuccessClient'; // Client Component-কে ইম্পোর্ট করুন

// এটি একটি Server Component, যা Next.js থেকে searchParams prop গ্রহণ করে
export default function SuccessPage({ searchParams }) {
    // URL-এর email এবং plan প্যারামিটারগুলি সরাসরি prop থেকে অ্যাক্সেস করুন
    const email = searchParams.email;
    const plan = searchParams.plan;

    // Client Component-এ prop হিসেবে ডাটা পাস করুন
    return (
        <SuccessClient initialEmail={email} initialPlan={plan} />
    );
}