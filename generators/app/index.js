'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
	prompting() {
		// Have Yeoman greet the user.
		this.log(yosay(`Welcome to the amazing ${chalk.green('generator-yeo')} generator!`));

		const prompts = [
			{
				type: 'input',
				name: 'name',
				message: 'Your project name',
				default: this.appname // Default
			},
			{
				type: 'input',
				name: 'authorName',
				message: 'Enter author name',
				default: this.appname // Default
			},
			{
				type: 'list',
				name: 'jsPreprocessor',
				message: `What ${chalk.blue('JavaScript preprocessor')} would you like to use?`,
				choices: ['none', 'ES6(using babel)'],
				default: 'ES6(using babel)' // Default
			}
		];

		return this.prompt(prompts).then(props => {
			// To access props later use this.props.someAnswer;
			this.props = props;
		});
	}

	writing() {
		let projectName = String(this.props.name).replace(' ', '-');
		this.config.set('project', projectName);
		this.config.set('author', this.props.authorName);
		this.config.set('jsPreprocessor', this.props.jsPreprocessor);
		this.fs.copyTpl(
			this.templatePath('_package.json'),
			this.destinationPath('package.json'),
			{
				name: projectName,
				authorName: this.props.authorName
			}
		);
		this.fs.copyTpl(this.templatePath('_index.js'), this.destinationPath('index.js'), {
			jsPreprocessor: this.props.jsPreprocessor
		});
		this.fs.copyTpl(
			this.templatePath('_postcss.config.js'),
			this.destinationPath('postcss.config.js')
		);
		this.fs.copyTpl(
			this.templatePath('_tailwind.config.js'),
			this.destinationPath('tailwind.config.js')
		);
		this.fs.copyTpl(
			this.templatePath('_webpack.config.js'),
			this.destinationPath('webpack.config.js'),
			{
				jsPreprocessor: this.props.jsPreprocessor
			}
		);
		this.fs.copyTpl(
			this.templatePath('_.editorconfig'),
			this.destinationPath('.editorconfig')
		);
		this.fs.copyTpl(this.templatePath('_.gitignore'), this.destinationPath('.gitignore'));
		this.fs.copyTpl(
			this.templatePath('_.gitattributes'),
			this.destinationPath('.gitattributes')
		);
		this.fs.copyTpl(this.templatePath('_.eslintrc'), this.destinationPath('.eslintrc'), {
			jsPreprocessor: this.props.jsPreprocessor
		});
		this.fs.copyTpl(this.templatePath('_.babelrc'), this.destinationPath('.babelrc'));
		this.fs.copyTpl(this.templatePath('_README.md'), this.destinationPath('README.md'), {
			name: this.props.name
		});
		this.fs.copyTpl(this.templatePath('src'), this.destinationPath('src'), {
			name: this.props.name,
			jsPreprocessor: this.props.jsPreprocessor
		});
	}

	install() {
		// This.installDependencies();
		this.log(
			`All necessary files are created and we will run ${chalk.yellow(
				'"npm install"'
			)} for you!`
		);
		this.npmInstall();
	}
};
