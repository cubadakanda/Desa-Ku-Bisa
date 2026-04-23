/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core Colors
        "primary": "#00677f",
        "on-primary": "#ffffff",
        "primary-container": "#00cffd",
        "on-primary-container": "#005469",
        "secondary": "#006689",
        "on-secondary": "#ffffff",
        "secondary-container": "#1bc0fe",
        "on-secondary-container": "#004b66",
        "tertiary": "#3658ba",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#aabcff",
        "on-tertiary-container": "#2045a8",
        
        // Surface & Background Colors (Material 3 Style)
        "background": "#f5faff",
        "on-background": "#001e2c",
        "surface": "#f5faff",
        "on-surface": "#001e2c",
        "surface-variant": "#c4e7ff",
        "on-surface-variant": "#3c494e",
        "surface-dim": "#b4e0fc",
        "surface-bright": "#f5faff",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#e9f5ff",
        "surface-container": "#ddf1ff",
        "surface-container-high": "#d1ecff",
        "surface-container-highest": "#c4e7ff",
        "inverse-surface": "#00344a",
        "inverse-on-surface": "#e3f3ff",
        "inverse-primary": "#4dd6ff",
        
        // Outline & Error
        "outline": "#6c797f",
        "outline-variant": "#bbc9cf",
        "error": "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
      },
      fontFamily: {
        sans: ['Public Sans', 'sans-serif'],
        headline: ['Public Sans', 'sans-serif'],
        display: ['Public Sans', 'sans-serif'],
        body: ['Public Sans', 'sans-serif'],
        label: ['Public Sans', 'sans-serif'],
      },
      borderRadius: {
        'DEFAULT': '0.25rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        'full': '9999px',
      },
    },
  },
  plugins: [
    // Penting agar select dan input di form terlihat bagus
    require('@tailwindcss/forms'),
  ],
}