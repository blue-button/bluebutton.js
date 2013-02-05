# Helpers (helpers.rb)

helpers do
  
  def menu_link(text, path)
    if params[:splat][0] == path[1..-1]  # ignore first '/'
      "<li class='active'><div>#{text}</div></li>"
    else
      "<li><a href='#{path}'><div>#{text}</div></a></li>"
    end
  end
  
  def render_doc(url)
    path = 'views/docs/' << url
    
    # Deal with trailing '/'
    if path[-1] == '/'
      redirect url[0..-2]
    end
    
    if File.exists?(path + '/index.md')
      render_file(path + '/index.md')
    elsif File.exists?(path + '.md')
      render_file(path + '.md')
    else
      raise error 404
    end
  end
  
  def render_file(path)
    erb render_md(File.read(path)), :layout => :'layouts/docs'
  end
  
  def render_md(md)
    rc =  Redcarpet::Markdown.new(
            Redcarpet::Render::HTML.new(:hard_wrap => true),
            :autolink => true,
            :space_after_headers => true,
            :fenced_code_blocks => true,
            :no_intra_emphasis => true,
            :strikethrough => true,
            :tables => true,
            :superscript => true )
      
    rc.render(md)
  end
  
end
