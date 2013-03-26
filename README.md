bootstrap-template
==================

A project template to quickly kick-off a project based on Twitter's Bootstrap framework.


# Bootstrap Build Tools

 * Install node.js: [http://nodejs.org](http://nodejs.org "node.js")
 * Install npm.js: [https://npmjs.org](https://npmjs.org, "npm")
 * Install local dependencies by running: `npm install`
 * Do a full build by running: `make`


The makefile provides various make targets. To run an individual target, just run `make TARGETNAME`. See the makefile for target definitions.

In the following, more information about these make targets and the LESS and JavaScript tools.


## LESS

We use RECESS as compiler & code quality tool for our .less files.


### Code Quality

Run on shell:

	make recess
	make recess-repoirt

When used as a linter, RECESS needs a configuration in `recess.json`. The file must contain valid JSON data. Available options can be found at [https://github.com/twitter/recess#programmatic-api](https://github.com/twitter/recess#programmatic-api, "RECESS on GitHub")


### Build

To compile from .less to .css, run on shell:

	make recess-compile



## JavaScript

We use UglifyJS as compiler for our .js files and JSHINT as code quality tool for our .js files.

JSHINT needs a configuration in `jshint.rc`. The file must continain a valid JSHint configuration. Available options can be found at [http://jshint.com/docs/](http://jshint.com/docs/ "JSHInt Documentation").

### Code Quality

Run on shell:

	make jshint
	make jshint-report


### Build

To compile .js, run on shell:

	make uglifyjs

