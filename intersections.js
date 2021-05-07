//TODO:
//change to not plural for file/layer names
//list intersections
//drawlayers
//network graph?
//more info for each datalyer - representatives? precinct captain? school head?

//"F_THEME1","F_THEME2", "F_THEME3", "F_THEME4"
var map;
var clicked = false
var currentAdmins = {}
// var files = [// "block.geojson",
//  "cityCouncil.geojson",
//   "congressionalDistricts.geojson",
//   // "electionDistricts.geojson",
//  "policePrecincts.geojson",
//   "stateAssemblyDistricts.geojson",
//   "stateSenate.geojson",
//   "tracts.geojson",
//  "zipcode.geojson",
// "borough.geojson"
// ]
	
	var root = "geoData/"
	var layers = [
		//"borough",
		"zipcode",
		"policePrecinct",
		"congressionalDistrict",
		"stateAssemblyDistrict",
		"stateSenate",
		"tract",
		"cityCouncil",
		"schoolDistrict",
		"fireDivision"
	]
	var layerUniqueIds = {
		borough:"BoroName",
		zipcode:"ZIPCODE",
		policePrecinct:"Precinct",
		congressionalDistrict:"CongDist",
		stateAssemblyDistrict:"AssemDist",
		stateSenate:"StSenDist",
		tract:"BoroCT2010",
		schoolDistrict:"SchoolDist",
		cityCouncil:"CounDist",
		fireDivision:"FireDiv"
	}
	var layerLabel = {
		borough:"Borough",
		zipcode:"Zipcode",
		policePrecinct:"Police Precinct",
		congressionalDistrict:"Congressional District",
		stateAssemblyDistrict:"State Assemmbly District",
		stateSenate:"State Senate District",
		tract:"Census Tract",
		schoolDistrict:"School District",
		cityCouncil:"City Council District",
		fireDivision:"Fire Division"
	}
	
	var promises = []
    for(var i in layers){
    	promises.push(d3.json(root+layers[i]+".geojson"))
    }	
var colors = ["#bb7051",
"#7b62cc",
"#78b642",
"#c163b9",
"#50b189",
"#d24c3c",
"#688dcd",
"#cd9c3f",
"#c85782",
"#73843b"] 
	
 Promise.all([d3.json("intersections.json")])
 .then(function(data){
	   var map = drawMap(data[0])
})
//click layer
//show a layer
//


