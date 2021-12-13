const path = require('path');
const fs = require('fs')
const webpack = require('webpack');
const HappyPack = require('happypack');
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');
const multiJsonLoader = require('multi-json-loader');
const smp = new SpeedMeasurePlugin();
const happyThreadPool = HappyPack.ThreadPool({ size: 4 });
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const PACKAGE = require('./package.json');
const assetPath = PACKAGE.assetPath;
const projName = PACKAGE.name;

const siteData = multiJsonLoader.loadFiles('./src/_data');

let runMod = "development";

if (process.argv.indexOf('--dev') === -1) {
  runMod = 'production';
  process.env.NODE_ENV = 'production';
  console.log('Running production build......');
  console.log('Assets will be created at ', assetPath);
} else {
  runMod = 'development';
  process.env.NODE_ENV = 'development';
  console.log('Running development build......');
  console.log('Assets will be created at ', assetPath);
}

function loadJsonFiles(startPath, parentObj) {
  var files=fs.readdirSync(startPath);

  for(var i=0;i<files.length;i++){
    var filename=path.join(startPath,files[i]);
    var stat = fs.lstatSync(filename);
    if (stat.isDirectory()){
      parentObj[`${files[i]}`] = multiJsonLoader.loadFiles(filename);
      loadJsonFiles(filename, parentObj[`${files[i]}`]);
    }
  }
}

loadJsonFiles('./src/_data', siteData);

function findFilesInDir(startPath,filter){
  var results = [];
  if (!fs.existsSync(startPath)){
    console.log("no dir ",startPath);
    return;
  }

  var files=fs.readdirSync(startPath);
  for(var i=0;i<files.length;i++){
    var filename=path.join(startPath,files[i]);
    var stat = fs.lstatSync(filename);
    if (stat.isDirectory()){
      results = results.concat(findFilesInDir(filename,filter)); //recurse
    }
    else if ((filename.indexOf(filter)>=0) && (filename.indexOf('_modules') === -1) && (filename.indexOf('_layouts') === -1)) {
      var actualFilename = filename.replace('src/','');
      actualFilename = actualFilename.replace(/src\\/g, '');
      results.push(actualFilename);
    }
  }
  return results;
}

function generateHtmlPlugins (templateDir,envPath) {
  // Read files in template directory
  const templateFiles = findFilesInDir(templateDir,'.pug');
  return templateFiles.map(item => {
    // Split names and extension
    const parts = item.split('.')
    const name = parts[0]
    const extension = parts[1]
    // Create new HTMLWebpackPlugin with options
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      cache: true,
      minify: false,
      hash: false,
      inject: false,
      alwaysWriteToDisk: true,
      data: siteData,
      env: envPath,
      directory: projName,
    })
  })
}

function generateModRules(envMode) {
  const devModRules = [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: "happypack/loader?id=js"
    },
    {
      test: /\.(sa|sc|c)ss$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'postcss-loader',
        // 'fast-sass-loader',
        {
          loader: "fast-sass-loader",
          options: {
            data: '$path: "/";'
          }
        }
      ],
    },
    {
      test: /\.pug$/,
      use: "happypack/loader?id=html"
    }
  ]

  const prodModRules = [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: "babel-loader?cacheDirectory"
    },
    {
      test: /\.(sa|sc|c)ss$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'postcss-loader',
        // 'fast-sass-loader',
        {
          loader: "fast-sass-loader",
          options: {
            data: '$path: "/";'
          }
        }
      ],
    },
    {
      test: /\.pug$/,
      use: "pug-loader?pretty=true"
    }
  ]

  const stgModRules = [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: "babel-loader?cacheDirectory"
    },
    {
      test: /\.(sa|sc|c)ss$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'postcss-loader',
        // 'fast-sass-loader',
        {
          loader: "fast-sass-loader",
          options: {
            data: '$path: "/' + projName + '/";'
          }
        }
      ],
    },
    {
      test: /\.pug$/,
      use: "pug-loader?pretty=true"
    }
  ]

  if (envMode === 'production') {
    if (process.argv.indexOf('--prod') === -1) {
      return stgModRules;
    } else {
      return prodModRules;
    }
  } else {
    return devModRules;
  }
}

function generatePlugins (envMode) {
  const devPlugins = [
    new webpack.HotModuleReplacementPlugin(),

    new HappyPack({
      id: 'html',
      loaders: ['pug-loader?pretty=true'],
      threadPool: happyThreadPool
    }),

    new HappyPack({
      id: 'js',
      loaders: ['babel-loader?cacheDirectory' ],
      threadPool: happyThreadPool
    }),

    new BrowserSyncPlugin(
      {
        files: ['styles/**/*.css', '**/*.html', '!/assets/**/*'],
        host: 'localhost',
        port: 3001,
        proxy: 'http://localhost:3000/'
      },
      {
        reload: true,
        injectCss: true
      },
    )
  ]

  const prodPlugins = [
    new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
      plugins: [
        imageminMozjpeg({
          quality: 70,
          progressive: true
        })
      ]
    })
  ]

  if ( envMode === 'production') {
    return prodPlugins;
  } else {
    return devPlugins;
  }
}

function generateDist (envMode) {
  const devPath = "";
  const prodPath = "";
  const stgPath = `/${projName}`;

  if (envMode === 'production') {
    if (process.argv.indexOf('--prod') === -1) {
      return stgPath;
    } else {
      return prodPath;
    }
  } else {
    return devPath;
  }
}

function generateEnv (envMode) {
  const devEnv = "dev";
  const prodEnv = "prod";
  const stgEnv = "stg";

  if (envMode === 'production') {
    if (process.argv.indexOf('--prod') === -1) {
      return stgEnv;
    } else {
      return prodEnv;
    }
  } else {
    return devEnv;
  }
}

const envRules = generateEnv(runMod);
const htmlPlugins = generateHtmlPlugins('./src', envRules);
const buildPlugins = generatePlugins(runMod);
const moduleRules = generateModRules(runMod);
const distRules = generateDist(runMod);

module.exports = smp.wrap({
  entry:  path.resolve(__dirname, 'index.js'),
  mode: process.env.NODE_ENV,
  output: {
    filename: `${assetPath}/scripts/main.js`,
    path: path.resolve(__dirname, 'dist' + distRules),
    publicPath: "/"
  },
  module: {
    rules: moduleRules
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {from:'src/_images',to:`${assetPath}/images`},
      {from:'src/_fonts',to:`${assetPath}/fonts`},
      {from:'**/*',ignore:['{**/\_*,**/\_*/**}','**/*.pug'],context: 'src/'}
    ]),

    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      $j: 'jquery'
    }),

    new MiniCssExtractPlugin({
      filename: `${assetPath}/styles/main.css`
    })
  ].concat(htmlPlugins, buildPlugins),
  devServer: {
    contentBase: path.resolve(__dirname, 'dist' + distRules),
    watchContentBase: true,
    publicPath: '/',
    hot:false,
    inline: true,
    port: 3000
  },
  resolve: {
    modules: [
      "node_modules"
    ],
    alias: {

    }
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        test: /\.js(\?.*)?$/i,
        extractComments: true,
      }),
    ],
  },
});