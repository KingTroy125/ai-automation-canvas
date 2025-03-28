import React, { useEffect, useRef } from 'react';
import GlassMorphism from './ui/GlassMorphism';
import AnimatedGradient from './ui/AnimatedGradient';
import { 
  Code, 
  FileUp, 
  Laptop, 
  Workflow, 
  Bot, 
  Layout, 
  BrainCircuit, 
  Link
} from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, index }) => {
  return (
    <GlassMorphism 
      className={`p-6 hover-lift animate-on-scroll opacity-0 animate-delay-${100 * (index + 1)}`}
    >
      <div className="p-3 bg-primary/10 rounded-full inline-block mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </GlassMorphism>
  );
};

const Features: React.FC = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  
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
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    );
    
    const elements = featuresRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => {
      observer.observe(el);
    });
    
    return () => {
      elements?.forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);

  const features = [
    {
      icon: <FileUp className="h-6 w-6" />,
      title: "Multimodal Input Support",
      description: "Accepts text prompts, images, PDFs, and documents to analyze and generate insights."
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: "AI-Powered Development",
      description: "Builds desktop, web, and mobile applications with optimal code generation."
    },
    {
      icon: <Workflow className="h-6 w-6" />,
      title: "VBA & Workflow Automation",
      description: "Creates complete automation solutions for Excel, Access, and Microsoft Office."
    },
    {
      icon: <BrainCircuit className="h-6 w-6" />,
      title: "AI Model Integration",
      description: "Integrates machine learning models into applications with AI-driven optimizations."
    },
    {
      icon: <Bot className="h-6 w-6" />,
      title: "AI Agent & Bot Builder",
      description: "Creates custom AI agents & chatbots with dynamic interactions and contextual memory."
    },
    {
      icon: <Layout className="h-6 w-6" />,
      title: "Custom UI/UX Development",
      description: "Generates unique user interfaces inspired by user-provided references."
    },
    {
      icon: <Link className="h-6 w-6" />,
      title: "API-Driven Development",
      description: "Leverages multiple LLM APIs to enhance coding, automation, and AI capabilities."
    },
    {
      icon: <Laptop className="h-6 w-6" />,
      title: "End-to-End Solutions",
      description: "Provides complete solutions from planning to implementation and optimization."
    }
  ];

  return (
    <section id="features" className="py-20 px-4 relative overflow-hidden" ref={featuresRef}>
      {/* Background gradient (added from Hero component) */}
      <AnimatedGradient 
        className="absolute top-0 left-0 right-0 bottom-0 opacity-20" 
        colors={['#8B5CF6', '#EC4899', '#3B82F6']}
      />
      
      {/* Previous background elements - you can keep or remove these */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-on-scroll opacity-0">
            Core <span className="text-gradient">Capabilities</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-on-scroll opacity-0 animate-delay-200">
            Our AI-powered platform combines multiple technologies to deliver a comprehensive solution for your digital needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;