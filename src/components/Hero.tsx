'use client';
import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import AnimatedGradient from './ui/AnimatedGradient';
import { TextEffect } from './motion-primitives/text-effect';
import GlassMorphism from './ui/GlassMorphism';
import { ArrowRight, Bot, BrainCircuit, PlusIcon, X } from 'lucide-react';
import { Cursor } from '@/components/core/cursor';
import { AnimatePresence, motion } from 'motion/react';

// Import the AnimatedGroup component
import { AnimatedGroup } from './motion-primitives/animated-group';

// Define transition variants for animations
const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: 'blur(12px)',
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        type: 'spring',
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

const Hero = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const targetRef = useRef(null);
  
  const handlePositionChange = (x, y) => {
    if (targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      const isInside =
        x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
      setIsHovering(isInside);
    }
  };
  
  const handleMoreClick = () => {
    setShowVideo(true);
  };

  return (
    <section className="relative pt-24 pb-20 overflow-hidden sm:py-32">
      {/* Background gradient */}
      <AnimatedGradient 
        className="absolute top-0 left-0 right-0 bottom-0 opacity-20" 
        colors={['#8B5CF6', '#EC4899', '#3B82F6']}
      />
      
      <div className="container px-4 mx-auto relative z-10">
        <div className="flex flex-col items-center text-center">
          <AnimatedGroup variants={transitionVariants}>
            <GlassMorphism className="inline-flex items-center px-4 py-2 mb-8 rounded-full" intensity="light">
              <span className="text-sm font-medium text-primary">
                AI-powered development assistant
              </span>
            </GlassMorphism>
          </AnimatedGroup>
          
          <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 gradient-text tracking-tight">
            <TextEffect preset="fade-in-blur" speedSegment={0.3}>
              All-in-One AI
            </TextEffect>
            <TextEffect preset="fade-in-blur" speedSegment={0.3} delay={0.2}>
              Development Agent
            </TextEffect>
          </div>
          
          <TextEffect
            per="line"
            preset="fade-in-blur"
            speedSegment={0.3}
            delay={0.5}
            className="text-lg md:text-xl text-foreground/80 max-w-3xl mb-8">
            Build, automate, and optimize digital solutions using AI. Generate code, create automation workflows, and develop custom AI agents for your projects.
          </TextEffect>
          
          <AnimatedGroup
            variants={{
              container: {
                visible: {
                  transition: {
                    staggerChildren: 0.05,
                    delayChildren: 0.75,
                  },
                },
              },
              ...transitionVariants,
            }}
            className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button size="lg" className="gap-2 group" asChild>
              <Link to="/signup">
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/dashboard">Try Demo</Link>
            </Button>
          </AnimatedGroup>

          {/* Cursor effect wrapper */}
          <div className="relative w-full max-w-4xl">
            <Cursor
              attachToParent
              variants={{
                initial: { scale: 0.3, opacity: 0 },
                animate: { scale: 1, opacity: 1 },
                exit: { scale: 0.3, opacity: 0 },
              }}
              springConfig={{
                bounce: 0.001,
              }}
              transition={{
                ease: 'easeInOut',
                duration: 0.15,
              }}
              onPositionChange={handlePositionChange}
            >
              <motion.div
                animate={{
                  width: isHovering ? 80 : 16,
                  height: isHovering ? 32 : 16,
                }}
                className="flex items-center justify-center rounded-[24px] bg-gray-500/40 backdrop-blur-md dark:bg-gray-300/40"
              >
                <AnimatePresence>
                  {isHovering ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      className="inline-flex w-full items-center justify-center cursor-pointer"
                      onClick={handleMoreClick}
                    >
                      <div className="inline-flex items-center text-sm text-white dark:text-black">
                        More <PlusIcon className="ml-1 h-4 w-4" />
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            </Cursor>

            <GlassMorphism className="p-4 w-full" intensity="medium">
              <div 
                ref={targetRef} 
                className="aspect-video relative overflow-hidden rounded-lg border border-foreground/10 bg-gradient-to-br from-background to-secondary/10"
              >
                <img 
                  src="../../public/images/ai-development-agent-dashboard.png" 
                  alt="AI Development Agent Dashboard" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
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
      </div>
      
      {/* YouTube Video Modal */}
      <AnimatePresence>
        {showVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          >
            <div className="relative w-full max-w-4xl p-4">
              <button 
                onClick={() => setShowVideo(false)}
                className="absolute top-0 right-0 -mt-12 -mr-2 p-2 rounded-full bg-foreground/10 hover:bg-foreground/20 transition-colors"
              >
                <X className="h-6 w-6 text-white" />
              </button>
              
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full aspect-video bg-black rounded-lg overflow-hidden"
              >
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const BrainCircuitIcon = ({ className }) => {
  return (
    <BrainCircuit className={className} />
  );
};

export default Hero;