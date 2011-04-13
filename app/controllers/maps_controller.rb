CartoDB::Settings   = YAML.load_file("#{File.dirname(__FILE__)}/config/cartodb_config.yml")[ENV["RACK_ENV"]] unless defined? CartoDB::Settings
CartoDB::Connection = CartoDB::Client::Connection.new unless defined? CartoDB::Connection

class MapsController < ApplicationController
  

  def show
    @uuid = params[:uuid]
    
    #Check if the uuid is in cartodb or not
    sql ="select * from mapbrd where uuid = '#{@uuid.gsub(/\\/, '\&\&').gsub(/'/, "''")}'"
    
    @cartodb = CartoDB::Connection
    result = @cartodb.query(sql)
    
    if result.rows.empty?
      sql= "INSERT INTO mapbrd(uuid) VALUES('#{@uuid.gsub(/\\/, '\&\&').gsub(/'/, "''")}')"
      @cartodb.query(sql)
      @geojson_data ="  "
    else
      if result.rows.first.the_geom.blank?
        @geojson_data ="{}"
      else
        @geojson_data = result.rows.first.the_geom
      end
    end
    
    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => "feo" }
    end
  end
  
  def get_polygons
    @cartodb = CartoDB::Connection
    sql = "SELECT ST_AsGeoJSON(ST_Transform(the_geom, 4326)) FROM mapbrd WHERE the_geom IS NOT NULL"
    result = @cartodb.query(sql);
    result.to_json
  end

  
  def save
    sql = "UPDATE mapbrd SET the_geom=ST_GeomFromText('#{params[:wkt]}', '4326') WHERE uuid = '#{params[:uuid].gsub(/\\/, '\&\&').gsub(/'/, "''")}'"
    puts sql
    @cartodb = CartoDB::Connection
    result = @cartodb.query(sql)
    
    respond_to do |format|
      format.json { render :json => result.to_json }
    end
  end  
end
