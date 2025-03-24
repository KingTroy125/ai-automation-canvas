
import React, { useEffect, useRef } from 'react';
import { Button } from './ui/button';
import AnimatedGradient from './ui/AnimatedGradient';
import GlassMorphism from './ui/GlassMorphism';
import { ArrowRight, Code, Workflow, Bot, Zap, Layers, Layout } from 'lucide-react';

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            entry.target.classList.remove('opacity-0');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const elements = containerRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => {
      observer.observe(el);
    });
    
    return () => {
      elements?.forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);

  return (
    <section className="min-h-screen pt-24 pb-16 px-4 relative overflow-hidden" ref={containerRef}>
      {/* Background Gradient Animation */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary via-background to-background z-0" />
      
      {/* Floating Elements */}
      <div className="absolute top-1/4 left-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl animate-float animate-delay-500" />
      
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="mb-3 animate-on-scroll opacity-0 animate-delay-100">
            <span className="pill bg-secondary text-primary-foreground">
              All-in-One Solution
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-on-scroll opacity-0">
            <span className="text-gradient">AI-Powered</span> Coding <br className="hidden md:block" />
            & Automation Agent
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl animate-on-scroll opacity-0 animate-delay-200">
            Build, automate, and optimize digital solutions with our advanced AI consultant.
            Seamlessly generate code, create workflows, and develop AI-driven applications.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-on-scroll opacity-0 animate-delay-300">
            <Button size="lg" className="group">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="lg">
              View Demo
            </Button>
          </div>
          
          {/* Feature Icons */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-3xl mx-auto mb-16">
            {[
              { icon: <Code className="h-6 w-6" />, label: "Code Generation", delay: 400 },
              { icon: <Workflow className="h-6 w-6" />, label: "Workflow Automation", delay: 500 },
              { icon: <Bot className="h-6 w-6" />, label: "AI Agents", delay: 600 },
              { icon: <Zap className="h-6 w-6" />, label: "API Integration", delay: 700 },
              { icon: <Layers className="h-6 w-6" />, label: "ML Integration", delay: 800 },
              { icon: <Layout className="h-6 w-6" />, label: "UI Development", delay: 900 }
            ].map((feature, index) => (
              <GlassMorphism 
                key={index}
                className={`p-4 flex flex-col items-center text-center animate-on-scroll opacity-0 hover-lift animate-delay-${feature.delay}`}
              >
                <div className="p-3 bg-primary/10 rounded-full mb-3">
                  {feature.icon}
                </div>
                <span className="text-sm font-medium">{feature.label}</span>
              </GlassMorphism>
            ))}
          </div>
          
          {/* Visual Element */}
          <div className="w-full animate-on-scroll opacity-0 animate-delay-1000">
            <GlassMorphism className="w-full p-1 overflow-hidden rounded-lg">
              <AnimatedGradient 
                className="h-64 md:h-80 rounded-lg" 
                gradientColors="from-blue-500/30 via-purple-500/30 to-pink-500/30"
              >
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-xl font-semibold text-white">
                    Interactive Demo
                  </div>
                </div>
              </AnimatedGradient>
            </GlassMorphism>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
