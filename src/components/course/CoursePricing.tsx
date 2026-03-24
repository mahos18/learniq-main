"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { CreditCard, Coins, Zap, Lock, CheckCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface CoursePricingProps {
  course: {
    _id: string;
    title: string;
    pricing: {
      type: "free" | "paid";
      amount: number;
      currency: string;
    };
    pointCost: number;
  };
  isEnrolled: boolean;
  userPoints: number;
}

export default function CoursePricing({ course, isEnrolled, userPoints }: CoursePricingProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "points">("stripe");

  if (isEnrolled) {
    return (
      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
        <p className="text-green-400 font-semibold text-lg">Already Enrolled!</p>
        <p className="text-sm text-gray-400 mt-1">Continue learning this course</p>
        <button
          onClick={() => router.push(`/student/courses/${course._id}`)}
          className="mt-4 px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
        >
          Go to Course <ArrowRight size={14} />
        </button>
      </div>
    );
  }

  if (course.pricing.type === "free") {
    return (
      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-xl p-6 text-center">
        <Zap className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
        <p className="text-indigo-400 font-semibold text-lg">Free Course</p>
        <p className="text-sm text-gray-400 mt-1">No payment required</p>
        <button
          onClick={async () => {
            setLoading(true);
            try {
              const res = await fetch("/api/enroll", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ courseId: course._id }),
              });
              const data = await res.json();
              if (res.ok) {
                toast.success("Successfully enrolled!");
                router.refresh();
              } else {
                toast.error(data.error || "Failed to enroll");
              }
            } catch (error) {
              toast.error("Something went wrong");
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          className="mt-4 px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50 inline-flex items-center gap-2"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            "Enroll Now"
          )}
        </button>
      </div>
    );
  }

  const handlePurchase = async () => {
    setLoading(true);
    
    try {
      if (paymentMethod === "points") {
        // Purchase with points
        const response = await fetch("/api/payments/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId: course._id, paymentMethod: "points" }),
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
          toast.success(data.message);
          router.refresh();
        } else {
          toast.error(data.error || "Failed to purchase with points");
        }
      } else {
        // Purchase with Stripe (test mode)
        const response = await fetch("/api/payments/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId: course._id, paymentMethod: "stripe" }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          toast.error(data.error || "Payment failed");
          return;
        }
        
        // Check if clientSecret exists
        if (!data.clientSecret) {
          toast.error("Payment configuration error. Please try again.");
          return;
        }
        
        // Load Stripe
        const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
        if (!stripePublishableKey) {
          toast.error("Stripe configuration error");
          return;
        }
        
        const stripe = await loadStripe(stripePublishableKey);
        
        if (!stripe) {
          toast.error("Failed to load Stripe");
          return;
        }
        
        // Confirm payment with proper error handling
        const { error } = await stripe.confirmPayment({
          clientSecret: data.clientSecret, // Now guaranteed to be string
          confirmParams: {
            return_url: `${window.location.origin}/student/courses/${course._id}/payment-success`,
          },
        });
        
        if (error) {
          console.error("Stripe error:", error);
          toast.error(error.message || "Payment failed");
        }
      }
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const amountInDollars = (course.pricing.amount / 100).toFixed(2);
  const canAffordWithPoints = userPoints >= course.pointCost;

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 sticky top-24">
      <h3 className="text-xl font-bold text-white mb-2">Purchase Course</h3>
      
      {/* Price Display */}
      <div className="mb-4">
        <div className="text-3xl font-bold text-white">
          {formatCurrency(course.pricing.amount, course.pricing.currency)}
          <span className="text-sm text-gray-400 font-normal ml-1">
            {course.pricing.currency.toUpperCase()}
          </span>
        </div>
        {course.pointCost > 0 && (
          <div className="text-sm text-gray-400 mt-1">
            or {course.pointCost} IQ Points
          </div>
        )}
      </div>
      
      {/* Payment Method Selection */}
      <div className="space-y-3 mb-6">
        <div
          onClick={() => setPaymentMethod("stripe")}
          className={cn(
            "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
            paymentMethod === "stripe"
              ? "border-indigo-500 bg-indigo-500/10"
              : "border-gray-700 hover:border-gray-600"
          )}
        >
          <CreditCard size={20} className={paymentMethod === "stripe" ? "text-indigo-400" : "text-gray-500"} />
          <div className="flex-1">
            <p className="font-medium text-white">Credit Card / Debit Card</p>
            <p className="text-xs text-gray-400">Pay with Stripe (test mode)</p>
          </div>
          <div className={cn(
            "w-4 h-4 rounded-full border-2",
            paymentMethod === "stripe"
              ? "border-indigo-500 bg-indigo-500"
              : "border-gray-600"
          )} />
        </div>
        
        {course.pointCost > 0 && (
          <div
            onClick={() => setPaymentMethod("points")}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
              paymentMethod === "points"
                ? "border-indigo-500 bg-indigo-500/10"
                : "border-gray-700 hover:border-gray-600",
              !canAffordWithPoints && "opacity-50 cursor-not-allowed"
            )}
          >
            <Coins size={20} className={paymentMethod === "points" ? "text-indigo-400" : "text-gray-500"} />
            <div className="flex-1">
              <p className="font-medium text-white">IQ Points</p>
              <p className="text-xs text-gray-400">
                You have {userPoints} points • {canAffordWithPoints ? "Sufficient" : "Insufficient"}
              </p>
            </div>
            <div className={cn(
              "w-4 h-4 rounded-full border-2",
              paymentMethod === "points"
                ? "border-indigo-500 bg-indigo-500"
                : "border-gray-600"
            )} />
          </div>
        )}
      </div>
      
      {/* Purchase Button */}
      <button
        onClick={handlePurchase}
        disabled={loading || (paymentMethod === "points" && !canAffordWithPoints)}
        className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <Lock size={16} />
            {paymentMethod === "points" 
              ? `Pay ${course.pointCost} IQ Points` 
              : `Pay ${formatCurrency(course.pricing.amount, course.pricing.currency)}`}
          </>
        )}
      </button>
      
      {/* Demo Info for Hackathon */}
      <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
        <p className="text-xs text-amber-400 font-medium mb-1">🎓 Hackathon Demo Mode</p>
        <p className="text-xs text-gray-400">
          Use test card: <code className="bg-gray-800 px-1 rounded text-indigo-400">4242 4242 4242 4242</code><br />
          Any future expiry, any CVC. No real charges.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          <span className="text-green-400">✓</span> Instructor gets 60% • Platform gets 40%
        </p>
      </div>
    </div>
  );
}