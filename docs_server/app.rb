# App Server (app.rb)

require 'sinatra'
require 'sinatra/reloader' if development?
require 'redcarpet'

# Includes
$LOAD_PATH << './'
require 'helpers'
require 'routes'
