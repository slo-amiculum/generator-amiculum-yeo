module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      './src/*.html',
      './src/**/*.html',
      './src/*.pug',
      './src/**/*.pug',
      './src/**/*.js'
    ],
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
  future: {
    purgeLayersByDefault: process.env.NODE_ENV === 'production',
  },
}