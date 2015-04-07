/*   VARIABILI  */
var divs = ["splash","menu", "homeTheseus", "homeClient", "homeCourier", "dashboard", "request", "communication", "aboutApp","drawer-controller-hide","drawer-controller-show", "profilo", "legend-content","dettaglio","loginForm","legend-position","nuovoIndirizzoForm","nuovoOrdineForm","bacheca","splashScreen","legend-actionbar"];
var mapID = "riccardante.llg16mdf";


// la posizione va presa dal GPS
var posizione = {"lat":"41.800278" , "lon" : "12.238889", "address":"impossibile ottenere la posizione"};



var myTheseusItems = [{"type" : "standalone", "color":"blue", "photo":"XXX"},
                     {"type" : "standalone", "color":"green", "photo":"YYY"}
					 ];




var stati = ["da ritirare", "da consegnare", "consegnato"];
var stato=0;
var azioni = ["Ritira", "Consegna", "Chuso"];
var azione=0;

/* //THESEUS//
var shops = [ {"name":"Gruppo Clark",
                                      "items" : [     
                                                      {"lat":"41.870128" , "lon":"12.467932" , "name": "Ostiense", "items":"2", "address":"Piazza della Radio, 85"},
                                                      {"lat":"41.83682786072714" , "lon":"12.600535154342651" , "name": "Tuscolana", "items":"1", "address":"Via Tuscolana, 1243"},
                                                      {"lat":"41.798319627369516" , "lon":"12.297563552856445" , "name": "Parco Leonardo", "items":"0", "address":"Piazza M. Buonarroti, 36/47"},
                                                      {"lat":"42.058884061856666" , "lon":"12.58410930633545" , "name": "Monterotondo", "items":"0", "address":"Via Salaria, 221"}
                                                    ]
                   }];
*/				   
//shops[0].items[1].name

var destinazione = 0;



var percorsi = [
                         {"latfrom":"41.89205502378826", "lonfrom":"12.49094009399414",  "latto":"41.914",  "lonto":"12.503",  "from":"Via del Colosseo, 12",  "to":"Via di Villa Albani",  "obj":"Busta",  "note":"URGENTE", "peso": "30g"},
                         {"latfrom":"41.892550190450876", "lonfrom":"12.492753267288208",  "latto":"41.91228983675952",  "lonto":"12.507",  "from":"Via della Polveriera",  "to":"Viale Regina Marg..",  "obj":"Pacco",   "note":"FRAGILE", "peso": "500g"} 
];
var percorso=0;

var bacheca = [  
    {"id":"23411","latfrom":"41.834168", "lonfrom":"12.467506",  "latto":"51.508849",  "lonto":"-0.12409",  "from":"Roma, EUR",  "to":"Londra, Convent Garden",  "distanza":"1500Km", "descrizione":"Pacco", "peso":"1kg", "validita":"2 giorni","valore":"36,00 Euro"},
    {"id":"23432","latfrom":"41.90918", "lonfrom":"12.464861",  "latto":"44.837822",  "lonto":"11.62063",  "from":"Roma, Prati",  "to":"Ferrara centro",  "distanza":"450Km", "descrizione":"Pacco", "peso":"10kg", "validita":"8 ore","valore":"19,00 Euro" }
];

var user = "";
var wrapper;
var username="";
var loginas ="";  // courier o user
var map;

var p1;
var pCircle;
var dest;
var destCircle;
var m1;
var m2;
var legend;
//THESEUS// var shopsMap = new Array();
var bachecaMap= new Array();




/*  UTILS  */
// symbol: k
//  https://graph.facebook.com/riccardo.luna/picture
//  https://www.mapbox.com/developers/api/geocoding/  beta





/****  VIEW    ****/

function hideAll(){
  for(i=0;i<divs.length;i++){
    document.getElementById(divs[i]).style.display = "none";    
  }
}

function showDrawerController(){
  document.getElementById("drawer-controller-hide").style.display = "block";
  document.getElementById("drawer-controller-show").style.display = "block";
  document.getElementById("menu").style.display = "block";
}


