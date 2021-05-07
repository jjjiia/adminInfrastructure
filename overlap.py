from shapely.geometry import shape
from shapely.geometry import Polygon
from shapely.geometry import MultiPolygon
import json
import fiona 
files = [ "cityCouncil.geojson",
 "fireDivisions.geojson",
"schoolDistricts.geojson",		
"tracts.geojson",
"borough.geojson",		
"congressionalDistricts.geojson",	
"stateAssemblyDistricts.geojson",	
"policePrecincts.geojson",		
"stateSenate.geojson",		
"zipcode.geojson"]


p1 = Polygon([(0,0), (1,1), (1,0)])
p2 = Polygon([(0,1), (1,0), (1,1)])
print(p1.intersects(p2))

#
# path = "shapefiles/nyad_21a/nyad.shp"
#
# c = fiona.open(path)
# pol = c.next()
# print(pol['properties'])
# geom = shape(pol['geometry'])
# print(geom)
# Multi = MultiPolygon([shape(pol['geometry']) for pol in fiona.open(path)])
#
#


def makePolygons(fileName,idName):    
    with open("geoData/"+fileName) as f:
        data = json.load(f)
    layer = {}
    for i in range(len(data["features"])):
        gid = data["features"][i]["properties"][idName]
        #print(gid)
        geo = data["features"][i]["geometry"]["coordinates"]
        coords = []
        flat = getSinglePolygon(geo,coords)
        
        #flat = flatten_json(geo)
         #print (flat)
        #print (flat)
        p = Polygon(flat)
        p2=p.buffer(0)
        if p2.is_valid == False:
            print( "false")
            
        layer[gid]=p2
    return layer
     

def getSinglePolygon(polygonString,coords):
    for p in polygonString:
        #print(len(p))
        if len(p)==2 and type(p[0]) is not list:
            coords.append(p)
            #print (p)
        else:
            getSinglePolygon(p,coords)
    return coords

def flatten_json(y):
    out = {}
    test =[]
    def flatten(x, name=''):
        if type(x) is dict:
            for a in x:
                flatten(x[a], name + a + '_')
        elif type(x) is list:
            i = 0
            for a in x:
                flatten(a, name + str(i) + '_')
                i += 1
        else:
            out[name[:-1]] = x
            test.append(x)

    flatten(y)
   # print(test)
    print (out.keys())
    return test
    return out

layerUniqueIds = {
	"borough":"BoroName",
	"zipcode":"ZIPCODE",
	"policePrecincts":"Precinct",
	"congressionalDistricts":"CongDist",
	"stateAssemblyDistricts":"AssemDist",
	"stateSenate":"StSenDist",
	"tracts":"BoroCT2010",
	"schoolDistricts":"SchoolDist",
	"cityCouncil":"CounDist",
    "fireDivisions":"FireDiv"
}

polygonLayers = {}
for f in files:
    print (f)
    layerName = f.split(".")[0]
    polygonLayers[layerName]=makePolygons(f,layerUniqueIds[layerName])
    #break
#print (polygonLayers)

intersections = {}

for i in polygonLayers:
    print (i)
    intersections[i]={}
    layer1 = polygonLayers[i]
    for l in layer1:
        #print (l)
        p1 = layer1[l]
        intersections[i][l]={}
        for j in polygonLayers:
            #print (j)
            if i!=j:
                intersections[i][l][j]=[]
                layer2 =  polygonLayers[j]
                for m in layer2:
                    p2 = layer2[m]
                    if p1.intersects(p2):
                        intersections[i][l][j].append(m)

#print(intersections)
with open('intersections.json', 'w') as outfile:
    json.dump(intersections, outfile)