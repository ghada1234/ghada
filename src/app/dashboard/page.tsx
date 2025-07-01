import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <h1 className="font-headline text-3xl font-bold">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Today's Summary</CardTitle>
            <CardDescription>Your nutritional intake for today.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <span>Calories</span>
              <span className="font-medium">1,234 / 2,000 kcal</span>
            </div>
            <div className="mt-2 flex justify-between">
              <span>Protein</span>
              <span className="font-medium">80 / 120 g</span>
            </div>
            <div className="mt-2 flex justify-between">
              <span>Carbs</span>
              <span className="font-medium">150 / 250 g</span>
            </div>
            <div className="mt-2 flex justify-between">
              <span>Fats</span>
              <span className="font-medium">45 / 70 g</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Daily Log</CardTitle>
            <Button size="sm">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Food
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">You haven't logged any food today.</p>
            <img 
              src="https://placehold.co/600x400.png" 
              alt="Empty plate" 
              className="mt-4 rounded-md"
              data-ai-hint="empty plate"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Meal Suggestions</CardTitle>
            <CardDescription>Personalized meal ideas for you.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
                <li>
                  <span className="font-semibold">Breakfast:</span> Greek Yogurt with Berries
                </li>
                <li>
                  <span className="font-semibold">Lunch:</span> Grilled Chicken Salad
                </li>
                <li>
                  <span className="font-semibold">Dinner:</span> Salmon with Quinoa & Asparagus
                </li>
            </ul>
            <Button variant="outline" className="mt-4 w-full">Generate New Ideas</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
