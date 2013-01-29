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
task :build, :options do |t, args|
  if args[:options] == "dev" then dev_mode = true end
  
  msg = "\nBuilding BlueButton.js"
  
  if dev_mode
    puts "#{msg} (Development)".task, ""
  else
    puts "#{msg} (Production)".task, ""
  end
  
  manifest = File.open("manifest.json", "r") { |f| f.read }
  manifest = JSON.parse(manifest).symbolize_keys
  
  # The final build containing all the JS
  js_build = ""
  
  # Example:
  #   "java -jar compiler.jar --js hi.js --js_output_file hi.min.js"
  compiler_cmd = "java -jar #{manifest[:compiler_path]}"
  
  puts "  Adding files:"
  manifest[:files].each do |js_file|
    print "    #{js_file}.js\n"
    compiler_cmd << " --js #{manifest[:src_path]}#{js_file}.js"
  end
  
  print "\n  Compiling..."
  
  js_build << manifest[:copyright]
  
  if dev_mode
    compiler_cmd << " --compilation_level WHITESPACE_ONLY" <<
                    " --formatting PRETTY_PRINT"
  else
    # Add a closure
    js_build << "\n(function () {\n"
  end
  
  # TODO: If compiler has errors, print and quit
  result = IO.popen(compiler_cmd << " 2>&1").readlines.join
  
  if result[0..4] == "ERROR"
    puts "failed!"
    puts result.error
    exit
  end
  
  js_build << result
  
  puts "done!",""
  
  # Close the closure
  if !manifest[:dev_mode] then js_build << "})();" end
  
  File.open("#{manifest[:build_path]}", "w") { |f| f.puts(js_build) }
  puts "  File written: #{manifest[:build_path]}".success, ""
  
end





















