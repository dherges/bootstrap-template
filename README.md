bootstrap-template
==================

A project template to quickly kick-off a project based on Twitter's Bootstrap framework.

## Kick-Off

Checkout or download, then

	cd {my-project-directory}
	npm install
	bower install
	grunt

And there you go! Off and running!


## Package and Dependency Management

Build tool dependencies are managed by npm, project package management is done by bower.

It's required that you have [node](http://nodejs.org "node.js") and [npm](https://npmjs.org "npm") installed on your system. Then, all other dependencies are managed (including bower which is manageable through npm – wooohooo, how meta that is!).

 * Install local dependencies for build tools (as specified in package.json):
   * `npm install`
 * Install local dependencies for packaging (as specified in component.json):
   * `bower install` or
   * `node_modules/.bin/bower install`
 * Let grunt do a demo build:
   * `grunt`

### Node Dependencies

Dependencies for build tools (grunt, recess, jshint, et al.) are specified in the package.json file. These are managed by npm.

### Bower Dependencies

Dependencies for packaging and distributing the project (bootstrap, jquery, et al.) are specified in component.json file. These are managed by bower.


## Project Structure

With resolved and installed dependencies, the project file structure should look like this:

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
	Gruntfiles.js    # grunt task definitions
	bower.json       # bower dependency definitions
	package.json     # node dependency definitions
	recess-checkstyle.json  # checkstyle report configuration for grunt's recess:checkstyle task
	recess.json      # RECESS linter configuration

Feel free to mix and max and to adapt to the needs of your very own project!


## Grunt my build

TODO: give some description of the grunt tasks
