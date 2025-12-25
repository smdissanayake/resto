import React from 'react';
import { LoginForm } from '../components/LoginForm';
export default function LoginPage() {
  return <div className="min-h-screen w-full flex flex-col lg:grid lg:grid-cols-2 bg-[#121212]">
      {/* Left Side - Cinematic Photo */}
      <div className="relative h-64 lg:h-full w-full overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent z-10 lg:bg-gradient-to-r lg:from-transparent lg:to-[#121212]" />
        <div className="absolute inset-0 bg-black/20 z-10" />
        <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=2400&auto=format&fit=crop" alt="Gourmet burger with smoke" className="h-full w-full object-cover object-center transition-transform duration-[20s] ease-in-out transform group-hover:scale-110" />

        {/* Brand Overlay */}
        <div className="absolute top-8 left-8 z-20">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-[#FF6B00] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Resto<span className="text-[#FF6B00]">SaaS</span>
            </span>
          </div>
        </div>

        {/* Quote/Testimonial Overlay (Optional Polish) */}
        <div className="absolute bottom-8 left-8 right-8 z-20 hidden lg:block">
          <blockquote className="max-w-md">
            <p className="text-lg font-medium text-white/90 leading-relaxed">
              "The most powerful platform for modern restaurant management.
              Streamline your operations with style."
            </p>
          </blockquote>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 bg-[#121212] relative">
        {/* Subtle background glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF6B00]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full relative z-10">
          <LoginForm />

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <a href="#" className="font-medium text-[#FF6B00] hover:text-[#ff8533] transition-colors">
                Contact Sales
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>;
}