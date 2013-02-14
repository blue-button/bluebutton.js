# Routes (routes.rb)

get '/' do
  erb :home, :layout => :'layouts/home'
end

get '/about' do
  render_md('about', :layout => :'layouts/page')
end

get '/community' do
  render_md('community', :layout => :'layouts/page')
end

get '/contributing' do
  render_md('contributing', :layout => :'layouts/page')
end

# Tests

get '/json' do
  render_md('json', :layout => :'layouts/page')
end

get '/docs/?' do
  redirect '/docs/getting_started'
end

get '/docs/*' do
  render_doc(params[:splat][0])
end

# Errors

error 404 do
  "404: Not Found!"
end
