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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function AboutPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleRating = (rate: number) => {
    setRating(rate);
  };

  const handleFeedbackSubmit = () => {
    // In a real app, this would be sent to a server.
    // For this prototype, we just show a thank you message.
    toast({
      title: t('about.feedback.thanksTitle'),
      description: t('about.feedback.thanksDescription'),
    });
    setRating(0);
    setFeedback('');
  };

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-headline">
              {t('about.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
              <div className="flex-shrink-0">
                <Avatar className="h-40 w-40">
                  <AvatarFallback>
                    <User className="h-20 w-20" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="space-y-4">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {t('about.story.p1')}
                </p>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {t('about.story.p2')}
                </p>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {t('about.story.p3')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">
              {t('about.feedback.title')}
            </CardTitle>
            <CardDescription>
              {t('about.feedback.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>{t('about.feedback.ratingLabel')}</Label>
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
                  {t('about.feedback.commentLabel')}
                </Label>
                <Textarea
                  id="feedback-text"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder={t('about.feedback.commentPlaceholder')}
                  className="mt-2"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleFeedbackSubmit} disabled={rating === 0}>
              {t('about.feedback.submitButton')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
