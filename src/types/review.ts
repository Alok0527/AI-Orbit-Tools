export interface Review {
  id: string;
  toolId: string;
  userId: string;
  rating: number;
  content?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export interface ReviewFormData {
  rating: number;
  content: string;
}

export interface RatingDistribution {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

export interface ReviewListProps {
  reviews: Review[];
  userReview?: Review | null;
  currentUserId?: string;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
  onSubmit?: (data: ReviewFormData) => void;
}