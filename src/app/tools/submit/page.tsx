'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowLeft, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { cn } from '@/lib/utils';
import { z } from 'zod';

const submissionSchema = z.object({
  name: z.string().min(1, 'Tool name is required').max(100),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  category: z.string().min(1, 'Please select a category'),
  pricing: z.enum(['free', 'freemium', 'paid', 'enterprise']),
  tags: z.string().optional(),
  logoUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

type FormData = z.infer<typeof submissionSchema>;

const categories = [
  { value: 'writing', label: 'Writing' },
  { value: 'coding', label: 'Coding' },
  { value: 'design', label: 'Design' },
  { value: 'image', label: 'Image' },
  { value: 'video', label: 'Video' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'productivity', label: 'Productivity' },
  { value: 'research', label: 'Research' },
  { value: 'audio', label: 'Audio' },
  { value: 'education', label: 'Education' },
];

const pricingOptions = [
  { value: 'free', label: 'Free' },
  { value: 'freemium', label: 'Freemium' },
  { value: 'paid', label: 'Paid' },
  { value: 'enterprise', label: 'Enterprise' },
];

export default function SubmitToolPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    website: '',
    description: '',
    category: '',
    pricing: 'freemium',
    tags: '',
    logoUrl: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6 max-w-2xl mx-auto">
            <div className="h-8 w-1/2 rounded bg-white/5" />
            <div className="h-48 rounded-lg bg-white/5" />
            <div className="space-y-4">
              <div className="h-10 rounded bg-white/5" />
              <div className="h-10 rounded bg-white/5" />
              <div className="h-10 rounded bg-white/5" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <svg className="mx-auto h-16 w-16 text-white/20 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h1 className="text-3xl font-semibold mb-4">Sign in to submit a tool</h1>
            <p className="text-white/60 mb-8">You need to be authenticated to submit new AI tools to the directory.</p>
            <div className="flex items-center justify-center gap-4">
              <a href="/login?callbackUrl=/tools/submit">
                <Button size="lg">Sign In</Button>
              </a>
              <a href="/signup?callbackUrl=/tools/submit">
                <Button variant="outline" size="lg">Create Account</Button>
              </a>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const validateField = (name: keyof FormData, value: string) => {
    try {
      submissionSchema.shape[name].parse(value);
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [name]: error.errors[0].message }));
      }
    }
  };

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = submissionSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormData, string>> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof FormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags?.split(',').map((t) => t.trim()).filter(Boolean) || [],
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setTimeout(() => router.push('/tools'), 2000);
      } else {
        const data = await response.json();
        setSubmitStatus('error');
        setErrorMessage(data.error?.[0]?.message || 'Failed to submit tool. Please try again.');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 flex items-center gap-3">
            <a href="/tools" className="text-white/50 hover:text-white">
              <ArrowLeft className="h-6 w-6" />
            </a>
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/50">Submit Tool</p>
              <h1 className="text-3xl font-semibold tracking-tight">Share an AI tool</h1>
            </div>
          </div>

          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 flex items-center gap-3 rounded-lg bg-green-500/10 border border-green-500/20 p-4 text-green-400"
            >
              <CheckCircle className="h-6 w-6 shrink-0" />
              <div>
                <p className="font-medium">Tool submitted successfully!</p>
                <p className="text-sm text-white/60">Our team will review it and add it to the directory soon.</p>
              </div>
            </motion.div>
          )}

          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 flex items-center gap-3 rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-red-400"
            >
              <AlertCircle className="h-6 w-6 shrink-0" />
              <p>{errorMessage}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <h2 className="text-lg font-semibold mb-6">Tool Information</h2>

              <div className="space-y-5">
                <Input
                  label="Tool Name"
                  placeholder="e.g., ChatGPT"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  error={errors.name}
                  required
                />

                <Input
                  label="Website URL"
                  placeholder="https://example.com"
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  error={errors.website}
                />

                <Select
                  label="Category"
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  options={categories}
                  placeholder="Select a category"
                  error={errors.category}
                  required
                />

                <Select
                  label="Pricing Model"
                  value={formData.pricing}
                  onChange={(e) => handleChange('pricing', e.target.value as FormData['pricing'])}
                  options={pricingOptions}
                  error={errors.pricing}
                  required
                />

                <Input
                  label="Logo URL (optional)"
                  placeholder="https://example.com/logo.png"
                  type="url"
                  value={formData.logoUrl}
                  onChange={(e) => handleChange('logoUrl', e.target.value)}
                  error={errors.logoUrl}
                  helperText="Direct link to the tool's logo image"
                />

                <Input
                  label="Tags (comma separated)"
                  placeholder="AI, writing, productivity, chatbot"
                  value={formData.tags}
                  onChange={(e) => handleChange('tags', e.target.value)}
                  error={errors.tags}
                  helperText="Add relevant tags to help users discover your tool"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <h2 className="text-lg font-semibold mb-6">Description</h2>

              <Textarea
                label="Tool Description"
                placeholder="Describe what this tool does, its key features, and who it's for. Minimum 10 characters."
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                error={errors.description}
                required
                rows={6}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex gap-3"
            >
              <Button type="submit" size="lg" className="flex-1" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit for Review
              </Button>
              <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>
                Cancel
              </Button>
            </motion.div>

            <p className="text-center text-sm text-white/40">
              By submitting, you agree to our{' '}
              <a href="#" className="underline hover:text-white">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="underline hover:text-white">Privacy Policy</a>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}