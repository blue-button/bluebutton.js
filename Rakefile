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
  
  puts "\nBuilding BlueButton.js".task
  
  manifest = File.open("manifest.json", "r") { |f| f.read }
  manifest = JSON.parse(manifest).symbolize_keys
  
  # Contains the assembled JS
  dev_js = prod_js = manifest[:copyright] += "\n// v.#{manifest[:version]}\n\n"
  
  # Check for compiler
  if !File.exist?("vendor/compiler.jar")
    
    puts "  Could not find compiler!".error
    
    msg = <<-msg
    
    Google's Closure Compiler is needed to build BlueButton.js.
    
    1) Download it from:
        http://closure-compiler.googlecode.com/files/compiler-latest.zip
    2) Unzip and place 'compiler.jar' in the 'vendor' directory.
    
msg

    puts msg
    exit
  end
  
  ### COMPILER COMMANDS ###
  
  # Example:
  #   "java -jar compiler.jar --js hi.js --js_output_file hi.min.js"
  compiler_cmd = "java -jar vendor/compiler.jar"
  
  puts "", "  Adding files:"
  manifest[:files].each do |js_file|
    print "    #{js_file}.js\n"
    compiler_cmd << " --js #{manifest[:src_path]}#{js_file}.js"
  end
  
  ### PRODUCTION BUILD ###
  
  print "\n  Compiling production build..."
  result = `#{compiler_cmd << " 2>&1"}`
  
  # If an error occurred
  unless $?.exitstatus.zero?
    puts "failed!"
    puts result.error
    exit
  end
  
  # Add a closure
  prod_js += "\n(function () {\n" << result << "})();"
  prod_path = "#{manifest[:build_path]}bluebutton-#{manifest[:version]}.js"
  File.open(prod_path, "w") { |f| f.puts(prod_js) }
  
  print "done!"
  
  ### DEVELOPMENT BUILD ###
  
  print "\n  Assembling development build..."
  
  manifest[:files].each do |js_file|
    dev_js << "\n\n" <<
      File.open("#{manifest[:src_path]}#{js_file}.js", "r") { |f| f.read }
  end
  
  dev_path = "#{manifest[:build_path]}bluebutton-#{manifest[:version]}-dev.js"
  File.open(dev_path, "w") { |f| f.puts(dev_js) }
  
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


desc "Build One Pager"
task :page do
  
  puts "\nBuilding page BlueButton.html".task
  
  xml = File.open("sample_data/ccda/Greenway_CCDA_Adam_Everyman.xml", "r") { |f| f.read }
  xml.gsub!('&','&amp;')
  
  bbjs = File.open("build/bluebutton-latest-dev.js", "r") { |f| f.read }
  
  page = <<-page
<!DOCTYPE html>
<head>
  <title>Blue Button</title>
</head>
<body>
  <pre id="result"></pre>
  <textarea id="xml" style="display:none">
page
  
  page << xml
  
  page << <<-page
  </textarea>
  <script>
page
  
  page << bbjs
  
  page << <<-page
  </script>
  <script>
    var xml = document.getElementById('xml').value;
    var bb = BlueButton(xml);
    var el = document.getElementById('result');
    el.innerHTML = bb.data.json();
  </script>
</body>
</html>
page
  
  File.open("build/bluebutton.html", "w") { |f| f.puts(page) }
  
  `cp build/bluebutton.html docs_server/public/`
  
  msg = <<-msg

  Files written:
    build/bluebutton.html
    docs_server/public/bluebutton.html
msg

  puts msg.success
  
end

desc "Build All"
task :all do
  Rake::Task["build"].execute
  Rake::Task["page"].execute
end

task :default => :all
