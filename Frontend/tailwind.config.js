/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],  
  theme: {
    extend: {
      borderRadius: {
        'custom-ellipse': '90% 60% 90% 50%',
        'phone-ellipse': '0% 0% 0% 0%',
      },
      colors: {
        primary: '#7BBCB0',
        secondary: '#6A669D',
        dark: '#495560',
        light: '#AFFFF0',
        darkBlue:'#13253F',
        purple:'#D176E0',
        yellow:'#E4B613',
        red:'#FC3131',
        blue:'#5C9BDE',

        },
      backgroundImage: {
        'intero': "url('./src/assets/Images/intero.png')",
        'gradient': 'linear-gradient(104deg, rgba(72, 5, 125, 0.70) -1.03%, rgba(42, 221, 231, 0.70) 100%)',
        
      
      },
      boxShadow: {
        'custom': '0 10px 30px rgba(123, 188, 176, 0.5)', 
        'custom-yellow': '0 5px 30px rgba(106,102,157, 0.5)', 
      },
      fontFamily: {
        volkhov: ['Volkhov', 'serif'], 
      },
    },
  },
  
  plugins: [],
}