function showHome(){
  if(loginas == "courier"){
    showHomeCourier();
  }else if(loginas == "client"){
    showHomeClient();
  }else{
    startApp();
  }
}

function showHomeClient(){
  // 20140601 rimanda alla homeCourier
  loginas = "client";
  showHomeCourier();
/*
  hideAll();
  loginas = "client";
  showDrawerController();
  document.getElementById("homeClient").style.display = "block";
  document.getElementById("addtitle").innerHTML=" - Client";
*/
}

function showLoginForm(){
	hideAll();
	showDrawerController();
	document.getElementById("loginForm").style.display = "block";
	document.getElementById("addtitle").innerHTML=" - LOGIN";
}

function showHomeTheseus(){
  hideAll();
  showDrawerController();
  document.getElementById("homeTheseus").style.display = "block";
  document.getElementById("addtitle").innerHTML=" - MyTheseus";
  
  var appo="<ul>";
  for(i=0;i<myTheseusItems.length ;i++){
    appo += '<li><h1 class="communicationTitle">Colore: ';
    appo += myTheseusItems[i]["color"];
    appo += '</h1><p>';
    appo += '<img src="'+myTheseusItems[i]['photo']+'" />';
    appo += '</p></li>';
  }
  appo += '</ul>';
  $('#homeTheseus').html(appo);
  
}




function showHomeCourier(){
  if(loginas == ""){loginas = "courier";}
  hideAll();
  showDrawerController();
  document.getElementById("legend-position").style.display = "block";
  document.getElementById("legend-actionbar").style.display = "block";

  document.getElementById("homeCourier").style.display = "block";
  document.getElementById("addtitle").innerHTML=" - Home";
  
  if(typeof(map) == "undefined" ){  
    map =  L.mapbox.map('homeCourier', mapID) .setView([posizione.lat, posizione.lon], 16);
    pCircle = L.circle([posizione.lat, posizione.lon], 200).addTo(map);
    p1 = L.marker([posizione.lat, posizione.lon], {
      icon: L.mapbox.marker.icon({
        'marker-size': 'medium',
        'marker-symbol': 'star',
        'marker-color': '#1087bf'
      })
    }).addTo(map);
    

/* //THESEUS//
  var index;
  var indice=0;
  for (index = 0; index < shops.length; ++index) {
    for(var i=0;i<shops[index].items.length;++i){
      
      shopsMap[indice] = L.marker([shops[index].items[i].lat, shops[index].items[i].lon], {
        icon: L.mapbox.marker.icon({
          'marker-size': 'medium',
          'marker-symbol': 'k',
          'marker-color': '#cccccc'
        })
      }).addTo(map);
      indice +=1;
    }
  }


  var indiceB = 0;
    for(var i=0;i<=shops.length;++i){
      
      bachecaMap[indiceB] = L.marker([bacheca[i].latfrom, bacheca[i].lonfrom], {
        icon: L.mapbox.marker.icon({
          'marker-size': 'medium',
          'marker-symbol': 'k',
          'marker-color': '#a3e46b'
        })
      }).addTo(map);
      indiceB+=1;
    }
*/

  }else{
    ////  if(p1!=undefined){map.removeLayer(p1);}  
    map.setView([posizione.lat, posizione.lon], 16)
  }
  if(m1!=undefined){map.removeLayer(m1);}
  if(m2!=undefined){map.removeLayer(m2);}
  if(dest!=undefined){map.removeLayer(dest);}
  if(destCircle!=undefined){map.removeLayer(destCircle);}
  
  document.getElementById("legend-content").style.display = "none";
  //document.getElementById("legend-position").style.display = "none";
  
}

