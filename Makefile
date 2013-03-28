#
# Bootstrap Template Project
#
DATE  = $(shell date +%I:%M%p)
CHECK = \033[32m✔\033[39m
HR    = \#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#


### Project Directories
DIR_BUILD    = build/
DIR_REPORTS  = ${DIR_BUILD}reports/
DIR_SRC      = src/
DIR_SRC_JS   = ${DIR_SRC}js/
DIR_SRC_IMG  = ${DIR_SRC}img/
DIR_SRC_LESS = ${DIR_SRC}less/
DIR_DIST     = dist/
DIR_DIST_JS  = ${DIR_DIST}js/
DIR_DIST_CSS = ${DIR_DIST}css/
DIR_DIST_IMG = ${DIR_DIST}img/

### Project Files
# Source Files: add more .less and .js sources here
JS_SRC             = ${DIR_SRC_JS}myproject.js
LESS               = ${DIR_SRC_LESS}myproject.less
LESS_RESPONSIVE    = ${DIR_SRC_LESS}myproject-responsive.less
# Target Files
JS_DIST            = ${DIR_DIST_JS}myproject.js
JS_DIST_MIN        = ${DIR_DIST_JS}myproject.min.js
CSS                = ${DIR_DIST_CSS}myproject.css
CSS_MIN            = ${DIR_DIST_CSS}myproject.min.css
CSS_RESPONSIVE     = ${DIR_DIST_CSS}myproject-responsive.css
CSS_RESPONSIVE_MIN = ${DIR_DIST_CSS}myproject-responsive.min.css
# Report Files
REPORT_JSHINT            = ${DIR_REPORTS}jshint.xml
REPORT_JSHINT_CHECKSTYLE = ${DIR_REPORTS}jshint.checkstyle.xml
REPORT_RECESS            = ${DIR_REPORTS}recess.log
REPORT_RECESS_CHECKSTYLE = ${DIR_REPORTS}recess.checkstyle.xml

### Executables
JSHINT   = ./node_modules/.bin/jshint --config ${DIR_BUILD}jshint.rc
UGLIFYJS = ./node_modules/.bin/uglifyjs
RECESS   = ./node_modules/.bin/recess --config ${DIR_BUILD}recess.json
RECESSCS = ./build/recess2checkstyle --config ${DIR_BUILD}recess.json
BOWER    = ./node_modules/.bin/bower


### Default make target
build: build-start \
       pkg-res \
       recess recess-report recess-compile \
       jshint jshint-report uglifyjs \
       build-finished

.PHONY: build build-start build-finished pkg-res \
        recess recess-report recess-compile \
        jshint jshint-report uglifyjs

build-start:
	@echo "\n${HR}"
	@echo "Building..."
	@rm -rf ${DIR_REPORTS}
	@mkdir -p ${DIR_REPORTS}
	@rm -rf ${DIR_DIST}
	@mkdir -p ${DIR_DIST}
	@mkdir -p ${DIR_DIST_JS}
	@mkdir -p ${DIR_DIST_CSS}
	@mkdir -p ${DIR_DIST_IMG}
	@echo "${HR}\n"

build-finished:
	@echo "\n${HR}"
	@echo "Successfully built at ${DATE}."
	@echo "${HR}\n"


### Package static resources (such as bootstrap.js, jquery.js, and images)
# NOTE: we simply copy these files to the dist directory
pkg-res:
	@echo "Packaging resource files..."
	@cp -r components/bootstrap/docs/assets/js/bootstrap.js ${DIR_DIST_JS}
	@cp -r components/bootstrap/docs/assets/js/bootstrap.min.js ${DIR_DIST_JS}
	@cp -r components/bootstrap/docs/assets/js/html5shiv.js ${DIR_DIST_JS}
	@cp -r components/bootstrap/img/ ${DIR_DIST_IMG}
	@cp -r components/jquery/jquery.js ${DIR_DIST_JS}
	@cp -r components/jquery/jquery.min.js ${DIR_DIST_JS}
	@cp -r components/less/dist/less-1.3.3.js ${DIR_DIST_JS}
	@cp -r components/less/dist/less-1.3.3.min.js ${DIR_DIST_JS}
	@cp -r ${DIR_SRC_IMG} ${DIR_DIST_IMG}
	@echo "Packaged files.                       ${CHECK} Done"


### Less Targets
recess:
	@echo "Running RECESS linter..."
	@${RECESS} ${LESS} ${LESS_RESPONSIVE}
	@echo "Ran RECESS linter.                          ${CHECK} Done"

recess-report:
	@echo "Generating checkstyle report from RECESS linter..."
	@${RECESS} --stripColors $(abspath ${LESS} ${LESS_RESPONSIVE}) > ${REPORT_RECESS}
	@${RECESSCS} $(abspath ${LESS} ${LESS_RESPONSIVE}) > ${REPORT_RECESS_CHECKSTYLE}
	@echo "Generated checkstyle report.                ${CHECK} Done"

recess-compile:
	@echo "Compiling less with RECESS..."
	@${RECESS} --compile ${LESS} > ${CSS}
	@${RECESS} --compile --compress ${LESS} > ${CSS_MIN}
	@${RECESS} --compile ${LESS_RESPONSIVE} > ${CSS_RESPONSIVE}
	@${RECESS} --compile --compress ${LESS_RESPONSIVE} > ${CSS_RESPONSIVE_MIN}
	@echo "Compiled less.                              ${CHECK} Done"


### JavaScript Targets
jshint:
	@echo "Running JSHint on javascript source..."
	@${JSHINT} ${JS_SRC} || true
	@echo "Ran JSHint.                                 ${CHECK} Done"

jshint-report:
	@echo "Generating checkstyle report from JSHint..."
	@${JSHINT} $(abspath ${JS_SRC}) --reporter=node_modules/jshint/lib/reporters/jslint_xml.js > ${REPORT_JSHINT} || true
	@${JSHINT} $(abspath ${JS_SRC}) --reporter=node_modules/jshint/lib/reporters/checkstyle.js > ${REPORT_JSHINT_CHECKSTYLE} || true
	@echo "Generated checkstyle report.                ${CHECK} Done"

uglifyjs:
	@echo "Compiling and minifying javascript..."
	@cat ${JS_SRC} > ${JS_DIST}
	@${UGLIFYJS} -nc ${JS_DIST} > ${JS_DIST_MIN}
	@echo "Compiled and minified javascript.           ${CHECK} Done"


### Bower/NPM Dependencies
component-deps:
	@${BOWER} install

package-deps:
	@npm install

.PHONY: component-deps npm-deps
