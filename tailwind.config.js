/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",],
  presets: [require("nativewind/preset")],
  theme: {  
    extend: {  
        fontFamily: {  
            "rubik-extrabold": ["Rubik-ExtraBold", "sans-serif"],  
            "rubik-medium": ["Rubik-Medium", "sans-serif"],  
            "rubik-semibold": ["Rubik-SemiBold", "sans-serif"],  
            "rubik-light": ["Rubik-Light", "sans-serif"],  
            "bebas-neue": ["Bebas-Neue", "sans-serif"],
            "oswald": ["Oswald","sans-serif"]
        },  
        colors: {  
          "primary": {  
            100: '#FADADD',  
            200: '#FED2EB',  
            300: '#E87EA1',  
          },  
          accent: {  
            100: '#FFEBEF',  
            200: '#FFC1CC',
            300: '#FFB6C1',
          },  
         
          black: {  
           "DEFAULT": "#4A4A4A",  // Đen tuyệt đối
  "100": "#6D6D6D",  // Đen xám nhẹ, dùng cho nền phụ
  "200": "#8A8A8A",  // Đen trung tính, tạo độ tương phản
  "300": "#A3A3A3",  // Xám đậm, dùng cho viền hoặc icon 
          },  
          danger: '#FF6961',  
          success: '#77DD77',  // Xanh pastel
          warning: '#FFD700',  // Vàng pastel
        }    
    }  
},
  plugins: [],
};