function showBacheca(){
   hideAll();
  showDrawerController();
  document.getElementById("bacheca").style.display = "block";
  document.getElementById("addtitle").innerHTML=" - BACHECA";
  var appo="<ul>";

  for(i=0;i<=1;++i){
    appo += '<li><h1 class="communicationTitle">Periodo di validit&agrave;: ';
    appo += bacheca[i].validita;
    appo += '</h1><p>';
    appo += 'Valore: ' + bacheca[i].valore;
    appo += ' - DA: ' + bacheca[i].from;
    appo += ' - A: ' + bacheca[i].to;
    appo += ' - Distanza: ' + bacheca[i].distanza;
    appo += ' - Descrizione: ' + bacheca[i].descrizione;
    appo += '</p></li>';
  }
  appo += '</ul>';
  $('#bacheca').html(appo);
}




/****  CONTROLLER   ****/
function startApp(){
  hideAll();
    user = [{
      "code":"1",
      "name":"Riccardo", 
      "surname":"Berti", 
      "email":"riccardo.berti@gmail.com", 
      "image":"style/images/userphoto.jpg", 
      "mobile":"3333333333",
      "password":"",
      "mezzo":"bike",
      "destinazioni":  [
         {"lat":"" , "lon":"" , "name": "Universita", "items":"0", "address":"P. Aldo Moro"},
         {"lat":"" , "lon":"" , "name": "Casa", "items":"0", "address":"Piazza Bologna"},
         {"lat":"41.9132638845839" , "lon":"12.504587173461914" , "name": "Mamma", "items":"2", "address":"Via Alessandria"}
      ]
    }];

    getPosition();
    //THESEUS// popolaShops();

	if(username == ""){
    document.getElementById("splash").style.display = "block";

    document.getElementById("menuUsername").innerHTML = user[0].name;
    //THESEUS// if(user[0].mezzo != ""){
    //THESEUS//    document.getElementById("menuUsername").innerHTML = document.getElementById("menuUsername").innerHTML + ' (<div id="div-MezzoTrasporto"></div>)';
    //THESEUS// }
    //POPOLA MENU (da spostare alla login + ciclo from server)
    document.getElementById("btn-Request0").innerHTML =  "Posizione <em>("+ user[0].destinazioni[0].items  +")</em>" + "<span class='submenu'>"+user[0].destinazioni[0].address+"</span>";
    //THESEUS// document.getElementById("btn-Request1").innerHTML = "Peso" + " <em>("+ user[0].destinazioni[1].items  +")</em>" + "<span class='submenu'>"+user[0].destinazioni[1].address+"</span>";
    document.getElementById("btn-Request2").innerHTML = "Batteria" + " <em>("+ user[0].destinazioni[2].items  +")</em>" + "<span class='submenu'>"+user[0].destinazioni[2].address+"</span>";

    // DO TEST HERE
  }else{
      // do something if logged in
  }
}


/***   POSIZIONE  ***/
function getPosition(){
  navigator.geolocation.getCurrentPosition(getPositionOnSuccess, getPositionOnError);
}

var getPositionOnSuccess = function (position) {
    console.log('Latitude: ' + position.coords.latitude + '\n' +     'Longitude: ' + position.coords.longitude + '\n');

   posizione.lat = position.coords.latitude ;
   posizione.lon = position.coords.longitude ;
   ridisegnaMappa();
   getAddress();
//THESEUS//fakePosizioniVicine();
test();
};
function getPositionOnError(error) {
  document.getElementById("leg-posizione").innerHTML = "impossibile determinare la posizione";
    console.log('Error getting GPS Data');
}


function ridisegnaMappa() {
  if(typeof(map) != "undefined" ){  
    map.setView([posizione.lat, posizione.lon], 16)
    if(p1!=undefined){map.removeLayer(p1);}  
    if(pCircle!=undefined){map.removeLayer(pCircle);}  

    pCircle = L.circle([posizione.lat, posizione.lon], 200).addTo(map);
    p1 = L.marker([posizione.lat, posizione.lon], {
      icon: L.mapbox.marker.icon({
        'marker-size': 'medium',
        'marker-symbol': 'star',
        'marker-color': '#1087bf'
      })
    }).addTo(map);

  }  
}


