/*   VARIABILI  */
var divs = ["splash","menu", "homeClient", "homeCourier", "dashboard", "request", "communication", "aboutApp","drawer-controller-hide","drawer-controller-show", "profilo", "legend-content","dettaglio","signature","loginForm","legend-position","nuovoIndirizzoForm","nuovoOrdineForm","bacheca","splashScreen","legend-actionbar"];

var mapID = "riccardante.llg16mdf";

var stati = ["da ritirare", "da consegnare", "consegnato"];
var stato=0;
var azioni = ["Ritira", "Consegna", "Chuso"];
var azione=0;

// la posizione va presa dal GPS
var posizione = {"lat":"41.891735559388124" , "lon" : "12.491819858551025", "address":"impossibile ottenere la posizione"};

var shops = [ {"name":"Gruppo Clark",
                                      "items" : [     
                                                      {"lat":"41.870128" , "lon":"12.467932" , "name": "Ostiense", "items":"2", "address":"Piazza della Radio, 85"},
                                                      {"lat":"41.83682786072714" , "lon":"12.600535154342651" , "name": "Tuscolana", "items":"1", "address":"Via Tuscolana, 1243"},
                                                      {"lat":"41.798319627369516" , "lon":"12.297563552856445" , "name": "Parco Leonardo", "items":"0", "address":"Piazza M. Buonarroti, 36/47"},
                                                      {"lat":"42.058884061856666" , "lon":"12.58410930633545" , "name": "Monterotondo", "items":"0", "address":"Via Salaria, 221"}
                                                    ]
                   }];
//shops[0].items[1].name

var destinazione = 0;



var percorsi = [
                         {"latfrom":"41.89205502378826", "lonfrom":"12.49094009399414",  "latto":"41.914",  "lonto":"12.503",  "from":"Via del Colosseo, 12",  "to":"Via di Villa Albani",  "obj":"Busta",  "note":"URGENTE", "peso": "30g"},
                         {"latfrom":"41.892550190450876", "lonfrom":"12.492753267288208",  "latto":"41.91228983675952",  "lonto":"12.507",  "from":"Via della Polveriera",  "to":"Viale Regina Marg..",  "obj":"Pacco",   "note":"FRAGILE", "peso": "500g"} 
  ///                       {"latfrom":"41.892550190450876", "lonfrom":"12.492753267288208",  "latto":"41.798319627369516",  "lonto":"12.297563552856445",  "from":"TEST",  "to":"TEST",  "obj":"Pacco",   "note":"FRAGILE", "peso": "500g"}
];
var percorso=0;

var bacheca = [  
    {"id":"23411","latfrom":"41.834168", "lonfrom":"12.467506",  "latto":"51.508849",  "lonto":"-0.12409",  "from":"Roma, EUR",  "to":"Londra, Convent Garden",  "distanza":"1500Km", "descrizione":"Pacco", "peso":"1kg", "validita":"2 giorni","valore":"36,00 Euro"},
    {"id":"23432","latfrom":"41.90918", "lonfrom":"12.464861",  "latto":"44.837822",  "lonto":"11.62063",  "from":"Roma, Prati",  "to":"Ferrara centro",  "distanza":"450Km", "descrizione":"Pacco", "peso":"10kg", "validita":"8 ore","valore":"19,00 Euro" }
];

var user = "";
var wrapper;
var clearButton;
var saveButton;
var canvas;
var signaturePad;
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
var shopsMap = new Array();
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
      "name":"Andrea", 
      "surname":"Ercoli", 
      "email":"andrea-ercoli@hotmail.it", 
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
    popolaShops();
