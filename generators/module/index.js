'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const _ = require('lodash');

module.exports = class extends Generator {
  writing() {
    let modulePath = String(this.arguments);
    let moduleName = String(this.arguments)
      .split('/')
      .slice(-1)[0];

    let convertedClassName = _.camelCase(moduleName);
    convertedClassName = _.upperFirst(convertedClassName);

    if (this.options.atomic) {
      if (
        this.options.atomic === 'atom' ||
        this.options.atomic === 'molecule' ||
        this.options.atomic === 'organism'
      ) {
        this.fs.copyTpl(
          this.templatePath('module.pug'),
          this.destinationPath(
            `src/_modules/${this.options.atomic}s/${modulePath}/${moduleName}.pug`
          ),
          {
            name: moduleName
          }
        );
        this.fs.copyTpl(
          this.templatePath('module.scss'),
          this.destinationPath(
            `src/_modules/${this.options.atomic}s/${modulePath}/${moduleName}.scss`
          ),
          {
            name: moduleName
          }
        );
        this.fs.copyTpl(
          this.templatePath('module.js'),
          this.destinationPath(
            `src/_modules/${this.options.atomic}s/${modulePath}/${moduleName}.js`
          ),
          {
            name: convertedClassName
          }
        );
      } else {
        this.log(
          chalk.red(
            'Invalid input! atomic flag will only recieve 3 options, "atom","molecule" or "organism"'
          )
        );
      }
    } else if (this.arguments.length === 0) {
      this.log(chalk.red('No module name entered. Please enter a module name.'));
    } else {
      this.fs.copyTpl(
        this.templatePath('module.pug'),
        this.destinationPath(`src/_modules/${modulePath}/${moduleName}.pug`),
        {
          name: moduleName
        }
      );
      this.fs.copyTpl(
        this.templatePath('module.scss'),
        this.destinationPath(`src/_modules/${modulePath}/${moduleName}.scss`),
        {
          name: moduleName
        }
      );
      this.fs.copyTpl(
        this.templatePath('module.js'),
        this.destinationPath(`src/_modules/${modulePath}/${moduleName}.js`),
        {
          name: convertedClassName
        }
      );
    }
  }
};
