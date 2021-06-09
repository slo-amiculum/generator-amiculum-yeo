module.exports = {
  purge: {
    content: ['./src/**/*.html'],
    safelist: [
      /^js-/
    ],
    whitelist: [/^js-/],
    whitelistPatternsChildren: [/^js-/],
    options: {
      whitelist: ['is-visible', 'is-user-visible', 'is-navbar-visible', 'is-liked', 'active', 'disabled']
    }
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    container: {
      center: true,
      padding: '2rem'
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
