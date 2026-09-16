'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, ExternalLink, Tag, ChevronRight, MessageSquare, Share2, Check } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/Button';
import { Tool } from '@/types/tool';
import { Review } from '@/types/review';
import { getPricingColor, getPricingLabel } from '@/lib/utils';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';

interface ToolDetailClientProps {
  tool: Tool;
}

export function ToolDetailClient({ tool: initialTool }: ToolDetailClientProps) {
  const { data: session } = useSession();
  const [tool, setTool] = useState(initialTool);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [similarTools, setSimilarTools] = useState<Tool[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [ratingHover, setRatingHover] = useState(0);
  const [newRating, setNewRating] = useState(0);
  const [newContent, setNewContent] = useState('');
  const [imgError, setImgError] = useState(false);
  const [similarImgErrors, setSimilarImgErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchToolDetails();
    checkSavedStatus();
  }, []);

  const fetchToolDetails = async () => {
    try {
      const [toolRes, reviewsRes] = await Promise.all([
        fetch(`/api/tools/${initialTool.slug}`),
        fetch(`/api/reviews?toolId=${initialTool.id}&limit=10`),
      ]);
      
      if (toolRes.ok) {
        const data = await toolRes.json();
        setTool(data.tool);
        setSimilarTools(data.similarTools || []);
      }
      
      if (reviewsRes.ok) {
        const data = await reviewsRes.json();
        setReviews(data.reviews || []);
        if (session?.user?.id) {
          const userRev = data.reviews.find((r: Review) => r.userId === session.user.id);
          setUserReview(userRev || null);
        }
      }
    } catch (error) {
      console.error('Failed to fetch tool details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkSavedStatus = async () => {
    if (!session?.user?.id) return;
    try {
      const res = await fetch(`/api/saved?toolId=${initialTool.id}`);
      if (res.ok) {
        const data = await res.json();
        setIsSaved(data.savedTools?.length > 0);
      }
    } catch (error) {
      console.error('Failed to check saved status:', error);
    }
  };

  const handleSave = async () => {
    if (!session?.user?.id) return;
    
    try {
      if (isSaved) {
        const res = await fetch(`/api/saved/${initialTool.id}`, { method: 'DELETE' });
        if (res.ok) setIsSaved(false);
      } else {
        const res = await fetch('/api/saved', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ toolId: initialTool.id }),
        });
        if (res.ok) setIsSaved(true);
      }
    } catch (error) {
      console.error('Failed to save/unsave:', error);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id || newRating === 0) return;

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId: initialTool.id,
          rating: newRating,
          content: newContent,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setReviews((prev) => [data.review, ...prev]);
        setUserReview(data.review);
        setShowReviewForm(false);
        setNewRating(0);
        setNewContent('');
        
        const toolRes = await fetch(`/api/tools/${initialTool.slug}`);
        if (toolRes.ok) {
          const toolData = await toolRes.json();
          setTool(toolData.tool);
        }
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const handleEditReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userReview || newRating === 0) return;

    try {
      const res = await fetch(`/api/reviews/${userReview.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: newRating, content: newContent }),
      });

      if (res.ok) {
        const data = await res.json();
        setReviews((prev) => prev.map((r) => (r.id === userReview.id ? data.review : r)));
        setUserReview(data.review);
        setShowReviewForm(false);
      }
    } catch (error) {
      console.error('Failed to update review:', error);
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview || !confirm('Delete this review?')) return;

    try {
      const res = await fetch(`/api/reviews/${userReview.id}`, { method: 'DELETE' });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== userReview.id));
        setUserReview(null);
      }
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  const distribution = reviews.reduce<Record<number, number>>(
    (acc, r) => ({ ...acc, [r.rating]: (acc[r.rating] || 0) + 1 }),
    { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-1 space-y-6">
                <div className="aspect-square rounded-2xl border border-white/10 bg-white/[0.03]" />
                <div className="h-12 rounded-lg bg-white/5" />
              </div>
              <div className="lg:col-span-2 space-y-4">
                <div className="h-8 w-1/2 rounded bg-white/5" />
                <div className="h-4 w-1/4 rounded bg-white/5" />
                <div className="h-4 w-3/4 rounded bg-white/5" />
                <div className="h-20 w-full rounded bg-white/5" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-8 flex items-center gap-2 text-sm text-white/50" aria-label="Breadcrumb">
          <a href="/tools" className="hover:text-white">Tools</a>
          <ChevronRight className="h-4 w-4" />
          <a href={`/tools/category/${tool.category.toLowerCase()}`} className="hover:text-white">
            {tool.category}
          </a>
          <ChevronRight className="h-4 w-4" />
          <span className="text-white" aria-current="page">{tool.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sticky top-24"
            >
              {tool.logo && !imgError ? (
                <Image
                  src={tool.logo}
                  alt={tool.name}
                  width={120}
                  height={120}
                  className="mx-auto mb-4 rounded-2xl"
                  sizes="120px"
                  priority
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-4xl font-bold">
                  {tool.name.charAt(0)}
                </div>
              )}

              <div className="text-center space-y-3">
                <h1 className="text-2xl font-semibold">{tool.name}</h1>
                <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-medium', getPricingColor(tool.pricing))}>
                  {getPricingLabel(tool.pricing)}
                </span>
              </div>

              <div className="flex items-center justify-center gap-3">
                <span className="flex items-center gap-1 text-lg font-medium">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  {tool.rating.toFixed(1)}
                </span>
                <span className="text-white/40">({tool.reviewCount} reviews)</span>
              </div>

              <div className="flex flex-col gap-2">
                {tool.website && (
                  <a
                    href={tool.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/[0.05]"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Visit Website
                  </a>
                )}
                <Button
                  variant={isSaved ? 'secondary' : 'outline'}
                  className="w-full gap-2"
                  onClick={handleSave}
                  disabled={!session?.user?.id}
                >
                  <Heart className={cn('h-4 w-4', isSaved ? 'fill-current' : '')} />
                  {isSaved ? 'Saved' : 'Save Tool'}
                </Button>
                <Button variant="ghost" className="w-full gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>

              <div className="border-t border-white/10 pt-4">
                <h4 className="font-medium mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {tool.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-white/60"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {similarTools.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sticky top-24"
              >
                <h3 className="font-semibold mb-4">Similar Tools</h3>
                <div className="space-y-3">
                  {similarTools.map((similar) => (
                    <a
                      key={similar.id}
                      href={`/tools/${similar.slug}`}
                      className="flex items-center gap-3 rounded-lg p-3 transition hover:bg-white/5 group"
                    >
                      {similar.logo && !similarImgErrors[similar.id] ? (
                        <Image 
                          src={similar.logo} 
                          alt={similar.name} 
                          width={40} 
                          height={40} 
                          className="rounded-lg" 
                          sizes="40px" 
                          onError={() => setSimilarImgErrors(prev => ({ ...prev, [similar.id]: true }))}
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-sm font-semibold">
                          {similar.name.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate group-hover:text-white">{similar.name}</p>
                        <p className="text-xs text-white/40">{similar.category}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-white/30 group-hover:text-white" />
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-8">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8"
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-white/40 uppercase tracking-wide">{tool.category}</span>
                    <span className="text-white/30">●</span>
                    <span className="text-xs text-white/40">AI Tool</span>
                  </div>
                  <p className="text-lg text-white/70 leading-relaxed">{tool.description}</p>
                </div>
              </div>

              {tool.longDescription && (
                <div className="prose prose-invert max-w-none text-white/60">
                  <p>{tool.longDescription}</p>
                </div>
              )}

              {tool.features.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-semibold mb-4">Key Features</h3>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {tool.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                        <span className="text-white/70">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Reviews</h2>
                <Button
                  variant={userReview ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={() => {
                    if (userReview) {
                      setNewRating(userReview.rating);
                      setNewContent(userReview.content || '');
                    }
                    setShowReviewForm(!showReviewForm);
                  }}
                >
                  {userReview ? 'Edit Review' : 'Write a Review'}
                </Button>
              </div>

              <div className="flex gap-8 mb-8">
                <div className="flex flex-col items-center text-center">
                  <div className="text-5xl font-bold">{tool.rating.toFixed(1)}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-white/50">out of 5</span>
                  </div>
                  <div className="mt-2 text-sm text-white/40">{tool.reviewCount} reviews</div>
                </div>
                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = distribution[star as keyof typeof distribution] || 0;
                    const percentage = tool.reviewCount > 0 ? (count / tool.reviewCount) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-3">
                        <span className="text-white/60 w-6 text-right">{star}</span>
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            className="h-full bg-yellow-400"
                          />
                        </div>
                        <span className="text-white/40 w-10 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {showReviewForm && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={userReview ? handleEditReview : handleSubmitReview}
                  className="space-y-4 mb-8 p-6 rounded-xl border border-white/10 bg-white/[0.02]"
                >
                  <h3 className="font-semibold">{userReview ? 'Edit Your Review' : 'Write a Review'}</h3>
                  
                  <fieldset>
                    <legend className="block text-sm font-medium mb-2">Your Rating</legend>
                    <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          onMouseEnter={() => setRatingHover(star)}
                          onMouseLeave={() => setRatingHover(0)}
                          className="p-1 text-2xl transition"
                          aria-label={`${star} star${star > 1 ? 's' : ''}`}
                        >
                          <Star
                            className={cn(
                              'h-6 w-6 cursor-pointer',
                              star <= (ratingHover || newRating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-white/20'
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <div>
                    <label htmlFor="review-content" className="block text-sm font-medium mb-2">
                      Your Review (optional)
                    </label>
                    <textarea
                      id="review-content"
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder="Share your experience with this tool..."
                      className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 min-h-[100px] resize-y"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" disabled={newRating === 0}>
                      {userReview ? 'Update Review' : 'Submit Review'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => { setShowReviewForm(false); setNewRating(0); setNewContent(''); }}>
                      Cancel
                    </Button>
                    {userReview && (
                      <Button type="button" variant="danger" onClick={handleDeleteReview}>
                        Delete
                      </Button>
                    )}
                  </div>
                </motion.form>
              )}

              <div className="space-y-6">
                {reviews.length === 0 ? (
                  <p className="text-center text-white/50 py-8">No reviews yet. Be the first to review!</p>
                ) : (
                  reviews.map((review) => (
                    <motion.article
                      key={review.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border border-white/10 bg-white/[0.02] p-5"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-medium">
                            {review.user?.name?.charAt(0) || review.user?.email?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-medium">{review.user?.name || 'Anonymous'}</p>
                            <p className="text-xs text-white/40">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                'h-4 w-4',
                                star <= review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-white/20'
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      {review.content && (
                        <p className="text-white/70 leading-relaxed">{review.content}</p>
                      )}
                    </motion.article>
                  ))
                )}
              </div>
            </motion.section>
          </div>
        </div>
      </main>
    </div>
  );
}