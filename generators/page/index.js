'use strict';
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  writing() {
    let pages = this.config.get('pages');
    if (pages === undefined) {
      pages = [];
      pages.push(this.arguments[0]);
    } else {
      pages.push(this.arguments[0]);
    }
    this.config.set('pages', pages);

    this.fs.copyTpl(
      this.templatePath('page.pug'),
      this.destinationPath(`src/${this.arguments}/index.pug`),
      {
        name: this.arguments
      }
    );
  }
};
