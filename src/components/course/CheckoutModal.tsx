"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { X, CreditCard, Coins, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
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
  userPoints: number;
  onSuccess: () => void;
}

export default function CheckoutModal({ isOpen, onClose, course, userPoints, onSuccess }: CheckoutModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "points">("stripe");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const handlePurchase = async () => {
    setLoading(true);
    setError(null);
    
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
          onSuccess();
          router.refresh();
        } else {
          setError(data.error || "Failed to purchase with points");
          toast.error(data.error || "Failed to purchase with points");
        }
      } else {
        // Purchase with Stripe
        // First, create payment intent
        const response = await fetch("/api/payments/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId: course._id, paymentMethod: "stripe" }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          setError(data.error || "Payment failed");
          toast.error(data.error || "Payment failed");
          return;
        }
        
        if (!data.clientSecret) {
          setError("Payment configuration error. Please try again.");
          toast.error("Payment configuration error");
          return;
        }
        
        const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
        if (!stripePublishableKey) {
          setError("Stripe configuration error");
          toast.error("Stripe configuration error");
          return;
        }
        
        const stripe = await loadStripe(stripePublishableKey);
        if (!stripe) {
          setError("Failed to load Stripe");
          toast.error("Failed to load Stripe");
          return;
        }
        
        // For hackathon demo, we'll simulate successful payment
        // In production, you would use stripe.confirmPayment
        const { error: confirmError } = await stripe.confirmPayment({
          clientSecret: data.clientSecret,
          confirmParams: {
            return_url: `${window.location.origin}/student/courses/${course._id}/payment-success`,
          },
        });
        
        if (confirmError) {
          console.error("Stripe confirmation error:", confirmError);
          setError(confirmError.message || "Payment failed");
          toast.error(confirmError.message || "Payment failed");
        } else {
          // Payment successful - will redirect to return_url
          toast.success("Payment successful! Redirecting...");
        }
      }
    } catch (error) {
      console.error("Purchase error:", error);
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const canAffordWithPoints = userPoints >= course.pointCost;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative max-w-md w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-white">Purchase Course</h2>
            <p className="text-sm text-gray-400">{course.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-5">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2">
              <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}
          
          {/* Price Display */}
          <div className="mb-6 text-center">
            <div className="text-3xl font-bold text-white">
              {formatPrice(course.pricing.amount, course.pricing.currency)}
            </div>
            {course.pointCost > 0 && (
              <div className="text-sm text-gray-400 mt-1">
                or {course.pointCost} IQ Points
              </div>
            )}
          </div>
          
          {/* Payment Methods */}
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
                  : `Pay ${formatPrice(course.pricing.amount, course.pricing.currency)}`}
                <ArrowRight size={16} />
              </>
            )}
          </button>
          
          {/* Demo Info */}
          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <p className="text-xs text-amber-400 font-medium mb-1">🎓 Hackathon Demo Mode</p>
            <p className="text-xs text-gray-400">
              Use test card: <code className="bg-gray-800 px-1 rounded">4242 4242 4242 4242</code>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Any future expiry, any CVC. No real charges.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}