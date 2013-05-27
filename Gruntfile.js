module.exports = function(grunt) {

  // Configurable paths
  var bbConfig = {
    build: "./build",
    src: "./src",
    test: "./spec/javascripts",
    samples: "./sample_data"
  };

  // Project configuration.
  grunt.initConfig({
    bb: bbConfig,
    pkg: grunt.file.readJSON("package.json"),
    banner: "/* BlueButton.js -- <%= pkg.version %> */\n\n",

    clean: {
      build: ["<%= bb.build %>/*.js"],
      // bug in grunt-contrib-jasmine (0.4.2) doesn't tear this folder down
      // so we manually delete it
      test: ["./.grunt"]
    },

    concat: {
      all: {
        options: {
          banner: "<%= banner %>",
          separator: ";\n\n"
        },
        src: [
          "<%= bb.src %>/core.js",
          "<%= bb.src %>/sections/allergies.js",
          "<%= bb.src %>/sections/demographics.js",
          "<%= bb.src %>/sections/encounters.js",
          "<%= bb.src %>/sections/immunizations.js",
          "<%= bb.src %>/sections/labs.js",
          "<%= bb.src %>/sections/medications.js",
          "<%= bb.src %>/sections/problems.js",
          "<%= bb.src %>/sections/procedures.js",
          "<%= bb.src %>/sections/vitals.js",
          "<%= bb.src %>/bluebutton.js"
        ],
        dest: "<%= bb.build %>/bluebutton.js"
      }
    },

    uglify: {
      all: {
        options: {
          banner: "<%= banner %>",
          wrap: "BlueButton"
        },
        src: "<%= bb.build %>/bluebutton.js",
        dest: "<%= bb.build %>/bluebutton.min.js"
      }
    },

    copy: {
      all: {
        expand: true,
        src: "<%= bb.samples %>/**",
        dest: "<%= bb.build %>"
      }
    },

    jasmine: {
      test: {
        src: "<%= bb.build %>/bluebutton.js",
        options: {
          specs: "<%= bb.test %>/*_spec.js",
          vendor: ["<%= bb.test %>/helpers/*.js"]
        }
      }
    }
  });

  // Load all grunt tasks starting with "grunt-"
  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

  // Define tasks
  grunt.registerTask("default", ["clean", "concat", "uglify", "copy"]);
  grunt.registerTask("test", ["default", "jasmine", "clean:test"]);

};