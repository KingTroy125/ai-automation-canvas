
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import GlassMorphism from './ui/GlassMorphism';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#demo', label: 'Demo' },
    { href: '#workflow', label: 'Workflow' },
    { href: '#about', label: 'About' },
  ];
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <GlassMorphism 
        className={cn(
          "mx-4 my-3 px-4 transition-all duration-300",
          isScrolled ? "py-2 shadow-md" : "py-3"
        )}
        intensity="medium"
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-gradient">AI Agent</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navLinks.map(link => (
              <a 
                key={link.href} 
                href={link.href} 
                className="nav-link"
              >
                {link.label}
              </a>
            ))}
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="secondary" size="sm">Sign In</Button>
            <Button size="sm">Get Started</Button>
          </div>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-foreground"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </GlassMorphism>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <GlassMorphism 
          className="absolute top-full left-0 right-0 mx-4 mt-1 py-4 animate-fade-in"
          intensity="heavy"
        >
          <nav className="flex flex-col space-y-3 px-6">
            {navLinks.map(link => (
              <a 
                key={link.href} 
                href={link.href} 
                className="text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col space-y-3 pt-4">
              <Button variant="outline" size="sm">Sign In</Button>
              <Button size="sm">Get Started</Button>
            </div>
          </nav>
        </GlassMorphism>
      )}
    </header>
  );
};

export default Header;
