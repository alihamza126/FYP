"use client";

import Axios from "@/lib/Axios";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
import Image from "next/image";
import { CloudinaryUploader } from "@/components/upload/Uploader";
import MenuOne from "@/components/Header/Menu/MenuOne";
import Footer from "@/components/Footer/Footer";
import { motion } from "framer-motion"
import Link from "next/link";

type OrderItem = {
   productId: {
      _id: string;
      name: string;
      images: string[];
      slug?: string;
      description?: string;
   };
};

type ReviewForm = {
   rating: number;
   comment: string;
   images: { url: string }[];
};

const ReviewPage = ({ params }: { params: { id: string } }) => {
   const { id } = params;
   const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
   const [loading, setLoading] = useState(true);

   const [reviews, setReviews] = useState<Record<string, ReviewForm>>({});
   const [currentProductId, setCurrentProductId] = useState<string | null>(null);
   const [isMounted, setIsMounted] = useState(false);

   useEffect(() => {
      setIsMounted(true);
   }, []);

   useEffect(() => {
      if (isMounted) fetchOrder();
   }, [isMounted]);

   async function fetchOrder() {
      try {
         setLoading(true);
         const res = await Axios.get(`/api/v1/review/${id}`);
         const items: OrderItem[] = res.data.order.items || [];
         setOrderItems(items);

         // init blank forms keyed by productId
         const initForms: Record<string, ReviewForm> = {};
         items.forEach((item) => {
            initForms[item.productId._id] = {
               rating: 1,
               comment: "",
               images: [],
            };
         });
         setReviews(initForms);
      } catch (err) {
         console.error(err);
         toast.error("Failed to load order details");
      } finally {
         setLoading(false);
      }
   }

   function handleRatingChange(productId: string, rating: number) {
      setReviews((prev) => ({
         ...prev,
         [productId]: { ...prev[productId], rating },
      }));
   }

   function handleCommentChange(productId: string, comment: string) {
      setReviews((prev) => ({
         ...prev,
         [productId]: { ...prev[productId], comment },
      }));
   }

   function handleUploadComplete(files: any[]) {
      if (!currentProductId) return;
      setReviews((prev) => ({
         ...prev,
         [currentProductId]: { ...prev[currentProductId], images: files },
      }));
   }

   async function submitReview(productId: string) {
      const { rating, comment, images } = reviews[productId];
      const reviewData = {
         productId,
         rating,
         comment,
         // send only URLs
         imageUrls: images.map((img) => img.url),
      };

      try {
         const res = await Axios.post(`/api/v1/review/${id}`, reviewData);
         if (res.status === 200 || res.status === 201) {
            toast.success("Review submitted successfully");
            // optionally disable further edits:
            setReviews((prev) => ({
               ...prev,
               [productId]: { ...prev[productId], rating: 0, comment: "", images: [] },
            }));
         }
      } catch (err) {
         console.error(err);
         toast.error(err.response?.data?.message || "Failed to submit review");
      }
   }

   const StarRating = ({
      rating,
      onRatingChange,
   }: {
      rating: number;
      onRatingChange: (rating: number) => void;
   }) => (
      <div className="flex items-center space-x-1">
         {[1, 2, 3, 4, 5].map((star) => (
            <button
               key={star}
               type="button"
               onClick={() => onRatingChange(star)}
               className="focus:outline-none"
            >
               <Star
                  className={`w-6 h-6 ${rating >= star
                     ? "text-yellow-500 fill-yellow"
                     : "text-gray-300"
                     }`}
               />
            </button>
         ))}
      </div>
   );

   if (!id) {
      return (
         <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold">Order not found</h1>
         </div>
      );
   }

   if (loading) {
      return (
         <div className="container mx-auto py-10">
            <div className="flex items-center justify-center h-64">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
         </div>
      );
   }

   return (
      <>
         <MenuOne />

         <div className="container mx-auto py-16 px-4 ">

            <h1 className="text-2xl font-bold mb-6 text-center mt-10">Review Your Purchase</h1>
            <p className="text-muted-foreground mb-8 text-center">
               Share your thoughts on the products you ordered.
            </p>

            {orderItems.length === 0 ? (
               <motion.div
                  // start invisible and slightly down
                  initial={{ opacity: 0, y: 20 }}
                  // animate up into place
                  animate={{ opacity: 1, y: 0 }}
                  // when unmounting, fade out/up
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-10"
               >
                  <motion.h2
                     // small pop-in
                     initial={{ scale: 0.8 }}
                     animate={{ scale: 1 }}
                     transition={{ type: "spring", stiffness: 120, damping: 12 }}
                     className="text-xl font-semibold"
                  >
                     You have already reviewed this order
                  </motion.h2>
               </motion.div>
            ) : (
               <div className="space-y-8">
                  {orderItems.map((item) => {
                     const pid = item.productId._id;
                     const form = reviews[pid];
                     return (
                        <Card key={pid} className="overflow-hidden">
                           <CardContent className="p-6">
                              <div className="flex flex-col md:flex-row gap-6">
                                 <div className="w-full md:w-1/4">
                                    <div className="aspect-square relative rounded-md overflow-hidden border">
                                       <Link href={`/product?id=${item.productId.id}`}>
                                          <Image
                                             src={
                                                item.productId.images[0] ||
                                                "/placeholder.svg?height=200&width=200"
                                             }
                                             alt={item.productId.slug || "Product image"}
                                             fill
                                             className="object-cover"
                                          />
                                       </Link>
                                    </div>
                                 </div>

                                 <div className="w-full md:w-3/4 space-y-4">
                                    <h3 className="text-xl font-semibold">
                                       {item.productId.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                       {item.productId.description ||
                                          "No description available"}
                                    </p>

                                    <div className="space-y-4 pt-4">
                                       <div>
                                          <label className="block text-sm font-medium mb-2">
                                             Your Rating
                                          </label>
                                          <StarRating
                                             rating={form?.rating || 0}
                                             onRatingChange={(r) =>
                                                handleRatingChange(pid, r)
                                             }
                                          />
                                       </div>

                                       <div>
                                          <label
                                             htmlFor={`comment-${pid}`}
                                             className="block text-sm font-medium mb-2"
                                          >
                                             Your Review
                                          </label>
                                          <Textarea
                                             id={`comment-${pid}`}
                                             placeholder="Share your experience…"
                                             value={form?.comment || ""}
                                             onChange={(e) =>
                                                handleCommentChange(pid, e.target.value)
                                             }
                                             className="min-h-[120px]"
                                          />
                                       </div>

                                       <div>
                                          <label className="block text-sm font-medium mb-2">
                                             Add Photos
                                          </label>
                                          <div
                                             onClick={() => setCurrentProductId(pid)}
                                             className="border-2 border-dashed rounded-md p-4 hover:bg-muted/50 cursor-pointer"
                                          >
                                             {currentProductId === pid ? (
                                                <CloudinaryUploader
                                                   onUploadComplete={handleUploadComplete}
                                                   onUploadError={(err) =>
                                                      toast.error(
                                                         "Upload failed: " + err.message
                                                      )
                                                   }
                                                   maxFiles={5}
                                                />
                                             ) : (
                                                <div className="text-center">
                                                   <p>Click to add up to 5 photos</p>
                                                </div>
                                             )}
                                          </div>

                                          {form?.images?.length > 0 && (
                                             <div className="mt-4">
                                                <p className="text-sm font-medium mb-2">
                                                   Uploaded Images:
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                   {form.images.map((img, i) => (
                                                      <div
                                                         key={i}
                                                         className="relative w-16 h-16 rounded-md overflow-hidden border"
                                                      >
                                                         <Image
                                                            src={img.url}
                                                            alt={`Uploaded ${i + 1}`}
                                                            fill
                                                            className="object-cover"
                                                         />
                                                      </div>
                                                   ))}
                                                </div>
                                             </div>
                                          )}
                                       </div>

                                       <Button
                                          onClick={() => submitReview(pid)}
                                          disabled={!form?.rating}
                                          className="mt-4"
                                       >
                                          Submit Review
                                       </Button>
                                    </div>
                                 </div>
                              </div>
                           </CardContent>
                        </Card>
                     );
                  })}
               </div>
            )}
         </div>


         <Footer />
      </>
   );
};

export default ReviewPage;
