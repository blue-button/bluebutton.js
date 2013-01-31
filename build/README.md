# About The Builds

`Rake build` will build two JavaScript files (where "#.#.#" is the version number):

 - bluebutton-#.#.#-dev.js (the development build)
 - bluebutton-#.#.#.js (the production build)

The production build is functionally equivalent to the development build, however the production adds a closure around the resulting code to reduce globals and is minified and locally optimized using Google's Closure Compiler.

The `dev` build should only be used for development and testing purposes.
