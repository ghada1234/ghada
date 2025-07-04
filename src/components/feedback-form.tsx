'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useLanguage } from '@/contexts/language-context';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useUserSettings } from '@/contexts/user-settings-context';
import { useTestimonials } from '@/contexts/testimonials-context';

export default function FeedbackForm() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { settings } = useUserSettings();
  const { addTestimonial } = useTestimonials();

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleRating = (rate: number) => {
    setRating(rate);
  };

  const handleFeedbackSubmit = () => {
    if (rating > 0 && feedback) {
      addTestimonial({
        name: settings.profile.name || 'Anonymous User',
        avatar: settings.profile.avatar,
        rating,
        text: feedback,
      });

      toast({
        title: t('feedbackpage.form.thanksTitle'),
        description: t('feedbackpage.form.thanksDescription'),
      });

      // Reset form
      setRating(0);
      setFeedback('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-headline">
          {t('feedbackpage.title')}
        </CardTitle>
        <CardDescription>{t('feedbackpage.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>{t('feedbackpage.form.ratingLabel')}</Label>
            <div className="mt-2 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => handleRating(star)}>
                  <Star
                    className={cn(
                      'h-8 w-8 cursor-pointer transition-colors',
                      rating >= star
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-muted-foreground/50 hover:text-muted-foreground'
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="feedback-text">
              {t('feedbackpage.form.commentLabel')}
            </Label>
            <Textarea
              id="feedback-text"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={t('feedbackpage.form.commentPlaceholder')}
              className="mt-2"
              rows={5}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleFeedbackSubmit}
          disabled={rating === 0 || !feedback}
        >
          {t('feedbackpage.form.submitButton')}
        </Button>
      </CardFooter>
    </Card>
  );
}
