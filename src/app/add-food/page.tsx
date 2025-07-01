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

export default function AddFoodPage() {
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
        title: 'Analysis Complete!',
        description: `${result.dishName} (${result.calories} kcal) has been logged.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Could not analyze the photo. Please try again.',
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
        title: 'Analysis Complete!',
        description: `${result.dishName} (${result.calories} kcal) has been logged.`,
      });
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Could not analyze the description. Please try again.',
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
          <CardTitle className="text-3xl font-headline">Log Your Meal</CardTitle>
          <CardDescription>
            Add a meal by snapping a photo or describing it. Our AI will handle the rest.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="photo" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="photo">
                <Camera className="mr-2" />
                Snap a Photo
              </TabsTrigger>
              <TabsTrigger value="describe">
                <Utensils className="mr-2" />
                Describe Meal
              </TabsTrigger>
            </TabsList>
            <TabsContent value="photo">
              <div className="space-y-4 pt-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="picture">Upload Photo</Label>
                  <Input id="picture" type="file" accept="image/*" onChange={handleImageChange} />
                </div>
                <div>
                  <Label htmlFor="photo-portion">Portion Size</Label>
                  <Input
                    id="photo-portion"
                    placeholder="e.g., 1 cup, 100g, 1 slice"
                    value={portionSize}
                    onChange={(e) => setPortionSize(e.target.value)}
                  />
                </div>
                {image && (
                  <div className="mt-4">
                    <p className="text-sm font-medium">Preview:</p>
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Food preview"
                      className="mt-2 max-h-64 rounded-md object-contain"
                    />
                  </div>
                )}
                <Button onClick={handleAnalyzePhoto} disabled={!image || !portionSize || isAnalyzing} className="w-full">
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Photo'}
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="describe">
               <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="description">Meal Description</Label>
                  <Input
                    id="description"
                    placeholder="e.g., A bowl of oatmeal with berries and nuts"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="describe-portion">Portion Size</Label>
                  <Input
                    id="describe-portion"
                    placeholder="e.g., 1 cup, 100g, 1 slice"
                    value={portionSize}
                    onChange={(e) => setPortionSize(e.target.value)}
                  />
                </div>
                 <Button onClick={handleAnalyzeDescription} disabled={!description || !portionSize || isAnalyzing} className="w-full">
                   {isAnalyzing ? 'Analyzing...' : 'Analyze Description'}
                 </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
