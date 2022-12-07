module.exports = {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                on: "#ff264a",
                off: "#7d0e14",
                success: "lightgreen",
                info: "#2a53cd",
                warn: "#f5bd00",
                error: "#eb3941",
            },
            fontFamily: {
                digital: "Digital-7",
            },
            spacing: {
                42: "10.5rem",
            },
        },
    },
    safelist: ["bg-on", "bg-off", "bg-success", "bg-info", "bg-warn", "bg-error", "text-on", "text-success", "text-info", "text-warn", "text-error"],
    plugins: [],
};
