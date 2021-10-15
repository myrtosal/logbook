'use strict';

/*
    Author: Panagiotis Papadakos papadako@csd.uoc.gr

    Try to read this file and understand what the code does...
    Then try to complete the missing functionality

    For the needs of the hy359 2019 course
    University of Crete

    At the end of the file there are some comments about our trips

*/

/*  face recognition that is based on faceplusplus service */
var faceRec = (function() {

    // Object that holds anything related with the facetPlusPlus REST API Service
    var faceAPI = {
        apiKey: 'l2jNgKbk1HXSR4vMzNygHXx2g8c_xT9c',
        apiSecret: '2T6XdZt4EYw-I7OhmZ6g1wtECl81e_Ip',
        app: 'hy359',
        // Detect
        // https://console.faceplusplus.com/documents/5679127
        detect: 'https://api-us.faceplusplus.com/facepp/v3/detect', // POST
        // Set User ID
        // https://console.faceplusplus.com/documents/6329500
        setuserId: 'https://api-us.faceplusplus.com/facepp/v3/face/setuserid', // POST
        // Get User ID
        // https://console.faceplusplus.com/documents/6329496
        getDetail: 'https://api-us.faceplusplus.com/facepp/v3/face/getdetail', // POST
        // addFace
        // https://console.faceplusplus.com/documents/6329371
        addFace: 'https://api-us.faceplusplus.com/facepp/v3/faceset/addface', // POST
        // Search
        // https://console.faceplusplus.com/documents/5681455
        search: 'https://api-us.faceplusplus.com/facepp/v3/search', // POST
        // Create set of faces
        // https://console.faceplusplus.com/documents/6329329
        create: 'https://api-us.faceplusplus.com/facepp/v3/faceset/create', // POST
        // update
        // https://console.faceplusplus.com/documents/6329383
        update: 'https://api-us.faceplusplus.com/facepp/v3/faceset/update', // POST
        // removeface
        // https://console.faceplusplus.com/documents/6329376
        removeFace: 'https://api-us.faceplusplus.com/facepp/v3/faceset/removeface', // POST
    };

    // Object that holds anything related with the state of our app
    // Currently it only holds if the snap button has been pressed
    var state = {
        photoSnapped: false,
    };

    // function that returns a binary representation of the canvas
    function getImageAsBlobFromCanvas(canvas) {

        // function that converts the dataURL to a binary blob object
        function dataURLtoBlob(dataUrl) {
            // Decode the dataURL
            var binary = atob(dataUrl.split(',')[1]);

            // Create 8-bit unsigned array
            var array = [];
            for (var i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }

            // Return our Blob object
            return new Blob([new Uint8Array(array)], {
                type: 'image/jpg',
            });
        }

        var fullQuality = canvas.toDataURL('image/jpeg', 1.0);
        return dataURLtoBlob(fullQuality);

    }

    // function that returns a base64 representation of the canvas
    function getImageAsBase64FromCanvas(canvas) {
        // return only the base64 image not the header as reported in issue #2
        return canvas.toDataURL('image/jpeg', 1.0).split(',')[1];

    }

    // Function called when we upload an image
    function uploadImage() {
        if (state.photoSnapped) {
            var canvas = document.getElementById('canvas');
            var image = getImageAsBlobFromCanvas(canvas);

            // ============================================

            // TODO!!! Well this is for you ... YES you!!!
            // Good luck!

            // Create Form Data. Here you should put all data
            // requested by the face plus plus services and
            // pass it to ajaxRequest
            var data = new FormData();
            data.append('api_key', faceAPI.apiKey);
            data.append('api_secret', faceAPI.apiSecret);
            // add also other query parameters based on the request
            // you have to send 
            data.append('image_file', image); //api says required image ,and imagefile is the type of data we created
            // You have to implement the ajaxRequest. Here you can
            // see an example of how you should call this
            // First argument: the HTTP method
            // Second argument: the URI where we are sending our request
            // Third argument: the data (the parameters of the request)
            // ajaxRequest function should be general and support all your ajax requests...
            // Think also about the handler
            ajaxRequest('POST', faceAPI.detect, data); //alagx8hke se detect gt sto upload kaleite h detect prwta /eswterika elegxei an kanoume sign in



        } else {
            alert('No image has been taken!');
        }
    }

    // Function for initializing things (event handlers, etc...)
    function init() {
        // Put event listeners into place
        // Notice that in this specific case handlers are loaded on the onload event
        window.addEventListener('DOMContentLoaded', function() {
            // Grab elements, create settings, etc.
            var canvas = document.getElementById('canvas');
            var context = canvas.getContext('2d');
            var video = document.getElementById('video');
            var mediaConfig = {
                video: true,
            };
            var errBack = function(e) {
                console.log('An error has occurred!', e);
            };

            // Put video listeners into place
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia(mediaConfig).then(function(stream) {
                    video.srcObject = stream;
                    video.onloadedmetadata = function(e) {
                        video.play();
                    };
                });
            }

            // Trigger photo take
            document.getElementById('snap').addEventListener('click', function() {
                context.drawImage(video, 0, 0, 640, 480);
                state.photoSnapped = true; // photo has been taken
            });

            // Trigger when upload button is pressed
            document.getElementById('upload').addEventListener('click', uploadImage);

        }, false);

    }

    // ============================================

    // !!!!!!!!!!! ================ TODO  ADD YOUR CODE HERE  ====================
    // From here on there is code that should not be given....

    // You have to implement the ajaxRequest function!!!!

    //about this function,we could have used closure ,but since I send the requests 
    //as steps,I dont need to create closures to be sure which request arrived
    function ajaxRequest(method, uri, data) {
        if (parent.document.getElementById("sign-in-handler")) {
            sign_ajaxRequest("POST", faceAPI.search, data);
        } else {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var response = JSON.parse(this.responseText);
                    //analoga se poio stadio twn step eimaste : detect,set,add stelnei to epomeno request
                    //blepw apla pio htan to uri gia na katalabw se poio stadio eimai( de xreiazetai closure afou stelnw to ena meta to allo)
                    if (uri === faceAPI.detect) { //shmainei exei kalestei h ajax request me orisma detect kai twra hr8e to response tou detect
                        if (response.faces.length > 0) { //borei na mhn anagnwristike face
                            var thedata = new FormData();
                            thedata.append("api_key", faceAPI.apiKey);
                            thedata.append("api_secret", faceAPI.apiSecret);
                            thedata.append("face_token", response.faces[0].face_token);
                            thedata.append("user_id", parent.document.getElementById("username").value); //access metablhtwn eksw apto iframe mesw parentzz
                            parent.document.getElementById("face_not_recognized").style.display = "none";
                            ajaxRequest("POST", faceAPI.setuserId, thedata);
                        } else {
                            parent.document.getElementById("face_not_recognized").style.display = "inline";
                        }
                    } else if (uri === faceAPI.setuserId) { //idia logikh kai gia ta alla duo method
                        var thedata = new FormData();
                        thedata.append("api_key", faceAPI.apiKey);
                        thedata.append("api_secret", faceAPI.apiSecret);
                        thedata.append("outer_id", faceAPI.app); //bazoume user defined  id of faceset(to 359 dld)
                        thedata.append("face_tokens", response.face_token);
                        ajaxRequest("POST", faceAPI.addFace, thedata);
                    } else if (uri === faceAPI.addFace) {
                        parent.document.getElementById("face_ok").style.display = "inline";
                        parent.document.getElementById("canvas_area").removeChild(parent.document.getElementById("area")); //telos diergasias,de xreiazomaste to para8hro
                    }
                }
            };
            xhttp.open(method, uri, true);
            xhttp.send(data);
        }
    }

    function sign_ajaxRequest(method, uri, data) {
        data.append("outer_id", faceAPI.app);
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var response = JSON.parse(this.responseText);
                if (response.results) {
                    parent.document.getElementById("username").
                    value = response.results[0].user_id;
                    parent.document.getElementById("face_not_recognized").style.display = "none";
                    parent.document.getElementById("canvas_area").removeChild(parent.document.getElementById("area"));
                } else {
                    parent.document.getElementById("face_not_recognized").style.display = "inline";
                }
            }
        };
        xhttp.open("POST", faceAPI.search, true);
        xhttp.send(data);
    }
    var canvas_bool = 0;

    function handle_canvades() { //skopos ths einai na emfanizetai o enas canvas panw ston allo gia ekshkwnomhsh xwrou
        if (canvas_bool == 0) {
            document.getElementById("canvas").style.display = "inline";
            document.getElementById("video").style.display = "none";
            canvas_bool = 1;
        } else {
            document.getElementById("video").style.display = "inline";
            document.getElementById("canvas").style.display = "none";
            canvas_bool = 0;
        }
    }

    function handle_camera() { //skopos einai otan do8ei username na mporei na path8ei h kamera
        if (document.getElementById("username").value.length >= 8)
            document.getElementById("camera").disabled = false;
        else
            document.getElementById("camera").disabled = true;
    }
    var canvas_area_bool = 0; //idia logikh me ta maps,mia emfanizetai to area mia eksafanizetai
    function create_canvas_area() { //creates an area for user to take photo and upload
        if (canvas_area_bool === 0) {
            var area = document.createElement("iframe");
            area.id = "area";
            document.getElementById("canvas_area").appendChild(area);
            document.getElementById("area").src = "face++/index.html"; //load ton kwdika pou mas dwsate
            document.getElementById("area").style.width = "100%";
            document.getElementById("area").style.height = "400px";
            canvas_area_bool = 1;
        } else if (canvas_area_bool === 1) {
            document.getElementById("face_not_recognized").style.display = "none";
            if (document.getElementById("face_ok"))
                document.getElementById("face_ok").style.display = "none";
            if (document.getElementById("area"))
                document.getElementById("canvas_area").removeChild(document.getElementById("area"));
            canvas_area_bool = 0;
        }
    }

    // !!!!!!!!!!! =========== END OF TODO  ===============================

    // Public API of function for facet recognition
    // You might need to add here other methods based on your implementation
    return {
        init: init,
        handle_canvades: handle_canvades,
        handle_camera: handle_camera,
        create_canvas_area: create_canvas_area
    };

})();