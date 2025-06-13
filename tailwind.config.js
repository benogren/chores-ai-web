/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        'heading': ['var(--font-varela-round)', 'Varela Round', 'system-ui', 'sans-serif'],
      },
      colors: {
        'chores': {
          'purple': 'rgb(166 102 217)',
          'teal': 'rgb(51 191 166)', 
          'green': 'rgb(115 217 89)',
        }
      },
      backgroundImage: {
        'gradient-chores': 'linear-gradient(135deg, rgb(166 102 217) 0%, rgb(51 191 166) 100%)',
        'gradient-chores-hero': 'linear-gradient(135deg, rgb(166 102 217) 0%, rgb(51 191 166) 50%, rgb(115 217 89) 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}