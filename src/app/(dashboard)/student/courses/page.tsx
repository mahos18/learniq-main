// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { Search, BookOpen, Coins, CheckCircle, ShoppingCart } from "lucide-react";
// import { cn, difficultyColor } from "@/lib/utils";
// import { useRouter } from "next/navigation";
// import CheckoutModal from "@/components/course/CheckoutModal";

// interface Course {
//   _id: string; 
//   title: string; 
//   description: string;
//   difficulty: string; 
//   tags: string[]; 
//   pointCost: number;
//   pricing?: {
//     type: "free" | "paid";
//     amount: number;
//     currency: string;
//   };
//   thumbnail?: string; 
//   instructor: { name: string };
//   modules: string[];
//   isEnrolled?: boolean;
// }

// interface Props {
//   courses: Course[];
//   enrolledIds: string[];
//   userPoints: number;
// }

// const DIFFICULTIES = ["All", "beginner", "intermediate", "advanced"];

// export default function CoursesClient({ courses = [], enrolledIds = [], userPoints = 0 }: Props) {
//   const router = useRouter();
//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState("All");
//   const [enrolling, setEnrolling] = useState<string | null>(null);
//   const [enrolled, setEnrolled] = useState(new Set(enrolledIds));
//   const [checkoutCourse, setCheckoutCourse] = useState<Course | null>(null);
//   const [showCheckout, setShowCheckout] = useState(false);

//   // Update enrolled set when enrolledIds changes
//   useEffect(() => {
//     setEnrolled(new Set(enrolledIds));
//   }, []);

//   const filtered = (courses || []).filter((c) => {
//     const matchSearch = c.title?.toLowerCase().includes(search.toLowerCase()) ||
//       c.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));
//     const matchFilter = filter === "All" || c.difficulty === filter;
//     return matchSearch && matchFilter;
//   });

//   const handleEnroll = async (course: Course, usePoints = false) => {
//     setEnrolling(course._id);
//     try {
//       const response = await axios.post("/api/enroll", { 
//         courseId: course._id, 
//         usePoints 
//       });
      
//       setEnrolled((prev) => new Set([...Array.from(prev), course._id]));
//       toast.success("Enrolled successfully!");
//       router.refresh();
//     } catch (e: any) {
//       const error = e.response?.data;
      
//       // If it's a paid course, open checkout modal
//       if (e.response?.status === 402 && error?.requiresPayment) {
//         setCheckoutCourse(course);
//         setShowCheckout(true);
//         toast.error("This is a paid course. Please complete payment.");
//       } else {
//         toast.error(error?.error || "Enrollment failed");
//       }
//     } finally {
//       setEnrolling(null);
//     }
//   };

//   const handlePurchaseSuccess = () => {
//     setShowCheckout(false);
//     setCheckoutCourse(null);
//     router.refresh();
//     toast.success("Course purchased successfully! You can now access the course.");
//   };

//   const formatPrice = (amount: number, currency: string) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: currency.toUpperCase(),
//     }).format(amount / 100);
//   };

//   const isCoursePaid = (course: Course) => {
//     return course.pricing?.type === "paid";
//   };

//   // Show loading state if no courses
//   if (!courses || courses.length === 0) {
//     return (
//       <div className="max-w-5xl mx-auto py-12 text-center">
//         <div className="animate-pulse">
//           <div className="h-8 w-48 bg-gray-700 rounded mx-auto mb-4"></div>
//           <div className="h-4 w-64 bg-gray-700 rounded mx-auto"></div>
//         </div>
//         <p className="text-gray-400 mt-8">Loading courses...</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="max-w-5xl mx-auto space-y-5 animate-fade-in">
//         <div className="flex items-center justify-between">
//           <h1 className="text-2xl font-bold text-white">Browse Courses</h1>
//           <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
//             <Coins size={14} className="text-amber-400" />
//             <span className="text-sm font-medium text-amber-400">{userPoints} IQ Points</span>
//           </div>
//         </div>

//         {/* Search + filters */}
//         <div className="flex flex-col sm:flex-row gap-3">
//           <div className="relative flex-1">
//             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
//             <input
//               className="input pl-9"
//               placeholder="Search courses or topics..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>
//           <div className="flex gap-2 overflow-x-auto no-scrollbar">
//             {DIFFICULTIES.map((d) => (
//               <button
//                 key={d}
//                 onClick={() => setFilter(d)}
//                 className={cn(
//                   "badge whitespace-nowrap px-3 py-1.5 transition-colors",
//                   filter === d
//                     ? "bg-brand-600 text-white"
//                     : "bg-slate-700 text-slate-300 hover:bg-slate-600"
//                 )}
//               >
//                 {d === "All" ? "All levels" : d.charAt(0).toUpperCase() + d.slice(1)}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Course grid */}
//         {filtered.length === 0 ? (
//           <div className="card p-12 text-center text-slate-500">
//             No courses match your search.
//           </div>
//         ) : (
//           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//             {filtered.map((course) => {
//               const isEnrolled = enrolled.has(course._id);
//               const canRedeem = course.pointCost > 0 && userPoints >= course.pointCost;
//               const isPaid = isCoursePaid(course);
//               const isLoading = enrolling === course._id;

//               return (
//                 <div key={course._id} className="card overflow-hidden flex flex-col hover:shadow-card-hover transition-shadow">
//                   {/* Thumbnail */}
//                   <div className="h-36 bg-brand-900/20 flex items-center justify-center overflow-hidden relative">
//                     {course.thumbnail ? (
//                       <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
//                     ) : (
//                       <BookOpen size={32} className="text-brand-300" />
//                     )}
//                     {isPaid && (
//                       <div className="absolute top-2 right-2 bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
//                         Premium
//                       </div>
//                     )}
//                   </div>

