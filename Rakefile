require 'json'

class String
  def error
    # red => \e[0;31
    # red/bold => \e[1;31m
    "\n\e[0;31m#{self}\e[0m"
  end
  def task
    "\e[1;34m#{self}\e[0m"
  end
  def success
    "\e[0;32m#{self}\e[0m"
  end
end

class Hash
  def symbolize_keys
    keys.each do |key|
      self[(key.to_sym rescue key) || key] = delete(key)
    end
    self
  end
end

desc "Build BlueButton.js"
task :build do
  
  puts "\nBuilding BlueButton.js".task, ""
  
  manifest = File.open("manifest.json", "r") { |f| f.read }
  manifest = JSON.parse(manifest).symbolize_keys
  
  # Contains the assembled JS
  dev_js = prod_js = manifest[:copyright] += "\n// v.#{manifest[:version]}\n\n"
  
  ### COMPILER COMMANDS ###
  
  # Example:
  #   "java -jar compiler.jar --js hi.js --js_output_file hi.min.js"
  compiler_cmd = "java -jar #{manifest[:compiler_path]}"
  
  puts "  Adding files:"
  manifest[:files].each do |js_file|
    print "    #{js_file}.js\n"
    compiler_cmd << " --js #{manifest[:src_path]}#{js_file}.js"
  end
  
  dev_cmd = prod_cmd = compiler_cmd
  dev_cmd += " --compilation_level WHITESPACE_ONLY" <<
             " --formatting PRETTY_PRINT"
  
  ### DEVELOPMENT BUILD ###
  
  print "\n  Compiling development build..."
  result = `#{dev_cmd << " 2>&1"}`
  
  # If an error occurred
  unless $?.exitstatus.zero?
    puts "failed!"
    puts result.error
    exit
  end
  
  dev_js += result
  dev_path = "#{manifest[:build_path]}bluebutton-#{manifest[:version]}-dev.js"
  File.open(dev_path, "w") { |f| f.puts(dev_js) }
  
  print "done!"
  
  ### PRODUCTION BUILD ###
  
  print "\n  Compiling production build..."
  result = `#{prod_cmd << " 2>&1"}`
  
  # Add a closure
  prod_js += "\n(function () {\n" << result << "})();"
  prod_path = "#{manifest[:build_path]}bluebutton-#{manifest[:version]}.js"
  File.open(prod_path, "w") { |f| f.puts(prod_js) }
  
  print "done!"
  
  ### MAKING COPIES ###
  
  `cp #{dev_path} build/bluebutton-latest-dev.js`
  `cp #{prod_path} build/bluebutton-latest.js`
  `cp build/bluebutton-latest-dev.js docs_server/public/`
  `cp build/bluebutton-latest.js docs_server/public/`
  
  ### DONE ###
  
msg = <<-msg


  Files written:
    #{dev_path}
    #{prod_path}
    build/bluebutton-latest-dev.js
    build/bluebutton-latest.js
    docs_server/public/bluebutton-latest-dev.js
    docs_server/public/bluebutton-latest.js
msg

  puts msg.success
  
end

task :default => :build

