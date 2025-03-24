
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import AnimatedGradient from './ui/AnimatedGradient';
import GlassMorphism from './ui/GlassMorphism';
import { ArrowRight, Bot, BrainCircuit } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative pt-24 pb-20 overflow-hidden sm:py-32">
      {/* Background gradient */}
      <AnimatedGradient 
        className="absolute top-0 left-0 right-0 bottom-0 opacity-20" 
        colors={['#8B5CF6', '#EC4899', '#3B82F6']}
      />
      
      <div className="container px-4 mx-auto relative z-10">
        <div className="flex flex-col items-center text-center">
          <GlassMorphism className="inline-flex items-center px-4 py-2 mb-8 rounded-full" intensity="light">
            <span className="text-sm font-medium text-primary">
              AI-powered development assistant
            </span>
          </GlassMorphism>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 gradient-text tracking-tight">
            All-in-One AI <br />Development Agent
          </h1>
          
          <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mb-8">
            Build, automate, and optimize digital solutions using AI. Generate code, create automation workflows, and develop custom AI agents for your projects.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button size="lg" className="gap-2 group" asChild>
              <Link to="/signup">
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/dashboard">Try Demo</Link>
            </Button>
          </div>
          
          <GlassMorphism className="p-4 max-w-4xl w-full" intensity="medium">
            <div className="aspect-video relative overflow-hidden rounded-lg border border-foreground/10 bg-gradient-to-br from-background to-secondary/10">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex items-center justify-center space-x-4">
                  <Bot className="h-12 w-12 text-primary animate-pulse-slow" />
                  <span className="text-xl font-medium">AI Development Agent</span>
                </div>
              </div>
            </div>
          </GlassMorphism>
        </div>
      </div>
    </section>
  );
};

const BrainCircuitIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <BrainCircuit className={className} />
  );
};

export default Hero;
