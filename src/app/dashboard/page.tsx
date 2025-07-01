import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <h1 className="font-headline text-3xl font-bold">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Macronutrients</CardTitle>
            <CardDescription>Your main energy sources for today.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-1 flex justify-between">
                <span>Calories</span>
                <span className="font-medium">1,234 / 2,000 kcal</span>
              </div>
              <Progress value={62} />
            </div>
            <div>
              <div className="mb-1 flex justify-between">
                <span>Protein</span>
                <span className="font-medium">80 / 120 g</span>
              </div>
              <Progress value={66} />
            </div>
            <div>
              <div className="mb-1 flex justify-between">
                <span>Carbs</span>
                <span className="font-medium">150 / 250 g</span>
              </div>
              <Progress value={60} />
            </div>
            <div>
              <div className="mb-1 flex justify-between">
                <span>Fats</span>
                <span className="font-medium">45 / 70 g</span>
              </div>
              <Progress value={64} />
            </div>
             <div>
              <div className="mb-1 flex justify-between">
                <span>Fiber</span>
                <span className="font-medium">15 / 30 g</span>
              </div>
              <Progress value={50} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Micronutrients</CardTitle>
            <CardDescription>Essential vitamins and minerals.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div className="text-sm">
              <p className="text-muted-foreground">Sodium</p>
              <p className="font-medium">1500 / 2300 mg</p>
            </div>
            <div className="text-sm">
              <p className="text-muted-foreground">Sugar</p>
              <p className="font-medium">40 / 50 g</p>
            </div>
            <div className="text-sm">
              <p className="text-muted-foreground">Potassium</p>
              <p className="font-medium">2000 / 3500 mg</p>
            </div>
            <div className="text-sm">
              <p className="text-muted-foreground">Vitamin C</p>
              <p className="font-medium">75 / 90 mg</p>
            </div>
             <div className="text-sm">
              <p className="text-muted-foreground">Calcium</p>
              <p className="font-medium">800 / 1000 mg</p>
            </div>
             <div className="text-sm">
              <p className="text-muted-foreground">Iron</p>
              <p className="font-medium">10 / 18 mg</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Daily Log</CardTitle>
             <Link href="/add-food">
                <Button size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Food
                </Button>
            </Link>
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
