
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Utensils, Upload, Video, X, Loader2, SwitchCamera, Percent, Barcode, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analyzeFoodImage, type NutritionalInfo } from '@/ai/flows/analyze-food-image';
import { analyzeDishName } from '@/ai/flows/analyze-dish-name';
import { analyzeBarcode } from '@/ai/flows/analyze-barcode';
import { useLanguage } from '@/contexts/language-context';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useMealLog, type MealType } from '@/contexts/meal-log-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserSettings } from '@/contexts/user-settings-context';
import { Badge } from '@/components/ui/badge';

export default function AddFoodPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { addMeal } = useMealLog();
  const { addPositiveFeedback, addNegativeFeedback } = useUserSettings();

  // Form state
  const [image, setImage] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [portionSize, setPortionSize] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<NutritionalInfo | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mealType, setMealType] = useState<MealType>('snack');
  const [loggedMealForFeedback, setLoggedMealForFeedback] = useState<NutritionalInfo | null>(null);

  // Camera state
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | undefined>(undefined);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = useCallback(() => {
    setImage(null);
    setDescription('');
    setPortionSize('');
    setIsAnalyzing(false);
    setAnalysisResult(null);
    setImagePreview(null);
    setMealType('snack');
    setLoggedMealForFeedback(null);
  }, []);
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setAnalysisResult(null);
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
  
  const handleAnalyze = async (mode: 'photo' | 'describe' | 'barcode') => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      let result: NutritionalInfo;
      if (mode === 'photo') {
        if (!image) return;
        const photoDataUri = await toDataUri(image);
        result = await analyzeFoodImage({ photoDataUri, portionSize });
      } else if (mode === 'describe') {
        if (!description) return;
        result = await analyzeDishName({ description, portionSize });
      } else { // barcode
        if (!image) return;
        const photoDataUri = await toDataUri(image);
        result = await analyzeBarcode({ photoDataUri });
      }
      setAnalysisResult(result);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('addFood.toastErrorTitle'),
        description: 
            mode === 'photo' ? t('addFood.toastErrorPhoto') :
            mode === 'describe' ? t('addFood.toastErrorDescription') :
            t('addFood.toastErrorBarcode'),
      });
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLogMeal = () => {
    if (!analysisResult) return;
    addMeal({
      ...analysisResult,
      photoDataUri: imagePreview, // Use the preview which could be from file or camera
      mealType,
    });
    toast({
      title: t('addFood.logSuccessTitle'),
      description: t('addFood.logSuccessDescription').replace('{dishName}', analysisResult.dishName),
    });
    setLoggedMealForFeedback(analysisResult);
    setAnalysisResult(null);
    setImage(null);
    setImagePreview(null);
    setDescription('');
    setPortionSize('');
  };
  
  const handleFeedback = (isPositive: boolean) => {
    if (!loggedMealForFeedback) return;
    const dishName = loggedMealForFeedback.dishName;

    if (isPositive) {
      addPositiveFeedback(dishName);
    } else {
      addNegativeFeedback(dishName);
    }

    toast({
      description: t('addFood.feedback.thanks'),
    });

    setLoggedMealForFeedback(null);
  };


  // Camera Logic
  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const getCameraPermission = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode } });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
      }
    };
    
    if (isCameraOpen) {
      getCameraPermission();
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const currentStream = videoRef.current.srcObject as MediaStream;
        currentStream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      } else if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraOpen, facingMode]);
  
  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => {
          if (blob) {
            const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
          }
        }, 'image/jpeg');
        setIsCameraOpen(false);
        setAnalysisResult(null);
      }
    }
  };

  const handleSwitchCamera = () => {
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
  };

  const renderNutrient = (label: string, value: number, unit: string) => (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value.toLocaleString()} {unit}</span>
    </div>
  );

  return (
    <div className="container mx-auto max-w-2xl p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-headline">{t('addFood.title')}</CardTitle>
          <CardDescription>{t('addFood.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="photo" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="photo" onClick={resetForm}>
                <Camera className="mx-2" />
                {t('addFood.tabPhoto')}
              </TabsTrigger>
              <TabsTrigger value="describe" onClick={resetForm}>
                <Utensils className="mx-2" />
                {t('addFood.tabDescribe')}
              </TabsTrigger>
              <TabsTrigger value="barcode" onClick={resetForm}>
                <Barcode className="mx-2" />
                {t('addFood.tabBarcode')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="photo">
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                   <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                     <Upload className="mx-2"/>{t('addFood.uploadFromDevice')}
                   </Button>
                   <Input id="picture" type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="hidden" />
                   <Button variant="outline" onClick={() => setIsCameraOpen(true)}>
                     <Video className="mx-2"/>{t('addFood.useCamera')}
                   </Button>
                </div>

                {imagePreview && (
                  <div className="mt-4">
                    <p className="text-sm font-medium">{t('addFood.preview')}</p>
                    <img
                      src={imagePreview}
                      alt="Food preview"
                      className="mt-2 max-h-64 w-full rounded-md object-contain"
                    />
                  </div>
                )}
                
                {image && !analysisResult && (
                  <>
                    <div>
                      <Label htmlFor="photo-portion">{t('addFood.portionLabel')} <span className="text-muted-foreground text-xs">{t('addFood.portionSizeOptional')}</span></Label>
                      <Input
                        id="photo-portion"
                        placeholder={t('addFood.portionPlaceholder')}
                        value={portionSize}
                        onChange={(e) => setPortionSize(e.target.value)}
                      />
                    </div>
                    <Button onClick={() => handleAnalyze('photo')} disabled={isAnalyzing} className="w-full">
                      {isAnalyzing ? <><Loader2 className="animate-spin" /> {t('addFood.analyzing')}</> : t('addFood.analyzePhotoButton')}
                    </Button>
                  </>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="describe">
              <div className="space-y-4 pt-4">
                {!analysisResult && (
                    <>
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
                      <Label htmlFor="describe-portion">{t('addFood.portionLabel')} <span className="text-muted-foreground text-xs">{t('addFood.portionSizeOptional')}</span></Label>
                      <Input
                        id="describe-portion"
                        placeholder={t('addFood.portionPlaceholder')}
                        value={portionSize}
                        onChange={(e) => setPortionSize(e.target.value)}
                      />
                    </div>
                    <Button
                      onClick={() => handleAnalyze('describe')}
                      disabled={!description || isAnalyzing}
                      className="w-full"
                    >
                      {isAnalyzing ? <><Loader2 className="animate-spin" /> {t('addFood.analyzing')}</> : t('addFood.analyzeDescriptionButton')}
                    </Button>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="barcode">
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                   <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                     <Upload className="mx-2"/>{t('addFood.uploadFromDevice')}
                   </Button>
                   <Input id="barcode-picture" type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="hidden" />
                   <Button variant="outline" onClick={() => setIsCameraOpen(true)}>
                     <Video className="mx-2"/>{t('addFood.useCamera')}
                   </Button>
                </div>

                {imagePreview && (
                  <div className="mt-4">
                    <p className="text-sm font-medium">{t('addFood.preview')}</p>
                    <img
                      src={imagePreview}
                      alt="Barcode preview"
                      className="mt-2 max-h-64 w-full rounded-md object-contain"
                    />
                  </div>
                )}
                
                {image && !analysisResult && (
                  <Button onClick={() => handleAnalyze('barcode')} disabled={isAnalyzing} className="w-full">
                    {isAnalyzing ? <><Loader2 className="animate-spin" /> {t('addFood.analyzing')}</> : t('addFood.analyzeBarcodeButton')}
                  </Button>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {isAnalyzing && (
            <div className="flex items-center justify-center gap-2 p-8 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>{t('addFood.analyzing')}</span>
            </div>
          )}

          {analysisResult && (
            <Card className="mt-6">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{t('addFood.analysisResultTitle')}: {analysisResult.dishName}</CardTitle>
                   <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                       <Percent className="h-4 w-4" />
                       <span>{t('addFood.nutrients.confidence')}: {(analysisResult.confidence * 100).toFixed(0)}%</span>
                   </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysisResult.ingredients && analysisResult.ingredients.length > 0 && (
                  <div>
                    <h4 className="mb-2 font-semibold">{t('dashboard.suggestions.ingredients')}</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.ingredients.map((ingredient, index) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {ingredient}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="mb-2 font-semibold">{t('dashboard.suggestions.nutrition')}</h4>
                  <div className="space-y-2">
                    {renderNutrient(t('addFood.nutrients.calories'), analysisResult.calories, 'kcal')}
                    {renderNutrient(t('addFood.nutrients.protein'), analysisResult.protein, 'g')}
                    {renderNutrient(t('addFood.nutrients.carbs'), analysisResult.carbs, 'g')}
                    {renderNutrient(t('addFood.nutrients.fats'), analysisResult.fats, 'g')}
                    {renderNutrient(t('addFood.nutrients.fiber'), analysisResult.fiber, 'g')}
                    {renderNutrient(t('addFood.nutrients.sugar'), analysisResult.sugar, 'g')}
                    {renderNutrient(t('addFood.nutrients.sodium'), analysisResult.sodium, 'mg')}
                    {renderNutrient(t('addFood.nutrients.potassium'), analysisResult.potassium, 'mg')}
                    {renderNutrient(t('addFood.nutrients.calcium'), analysisResult.calcium, 'mg')}
                    {renderNutrient(t('addFood.nutrients.iron'), analysisResult.iron, 'mg')}
                    {renderNutrient(t('addFood.nutrients.vitaminC'), analysisResult.vitaminC, 'mg')}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col items-stretch gap-4">
                <div>
                  <Label htmlFor="meal-type">{t('addFood.mealTypeLabel')}</Label>
                  <Select
                    value={mealType}
                    onValueChange={(value) => setMealType(value as MealType)}
                  >
                    <SelectTrigger id="meal-type">
                      <SelectValue placeholder={t('addFood.mealTypeLabel')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">{t('addFood.mealTypes.breakfast')}</SelectItem>
                      <SelectItem value="lunch">{t('addFood.mealTypes.lunch')}</SelectItem>
                      <SelectItem value="dinner">{t('addFood.mealTypes.dinner')}</SelectItem>
                      <SelectItem value="snack">{t('addFood.mealTypes.snack')}</SelectItem>
                      <SelectItem value="dessert">{t('addFood.mealTypes.dessert')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleLogMeal} className="w-full">{t('addFood.logMealButton')}</Button>
              </CardFooter>
            </Card>
          )}

          {loggedMealForFeedback && (
            <Card className="mt-6 border-dashed border-primary/50">
              <CardHeader className="text-center">
                <CardTitle className="text-lg">
                  {t('addFood.feedback.question').replace('{dishName}', loggedMealForFeedback.dishName)}
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-14 w-14 rounded-full border-2 hover:bg-green-100 dark:hover:bg-green-900/50"
                  onClick={() => handleFeedback(true)}
                >
                  <ThumbsUp className="h-7 w-7 text-green-600" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-14 w-14 rounded-full border-2 hover:bg-red-100 dark:hover:bg-red-900/50"
                  onClick={() => handleFeedback(false)}
                >
                  <ThumbsDown className="h-7 w-7 text-red-600" />
                </Button>
              </CardFooter>
            </Card>
          )}

        </CardContent>
      </Card>

      <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('addFood.cameraDialogTitle')}</DialogTitle>
          </DialogHeader>
          {hasCameraPermission === false ? (
            <Alert variant="destructive">
              <AlertTitle>{t('addFood.cameraErrorTitle')}</AlertTitle>
              <AlertDescription>{t('addFood.cameraErrorDescription')}</AlertDescription>
            </Alert>
          ) : (
            <>
              <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted playsInline />
              <canvas ref={canvasRef} className="hidden" />
            </>
          )}
          <DialogFooter className="sm:justify-between">
            <Button variant="ghost" size="icon" onClick={handleSwitchCamera} disabled={!hasCameraPermission} type="button" aria-label={t('addFood.switchCamera')}>
               <SwitchCamera />
            </Button>
            <div className="flex gap-2">
               <Button variant="secondary" onClick={() => setIsCameraOpen(false)}><X className="mr-2"/>{t('addFood.cameraCloseButton')}</Button>
               <Button onClick={handleCapture} disabled={!hasCameraPermission}><Camera className="mr-2"/>{t('addFood.cameraCaptureButton')}</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