function drawMap(intersections){
//	console.log(intersections)
	//console.log("map")
    d3.select("#map").style("width",window.innerWidth+"px")
          .style("height",window.innerHeight+"px")
    mapboxgl.accessToken = "pk.eyJ1IjoiampqaWlhMTIzIiwiYSI6ImNpbDQ0Z2s1OTN1N3R1eWtzNTVrd29lMDIifQ.gSWjNbBSpIFzDXU2X5YCiQ"
    map = new mapboxgl.Map({
         container: 'map',
        style:"mapbox://styles/jjjiia123/cko6gwof42j1617kqh2r706sd",//newest
       // style:"mapbox://styles/jjjiia123/ckoeh9hz9413117qhmh6w4mza",
		 zoom: 10,
		//pitch: 30,
	   maxZoom:12.5,
	   minZoom:9,
	   bearing: 28,
		center: [-74,40.73]
     });
	 
	 map.getCanvas().style.cursor = "unset";

	 var filters = {}
     
	 
     map.on("load",function(){
		 d3.selectAll(".mapboxgl-ctrl-bottom-right").remove()
		 d3.selectAll(".mapboxgl-ctrl-bottom-left").remove()
		
		var activeLayer = ""
		
	 for(var i in layers){
 			//map.setFilter(layers[i]+"_hover",["==","",""])
		d3.select("#key").append("div")
		 .attr("id",layers[i])
		 .attr("class","bars")
		 .style("padding","5px")
		 //.style("height","40px")
		 .style("cursor","pointer")
		 .on("mouseover",function(){d3.select(this).style("background-color","#eee")})
		 .on("mouseout",function(){d3.select(this).style("background-color","#fff")})
		 .on("click",function(event,d){
		 	var layerName = d3.select(this).attr("id")
			 d3.selectAll(".bars").style("border","none")
			 d3.select(this).style("border","3px solid black")
			 for(var k in layers){
		   		 map.setPaintProperty(layers[k]+"_hover",'fill-opacity',0.2);
			 }
	   		 map.setPaintProperty(layerName+"_hover",'fill-opacity',1);
			 activeLayer  = layerName
			 			 //
			 // console.log(activeLayer)
			 // console.log(currentAdmins[activeLayer])
			
			 
			 d3.selectAll(".shared").remove()
			 d3.selectAll("#"+activeLayer).style("visiblity","visible")
			 d3.select("#"+layerName+"_shared")
			 //.html("<strong>"+layerLabel[activeLayer]+" "+currentAdmins[activeLayer]["gid"]+"</strong> also governs ")
			 .append("div")
			 .attr("class","shared")
			 .html("is share between:")
				 .style("font-size","12px")
			 for(var a in currentAdmins[activeLayer]){			 	//
			 	// console.log([a,layerLabel[a]])
			 	// 				 console.log(currentAdmins[activeLayer][a])
				 if(a!="gid"){
					 if(a=="tract"){
						 // console.log(currentAdmins[activeLayer][a])
						 d3.select("#"+layerName+"_shared")
						 .append("div").html("<strong>"+currentAdmins[activeLayer][a].length+" census tracts</strong>")
						  .attr("class","shared")//.style("width","200px")
						 .style("font-size","10px")
						 .style("padding-right","10px")
					 }else{
						 d3.select("#"+layerName+"_shared")
						 .append("div")
						  .attr("class","shared").html("<strong>"+layerLabel[a]+"s:</strong> "+currentAdmins[activeLayer][a].join(", "))
						 .style("padding-right","10px")
						 .style("font-size","10px")
					 }
					
				 }
				
			 }
				 
		 })
		 
		 // d3.select("#"+layers[i]).append("div").attr("id",layers[i]+"_box")
 // 		 .attr("class","key")
 // 		 .style("width","10px")
 // 		 .style("height","10px")
 // 		 .style("padding","4px")
 // 		 .style("background-color",colors[i])
 // 		 // .style("display","inline-block")
 // 		 .style("vertical-align","top")
 // 		 //.style("visibility","hidden")
		 
		 d3.select("#"+layers[i]).append("div").attr("id",layers[i]+"_text")
		 .attr("class","key")
		 // .style("display","inline-block")
		 .style("vertical-align","top")
		 .style("padding-left","4px")
		 // .style("height","10px")
		 .html(layerLabel[layers[i]])
		 .style("background-color",colors[i])
		 .style("color","#fff")
		 .style("opacity",".8")
		 //.style("visibility","hidden")
		 
		 d3.select("#"+layers[i]).append("div").attr("id",layers[i]+"_shared")
		// .attr("class","shared")
		 // .style("display","inline")
		 // .style("height","200px")
		 .style("width","200px")
		 .style("font-size","10px")
		 
 		 map.setFilter(layers[i]+"_hover",["==","",""])
   		 map.setPaintProperty(layers[i]+"_hover",'fill-opacity',0);
		 map.setPaintProperty(layers[i]+"_hover",'fill-color',colors[i]);
		 map.setPaintProperty(layers[i],'fill-opacity',0);
		 
		 
		map.on("click",layers[i],function(c){
			var feature = c.features[0]
			//console.log(feature)
			 d3.selectAll(".shared").remove()

 			var layerName = c.features[0].layer.id
			var filterKey = layerUniqueIds[layerName]
			var filterValue = feature.properties[filterKey]
			//displayText+=layerName+" "+filterKey+": "+filterValue
			
			filters[layerName] = {key:filterKey, value:filterValue}
			//console.log([layerName,filterValue])
			d3.select("#key").style("visibility","visible")

			d3.select("#"+layerName+"_text").html(layerName
				+"<br><span style=\"font-size:20px\"><strong>"+filterValue+"</strong></span>")
			d3.selectAll("#layerName")
				
	   		 map.setPaintProperty(layerName+"_hover",'fill-opacity',.3);
 			map.setFilter(layerName+"_hover",["==",filterKey,filterValue])
			 			 //
			  // console.log(layerName)
// 			  console.log(intersections[layerName][filterValue])
//
			 currentAdmins[layerName]=intersections[layerName][filterValue]
			 currentAdmins[layerName]["gid"]=filterValue
 	    })
 	}

	 })

      return map
}

function addPolygon(layerName,filterKey,filterValue){
	
}
