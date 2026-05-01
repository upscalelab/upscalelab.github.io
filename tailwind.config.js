/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // UpScale Lab Brand Colors
        orange: {
          upscale: '#e85d04',
          'upscale-light': '#ff7e3a',
          'upscale-dark': '#c44a00',
        },
        green: {
          upscale: '#5db329',
          'upscale-light': '#7ed44a',
          'upscale-dark': '#1e6b00',
        },
        navy: {
          upscale: '#1e2a44',
        },
        dark: {
          bg: '#080c14',
          bg2: '#0d1420',
          bg3: '#111926',
          bg4: '#161f30',
          card: 'rgba(255,255,255,0.04)',
          border: 'rgba(255,255,255,0.08)',
          'border-strong': 'rgba(255,255,255,0.14)',
        },
        text: {
          primary: '#f0f2f5',
          muted: '#8a95a8',
          'muted-2': '#a8b2c4',
        },
      },
      fontFamily: {
        manrope: ['Manrope', 'system-ui', 'sans-serif'],
        fraunces: ['Fraunces', 'serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #e85d04, #c44a00)',
        'gradient-green': 'linear-gradient(135deg, #5db329, #1e6b00)',
        'gradient-progress': 'linear-gradient(90deg, #5db329, #e85d04)',
      },
      boxShadow: {
        'brand': '0 4px 18px rgba(232,93,4,.35)',
        'brand-lg': '0 8px 26px rgba(232,93,4,.5)',
      },
    },
  },
  plugins: [],
};
