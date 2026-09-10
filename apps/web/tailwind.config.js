/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Les valeurs vivent dans src/styles/tokens.css - ici on ne fait que les exposer.
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        'surface-2': 'var(--color-surface-2)',
        ink: 'var(--color-text)',
        muted: 'var(--color-muted)',
        accent: 'var(--color-accent)',
        'accent-2': 'var(--color-accent-2)',
        line: 'var(--color-line)',
        'line-soft': 'var(--color-line-soft)',
      },
      fontFamily: {
        sans: ['Archivo', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        // Modernist : aucun arrondi, nulle part.
        none: '0px',
      },
      maxWidth: {
        shell: '1280px',
      },
      spacing: {
        header: '68px',
      },
      keyframes: {
        rise: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        rise: 'rise .7s cubic-bezier(.22,.61,.36,1) both',
      },
    },
  },
  plugins: [],
};
