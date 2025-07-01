'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Utensils } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AddFoodPage() {
  const { toast } = useToast();
  const [image, setImage] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    // Placeholder for AI analysis
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
    setIsAnalyzing(false);
    toast({
      title: 'Analysis Complete!',
      description: 'Your meal has been logged.',
    });
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
                <Button onClick={handleAnalyze} disabled={!image || isAnalyzing} className="w-full">
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
                 <Button onClick={handleAnalyze} disabled={!description || isAnalyzing} className="w-full">
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
