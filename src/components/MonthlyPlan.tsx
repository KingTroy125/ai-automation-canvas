import { ArrowRight, CircleCheck } from "lucide-react";
import { useState } from "react";

// Change imports to relative paths for Vite
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import AnimatedGradient from "./ui/AnimatedGradient";
import GlassMorphism from "./ui/GlassMorphism";

interface PricingFeature {
  text: string;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: string;
  yearlyPrice: string;
  features: PricingFeature[];
  button: {
    text: string;
    url: string;
  };
}

interface Pricing2Props {
  heading?: string;
  description?: string;
  plans?: PricingPlan[];
}

const Pricing2 = ({
  heading = "Pricing",
  description = "Check out our affordable pricing plans",
  plans = [
    {
      id: "Free",
      name: "Free",
      description: "For individuals just getting started",
      monthlyPrice: "$0",
      yearlyPrice: "$0",
      features: [
        { text: "100 AI requests per month" },
        { text: "Basic chat assistant" },
        { text: "5 MB file uploads" },
        { text: "Community support" },
      ],
      button: {
        text: "Purchase",
        url: "https://www.shadcnblocks.com",
      },
    },
    {
      id: "plus",
      name: "Plus",
      description: "For Professionals and small terms",
      monthlyPrice: "$19",
      yearlyPrice: "$15",
      features: [
        { text: "5,000 AI requests per month" },
        { text: "Advanced chat assisstant" },
        { text: "Code generation & analysis" },
        { text: "100 MB file uploads" },
        { text: "Document analysis"},
        { text: "Email support"},
      ],
      button: {
        text: "Purchase",
        url: "https://www.shadcnblocks.com",
      },
    },
    {
      id: "pro",
      name: "Pro",
      description: "For large terms and organizations",
      monthlyPrice: "$49",
      yearlyPrice: "$35",
      features: [
        { text: "Unlimited AI requests" },
        { text: "All Pro features" },
        { text: "Custom Ai agents" },
        { text: "Workflow automation" },
        { text: "1 GB file uploads"},
        { text: "API access"},
        { text: "Priority support"},
        { text: "Custom intergrations"},
      ],
      button: {
        text: "Purchase",
        url: "https://www.shadcnblocks.com",
      },
    },
  ],
}: Pricing2Props) => {
  const [isYearly, setIsYearly] = useState(false);
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background gradient */}
      <AnimatedGradient 
        className="absolute top-0 left-0 right-0 bottom-0 opacity-20" 
        colors={['#8B5CF6', '#EC4899', '#3B82F6']}
      />
      
      <div className="container relative z-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
          <h2 className="text-4xl font-bold text-pretty lg:text-6xl">
            {heading}
          </h2>
          <p className="text-muted-foreground lg:text-xl">{description}</p>
          <GlassMorphism className="inline-flex items-center px-6 py-3 rounded-full" intensity="light">
            <div className="flex items-center gap-3 text-lg">
              Monthly
              <Switch
                checked={isYearly}
                onCheckedChange={() => setIsYearly(!isYearly)}
              />
              Yearly
            </div>
          </GlassMorphism>
          <div className="flex flex-col items-stretch gap-6 md:flex-row">
            {plans.map((plan) => (
              <GlassMorphism
                key={plan.id}
                className="flex w-80 flex-col justify-between text-left rounded-lg p-0 overflow-hidden"
                intensity="medium"
              >
                <div className="flex flex-col h-full">
                  <CardHeader>
                    <CardTitle>
                      <p>{plan.name}</p>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                    <span className="text-4xl font-bold">
                      {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                    </span>
                    <p className="text-muted-foreground">
                      Billed{" "}
                      {isYearly
                        ? `${Number(plan.yearlyPrice.slice(1)) * 12}`
                        : `${Number(plan.monthlyPrice.slice(1)) * 12}`}{" "}
                      annually
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Separator className="mb-6" />
                    {plan.id === "pro" && (
                      <p className="mb-3 font-semibold">
                        Everything in Plus, and:
                      </p>
                    )}
                    <ul className="space-y-4">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CircleCheck className="size-4" />
                          <span>{feature.text}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Button asChild className="w-full">
                      <a href={plan.button.url} target="_blank">
                        {plan.button.text}
                        <ArrowRight className="ml-2 size-4" />
                      </a>
                    </Button>
                  </CardFooter>
                </div>
              </GlassMorphism>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing2;