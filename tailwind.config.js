/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        'mukta': ['Mukta Vaani', 'sans-serif']
      },
      letterSpacing: {
        'widest': '.25em'
      },
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

