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
var image_api = (function() {

    // Object that holds anything related with the facetPlusPlus REST API Service

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
        return canvas.toDataURL('image/jpeg', 1).split(',')[1];

    }
    // Function called when we upload an image
    var image_64_photo = "";

    function uploadImage() {
        if (state.photoSnapped) {
            var canvas = document.getElementById('canvas');
            image_64_photo = getImageAsBase64FromCanvas(canvas);
            // h todataurl den bazei apo mprosta to data:image/jpeg gia kapoio logo ara to ebala egw apo mprosta
            parent.document.getElementById("image_base64").value = ("data:image/jpeg;base64," + image_64_photo).split(' ').join('+');
            image_64_photo = "";
        } else {
            alert('No image has been taken!');
        }
    }
    // Function for initializing things (event handlers, etc...)
    function init() {
        image_64_photo = "";
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
            document.getElementById("area").src = "face++/imageapi.html"; //load ton kwdika pou mas dwsate
            document.getElementById("area").style.width = "100%";
            document.getElementById("area").style.height = "400px";
            canvas_area_bool = 1;
        } else if (canvas_area_bool === 1) {
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