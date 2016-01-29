var element; //DOM element containing everything
var wantedSize = 640; //what version of image at Flickr are we using
var photos = 0;
var currentPhoto = 0;
var apiUrl = 'https://api.flickr.com/services/rest/?format=json&nojsoncallback=1&api_key=81bcafb1419ee85e54f9c29392eb356b&method='; //API url with json setting and api key
window.addEventListener('load', fvInit, false ); //trigger initialization when DOM loaded
document.onkeydown = keyEvent;

function fvInit(){
	element = document.getElementById('f-viewer'); //get our container element
	element.innerHTML += 'Album with ID: ' + element.getAttribute('data-photoset') +'</br>';
	element.innerHTML += '<button id="nextBtn" class="arrowBtn" onClick="changeImage(1)"></button>';
	element.innerHTML += '<button id="prevBtn" class="arrowBtn" onClick="changeImage(-1)"></button>';
	getPhotoIDs(element.getAttribute('data-photoset')); //get settings and call for photos
}

function getPhotoIDs(albumId){ //get list of all photos and their IDs in this album (photoset)
	var url = apiUrl + 'flickr.photosets.getPhotos&photoset_id=' + albumId; 
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	    if (xhttp.readyState == 4 && xhttp.status == 200) {
	     	getPhotoUrls(JSON.parse(xhttp.responseText)); //call next fuction to parse the responce
	    }
	};
	xhttp.open("GET", url, true);
	xhttp.send();
}

function getPhotoUrls(data){
	var xhttp = [];
	photos = data.photoset.photo.length;
	for (var i = 0; i < photos; i++){ //loop thru each photoID and call API for image file urls
		(function (i){
			element.innerHTML += '<div id="fv-photo-' + i + '" class="fv-image right"></div>';
			var url = apiUrl + 'flickr.photos.getSizes&photo_id=' + data.photoset.photo[i].id; 

			xhttp[i] = new XMLHttpRequest();
			xhttp[i].onreadystatechange = function() {
			    if (xhttp[i].readyState == 4 && xhttp[i].status == 200) {
			    	setPhoto(JSON.parse(xhttp[i].responseText), i); //call function to select wanted image size
			    }
			};
			xhttp[i].open("GET", url, true);
			xhttp[i].send();

		})(i);
	}

	document.getElementById('fv-photo-0').setAttribute("class", "fv-image center"); // first image pointing towards viewer
}

function setPhoto(photoSizes, index){

	for (var i = 0; i < photoSizes.sizes.size.length; i++){ //loop thru all image sizes

		if (photoSizes.sizes.size[i].height >= wantedSize) { //check if the size is what we wanted
			document.getElementById('fv-photo-' + index).innerHTML += '<img src="' + photoSizes.sizes.size[i].source + '"/>'; //create DOM img element
			return;

		}else if(i == photoSizes.sizes.size.length - 1){ //if we did not find the size we want
			document.getElementById('fv-photo-' + index).innerHTML += '<img src="' + photoSizes.sizes.size[i].source + '"/>'; //create DOM img element
		}
		changeImage(0);
	}
}

function changeImage(value){
	currentPhoto = Math.max(0, currentPhoto + value);

	for (var n = 0; n < photos; n++){
		var nthElement = document.getElementById('fv-photo-' + n);
		nthElement.style.zIndex = 999 - (n - currentPhoto); //set arrage
		if(n < currentPhoto){
			nthElement.setAttribute("class", "fv-image left");
			nthElement.style.left = -500 + (n - currentPhoto) * 150 + 'px'; //set style position
		}else if(n > currentPhoto){
			nthElement.setAttribute("class", "fv-image right");
			nthElement.style.left = 500 + (n - currentPhoto) * 150 + 'px'; //set style position
		}else{
			nthElement.setAttribute("class", "fv-image center");
			nthElement.style.left = 0 + 'px'; //set style position
		}
	}

}

function keyEvent(event){
	if(event.keyCode == 37) changeImage(-1);
	else if(event.keyCode == 39) changeImage(1);
}