/*
  map =  L.mapbox.map('homeCourier', mapID) .setView([posizione.lat, posizione.lon], 16);
  L.circle([posizione.lat, posizione.lon], 200).addTo(map);
    p1 = L.marker([posizione.lat, posizione.lon], {
      icon: L.mapbox.marker.icon({
        'marker-size': 'medium',
        'marker-symbol': 'star',
        'marker-color': '#1087bf'
      })
    }).addTo(map);

*/
  if(username == ""){
    document.getElementById("splash").style.display = "block";

    document.getElementById("menuUsername").innerHTML = user[0].name;
    if(user[0].mezzo != ""){
        // BUG se non ho un mezzo iniziale non posso impostarlo mai.. 
        document.getElementById("menuUsername").innerHTML = document.getElementById("menuUsername").innerHTML + ' (<div id="div-MezzoTrasporto"></div>)';
    }
    //POPOLA MENU (da spostare alla login + ciclo from server)
    document.getElementById("btn-Request0").innerHTML = user[0].destinazioni[0].name + " <em>("+ user[0].destinazioni[0].items  +")</em>" + "<span class='submenu'>"+user[0].destinazioni[0].address+"</span>";
    document.getElementById("btn-Request1").innerHTML = user[0].destinazioni[1].name + " <em>("+ user[0].destinazioni[1].items  +")</em>" + "<span class='submenu'>"+user[0].destinazioni[1].address+"</span>";
    document.getElementById("btn-Request2").innerHTML = user[0].destinazioni[2].name + " <em>("+ user[0].destinazioni[2].items  +")</em>" + "<span class='submenu'>"+user[0].destinazioni[2].address+"</span>";

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
fakePosizioniVicine();
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
console.log('ridisegnaMappa');
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



function showSignature(){
  hideAll();
  showDrawerController();

  document.getElementById("addtitle").innerHTML=" - FIRMA" ;

  document.getElementById("signature").style.display = "block";
  resizeCanvas();  
}
















// Adjust canvas coordinate space taking into account pixel ratio,
// to make it look crisp on mobile devices.
// This also causes canvas to be cleared.
function resizeCanvas() {
    var ratio =  window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d").scale(ratio, ratio);
}

window.onresize = resizeCanvas;










/*!
 * Signature Pad v1.3.2
 * https://github.com/szimek/signature_pad
 *
 * Copyright 2013 Szymon Nowak
 * Released under the MIT license
 *
 * The main idea and some parts of the code (e.g. drawing variable width BÃ©zier curve) are taken from:
 * http://corner.squareup.com/2012/07/smoother-signatures.html
 *
 * Implementation of interpolation using cubic BÃ©zier curves is taken from:
 * http://benknowscode.wordpress.com/2012/09/14/path-interpolation-using-cubic-bezier-and-control-point-estimation-in-javascript
 *
 * Algorithm for approximated length of a BÃ©zier curve is taken from:
 * http://www.lemoda.net/maths/bezier-length/index.html
 *
 */
var SignaturePad = (function (document) {
    "use strict";

    var SignaturePad = function (canvas, options) {
        var self = this,
            opts = options || {};

        this.velocityFilterWeight = opts.velocityFilterWeight || 0.7;
        this.minWidth = opts.minWidth || 0.5;
        this.maxWidth = opts.maxWidth || 2.5;
        this.dotSize = opts.dotSize || function () {
            return (this.minWidth + this.maxWidth) / 2;
        };
        this.penColor = opts.penColor || "black";
        this.backgroundColor = opts.backgroundColor || "rgba(0,0,0,0)";
        this.onEnd = opts.onEnd;
        this.onBegin = opts.onBegin;

        this._canvas = canvas;
        this._ctx = canvas.getContext("2d");
        this.clear();

        this._handleMouseEvents();
        this._handleTouchEvents();
    };

    SignaturePad.prototype.clear = function () {
        var ctx = this._ctx,
            canvas = this._canvas;

        ctx.fillStyle = this.backgroundColor;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this._reset();
    };

    SignaturePad.prototype.toDataURL = function (imageType, quality) {
        var canvas = this._canvas;
        return canvas.toDataURL.apply(canvas, arguments);
    };

    SignaturePad.prototype.fromDataURL = function (dataUrl) {
        var self = this,
            image = new Image();

        this._reset();
        image.src = dataUrl;
        image.onload = function () {
            self._ctx.drawImage(image, 0, 0, self._canvas.width, self._canvas.height);
        };
        this._isEmpty = false;
    };

    SignaturePad.prototype._strokeUpdate = function (event) {
        var point = this._createPoint(event);
        this._addPoint(point);
    };

    SignaturePad.prototype._strokeBegin = function (event) {
        this._reset();
        this._strokeUpdate(event);
        if (typeof this.onBegin === 'function') {
            this.onBegin(event);
        }
    };

    SignaturePad.prototype._strokeDraw = function (point) {
        var ctx = this._ctx,
            dotSize = typeof(this.dotSize) === 'function' ? this.dotSize() : this.dotSize;

        ctx.beginPath();
        this._drawPoint(point.x, point.y, dotSize);
        ctx.closePath();
        ctx.fill();
    };

    SignaturePad.prototype._strokeEnd = function (event) {
        var canDrawCurve = this.points.length > 2,
            point = this.points[0];

        if (!canDrawCurve && point) {
            this._strokeDraw(point);
        }
        if (typeof this.onEnd === 'function') {
            this.onEnd(event);
        }
    };

    SignaturePad.prototype._handleMouseEvents = function () {
        var self = this;
        this._mouseButtonDown = false;

        this._canvas.addEventListener("mousedown", function (event) {
            if (event.which === 1) {
                self._mouseButtonDown = true;
                self._strokeBegin(event);
            }
        });

        this._canvas.addEventListener("mousemove", function (event) {
            if (self._mouseButtonDown) {
                self._strokeUpdate(event);
            }
        });

        document.addEventListener("mouseup", function (event) {
            if (event.which === 1 && self._mouseButtonDown) {
                self._mouseButtonDown = false;
                self._strokeEnd(event);
            }
        });
    };

    SignaturePad.prototype._handleTouchEvents = function () {
        var self = this;

        // Pass touch events to canvas element on mobile IE.
        this._canvas.style.msTouchAction = 'none';

        this._canvas.addEventListener("touchstart", function (event) {
            var touch = event.changedTouches[0];
            self._strokeBegin(touch);
        });

        this._canvas.addEventListener("touchmove", function (event) {
            // Prevent scrolling.
            event.preventDefault();

            var touch = event.changedTouches[0];
            self._strokeUpdate(touch);
        });

        document.addEventListener("touchend", function (event) {
            var wasCanvasTouched = event.target === self._canvas;
            if (wasCanvasTouched) {
                self._strokeEnd(event);
            }
        });
    };

    SignaturePad.prototype.isEmpty = function () {
        return this._isEmpty;
    };

    SignaturePad.prototype._reset = function () {
        this.points = [];
        this._lastVelocity = 0;
        this._lastWidth = (this.minWidth + this.maxWidth) / 2;
        this._isEmpty = true;
        this._ctx.fillStyle = this.penColor;
    };

    SignaturePad.prototype._createPoint = function (event) {
        var rect = this._canvas.getBoundingClientRect();
        return new Point(
            event.clientX - rect.left,
            event.clientY - rect.top
        );
    };

    SignaturePad.prototype._addPoint = function (point) {
        var points = this.points,
            c2, c3,
            curve, tmp;

        points.push(point);

        if (points.length > 2) {
            // To reduce the initial lag make it work with 3 points
            // by copying the first point to the beginning.
            if (points.length === 3) points.unshift(points[0]);

            tmp = this._calculateCurveControlPoints(points[0], points[1], points[2]);
            c2 = tmp.c2;
            tmp = this._calculateCurveControlPoints(points[1], points[2], points[3]);
            c3 = tmp.c1;
            curve = new Bezier(points[1], c2, c3, points[2]);
            this._addCurve(curve);

            // Remove the first element from the list,
            // so that we always have no more than 4 points in points array.
            points.shift();
        }
    };

    SignaturePad.prototype._calculateCurveControlPoints = function (s1, s2, s3) {
        var dx1 = s1.x - s2.x, dy1 = s1.y - s2.y,
            dx2 = s2.x - s3.x, dy2 = s2.y - s3.y,

            m1 = {x: (s1.x + s2.x) / 2.0, y: (s1.y + s2.y) / 2.0},
            m2 = {x: (s2.x + s3.x) / 2.0, y: (s2.y + s3.y) / 2.0},

            l1 = Math.sqrt(dx1*dx1 + dy1*dy1),
            l2 = Math.sqrt(dx2*dx2 + dy2*dy2),

            dxm = (m1.x - m2.x),
            dym = (m1.y - m2.y),

            k = l2 / (l1 + l2),
            cm = {x: m2.x + dxm*k, y: m2.y + dym*k},

            tx = s2.x - cm.x,
            ty = s2.y - cm.y;

        return {
            c1: new Point(m1.x + tx, m1.y + ty),
            c2: new Point(m2.x + tx, m2.y + ty)
        };
    };

    SignaturePad.prototype._addCurve = function (curve) {
        var startPoint = curve.startPoint,
            endPoint = curve.endPoint,
            velocity, newWidth;

        velocity = endPoint.velocityFrom(startPoint);
        velocity = this.velocityFilterWeight * velocity
            + (1 - this.velocityFilterWeight) * this._lastVelocity;

        newWidth = this._strokeWidth(velocity);
        this._drawCurve(curve, this._lastWidth, newWidth);

        this._lastVelocity = velocity;
        this._lastWidth = newWidth;
    };

    SignaturePad.prototype._drawPoint = function (x, y, size) {
        var ctx = this._ctx;

        ctx.moveTo(x, y);
        ctx.arc(x, y, size, 0, 2 * Math.PI, false);
        this._isEmpty = false;
    };

    SignaturePad.prototype._drawCurve = function (curve, startWidth, endWidth) {
        var ctx = this._ctx,
            widthDelta = endWidth - startWidth,
            drawSteps, width, i, t, tt, ttt, u, uu, uuu, x, y;

        drawSteps = Math.floor(curve.length());
        ctx.beginPath();
        for (i = 0; i < drawSteps; i++) {
            // Calculate the Bezier (x, y) coordinate for this step.
            t = i / drawSteps;
            tt = t * t;
            ttt = tt * t;
            u = 1 - t;
            uu = u * u;
            uuu = uu * u;

            x = uuu * curve.startPoint.x;
            x += 3 * uu * t * curve.control1.x;
            x += 3 * u * tt * curve.control2.x;
            x += ttt * curve.endPoint.x;

            y = uuu * curve.startPoint.y;
            y += 3 * uu * t * curve.control1.y;
            y += 3 * u * tt * curve.control2.y;
            y += ttt * curve.endPoint.y;

            width = startWidth + ttt * widthDelta;
            this._drawPoint(x, y, width);
        }
        ctx.closePath();
        ctx.fill();
    };

    SignaturePad.prototype._strokeWidth = function (velocity) {
        return Math.max(this.maxWidth / (velocity + 1), this.minWidth);
    };


    var Point = function (x, y, time) {
        this.x = x;
        this.y = y;
        this.time = time || new Date().getTime();
    };

    Point.prototype.velocityFrom = function (start) {
        return (this.time !== start.time) ? this.distanceTo(start) / (this.time - start.time) : 1;
    };

    Point.prototype.distanceTo = function (start) {
        return Math.sqrt(Math.pow(this.x - start.x, 2) + Math.pow(this.y - start.y, 2));
    };

    var Bezier = function (startPoint, control1, control2, endPoint) {
        this.startPoint = startPoint;
        this.control1 = control1;
        this.control2 = control2;
        this.endPoint = endPoint;
    };

    // Returns approximated length.
    Bezier.prototype.length = function () {
        var steps = 10,
            length = 0,
            i, t, cx, cy, px, py, xdiff, ydiff;

        for (i = 0; i <= steps; i++) {
            t = i / steps;
            cx = this._point(t, this.startPoint.x, this.control1.x, this.control2.x, this.endPoint.x);
            cy = this._point(t, this.startPoint.y, this.control1.y, this.control2.y, this.endPoint.y);
            if (i > 0) {
                xdiff = cx - px;
                ydiff = cy - py;
                length += Math.sqrt(xdiff * xdiff + ydiff * ydiff);
            }
            px = cx;
            py = cy;
        }
        return length;
    };

    Bezier.prototype._point = function (t, start, c1, c2, end) {
        return          start * (1.0 - t) * (1.0 - t)  * (1.0 - t)
               + 3.0 *  c1    * (1.0 - t) * (1.0 - t)  * t
               + 3.0 *  c2    * (1.0 - t) * t          * t
               +        end   * t         * t          * t;
    };

    return SignaturePad;
})(document);










/////////////////////  AJAX
// 20140601 deciso di introdurre jquery ..



/*   ONLOAD  */

window.onload = function () {
  // aggiungo i listner	
  //// document.getElementById("bLoginCourier").addEventListener("click", showHomeCourier);   // 20140601 rimosso login courier
  document.getElementById("bLoginClient").addEventListener("click", showHomeClient);
  document.getElementById("btn-Profilo").addEventListener("click", showProfilo);
  document.getElementById("menuUsername").addEventListener("click", showHome);
  document.getElementById("btn-Request0").addEventListener("click", showHome);
  document.getElementById("btn-Request1").addEventListener("click", showHome);
  document.getElementById("btn-Request2").addEventListener("click", showRequests);
  document.getElementById("btn-RequestAdd").addEventListener("click", showNuovoIndirizzo);
  document.getElementById("btn-leg-NuovoIndirizzo").addEventListener("click", showNuovoIndirizzo);

  document.getElementById("btn-About").addEventListener("click", showAbout);
  document.getElementById("prof-bike").addEventListener("click", selectBike);
  document.getElementById("prof-scooter").addEventListener("click", selectScooter);
  document.getElementById("prof-auto").addEventListener("click", selectAuto);
  document.getElementById("prof-treno").addEventListener("click", selectTrain);
  document.getElementById("legprev").addEventListener("click", selectPrev);
  document.getElementById("legnext").addEventListener("click", selectNext);
  document.getElementById("leg-accetta").addEventListener("click", doAccetta);
  document.getElementById("bContattaRitiro").addEventListener("click", showCommunication);
  document.getElementById("bContattaConsegna").addEventListener("click", showCommunication);
  document.getElementById("bChiudiComunica").addEventListener("click", showDetails);
  document.getElementById("bStatus").addEventListener("click", showSignature);
  document.getElementById("bFirma").addEventListener("click", doChangeStatus);
  document.getElementById("btn-NewOrder").addEventListener("click", showNewOrder);

  // document.getElementById("btn-Bacheca").addEventListener("click", showBacheca);
  document.getElementById("btn-leg-bacheca").addEventListener("click", showBacheca);

  document.getElementById("btn-ricalcolaMappa").addEventListener("click", ridisegnaMappa);

//  document.getElementById("").addEventListener("click", );

  startApp();

  wrapper = document.getElementById("signature-pad");
  clearButton = wrapper.querySelector("[data-action=clear]");
  saveButton = wrapper.querySelector("[data-action=save]");
  canvas = wrapper.querySelector("canvas");
    
  resizeCanvas();
  signaturePad = new SignaturePad(canvas);
  clearButton.addEventListener("click", function (event) {
    signaturePad.clear();
  });

  saveButton.addEventListener("click", function (event) {
    if (signaturePad.isEmpty()) {
        alert("Please provide signature first.");
    } else {
        window.open(signaturePad.toDataURL());
    }
});


};



