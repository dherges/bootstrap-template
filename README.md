bootstrap-template
==================

A project template to quickly kick-off a project based on Twitter's Bootstrap framework.

## Kick-Off

Get yourself the source, then

	cd {my-project-directory}
	npm install
	bower install
	grunt

And there you go! Off and running!


## Package and Dependency Management

Build tool dependencies are managed by npm, web package management is done by Bower, and the tool suite is task-automated by Grunt.

It's required that you have [node](http://nodejs.org "node.js") and it's package manager [npm](https://npmjs.org "npm") installed on your system. Usually, npm is distributed alongside node. Then, other dependencies are managed (including Bower which is manageable through npm – wooohooo, how meta that is!).

 * Install local dependencies for build tools (as specified in package.json):
   * `npm install`
 * Install local dependencies for web packages (as specified in component.json):
   * `bower install` or
   * `node_modules/.bin/bower install`
 * Let Grunt do a build:
   * `grunt`


### Node Dependencies

Dependencies for build tools (grunt, recess, jshint, et al.) are specified in the package.json file. These are managed by npm.

### Bower Dependencies

Dependencies for packaging and distributing the project (bootstrap, jquery, et al.) are specified in component.json file. These are managed by bower. Tun run `bower` directly from the command-line, you must have it installed globally on your system: `npm install -g bower`

### Grunt Task Automation

The build tools and their tasks are automated by Grunt and task definitions are specified in Gruntfile.js file. To run `grunt` directly from command-line you must have `grunt-cli` globally installed: `npm install -g grunt-cli`

### PhantomJS QUnit Test Reporting

The Gruntfile ships with a phantom task to automatically run the QUnit test suites and generate a junit-formatted report out of the test results. In order to run the task, you mast have `phantomjs` executable on your command-line. Get it from [http://phantomjs.org](http://phantomjs.org/ "phantomjs").


## Project Structure

With dependencies resolved, the project file structure should look like this:

	components/      ### Web components (bower dependencies)
	dist/            ### Target directory for the distributable package of your project
	node_modules/    ### Development tools (node dependencies)
	src/             ### Source files of your project, containing
		index.html   # a demo page to show-case some things
		img/         # images, e.g. icons, background graphics
		js/          # javascript sources
		less/        # less sources (which should import bootstrap's .less)
		templates/   # template files, e.g. .mustache if you're using mustache
	tasks/           ### Additional grunt tasks, e.g. for jshint, phantomjs
	.jshintrc        # JSHint configuration
	Gruntfiles.js    # Grunt task definitions
	bower.json       # Bower dependency definitions
	package.json     # node dependency definitions
	recess-checkstyle.json  # checkstyle report configuration for grunt's recess:checkstyle task
	recess.json      # RECESS linter configuration

Feel free to mix and max and to adapt to the needs of your very own project!


## Grunt my build

TODO: give some description of the grunt tasks
