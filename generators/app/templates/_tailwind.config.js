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
      whitelist: []
    }
  },
  theme: {
    colors: {},
    container: {
      center: true,
      padding: '2rem'
    },
    //custom width classes for pug as pug cannot use '/'
    width: {
      'auto': 'auto',
      'px': '1px',
      '1': '0.25rem',
      '2': '0.5rem',
      '3': '0.75rem',
      '4': '1rem',
      '6': '1.5rem',
      '8': '2rem',
      '10': '2.5rem',
      '12': '3rem',
      '16': '4rem',
      '24': '6rem',
      '32': '8rem',
      '48': '12rem',
      '64': '16rem',
      '1o2': '50%',
      '1o3': '33.33333%',
      '2o3': '66.66667%',
      '1o4': '25%',
      '3o4': '75%',
      '1o5': '20%',
      '2o5': '40%',
      '3o5': '60%',
      '4o5': '80%',
      '1o6': '16.66667%',
      '5o6': '83.33333%',
      'full': '100%',
      'screen': '100vw'
    },
    extend: {},
  },
  variants: {},
  corePlugins: {},
  separator: '_', // custom prefix for pug as pug cannot use ':'
  future: {
    purgeLayersByDefault: process.env.NODE_ENV === 'production',
  },
};