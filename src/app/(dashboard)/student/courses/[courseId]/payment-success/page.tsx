"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage({ params }: { params: { courseId: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const confirmPayment = async () => {
      const paymentIntent = searchParams.get("payment_intent");
      const redirectStatus = searchParams.get("redirect_status");
      
      if (redirectStatus === "succeeded") {
        try {
          const response = await fetch("/api/payments/confirm-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              paymentIntentId: paymentIntent,
              courseId: params.courseId 
            }),
          });
          
          if (response.ok) {
            setSuccess(true);
          }
        } catch (error) {
          console.error("Payment confirmation error:", error);
        }
      }
      
      setLoading(false);
    };
    
    confirmPayment();
  }, [params.courseId, searchParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 size={32} className="animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 text-center">
      <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8">
        <CheckCircle size={64} className="text-green-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Payment Successful! 🎉</h1>
        <p className="text-gray-400 mb-6">
          Your course has been purchased successfully. You can now start learning!
        </p>
        <Link
          href={`/student/courses/${params.courseId}`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all"
        >
          Go to Course
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}