'use strict';
var lat, lon;
var mapboolean = 0; //antiprosopeuei an prepei na einai emfanismenos o xarths h oxi (0 gia nai ,1 gia oxi)

function match() {
    if (document.getElementById("password").value === document.getElementById("check_pass").value) {
        document.getElementById("error_pass").style.display = "none";
    } else {
        document.getElementById("error_pass").style.display = "block";
    }
}

function validate_position() {
    var response_msg;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) { //response ok
            response_msg = JSON.parse(xmlhttp.responseText);
            if (response_msg.length === 0) {
                document.getElementById("error_location").style.display = "block";
                document.getElementById("show_map").disabled = true;
            } //else shmainei brhke dieu8unsh
            else {
                document.getElementById("error_location").style.display = "none";
                document.getElementById("show_map").disabled = false; //afou epistrafike valid dieu8unsh energopoioume to koumpi
                lat = response_msg[0].lat; //[0] etsi wste an paroume polles dieu8unseis na paroume th sxetikoterh
                lon = response_msg[0].lon; //an er8ei mia dieu8unsh pali swsto einai programmatistika
            }
            if (mapboolean === 1) { //mini trick etsi wste oso allazei ta stoixeia ths anazhthshs o xarths na diagraftei
                show_on_map();
            }
        }
    };

    //send request via get -> hence we put the query on the link
    xmlhttp.open("GET", "https://nominatim.openstreetmap.org/search/" +
        document.getElementById("inputState").options[document.getElementById("inputState").selectedIndex].text +
        "/" + document.getElementById("city").value + "/" +
        document.getElementById("address").value +
        "?format=json", true);
    xmlhttp.send();
}

function add_markers(map, position) {
    var markers = new OpenLayers.Layer.Markers("Markers");
    map.addLayer(markers); //bazw to layer twn markers apo panw 
    markers.addMarker(new OpenLayers.Marker(position)); //topo8etw marker sth topo8esia tou xrhsth
}

function show_on_map() { //pera apo th leitourgia gia show map einai kai state mashine gia emfanish kai eksafanish xarth kata thn allagh stoixeiwn
    if (mapboolean === 0) { //ok katastash,show
        var themap = document.createElement("div");
        themap.id = "themap";
        document.getElementById("map_area").appendChild(themap); //bazw to map sto placeholder tou pou einai to map area
        document.getElementById("themap").style.height = "200px"; //fixed height for page cohession
        var map = new OpenLayers.Map("themap");
        map.addLayer(new OpenLayers.Layer.OSM()); //ftiaxnw to basic layer gia to map
        var fromProjection = new OpenLayers.Projection("EPSG:4326"); // Transform from WGS 1984
        var toProjection = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
        var position = new OpenLayers.LonLat(lon, lat).transform(fromProjection, toProjection);
        add_markers(map, position);
        var zoom = 16;
        map.setCenter(position, zoom); //kentrarw to xarth sth topo8esia
        mapboolean = 1; //arxika htan 0 kai patwntas to show map emfanistike o xarths kai egine 1,se epomeno press tou show map
        //h meso allaghs  ths dieu8unhshs h polhs ,8a ksanakalestei h show map kai o xarths 8a kleisei (to opoio einai to epi8umhto)
    } else { //prepei na kruftei o xarths
        document.getElementById("map_area").removeChild(document.getElementById("themap")); //eite logo allaghs eite apo patima koumpiou delete
        mapboolean = 0; //otan mpei edw h sunarthsh allazei sto 0 wste na ksanaemfanistei o xarths otan path8ei to koumpi
    }
}

function find_me() { //exei elegx8ei h dia8eshmothta,opote amesws kaloume geolocation api
    if (document.getElementById("themap"))
        document.getElementById("map_area").removeChild(document.getElementById("themap"));
    navigator.geolocation.getCurrentPosition(handleposition); //pernaei san orisma sthn sunarthsh handle position thn position pou epistrefei to geolocation api
}

function handleposition(position) {
    var xmlhttp = new XMLHttpRequest();
    var response_msg;
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            response_msg = JSON.parse(xmlhttp.responseText);
            document.getElementById("inputState").value = response_msg.address.country_code.toUpperCase(); //toupper wste na einai o dipshfios kwdikos opws ton exoume kai emeis
            document.getElementById("city").value = response_msg.address.city;
            if (response_msg.address.road)
                document.getElementById("address").value = response_msg.address.road;
            else
                document.getElementById("address").value = "";
            validate_position();
        }
    };
    //ftiaxnoume to get request me bash th position pou labame apto geolocation api
    xmlhttp.open("GET", "https://nominatim.openstreetmap.org/reverse?format=json&lat=" + position.coords.latitude +
        "&lon=" + position.coords.longitude, true);
    xmlhttp.send();
}

function fill_lat_lon() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(update_input_lat_lon);
    }
}

function update_input_lat_lon(position) {
    document.getElementById("lat").value = position.coords.latitude;
    document.getElementById("lon").value = position.coords.longitude;
}