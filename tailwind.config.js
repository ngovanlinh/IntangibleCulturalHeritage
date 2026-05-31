/** @type {import('tailwindcss').Config} */
module.exports = {
    // Yêu cầu Tailwind quét tất cả các file HTML và JS nằm cùng thư mục
    content: ["./*.{html,js}"],
    theme: {
        extend: {
            colors: {
                // Khai báo lại mã màu chủ đạo của dự án
                maroon: {
                    DEFAULT: '#800000',
                    dark: '#5a0000'
                }
            }
        },
    },
    plugins: [],
}