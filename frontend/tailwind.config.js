export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF0000',
        secondary: '#282828',
        dark: '#0F0F0F',
        darkGray: '#212121',
        lightGray: '#F1F1F1',
        accent: '#00B4D8',
        'glass-dark': 'rgba(15, 15, 15, 0.8)',
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #0F0F0F 0%, #1a1a1a 100%)',
        'gradient-primary': 'linear-gradient(135deg, #FF0000 0%, #CC0000 100%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(255, 0, 0, 0.3)',
        'glow-sm': '0 0 10px rgba(255, 0, 0, 0.2)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
