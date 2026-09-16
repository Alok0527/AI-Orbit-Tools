export interface ToolSubmission {
  id: string;
  name: string;
  website?: string;
  description?: string;
  category?: string;
  pricing: string;
  tags: string[];
  logoUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface SubmissionFormData {
  name: string;
  website: string;
  description: string;
  category: string;
  pricing: string;
  tags: string;
  logoUrl: string;
}