function getAddress(){
  url = "http://api.tiles.mapbox.com/v3/"+mapID+"/geocode/"+posizione.lon+","+posizione.lat+".json";
  $.getJSON( url, function( data ) {
    posizione.address=data.results[0][0].name +" ("+data.results[0][2].name+")";
    console.log("Posizione: " + data.results[0][0].name +" ("+data.results[0][2].name+")");
   document.getElementById("leg-posizione").innerHTML = data.results[0][0].name +" ("+data.results[0][2].name+")";
  

  });
}

/*  //THESEUS//
function popolaShops(){
  var index;
  for (index = 0; index < shops.length; ++index) {
    $(menuNav).append( '<h2>'+shops[index].name+' <em>(TODO)</em></h2>');
    var appo = "<ul>";
    for(var i=0;i<shops[index].items.length;++i){
      appo += '<li><a href="#" id="btn-shop'+i+'">'+shops[index].items[i].name+' <em>('+shops[index].items[i].items+')</em> <span class="submenu">'+shops[index].items[i].address+'</span></a></li>';
    }
    appo += "</ul>";
    $(menuNav).append( appo);
  }
}
*/

function fakePosizioniVicine(){
  for(var i=0;i<2;i++){
      var appo = (Math.random() * (2* 0.0018)) - 0.0018;
      var appo1 = Math.random() * (2* 0.0018) - 0.0018;
      appo2 = parseFloat(posizione.lat) + appo;
      appo3 = parseFloat(posizione.lon) + appo1;
      percorsi[i].latfrom = appo2;
      percorsi[i].lonfrom = appo3;
  }
}

function test(){
  for(var i=0;i<5;i++){
      var appo = (Math.random() * (2* 0.0018)) - 0.0018;
      var appo1 = Math.random() * (2* 0.0018) - 0.0018;
appo2 = parseFloat(posizione.lat) + appo;
appo3 = parseFloat(posizione.lon) + appo1;
      L.marker([ appo2 , appo3 ], {
        icon: L.mapbox.marker.icon({
          'marker-size': 'medium',
          'marker-symbol': 'k',
          'marker-color': '#a3e46b'
        })
      }).addTo(map);
  }
}





function showProfilo(){
  hideAll();
  showDrawerController();
  document.getElementById("profilo").style.display = "block";
  document.getElementById("profileUserPhoto").src = user[0].image;
  document.getElementById("profileUserName").innerHTML = user[0].name;
  document.getElementById("profileUserSurname").innerHTML = user[0].surname;

  document.getElementById("profileUserEmail").innerHTML = user[0].email;
  document.getElementById("profileUserMobile").innerHTML = user[0].mobile;
  document.getElementById("profileUserPassword").innerHTML = "******";

  document.getElementById("addtitle").innerHTML=" - Profilo";

}


