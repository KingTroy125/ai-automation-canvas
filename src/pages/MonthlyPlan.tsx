
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronsUpDown, Crown, Sparkles, Zap } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const MonthlyPlan: React.FC = () => {
  const handleUpgrade = (plan: string) => {
    toast.success(`Upgrading to ${plan} plan! (Demo only)`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscription Plans</h1>
          <p className="text-muted-foreground mt-2">
            Choose the right plan for your needs
          </p>
        </div>
        
        <div className="flex items-center justify-center mb-8">
          <Tabs defaultValue="monthly" className="w-[300px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">
                Yearly
                <Badge variant="secondary" className="ml-2 px-1 text-xs">
                  20% off
                </Badge>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="monthly"></TabsContent>
            <TabsContent value="yearly"></TabsContent>
          </Tabs>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Free Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Free
                <Badge variant="outline">
                  Current Plan
                </Badge>
              </CardTitle>
              <CardDescription>
                For individuals just getting started
              </CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">$0</span>
                <span className="text-muted-foreground ml-1">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 my-4">
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span>100 AI requests per month</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span>Basic chat assistant</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span>5 MB file uploads</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span>Community support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled>
                Current Plan
              </Button>
            </CardFooter>
          </Card>
          
          {/* Pro Plan */}
          <Card className="border-primary/50 shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  Pro
                  <Zap className="h-5 w-5 ml-2 text-yellow-500" />
                </CardTitle>
                <Badge className="bg-primary text-primary-foreground hover:bg-primary/80">
                  Popular
                </Badge>
              </div>
              <CardDescription>
                For professionals and small teams
              </CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">$19</span>
                <span className="text-muted-foreground ml-1">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 my-4">
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span>5,000 AI requests per month</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span>Advanced chat assistant</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span>Code generation & analysis</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span>100 MB file uploads</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span>Document analysis</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span>Email support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handleUpgrade('Pro')}>
                Upgrade to Pro
              </Button>
            </CardFooter>
          </Card>
          
          {/* Enterprise Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                Enterprise
                <Crown className="h-5 w-5 ml-2 text-purple-500" />
              </CardTitle>
              <CardDescription>
                For large teams and organizations
              </CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">$99</span>
                <span className="text-muted-foreground ml-1">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 my-4">
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span>Unlimited AI requests</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span>All Pro features</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span>Custom AI agents</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span>Workflow automation</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span>1 GB file uploads</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span>API access</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span>Custom integrations</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => handleUpgrade('Enterprise')}>
                Upgrade to Enterprise
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What happens when I reach my monthly request limit?</AccordionTrigger>
              <AccordionContent>
                When you reach your monthly request limit, you'll be notified and will have the option to upgrade to a higher plan. You won't be able to make additional AI requests until the next billing cycle or until you upgrade your plan.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>Can I cancel my subscription at any time?</AccordionTrigger>
              <AccordionContent>
                Yes, you can cancel your subscription at any time from your account settings. Your subscription will remain active until the end of your current billing period, and you won't be charged again after that.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
              <AccordionContent>
                We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and most popular cryptocurrency payments. For Enterprise plans, we also offer invoicing and wire transfer options.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger>Are there any discounts for annual subscriptions?</AccordionTrigger>
              <AccordionContent>
                Yes, we offer a 20% discount when you choose an annual subscription plan instead of monthly billing. This is a great way to save if you're planning to use our service long-term.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger>Do you offer a free trial for paid plans?</AccordionTrigger>
              <AccordionContent>
                We offer a 14-day free trial for the Pro plan so you can experience all the features before committing. For Enterprise plans, we offer a custom demo and trial period. Contact our sales team for more information.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        <div className="bg-primary/5 rounded-lg p-6 mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-primary" />
                Need a custom plan?
              </h3>
              <p className="text-muted-foreground">
                Contact us for custom enterprise solutions tailored to your organization
              </p>
            </div>
            <Button variant="outline" className="min-w-[150px]">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MonthlyPlan;
