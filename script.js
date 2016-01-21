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
	var url = 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&format=json&nojsoncallback=1&api_key=81bcafb1419ee85e54f9c29392eb356b&photoset_id=' + albumId; 
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	    if (xhttp.readyState == 4 && xhttp.status == 200) {
	     	getPhotoUrls(JSON.parse(xhttp.responseText));
	    }
	};
	xhttp.open("GET", url, true);
	xhttp.send();
}

function getPhotoUrls(data){
	var xhttp = [];
	for (var i = 0; i < data.photoset.photo.length; i++){
		(function (i){
			//element.innerHTML += '<div id="fv-photo-' + i + '" class="fv-image"><p>' + data.photoset.photo[i].title+ '</p></div>';
			element.innerHTML += '<div id="fv-photo-' + i + '" class="fv-image right"></div>';
			var url = 'https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&format=json&nojsoncallback=1&api_key=81bcafb1419ee85e54f9c29392eb356b&photo_id=' + data.photoset.photo[i].id; 
			xhttp[i] = new XMLHttpRequest();
			xhttp[i].onreadystatechange = function() {
			    if (xhttp[i].readyState == 4 && xhttp[i].status == 200) {
			    	setPhoto(JSON.parse(xhttp[i].responseText), i);
			    }
			};
			xhttp[i].open("GET", url, true);
			xhttp[i].send();
		})(i);
	}
	document.getElementById('fv-photo-0').setAttribute("class", "fv-image center"); // first image pointing towards viewer
}

function setPhoto(photoSizes, index){
	for (var i = 0; i < photoSizes.sizes.size.length; i++){
		if (photoSizes.sizes.size[i].height >= wantedSize) {
			document.getElementById('fv-photo-' + index).innerHTML += '<img src="' + photoSizes.sizes.size[i].source + '"/>';
			document.getElementById('fv-photo-' + index).style.left = index * 300 + 'px';
			document.getElementById('fv-photo-' + index).style.zIndex = 999 - index;
			return;
		}else if(i == photoSizes.sizes.size.length - 1){
			document.getElementById('fv-photo-' + index).innerHTML += '<img src="' + photoSizes.sizes.size[i].source + '"/>';
		}
	}
}