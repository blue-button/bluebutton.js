module.exports = function(grunt) {
  
  // Configurable paths
  var bbConfig = {
    build: "./build",
    src: "./lib",
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
        src: ["<%= bb.src %>/{,*/}*.js"]
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
          "<%= bb.src %>/core/codes.js",
          "<%= bb.src %>/core/xml.js",
          
          "<%= bb.src %>/documents.js",
          "<%= bb.src %>/documents/c32.js",
          "<%= bb.src %>/documents/ccda.js",
          
          "<%= bb.src %>/generators.js",
          "<%= bb.src %>/generators/c32.js",
          "<%= bb.src %>/generators/ccda.js",
          
          "<%= bb.src %>/parsers.js",
          "<%= bb.src %>/parsers/c32.js",
          "<%= bb.src %>/parsers/ccda.js",
          
          "<%= bb.src %>/renderers.js",
          "<%= bb.src %>/renderers/c32.js",
          "<%= bb.src %>/renderers/ccda.js",
          
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
      all: "<%= bb.test %>/node_specs",
      options: {
        specNameMatcher: "_spec", // load only specs containing specNameMatcher
        requirejs: false,
        forceExit: true,
        isVerbose: false,
        jUnit: {
          report: false,
          savePath : "./build/reports/jasmine/",
          useDotNotation: true,
          consolidate: true
        }
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