function showRequests(){
  destinazione = 2;

  hideAll();
  showDrawerController();
  document.getElementById("homeCourier").style.display = "block";
  document.getElementById("addtitle").innerHTML=" - " +  user[0].destinazioni[destinazione].name ;
  
  // percorso[percorso]

  var sw_lat = Math.min(percorsi[percorso].latfrom,percorsi[percorso].latto);  // a nord dell'equatore
  var sw_lon = Math.min(percorsi[percorso].lonfrom,percorsi[percorso].lonto);  // ad est di greenwich  //??
  var ne_lat = Math.max(percorsi[percorso].latfrom,percorsi[percorso].latto);
  var ne_lon = Math.max(percorsi[percorso].lonfrom,percorsi[percorso].lonto);

  var southWest = L.latLng(sw_lat, sw_lon),
	northEast = L.latLng(ne_lat, ne_lon),
	bounds = L.latLngBounds(southWest, northEast);

  map.fitBounds(bounds);


  dest = L.marker([Number(user[0].destinazioni[destinazione].lat), Number(user[0].destinazioni[destinazione].lon)], {
    icon: L.mapbox.marker.icon({
        'marker-size': 'large',
        'marker-symbol': 'embassy',
        'marker-color': '#1087bf'
    })
  }).addTo(map);

  destCircle = L.circle([Number(user[0].destinazioni[destinazione].lat), Number(user[0].destinazioni[destinazione].lon)], 200).addTo(map);


  // FROM  41.89205502378826, 12.49094009399414   percorsi[percorso].latfrom 
  m1 = L.marker([percorsi[percorso].latfrom, percorsi[percorso].lonfrom], {
    icon: L.mapbox.marker.icon({
        'marker-size': 'small',
        'marker-symbol': 'post',
        'marker-color': '#ff0000'
    })
  }).addTo(map);

  // TO
  m2 = L.marker([percorsi[percorso].latto, percorsi[percorso].lonto], {
    icon: L.mapbox.marker.icon({
        'marker-size': 'small',
        'marker-symbol': 'post',
        'marker-color': '#ff0000'
    })
  }).addTo(map);

var fc =m1.getLatLng();
$('#leg-dist').html((fc.distanceTo(m2.getLatLng())).toFixed(0) + 'm');


  //PUBBLICA LEGGENDA
  //legend = map.legendControl.addLegend(document.getElementById('legend-content').innerHTML);
  document.getElementById("legend-content").style.display = "block";

  // popola LEGENDA
  document.getElementById("leg-numpercorso").innerHTML=  (percorso+1) + "/" + user[0].destinazioni[destinazione].items;
  document.getElementById("leg-from").innerHTML=  percorsi[percorso].from;
  document.getElementById("leg-to").innerHTML=  percorsi[percorso].to;
  document.getElementById("leg-object").innerHTML=  percorsi[percorso].obj + "("+percorsi[percorso].peso+")";
  document.getElementById("leg-note").innerHTML=  percorsi[percorso].note;


}



/* //THESEUS//
function selectBike(){
  document.getElementById("div-MezzoTrasporto").style.backgroundImage = "url(style/images/iconBicycle.png)";
  showHome();
}

function selectScooter(){
  document.getElementById("div-MezzoTrasporto").style.backgroundImage = "url(style/images/Transport-scooter-icon.png)";
  showHome();
}

function selectAuto(){
  document.getElementById("div-MezzoTrasporto").style.backgroundImage = "url(style/images/Transport-car-icon.png)";
  showHome();
}

function selectTrain(){
  document.getElementById("div-MezzoTrasporto").style.backgroundImage = "url(style/images/Transport-train-icon.png)";
  showHome();
}
*/

function showAbout(){
  hideAll();
  showDrawerController();
  document.getElementById("aboutApp").style.display = "block";
  document.getElementById("addtitle").innerHTML=" - About";
}

function doLogoff(){
  hideAll();
  document.getElementById("splash").style.display = "block";
  document.getElementById("addtitle").innerHTML="";
}







function doSignIn(){
  hideAll();
  showDrawerController();
  username= document.getElementById("signin-username").value;
  document.getElementById("dashboard").style.display = "block";
  document.getElementById("addtitle").innerHTML=" - Dashboard";
  document.getElementById("menu").style.display = "block";
  document.getElementById("menuUsername").innerHTML=username;

}

function showCommunication(){
  hideAll();
  showDrawerController();
  document.getElementById("communication").style.display = "block";
  document.getElementById("addtitle").innerHTML=" - Messages";
}



function showRequestDetail(){
  hideAll();
  showDrawerController();
  document.getElementById("request").style.display = "block";
  document.getElementById("addtitle").innerHTML=" - Detail";
}

function selectPrev(){
  // PULISCI M1 e M2
  map.removeLayer(m1);
  map.removeLayer(m2);
  map.removeLayer(dest);
  map.removeLayer(destCircle);
  //map.removeControl(legend);
  //legend = map.legendControl.removeLegend(legend);
  document.getElementById("legend-content").style.display = "none";



  if(percorso>0){
    percorso=percorso-1;
  }else{
    percorso = Number(user[0].destinazioni[destinazione].items-1);
  }
  showRequests();
}
function selectNext(){
  // PULISCI M1 e M2
  map.removeLayer(m1);
  map.removeLayer(m2);
  map.removeLayer(dest);
  map.removeLayer(destCircle);
  //map.removeControl(legend);
  // legend = map.legendControl.removeLegend(legend);
  document.getElementById("legend-content").style.display = "none";

  if(percorso<Number(user[0].destinazioni[destinazione].items)-1){
    percorso=percorso+1;
  }else{
    percorso = 0 ;
  }
  showRequests();
}

