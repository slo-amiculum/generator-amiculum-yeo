const path = require('path');
const fs = require('fs');
const glob = require('glob');
const loaderUtils = require('loader-utils');
const webpack = require('webpack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const PugPlugin = require('pug-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const PACKAGE = require('./package.json');
const assetPath = PACKAGE.assetPath;
const projName = PACKAGE.name;

// Aggregating JSON functions - Start
function pitch() {
  var query = loaderUtils.parseQuery(this.query);

  var results = loadFiles(query.cwd, query.glob, this.addContextDependency.bind(this));

  this.cacheable && this.cacheable();
  this.value = [ results ];

  return JSON.stringify(results, null, '\t');
}

function loadFiles(cwd, fileGlob, addContextDependency) {
  var absoluteCwd = path.resolve(cwd || '');
  var currentGlob = fileGlob || '*.json';
  var results = {};

  glob.sync(currentGlob, {
    cwd: absoluteCwd
  }).forEach(function(filePath) {
    var absoluteFilePath = path.join(absoluteCwd, filePath);
    var parsedAbsoluteFilePath = path.parse(absoluteFilePath);

    if (typeof addContextDependency === 'function') {
      addContextDependency(parsedAbsoluteFilePath.dir);
    }

    var extension = parsedAbsoluteFilePath.ext;
    var end = -1 * extension.length;
    var parts = filePath.slice(0, end).split(path.sep);
    var last = parts.length - 1;
    parts.reduce(function(root, part, idx) {
      if (idx == last) root[part] = JSON.parse(fs.readFileSync(absoluteFilePath));
      else if (!(part in root)) root[part] = {};
      return root[part];
    }, results);
  });

  return results;
}
// Aggregating JSON functions - End

const siteData = loadFiles('./src/_data');

let runMod = 'development';

if (process.argv.indexOf('development') === -1) {
  if (process.argv.indexOf('production') === -1) {
    runMod = 'devServer';
    process.env.NODE_ENV = 'devServer';
    console.log(process.argv);
    console.log('Running Dev-Server build......');
  } else {
    runMod = 'production';
    process.env.NODE_ENV = 'production';
    console.log(process.argv);
    console.log('Running Production build......');
  }
} else {
  runMod = 'development';
  process.env.NODE_ENV = 'development';
  console.log(process.argv);
  console.log('Running Local build......');
}

function loadJsonFiles(startPath, parentObj) {
  var files = fs.readdirSync(startPath);

  for(var i=0; i < files.length; i++){
    var filename = path.join(startPath, files[i]);
    var stat = fs.lstatSync(filename);
    if (stat.isDirectory()){
      parentObj[`${files[i]}`] = loadFiles(filename);
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
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', { targets: "defaults" }]
          ],
          plugins: ['@babel/plugin-transform-runtime']
        },
      }
    },
    {
      test: /\.geojson$/,
      type: 'json',
    },
    {
      test: /\.(sa|sc|c)ss$/,
      use: [
        MiniCssExtractPlugin.loader,
        { 
          loader: 'css-loader', 
          options: { 
            url: false,
            esModule: true
          } 
        },
        'postcss-loader',
        {
          loader: "sass-loader",
          options: {
            additionalData: '$path: "/";'
          }
        }
      ],
    },
    {
      test: /\.pug$/,
      loader: PugPlugin.loader
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
        { 
          loader: 'css-loader', 
          options: { 
            url: false 
          } 
        },
        'postcss-loader',
        {
          loader: "sass-loader",
          options: {
            additionalData: '$path: "/";'
          }
        }
      ],
    },
    {
      test: /\.pug$/,
      loader: PugPlugin.loader
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
        { 
          loader: 'css-loader', 
          options: { 
            url: false 
          } 
        },
        'postcss-loader',
        {
          loader: "sass-loader",
          options: {
            additionalData: '$path: "/' + projName + '/";'
          }
        }
      ],
    },
    {
      test: /\.pug$/,
      loader: PugPlugin.loader
    }
  ]

  if (envMode === 'devServer') {
    return stgModRules;
  } else if (envMode === 'production') {
    return prodModRules;
  } else {
    return devModRules;
  }
}

function generatePlugins (envMode) {
  const devPlugins = [
    new webpack.HotModuleReplacementPlugin(),

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
    new ImageMinimizerPlugin({
      minimizer: {
        implementation: ImageMinimizerPlugin.sharpMinify,
        options: {
          encodeOptions: {
            jpeg: {
              quality: 70,
            },
            png: {
              quality: 70,
            },
          },
        },
      },
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

  if (envMode === 'devServer') {
    return stgPath;
  } else if (envMode === 'production') {
    return prodPath;
  } else {
    return devPath;
  }
}

function generateEnv (envMode) {
  const devEnv = "dev";
  const prodEnv = "prod";
  const stgEnv = "stg";

  if (envMode === 'devServer') {
    return stgEnv;
  } else if (envMode === 'production') {
    return prodEnv;
  } else {
    return devEnv;
  }
}

const envRules = generateEnv(runMod);
const htmlPlugins = generateHtmlPlugins('./src', envRules);
const buildPlugins = generatePlugins(runMod);
const moduleRules = generateModRules(runMod);
const distRules = generateDist(runMod);

module.exports = {
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
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/_data',
          to: `${assetPath}/data`,
        },
        {
          from: 'src/_images',
          to: `${assetPath}/images`,
        },
        {
          from: 'src/_fonts',
          to: `${assetPath}/fonts`,
        },
        {
          from:'src/_icomoon/fonts',
          to:`${assetPath}/fonts`
        },
        {
          from: '**/*',
          globOptions: {
            ignore:['{**/\_*,**/\_*/**}','**/*.pug'],
          },
          context: 'src/',
        }
      ]
    }),

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
    static: {
      directory: path.resolve(__dirname, 'dist' + distRules),
      publicPath: '/',
      watch: true,
    },
    hot:false,
    port: 3000
  },
  resolve: {
    modules: [
      "node_modules"
    ],
    alias: {

    }
  },
  resolve: {
    modules: [
      "node_modules"
    ],
    alias: {

    }
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
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        extractComments: true,
      }),
    ],
  },
};

console.log('site.data: ', siteData);