bootstrap-template
==================

A project template to quickly kick-off a project based on Twitter's Bootstrap framework.

# Kick-Off

Checkout or download, then

	cd {my-project-directory}
	npm install
	bower install
	make

And there you go! Off and running!


# Package and Dependency Management

Build tool dependencies are managed by npm, project package management is done by bower.

It's required that you have [node](http://nodejs.org "node.js") and [npm](https://npmjs.org "npm") installed on your system. Then, all other dependencies are managed (including bower which is managed by npm – wooohooo, how meta that is!).

 * Install local dependencies for build tools (as specified in package.json):
   * `npm install` or
   * `make package-deps`
 * Install local dependencies for packaging (as specified in component.json):
   * `bower install` or
   * `make component-deps`
 * Build the full template project:
   * `make`

## Node Dependencies

Dependencies for build tools (recess, jshint, et al.) are specified in the package.json file. These are managed by npm.

## Bower Dependencies

Dependencies for packaging and distributing the project (bootstrap, jquery, et al.) are specified in component.json file. These are managed by bower.


# Project Structure

When dependencies are resolved and locally installed, the project file structure should look like this:

	build/           ### Build stuff for your project
		reports/     # generated code quality reports
		jshint.rc    # JSHINT configuration file
		recess.json  # RECESS configuration file
	components/      ### Bower dependencies
	dist/            ### Target directory for the distributable
		css/         # package of your project.
		img/         #
		js/          #
	node_modules/    ### Node dependencies
	src/             ### Source directory of your project,
		img/         # containining js, less, images, templates,
		js/          # and other files that make up your project.
		less/        #

## Kick-Off




# Makefile

The makefile provides various make targets so that parts of the project can be built invidually. To run a target, just do `make TARGETNAME`. See the makefile for target definitions.

In the following, more information about these make targets and the LESS and JavaScript tools.


## LESS

We use RECESS as compiler & code quality tool for our .less files.

To use RECESS as a code quality tool, run on shell:

	make recess
	make recess-repoirt

When used as a linter, RECESS needs a configuration in `recess.json`. The file must contain valid JSON data. Available options can be found at [https://github.com/twitter/recess#programmatic-api](https://github.com/twitter/recess#programmatic-api, "RECESS on GitHub")


To use RECESS as a .less compiler and build the .css files, run on shell:

	make recess-compile



## JavaScript

We use UglifyJS as compiler for our .js files and JSHINT as code quality tool for our .js files.

JSHINT needs a configuration in `jshint.rc`. The file must continain a valid JSHint configuration. Available options can be found at [http://jshint.com/docs/](http://jshint.com/docs/ "JSHInt Documentation").

To analyze the JavaScript code quality using JSHINT, run on shell:

	make jshint
	make jshint-report


To concatenate and minify the .js files using UglifyJS, run on shell:

	make uglifyjs

