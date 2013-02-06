# Helpers (helpers.rb)

helpers do
  
  LATEST_BUILD = "https://raw.github.com/blue-button/bluebutton.js/master/build/bluebutton-0.0.0.js"
  
  def menu_link(text, path)
    if params[:splat][0] == path[1..-1]  # ignore first '/'
      "<li class='active'><div>#{text}</div></li>"
    else
      "<li><a href='#{path}'><div>#{text}</div></a></li>"
    end
  end
  
  def header_link(text, path)
    if request.path == path
      "<li class='active'>#{text}</li>"
    else
      "<a href='#{path}'><li>#{text}</li></a>"
    end
  end
  
  def render_doc(url)
    layout = { :layout => :'layouts/docs' }
    path = 'docs/' << url
    base_path = 'views/docs/' << url
    
    # Deal with trailing '/'
    if path[-1] == '/'
      redirect url[0..-2]
    end
    
    # Look for 'index.md' if it exists
    if File.exists?(base_path + '/index.md')
      render_md(path + '/index.md', layout)
    end
    
    render_md(path, layout)
  end
  
  def render_md(path, layout)
    path = 'views/' << path << '.md'
    
    unless File.exists?(path)
      raise error 404
    end
    
    md = File.read(path)
    rc =  Redcarpet::Markdown.new(
            Redcarpet::Render::HTML.new(:hard_wrap => true),
            :autolink => true,
            :space_after_headers => true,
            :fenced_code_blocks => true,
            :no_intra_emphasis => true,
            :strikethrough => true,
            :tables => true,
            :superscript => true )
      
    md_rendered = rc.render(md)
    erb md_rendered, layout
  end
  
end
