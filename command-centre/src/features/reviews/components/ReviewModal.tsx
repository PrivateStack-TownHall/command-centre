import { MessageSquareText, Star, TrendingUp } from "lucide-react";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

import type { Review } from "../types/review.type";

interface ReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  reviews: Review[];
}

function ReviewModal({
  open,
  onOpenChange,
  productName,
  reviews,
}: ReviewModalProps) {
  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          max-h-[90vh]
          max-w-5xl
          overflow-hidden
          rounded-xl
          border-0
          p-0
        "
      >
        <div
          className="
            bg-gradient-to-br
            from-violet-50
            via-white
            to-indigo-50
          "
        >
          <DialogHeader className="border-b p-6">
            <h2
              className="
                text-3xl
                font-bold
                text-slate-900
              "
            >
              {productName}
            </h2>

            <p className="text-slate-500">Customer Reviews Summary</p>
          </DialogHeader>

          <div className="grid grid-cols-4 gap-4 p-6">
            <div
              className="
                rounded-xl
                border
                bg-white
                p-4
              "
            >
              <Star className="mb-3 h-5 w-5 text-amber-500" />

              <p className="text-xs text-slate-500">Average Rating</p>

              <h3 className="text-3xl font-bold">{averageRating.toFixed(1)}</h3>
            </div>

            <div
              className="
                rounded-xl
                border
                bg-white
                p-4
              "
            >
              <MessageSquareText className="mb-3 h-5 w-5 text-blue-500" />

              <p className="text-xs text-slate-500">Reviews</p>

              <h3 className="text-3xl font-bold">{reviews.length}</h3>
            </div>

            <div
              className="
                rounded-xl
                border
                bg-white
                p-4
              "
            >
              <TrendingUp className="mb-3 h-5 w-5 text-emerald-500" />

              <p className="text-xs text-slate-500">Satisfaction</p>

              <h3 className="text-3xl font-bold">
                {Math.round((averageRating / 5) * 100)}%
              </h3>
            </div>

            <div
              className="
                rounded-xl
                border
                bg-white
                p-4
              "
            >
              <Star className="mb-3 h-5 w-5 text-violet-500" />

              <p className="text-xs text-slate-500">Five Star</p>

              <h3 className="text-3xl font-bold">
                {reviews.filter((review) => review.rating === 5).length}
              </h3>
            </div>
          </div>

          <div
            className="
              max-h-[500px]
              space-y-3
              overflow-y-auto
              p-6
              pt-0
            "
          >
            {reviews.map((review) => (
              <div
                key={review.id}
                className="
                  rounded-xl
                  border
                  bg-white
                  p-4
                "
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Customer #{review.userId}</h4>

                    <div className="mt-1 flex gap-1">
                      {Array.from({
                        length: review.rating,
                      }).map((_, index) => (
                        <Star
                          key={index}
                          className="
                            h-4
                            w-4
                            fill-amber-400
                            text-amber-400
                          "
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-sm text-slate-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ReviewModal;
