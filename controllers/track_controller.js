var fs = require('fs');
var track_model = require('./../models/track');
var Client = require('node-rest-client').Client;

// Devuelve una lista de las canciones disponibles y sus metadatos
exports.list = function (req, res) {
	var tracks = track_model.tracks;
	res.render('tracks/index', {tracks: tracks});
};

// Devuelve la vista del formulario para subir una nueva canción
exports.new = function (req, res) {
	res.render('tracks/new');
};

// Devuelve la vista de reproducción de una canción.
// El campo track.url contiene la url donde se encuentra el fichero de audio
exports.show = function (req, res) {
	var track = track_model.tracks[req.params.trackId];
	track.id = req.params.trackId;
	res.render('tracks/show', {track: track});
};

// Escribe una nueva canción en el registro de canciones.
// TODO:
// - Escribir en tracks.cdpsfy.es el fichero de audio contenido en req.files.track.buffer
// - Escribir en el registro la verdadera url generada al añadir el fichero en el servidor tracks.cdpsfy.es
exports.create = function (req, res) {
	var track = req.files.track;
	console.log('Nuevo fichero de audio. Datos: ', track);
	if (track == undefined){
		res.redirect('/tracks');
		return
	}
	var id = track.name.split('.')[0];
	var name = track.originalname.split('.')[0];

	/*for (track in track_model.tracks){
		if (name === track_model.tracks[track].name){
			res.redirect('/tracks');
			return
		}
	}*/
	// Aquí debe implementarse la escritura del fichero de audio (track.buffer) en tracks.cdpsfy.es
	// Esta url debe ser la correspondiente al nuevo fichero en tracks.cdpsfy.es
	var url = '/media/' + id + '.mp3';
	fs.writeFile('/var/CDPSfy/public' + url, track.buffer, function(err) {
		if(err){
			return console.log(err);
		}

	});
	
	client = new Client();

	var args = {
		//data: { name: track.name },
		parameters:{name: name, id: id, url: url},
		headers:{"Content-Type": "application/json"} 
	};

	var req11 = client.post("http://10.1.2.11/tracksadd/", args, function(data,response) {
	  	console.log("updating 10.1.2.11");
	});
	req11.on('error', function(err){
		console.log('request error',err);
		req11.end();
	});
	var req12 = client.post("http://10.1.2.12/tracksadd/", args, function(data,response) {
	  	console.log("updating 10.1.2.12");
	});
	req12.on('error', function(err){
		console.log('request error',err);
		req12.end();
	});
	var req13 = client.post("http://10.1.2.13/tracksadd/", args, function(data,response) {
	  	console.log("updating 10.1.2.13");
	});
	req13.on('error', function(err){
		console.log('request error',err);
		req13.end();
	});
	var req14 = client.post("http://10.1.2.14/tracksadd/", args, function(data,response) {
	  	console.log("updating 10.1.2.14");
	});
	req14.on('error', function(err){
		console.log('request error',err);
		req14.end();
	});
	// Escribe los metadatos de la nueva canción en el registro.
	track_model.tracks[id] = {
		name: name,
		url: url
	};

	res.redirect('/tracks');
};

// Borra una canción (trackId) del registro de canciones 
// TODO:
// - Eliminar en tracks.cdpsfy.es el fichero de audio correspondiente a trackId
exports.destroy = function (req, res) {
	var trackId = req.params.trackId;
	var tracks = track_model.tracks;
	var name = tracks[trackId].name;
	var url = tracks[trackId].url;
	console.log(name)

	// Aquí debe implementarse el borrado del fichero de audio indetificado por trackId en tracks.cdpsfy.es
	var filePath = '/var/CDPSfy/public' + url;
	fs.unlinkSync(filePath);

	client = new Client();

	var args = {
		//data: { name: track.name },
		parameters:{id: trackId},
		headers:{"Content-Type": "application/json"} 
	};

	var req11 = client.delete("http://10.1.2.11/tracksdell/", args, function(data,response) {
	  	console.log("updating 10.1.2.11");
	});
	req11.on('error', function(err){
		console.log('request error',err);
		req11.end();
	});
	var req12 = client.delete("http://10.1.2.12/tracksdell/", args, function(data,response) {
	  	console.log("updating 10.1.2.12");
	});
	req12.on('error', function(err){
		console.log('request error',err);
		req12.end();
	});
	var req13 = client.delete("http://10.1.2.13/tracksdell/", args, function(data,response) {
	  	console.log("updating 10.1.2.13");
	});
	req13.on('error', function(err){
		console.log('request error',err);
		req13.end();
	});
	var req14 = client.delete("http://10.1.2.14/tracksdell/", args, function(data,response) {
	  	console.log("updating 10.1.2.14");
	});
	req14.on('error', function(err){
		console.log('request error',err);
		req14.end();
	});

	// Borra la entrada del registro de datos
	delete track_model.tracks[trackId];
	res.redirect('/tracks');
};

exports.addtrack = function (req,res){
	var name = req.query.name;
	var id = req.query.id;
	var url = req.query.url;
	track_model.tracks[id] = {
		name: name,
		url: url
	};
	res.end()
};

exports.deltrack = function (req,res){
	var id = req.query.id;
	delete track_model.tracks[id];
	res.end()
};
