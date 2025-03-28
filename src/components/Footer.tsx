import React from 'react';
import { cn } from '@/lib/utils';
import GlassMorphism from './ui/GlassMorphism';
import AnimatedGradient from './ui/AnimatedGradient';
import { ArrowRight, Github, Twitter, Linkedin } from 'lucide-react';
import { Button } from './ui/button';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: 'Product',
      links: [
        { href: '#features', label: 'Features' },
        { href: '#demo', label: 'Demo' },
        { href: '#pricing', label: 'Pricing' },
        { href: '#faq', label: 'FAQ' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { href: '#', label: 'Documentation' },
        { href: '#', label: 'API Reference' },
        { href: '#', label: 'Blog' },
        { href: '#', label: 'Community' }
      ]
    },
    {
      title: 'Company',
      links: [
        { href: '#', label: 'About Us' },
        { href: '#', label: 'Careers' },
        { href: '#', label: 'Contact' },
        { href: '#', label: 'Privacy Policy' }
      ]
    }
  ];

  return (
    <footer className="py-16 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <AnimatedGradient 
        className="absolute top-0 left-0 right-0 bottom-0 opacity-20" 
        colors={['#8B5CF6', '#EC4899', '#3B82F6']}
      />
      
      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <div className="mb-4">
              <span className="text-xl font-semibold text-gradient">AI Agent</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Build, automate, and optimize digital solutions with our AI-powered 
              coding and automation platform.
            </p>
            
            <GlassMorphism className="p-6 mb-8 max-w-md" intensity="medium">
              <h3 className="text-sm font-medium mb-3">Stay up to date</h3>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 rounded-md px-3 py-2 bg-background border border-input text-sm"
                />
                <Button size="sm" className="shrink-0">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </GlassMorphism>
            
            <div className="flex space-x-4">
              <GlassMorphism className="p-2 rounded-full" intensity="light">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Github className="h-5 w-5" />
                </a>
              </GlassMorphism>
              <GlassMorphism className="p-2 rounded-full" intensity="light">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
              </GlassMorphism>
              <GlassMorphism className="p-2 rounded-full" intensity="light">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              </GlassMorphism>
            </div>
          </div>
          
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-10">
            {footerLinks.map((category, idx) => (
              <div key={idx}>
                <GlassMorphism className="inline-block px-3 py-1 rounded-md mb-4" intensity="light">
                  <h3 className="font-medium">{category.title}</h3>
                </GlassMorphism>
                <ul className="space-y-3">
                  {category.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <a 
                        href={link.href} 
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t border-border mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {currentYear} AI Agent. All rights reserved.
          </p>
          
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;