/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'primary': '#2563EB', // Deep blue (primary) - blue-600
        'primary-50': '#EFF6FF', // Light blue (50-level shade) - blue-50
        'primary-100': '#DBEAFE', // Light blue (100-level shade) - blue-100
        'primary-500': '#3B82F6', // Medium blue (500-level shade) - blue-500
        'primary-700': '#1D4ED8', // Dark blue (700-level shade) - blue-700
        'primary-900': '#1E3A8A', // Darker blue (900-level shade) - blue-900
        
        // Secondary Colors
        'secondary': '#64748B', // Neutral slate (secondary) - slate-500
        'secondary-50': '#F8FAFC', // Light slate (50-level shade) - slate-50
        'secondary-100': '#F1F5F9', // Light slate (100-level shade) - slate-100
        'secondary-200': '#E2E8F0', // Light slate (200-level shade) - slate-200
        'secondary-300': '#CBD5E1', // Light slate (300-level shade) - slate-300
        'secondary-400': '#94A3B8', // Medium slate (400-level shade) - slate-400
        'secondary-600': '#475569', // Dark slate (600-level shade) - slate-600
        'secondary-700': '#334155', // Darker slate (700-level shade) - slate-700
        'secondary-800': '#1E293B', // Darker slate (800-level shade) - slate-800
        'secondary-900': '#0F172A', // Darkest slate (900-level shade) - slate-900
        
        // Accent Colors
        'accent': '#0EA5E9', // Bright cyan (accent) - sky-500
        'accent-50': '#F0F9FF', // Light cyan (50-level shade) - sky-50
        'accent-100': '#E0F2FE', // Light cyan (100-level shade) - sky-100
        'accent-200': '#BAE6FD', // Light cyan (200-level shade) - sky-200
        'accent-500': '#0EA5E9', // Medium cyan (500-level shade) - sky-500
        'accent-600': '#0284C7', // Dark cyan (600-level shade) - sky-600
        'accent-700': '#0369A1', // Darker cyan (700-level shade) - sky-700
        
        // Background Colors
        'background': '#F8FAFC', // Near-white background - slate-50
        'surface': '#FFFFFF', // Pure white surface - white
        
        // Text Colors
        'text-primary': '#0F172A', // Deep charcoal text - slate-900
        'text-secondary': '#475569', // Medium gray text - slate-600
        'text-muted': '#64748B', // Muted text - slate-500
        
        // Status Colors
        'success': '#059669', // Forest green success - emerald-600
        'success-50': '#ECFDF5', // Light green (50-level shade) - emerald-50
        'success-100': '#D1FAE5', // Light green (100-level shade) - emerald-100
        'success-500': '#10B981', // Medium green (500-level shade) - emerald-500
        'success-700': '#047857', // Dark green (700-level shade) - emerald-700
        
        'warning': '#D97706', // Amber orange warning - amber-600
        'warning-50': '#FFFBEB', // Light amber (50-level shade) - amber-50
        'warning-100': '#FEF3C7', // Light amber (100-level shade) - amber-100
        'warning-500': '#F59E0B', // Medium amber (500-level shade) - amber-500
        'warning-700': '#B45309', // Dark amber (700-level shade) - amber-700
        
        'error': '#DC2626', // Clear red error - red-600
        'error-50': '#FEF2F2', // Light red (50-level shade) - red-50
        'error-100': '#FEE2E2', // Light red (100-level shade) - red-100
        'error-500': '#EF4444', // Medium red (500-level shade) - red-500
        'error-700': '#B91C1C', // Dark red (700-level shade) - red-700
        
        // Border Colors
        'border': '#E2E8F0', // Border color - slate-200
        'border-light': '#F1F5F9', // Light border - slate-100
      },
      fontFamily: {
        'heading': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
        'body': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
        'data': ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      fontWeight: {
        'normal': '400',
        'medium': '500',
        'semibold': '600',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'modal': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'elevation': '0 10px 15px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'sm': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      zIndex: {
        '100': '100',
        '200': '200',
        '300': '300',
        '400': '400',
      },
      transitionDuration: {
        '150': '150ms',
        '300': '300ms',
      },
      transitionTimingFunction: {
        'ease-out': 'ease-out',
        'ease-in-out': 'ease-in-out',
      },
      minHeight: {
        'touch': '44px',
      },
      minWidth: {
        'touch': '44px',
      },
    },
  },
  plugins: [],
}