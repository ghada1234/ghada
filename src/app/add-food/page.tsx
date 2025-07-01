'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Utensils } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analyzeFoodImage } from '@/ai/flows/analyze-food-image';
import { analyzeDishName } from '@/ai/flows/analyze-dish-name';
import { useLanguage } from '@/contexts/language-context';

export default function AddFoodPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [image, setImage] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [portionSize, setPortionSize] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const toDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleAnalyzePhoto = async () => {
    if (!image || !portionSize) return;

    setIsAnalyzing(true);
    try {
      const photoDataUri = await toDataUri(image);
      const result = await analyzeFoodImage({ photoDataUri, portionSize });
      toast({
        title: t('addFood.toastSuccessTitle'),
        description: t('addFood.toastSuccessDescription')
          .replace('{dishName}', result.dishName)
          .replace('{calories}', result.calories.toString()),
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('addFood.toastErrorTitle'),
        description: t('addFood.toastErrorPhoto'),
      });
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeDescription = async () => {
    if (!description || !portionSize) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzeDishName({ description, portionSize });
      toast({
        title: t('addFood.toastSuccessTitle'),
        description: t('addFood.toastSuccessDescription')
          .replace('{dishName}', result.dishName)
          .replace('{calories}', result.calories.toString()),
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('addFood.toastErrorTitle'),
        description: t('addFood.toastErrorDescription'),
      });
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-headline">{t('addFood.title')}</CardTitle>
          <CardDescription>{t('addFood.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="photo" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="photo">
                <Camera className="mx-2" />
                {t('addFood.tabPhoto')}
              </TabsTrigger>
              <TabsTrigger value="describe">
                <Utensils className="mx-2" />
                {t('addFood.tabDescribe')}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="photo">
              <div className="space-y-4 pt-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="picture">{t('addFood.uploadLabel')}</Label>
                  <Input id="picture" type="file" accept="image/*" onChange={handleImageChange} />
                </div>
                <div>
                  <Label htmlFor="photo-portion">{t('addFood.portionLabel')}</Label>
                  <Input
                    id="photo-portion"
                    placeholder={t('addFood.portionPlaceholder')}
                    value={portionSize}
                    onChange={(e) => setPortionSize(e.target.value)}
                  />
                </div>
                {image && (
                  <div className="mt-4">
                    <p className="text-sm font-medium">{t('addFood.preview')}</p>
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Food preview"
                      className="mt-2 max-h-64 rounded-md object-contain"
                    />
                  </div>
                )}
                <Button onClick={handleAnalyzePhoto} disabled={!image || !portionSize || isAnalyzing} className="w-full">
                  {isAnalyzing ? t('addFood.analyzing') : t('addFood.analyzePhotoButton')}
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="describe">
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="description">{t('addFood.descriptionLabel')}</Label>
                  <Input
                    id="description"
                    placeholder={t('addFood.descriptionPlaceholder')}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="describe-portion">{t('addFood.portionLabel')}</Label>
                  <Input
                    id="describe-portion"
                    placeholder={t('addFood.portionPlaceholder')}
                    value={portionSize}
                    onChange={(e) => setPortionSize(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleAnalyzeDescription}
                  disabled={!description || !portionSize || isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? t('addFood.analyzing') : t('addFood.analyzeDescriptionButton')}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
