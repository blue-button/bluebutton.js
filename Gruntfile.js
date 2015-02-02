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
          "<%= bb.src %>/parsers/c32/document.js",
          "<%= bb.src %>/parsers/c32/allergies.js",
          "<%= bb.src %>/parsers/c32/demographics.js",
          "<%= bb.src %>/parsers/c32/encounters.js",
          "<%= bb.src %>/parsers/c32/immunizations.js",
          "<%= bb.src %>/parsers/c32/results.js",
          "<%= bb.src %>/parsers/c32/medications.js",
          "<%= bb.src %>/parsers/c32/problems.js",
          "<%= bb.src %>/parsers/c32/procedures.js",
          "<%= bb.src %>/parsers/c32/vitals.js",
          
          "<%= bb.src %>/parsers/ccda.js",
          "<%= bb.src %>/parsers/ccda/document.js",
          "<%= bb.src %>/parsers/ccda/allergies.js",
          "<%= bb.src %>/parsers/ccda/care_plan.js",
          "<%= bb.src %>/parsers/ccda/demographics.js",
          "<%= bb.src %>/parsers/ccda/encounters.js",
          "<%= bb.src %>/parsers/ccda/free_text.js",
          "<%= bb.src %>/parsers/ccda/functional_statuses.js",
          "<%= bb.src %>/parsers/ccda/immunizations.js",
          "<%= bb.src %>/parsers/ccda/instructions.js",
          "<%= bb.src %>/parsers/ccda/results.js",
          "<%= bb.src %>/parsers/ccda/medications.js",
          "<%= bb.src %>/parsers/ccda/problems.js",
          "<%= bb.src %>/parsers/ccda/procedures.js",
          "<%= bb.src %>/parsers/ccda/smoking_status.js",
          "<%= bb.src %>/parsers/ccda/vitals.js",
          
          "<%= bb.src %>/renderers.js",
          "<%= bb.src %>/renderers/c32.js",
          "<%= bb.src %>/renderers/ccda.js",
          
          "<%= bb.src %>/bluebutton.js"
        ],
        dest: "<%= bb.build %>/bluebutton.js"
      }
    },

    copy: {
      ejs: {
        files: [{
          cwd: ".",
          src: "<%= bb.src %>/generators/ccda_template.ejs",
          dest: "<%= bb.build %>/ccda_template.ejs",
          expand: false
        }]
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
        src: [
          "<%= bb.build %>/bluebutton.js",
          "<%= bb.src %>/documents.js"
        ]
      },
      amd: {
        options: {
          specs: "<%= bb.test %>/amd_specs/*_spec.js",
          vendor: ["<%= bb.test %>/helpers/*.js"],
          template: require('grunt-template-jasmine-requirejs')
        },
        src: [
          "<%= bb.build %>/bluebutton.js",
          "<%= bb.src %>/documents.js"
        ]
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
    "copy",
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
