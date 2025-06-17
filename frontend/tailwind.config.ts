import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class', // Habilita o modo escuro baseado em classes
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cores personalizadas para o tema escuro
        dark: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      // Suporte a animações
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    // Plugin para estilos de scrollbar personalizados
    function({ addUtilities }: { addUtilities: any }) {
      const newUtilities = {
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          'scrollbar-color': '#9ca3af #f3f4f6',
        },
        '.scrollbar-thin-dark': {
          'scrollbar-width': 'thin',
          'scrollbar-color': '#4b5563 #1f2937',
        },
      }
      addUtilities(newUtilities, ['responsive', 'dark'])
    },
  ],
}

export default config
