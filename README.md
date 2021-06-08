# generator-yeo 
> Static site generator using Webpack


## Technologies
- Webpack
- SASS
- PUG for templating
- ES6


## Getting Started

- Install Node.js

Check to see if you already have Node installed. Do this by bringing up a terminal/command prompt and type `node -v`. If the response shows a version at or above `v0.5.x`, you are all set and can proceed to installing Yeoman. If you see an error and/or your version is too low, navigate to the [Node.js](http://nodejs.org/) website and install Node from there.

- Install [Yeoman](http://yeoman.io) 

```bash
npm install -g yo
```

- Install generator-yeo
```bash
npm install -g generator-yeo
```

- Generating new project

  Create a new folder with intended project name. open command line and navigate to the newly created folder.

  Once you are in the project folder. Run the following command.

```bash
yo yeo
```

Generator will automatically run `npm install` once the project files has been created.


Once everything is installed, you will see a project structure like below:

```
├── src
|   ├── _data                  # JSON files that add data to templates
|   ├── _fonts                 # Font files
|   ├── _images                # Images
|   ├── _layouts               # Layout structure for app
|   |   └── base.jade
|   ├── _modules               # Reusable modules
|   |   └── button
|   |       ├── button.pug
|   |       ├── button.js
|   |       └── button.scss
|   ├── _styles               # Global styles, mixins, variables, etc
        ├── _fonts.scss       # Custom font entries
|   |   └── main.scss         # Main stylesheet (import everything to this file)
|   ├── _scripts              # Global scripts, base classes, etc
|   |   └── index.js          # Main bootstrap file
|   ├── _fonts                # Fonts (Example, will not be generated)
|   ├── index.jade            # Homepage template
|   ├── favicon.ico
|   └── robots.txt
├── webpack.config.js         # Webpack Config
├── postcss.config.js         # Postcss config
└── package.json              # Dependencies and site/folder configuration
```

Congratulations! You should now have successfully created a YEO project and are ready to start building out your site/app.


Now you can run the following tasks:

- `npm run dev` for previewing your site/app on a development server.
- `npm run build` for generating a production version of your site/app.


## Sub-Generators

* [yeo:page](#page)
* [yeo:module](#module)

***Note: Generators need to be run from the root directory of your app.***

## Default Generators

### Page
Creates a new page.

#### Example:

```
$ yo yeo:page contact
```

Produces:

```
src/contact/index.pug
```

### Module
Creates a new module.

#### Example:

```
$ yo yeo:module header
```

Produces:

```
src/_modules/header/header.pug
src/_modules/header/header.scss
src/_modules/header/header.js
```

Specify custom folder structure

```
$ yo yeo:module components/header
```

Produces:

```
src/_modules/components/header/header.pug
src/_modules/components/header/header.scss
src/_modules/components/header/header.js
```

#### Example #2: Specifying module as atomic

This is a great way to create modules that adhere to [atomic design](https://bradfrost.com/blog/post/atomic-web-design/)

```
$ yo yeo:module button --atomic=atom
```

Produces:

```
src/_modules/atoms/button/button.pug
src/_modules/atoms/button/button.scss
src/_modules/atoms/button/button.js
```

> NOTE: Possible `--atomic` options: atom, molecule, organism

### Data Files

If you want to load global data into your PUG templates, you can add JSON files in `src/_data` folder.

For example, add menu.json in `src/_data` folder:

```json
{
  "name": "Home",
  "link": "/",
  "category": "Page",
  "status": "Development"
}
```

And it will be added to the `site.data` object so it can be used like so:

```PUG
div
  h1= site.data.menu.name
```

Which outputs to:

```html
<div>
  <h1>Home</h1>
</div>
```


## Image Minification options

please visit the following link to learn more about image minification options. 

[Imagemin Webpack Plugin](https://github.com/Klathmon/imagemin-webpack-plugin)


## Migrating from Generator Yeogurt to YEO
If you are migrating a current yeogurt project to YEO, you need to do some changes in the files.

1. In Yeogurt global json data is available via the variable ```site``` , so that you can access the date like ```site.data.somedata``` . In YEO global data is passed to pug via HTML WEBPACK PLUGIN, and the it is accessed via ```htmlWebpackPlugin.options.data.somedata``` . For new builds the generated pug template files already containes a variable ```- site = htmlWebpackPlugin.options``` which will let you use global data as you always use it. **When migrating you need to create this variable manually using search and replace.**

2. **Plugins using browserify-shim**
   In webpack jQuery is automatically loaded with the following references, So you don't need to import jquery in to your individual modules. Also different references of jQuery is automatically handled to avoid conflicts. See the reference code below. See [Webpack Provide Plugin](https://webpack.js.org/plugins/provide-plugin/) for more details.

    ```
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      $j: 'jquery'
    }),
    ```
    
    What you need to do for easy import of these plugins is to register it under ```resolve.alias``` in the webpack.config.js. See below for example,
    ```
    resolve: {
        modules: [
          "node_modules"
        ],
        alias: {
          niceSelect: path.resolve(__dirname, 'node_modules/jquery-nice-select/js/jquery.nice-select.js'),
        }
    },
    ```
    
    Then you can import the module like ```import niceSelect from 'niceSelect';``` so

    More information on this can be found at [resolve webpack](https://webpack.js.org/configuration/resolve/)

3. One major difference between YEO and YEOGURT is YEO doesn't create a ```tmp``` folder when running development mode. Everything is serverd via available memmory. 

## Getting To Know Yeoman
 * Feel free to [learn more about Yeoman](http://yeoman.io/).

## License
MIT © [Stephen Orioste]