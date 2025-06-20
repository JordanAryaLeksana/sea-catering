"use client";

import { Star, Clock, Users, ChefHat, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

// Sample meal plans data with elegant themes
const mealPlans = [
  {
    id: 1,
    name: "Ocean Fresh Premium",
    price: "IDR 450,000",
    description: "Fresh seafood and premium ingredients delivered weekly",
    image: "🐟",
  },
  {
    id: 2,
    name: "Garden Fresh Healthy",
    price: "IDR 320,000",
   
    description: "Nutritionally balanced meals with fresh garden vegetables",
    image: "🥗",
  },
  {
    id: 3,
    name: "Family Feast Delight",
    price: "IDR 680,000",
   
    description: "Perfect for family gatherings with colorful variety",
    image: "👨‍👩‍👧‍👦",
  },
  {
    id: 4,
    name: "Executive Energy",
    price: "IDR 280,000",
    description: "Professional lunch solutions with vibrant nutrition",
    image: "💼",
  }
];

export default function MealPlansPage() {

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 opacity-10"></div>
        <div className="relative mx-8 lg:mx-16 xl:mx-24 py-20 text-center">
          <div className="inline-block p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg mb-8">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
              Our Meal Plans
            </h1>
            <p className="text-xl md:text-2xl text-amber-800 max-w-2xl mx-auto font-light">
              Discover premium catering solutions tailored for every occasion
            </p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-orange-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-8 lg:mx-16 xl:mx-24 py-16">
        {/* Meal Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {mealPlans.map((plan, index) => (
            <Card 
              key={plan.id} 
              className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white/90 backdrop-blur-sm"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 to-orange-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {plan.popular && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="relative z-10 pb-4">
                <div className="text-6xl text-center mb-6 transform group-hover:scale-110 transition-transform duration-500 filter drop-shadow-lg">
                  {plan.image}
                </div>
                <CardTitle className="text-xl font-bold text-center text-amber-800 group-hover:text-orange-600 transition-colors duration-300">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-center text-amber-600 font-medium">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="relative z-10 space-y-6">
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    {plan.price}
                  </div>
                  <Badge variant="secondary" className="bg-yellow-100 text-amber-800 border-amber-200">
                    {plan.duration}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-sm text-amber-700">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
                      <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                      <span className="font-medium">{plan.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-orange-100 px-2 py-1 rounded-full">
                    <Users className="h-3 w-3 text-orange-600" />
                    <span className="font-medium text-orange-700">{plan.servings}</span>
                  </div>
                </div>

                <Separator className="bg-gradient-to-r from-yellow-200 to-orange-200" />
              </CardContent>

              <CardFooter className="relative z-10 flex gap-3 pt-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 border-0">
                      See Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-gradient-to-br from-yellow-50 to-orange-50 border-0">
                    <DialogHeader>
                      <div className="text-4xl text-center mb-4 filter drop-shadow-lg">{plan.image}</div>
                      <DialogTitle className="text-2xl text-center text-amber-800">{plan.name}</DialogTitle>
                      <DialogDescription className="text-center text-lg text-amber-600 font-medium">
                        {plan.description}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 mt-6">
                      <div className="flex justify-between items-center">
                        <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                          {plan.price}
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            <span className="font-medium text-amber-700">{plan.rating} rating</span>
                          </div>
                          <div className="flex items-center gap-1 bg-orange-100 px-3 py-1 rounded-full">
                            <Users className="h-4 w-4 text-orange-600" />
                            <span className="font-medium text-orange-700">{plan.servings}</span>
                          </div>
                        </div>
                      </div>

                      <Separator className="bg-gradient-to-r from-yellow-200 to-orange-200" />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4 bg-white/60 backdrop-blur-sm p-4 rounded-xl">
                          <h4 className="font-semibold flex items-center gap-2 text-amber-800">
                            <ChefHat className="h-4 w-4 text-orange-600" />
                            What's Included
                          </h4>
                          <ul className="space-y-2">
                            {plan.details.includes.map((item, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm text-amber-700">
                                <div className="h-2 w-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-4 bg-white/60 backdrop-blur-sm p-4 rounded-xl">
                          <h4 className="font-semibold flex items-center gap-2 text-amber-800">
                            <Heart className="h-4 w-4 text-orange-600" />
                            Nutrition Info
                          </h4>
                          <p className="text-sm text-amber-700">{plan.details.nutrition}</p>
                          
                          <h4 className="font-semibold flex items-center gap-2 mt-4 text-amber-800">
                            <Clock className="h-4 w-4 text-orange-600" />
                            Delivery
                          </h4>
                          <p className="text-sm text-amber-700">{plan.details.delivery}</p>
                        </div>
                      </div>

                      <Separator className="bg-gradient-to-r from-yellow-200 to-orange-200" />

                      <div className="space-y-3 bg-white/60 backdrop-blur-sm p-4 rounded-xl">
                        <h4 className="font-semibold text-amber-800">Customization Options</h4>
                        <p className="text-sm text-amber-700">{plan.details.customization}</p>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                          Subscribe Now
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1 border-amber-300 text-amber-700 hover:bg-yellow-50 hover:border-amber-400"
                        >
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-20">
          <Card className="bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 text-white border-0 shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
            <CardContent className="relative z-10 p-12 text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 max-w-3xl mx-auto">
                <h3 className="text-3xl font-bold mb-6 text-white drop-shadow-lg">
                  Need a Custom Plan?
                </h3>
                <p className="text-white/90 mb-8 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                  Cant find the perfect meal plan? Let us create a customized solution that perfectly matches your needs and preferences.
                </p>
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="bg-white text-amber-700 hover:bg-yellow-50 font-medium shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3"
                >
                  Contact Our Chefs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}