function doAccetta(){
  stato=0;
  azione=0;
  showDetails();
}

function showDetails(){
  hideAll();
  showDrawerController();

  if(stato==2){
    document.getElementById("bStatus").style.display = "none";
  }

  document.getElementById("addtitle").innerHTML=" - " + azioni[azione];

  document.getElementById("bStatus").innerHTML=  azioni[azione];
  document.getElementById("det-status").innerHTML=  stati[stato];
  document.getElementById("det-from").innerHTML=  percorsi[percorso].from;
  document.getElementById("det-to").innerHTML=  percorsi[percorso].to;
  document.getElementById("det-object").innerHTML=  percorsi[percorso].obj + "("+percorsi[percorso].peso+")";
  document.getElementById("det-note").innerHTML=  percorsi[percorso].note;

  document.getElementById("dettaglio").style.display = "block";

}

function doChangeStatus(){
  azione = azione+1;
  stato = stato+1;
  showDetails();
}


function showNuovoIndirizzo(){
  hideAll();
  showDrawerController();
  document.getElementById("addtitle").innerHTML=" - Nuovo indirizzo" ;
  document.getElementById("nuovoIndirizzoForm").style.display = "block";
}


function addNuovoIndirizzo(){
  // http://api.tiles.mapbox.com/v3/{mapid}/geocode/{query}.json
  //     {"lat":"" , "lon":"" , "name": "Universita", "items":"0", "address":"P. Aldo Moro"},

}


function showNewOrder(){
  hideAll();
  showDrawerController();
  document.getElementById("addtitle").innerHTML=" - ORDINE" ;
  document.getElementById("nuovoOrdineForm").style.display = "block";  
}












/*   ONLOAD  */

window.onload = function () {
  // aggiungo i listner	
  document.getElementById("bLoginClient").addEventListener("click", showLoginForm);
  document.getElementById("bFormSignIn").addEventListener("click", showHomeTheseus);
  document.getElementById("btn-Profilo").addEventListener("click", showProfilo);
  document.getElementById("menuUsername").addEventListener("click", showHome);
  document.getElementById("btn-Request0").addEventListener("click", showHome);
  //THESEUS// document.getElementById("btn-Request1").addEventListener("click", showHome);
  document.getElementById("btn-Request2").addEventListener("click", showRequests);
//THESEUS//  document.getElementById("btn-RequestAdd").addEventListener("click", showNuovoIndirizzo);
  document.getElementById("btn-leg-NuovoIndirizzo").addEventListener("click", showNuovoIndirizzo);

  document.getElementById("btn-About").addEventListener("click", showAbout);
//THESEUS//  document.getElementById("prof-bike").addEventListener("click", selectBike);
//THESEUS//  document.getElementById("prof-scooter").addEventListener("click", selectScooter);
//THESEUS//  document.getElementById("prof-auto").addEventListener("click", selectAuto);
//THESEUS//  document.getElementById("prof-treno").addEventListener("click", selectTrain);
  document.getElementById("legprev").addEventListener("click", selectPrev);
  document.getElementById("legnext").addEventListener("click", selectNext);
  document.getElementById("leg-accetta").addEventListener("click", doAccetta);
  document.getElementById("bContattaRitiro").addEventListener("click", showCommunication);
  document.getElementById("bContattaConsegna").addEventListener("click", showCommunication);
  document.getElementById("bChiudiComunica").addEventListener("click", showDetails);
  document.getElementById("btn-NewOrder").addEventListener("click", showNewOrder);
  document.getElementById("btn-leg-bacheca").addEventListener("click", showBacheca);
  document.getElementById("btn-ricalcolaMappa").addEventListener("click", ridisegnaMappa);


  startApp();

};