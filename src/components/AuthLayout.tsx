
import React from 'react';
import GlassMorphism from './ui/GlassMorphism';
import { Card, CardContent } from './ui/card';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-secondary/10 px-4 py-12">
      <Card className="w-full max-w-md border-none shadow-xl">
        <GlassMorphism intensity="medium" className="p-6">
          <CardContent className="p-0">
            <div className="mb-6 text-center">
              <h1 className="text-3xl font-bold text-gradient">{title}</h1>
              {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
            </div>
            {children}
          </CardContent>
        </GlassMorphism>
      </Card>
    </div>
  );
};

export default AuthLayout;
