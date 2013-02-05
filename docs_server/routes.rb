# Routes (routes.rb)

get '/' do
  erb :home, :layout => :'layouts/home'
end

get '/*' do
  render_doc(params[:splat][0])
end

# Errors

error 404 do
  "404: Not Found!"
end