//                   {/* Content */}
//                   <div className="p-4 flex-1 flex flex-col gap-2">
//                     <div className="flex items-start justify-between gap-2">
//                       <h3 className="font-semibold text-white text-sm line-clamp-2 flex-1">
//                         {course.title}
//                       </h3>
//                       <span className={cn("badge text-xs flex-shrink-0", difficultyColor(course.difficulty))}>
//                         {course.difficulty}
//                       </span>
//                     </div>

//                     <p className="text-xs text-slate-400 line-clamp-2">{course.description}</p>
//                     <p className="text-xs text-slate-500">by {course.instructor?.name || "Instructor"}</p>

//                     <div className="flex items-center gap-2 text-xs text-slate-500 mt-auto pt-2 border-t border-slate-700">
//                       <BookOpen size={12} />
//                       <span>{course.modules?.length || 0} modules</span>
//                       {course.pointCost > 0 && (
//                         <>
//                           <span>·</span>
//                           <Coins size={12} className="text-amber-500" />
//                           <span className="text-amber-400">{course.pointCost} pts</span>
//                         </>
//                       )}
//                       {isPaid && (
//                         <>
//                           <span>·</span>
//                           <span className="text-green-400">
//                             {formatPrice(course.pricing!.amount, course.pricing!.currency)}
//                           </span>
//                         </>
//                       )}
//                     </div>

//                     {/* CTA */}
//                     <div className="flex gap-2 mt-2">
//                       {isEnrolled ? (
//                         <button
//                           onClick={() => router.push(`/student/courses/${course._id}`)}
//                           className="flex-1 flex items-center justify-center gap-1.5 btn-secondary text-sm py-1.5"
//                         >
//                           <CheckCircle size={14} className="text-reward-600" />
//                           Continue
//                         </button>
//                       ) : (
//                         <>
//                           {!isPaid ? (
//                             <button
//                               onClick={() => handleEnroll(course)}
//                               disabled={isLoading}
//                               className="flex-1 btn-primary text-sm py-1.5"
//                             >
//                               {isLoading ? "Enrolling..." : "Enroll Free"}
//                             </button>
//                           ) : (
//                             <button
//                               onClick={() => handleEnroll(course)}
//                               disabled={isLoading}
//                               className="flex-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-sm py-1.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
//                             >
//                               <ShoppingCart size={14} />
//                               {isLoading ? "Processing..." : `Buy ${formatPrice(course.pricing!.amount, course.pricing!.currency)}`}
//                             </button>
//                           )}
                          
//                           {canRedeem && !isEnrolled && (
//                             <button
//                               onClick={() => handleEnroll(course, true)}
//                               disabled={isLoading}
//                               className="btn-secondary text-sm py-1.5 px-2"
//                               title={`Redeem for ${course.pointCost} points`}
//                             >
//                               <Coins size={14} className="text-amber-500" />
//                             </button>
//                           )}
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {/* Checkout Modal */}
//       {checkoutCourse && (
//         <CheckoutModal
//           isOpen={showCheckout}
//           onClose={() => {
//             setShowCheckout(false);
//             setCheckoutCourse(null);
//           }}
//           course={{
//             _id: checkoutCourse._id,
//             title: checkoutCourse.title,
//             pricing: checkoutCourse.pricing || { type: "paid", amount: 2999, currency: "usd" },
//             pointCost: checkoutCourse.pointCost,
//           }}
//           userPoints={userPoints}
//           onSuccess={handlePurchaseSuccess}
//         />
//       )}
//     </>
//   );
// }

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Course } from "@/models/Course";
import { Enrollment } from "@/models/Enrollment";
import User from "@/models/User";
import CoursesClient from "./CoursesClient";

export default async function CoursesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return (
      <div className="max-w-5xl mx-auto py-12 text-center">
        <p className="text-gray-400">Please sign in to view courses</p>
      </div>
    );
  }

  await connectDB();

  try {
    // Get all published courses
    const courses = await Course.find({ isPublished: true })
      .populate("instructor", "name email")
      .populate("modules")
      .lean();

    // Get user's enrolled courses
    const user = await User.findById(session.user.id).lean();
    const enrollments = await Enrollment.find({ 
      student: session.user.id 
    }).lean();

    // Create an array of enrolled course IDs as strings
    const enrolledIdsArray = enrollments.map((enrollment: any) => 
      enrollment.course?.toString()
    ).filter(Boolean); // Remove any undefined/null values

    // Transform courses for client component
    const transformedCourses = courses.map((course: any) => ({
      _id: course._id.toString(),
      title: course.title,
      description: course.description,
      difficulty: course.difficulty,
      tags: course.tags || [],
      pointCost: course.pointCost || 0,
      pricing: course.pricing || { type: "free", amount: 0, currency: "usd" },
      thumbnail: course.thumbnail || null,
      instructor: {
        name: course.instructor?.name || "Instructor",
      },
      modules: (course.modules || []).map((mod: any) => mod._id.toString()),
    }));

    return (
      <CoursesClient
        courses={transformedCourses}
        enrolledIds={enrolledIdsArray}  // Pass as array, not Set
        userPoints={user?.rewardPoints || 0}
      />
    );
  } catch (error) {
    console.error("Error loading courses:", error);
    return (
      <div className="max-w-5xl mx-auto py-12 text-center">
        <p className="text-red-400">Error loading courses. Please try again later.</p>
      </div>
    );
  }
}