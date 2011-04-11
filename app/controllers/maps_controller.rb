CartoDB::Settings   = YAML.load_file("#{File.dirname(__FILE__)}/config/cartodb_config.yml")[ENV["RACK_ENV"]] unless defined? CartoDB::Settings
CartoDB::Connection = CartoDB::Client::Connection.new unless defined? CartoDB::Connection

class MapsController < ApplicationController
  

  def new

    @cartodb =  CartoDB::Connection
    @cartodb.query("SELECT * from mapbrd")    
    
    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => "feo" }
    end
  end
  
end
