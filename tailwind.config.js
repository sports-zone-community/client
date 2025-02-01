/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            width: {
                104: "26rem",
            },
            borderRadius: {
                "4xl": "2rem",
                "5xl": "2.5rem",
                "6xl": "3rem",
                "7xl": "3.5rem",
                "8xl": "4rem",
                "10xl": "5rem",
            },
            colors: {
                customBlue: "#6AC8D8",
            },
            fontFamily: {
                rubik: ["Rubik", "sans-serif"],
                montserrat: ["Montserrat", "sans-serif"],
            },
            animation: {
                "spin-reverse": "spin 1.5s linear infinite reverse",
            },
        },
    },
    plugins: [],
};
