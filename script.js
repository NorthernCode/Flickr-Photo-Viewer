var element;
var wantedSize = 640;
var photos = [];
var photoOut = 0;
window.addEventListener('load', fvInit, false );

function fvInit(){
	element = document.getElementById('f-viewer');
	element.innerHTML += 'Loading Album with ID: ' + element.getAttribute('data-photoset') +'</br>';
	getPhotoIDs(element.getAttribute('data-photoset'));
}

function getPhotoIDs(albumId){
	var scriptTag = document.createElement('SCRIPT');
	scriptTag.src = 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&format=json&api_key=81bcafb1419ee85e54f9c29392eb356b&photoset_id=' + albumId;
	 
	document.getElementsByTagName('HEAD')[0].appendChild(scriptTag);
}

function jsonFlickrApi(data){
	var xhttp = [];
	for (var i = 0; i < data.photoset.photo.length; i++){
		(function (i){
			element.innerHTML += '<div id="fv-photo' + i + '"><p>' + data.photoset.photo[i].title+ '</p></div>';
			var url = 'https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&format=json&api_key=81bcafb1419ee85e54f9c29392eb356b&photo_id=' + data.photoset.photo[i].id; 
			xhttp[i] = new XMLHttpRequest();
			xhttp[i].onreadystatechange = function() {
			    if (xhttp[i].readyState == 4 && xhttp[i].status == 200) {
			     	setPhoto(JSON.parse(xhttp[i].responseText.split('(')[1].split(')')[0]), i);
			    }
			};
			xhttp[i].open("GET", url, true);
			xhttp[i].send();
		})(i);
	}
}

function setPhoto(photoSizes, index){
	for (var i = 0; i < photoSizes.sizes.size.length; i++){
		if (photoSizes.sizes.size[i].height >= wantedSize) {
			document.getElementById('fv-photo' + index).innerHTML += '<img src="' + photoSizes.sizes.size[i].source + '"/>';
			return;
		}
	}
}