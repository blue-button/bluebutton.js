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
      build: ["<%= bb.build %>"]
    },

    jshint: {
      options: {
        jshintrc: ".jshintrc"
      },
      beforeconcat: {
        src: ["<%= bb.src %>/{,*/}*.foo"]
      },
      afterconcat: {
        src: ["<%= bb.build %>/{,*/}*.foo"]
      }
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

    umd: {
     all: {
       src: "<%= bb.build %>/bluebutton.js",
       objectToExport: "BlueButton"
     }
   },

    uglify: {
      all: {
        options: {
          banner: "<%= banner %>"
        },
        src: "<%= bb.build %>/bluebutton.js",
        dest: "<%= bb.build %>/bluebutton.min.js"
      }
    },

    jasmine: {
      browser: {
        options: {
          specs: "<%= bb.test %>/browser_specs/*_spec.js",
          vendor: ["<%= bb.test %>/helpers/*.js"]
        },
        src: "<%= bb.build %>/bluebutton.js",
      },
      amd: {
        options: {
          specs: "<%= bb.test %>/amd_specs/*_spec.js",
          vendor: ["<%= bb.test %>/helpers/*.js"],
          template: require('grunt-template-jasmine-requirejs')
        },
        src: "<%= bb.build %>/bluebutton.js",
      }
    },

    jasmine_node: {
      specNameMatcher: "_spec", // load only specs containing specNameMatcher
        projectRoot: "<%= bb.test %>/node_specs",
        requirejs: false,
        forceExit: true,
        isVerbose: false,
        jUnit: {
          report: false,
          savePath : "./build/reports/jasmine/",
          useDotNotation: true,
          consolidate: true
        }
    },

    watch: {
      all: {
        files: "<%= bb.src %>/**/*.js",
        tasks: ["default"],
        options: {
          interrupt: true,
        }
      }
    }
  });

  // Load all grunt tasks starting with "grunt-"
  require("matchdep").filterDev("grunt-contrib-*").forEach(grunt.loadNpmTasks);
  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-umd');

  // Define tasks
  grunt.registerTask("default", [
    "clean",
    "jshint:beforeconcat",
    "concat",
    "umd",
    "jshint:afterconcat",
    "uglify"
  ]);
  
  grunt.registerTask("test", [
    "default",
    "jasmine",
    "jasmine_node"
  ]);

};