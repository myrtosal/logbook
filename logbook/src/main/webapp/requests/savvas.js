'use strict';

function create_message_prompt() {
    document.getElementById("delete_button").style.display = "block";
    document.getElementById("cancel_button").style.display = "block";
}

function cancel_deletion() {
    document.getElementById("delete_button").style.display = "none";
    document.getElementById("cancel_button").style.display = "none";
}

function detelete_user() {
    var data = "username=" + logged_in_user;
    var delete_request = new XMLHttpRequest();
    var response_msg;
    delete_request.onreadystatechange = function() {
        if (delete_request.readyState === 4 && delete_request.status === 200) {
            response_msg = JSON.parse(delete_request.responseText);
            if (response_msg.result === "success") {
                var get_sign_up = new XMLHttpRequest();
                get_sign_up.onreadystatechange = function() {
                    if (get_sign_up.readyState === 4 && get_sign_up.status === 200) {
                        document.getElementById("content").innerHTML = get_sign_up.responseText;
                        logged_in_user = "";
                    }
                };
                get_sign_up.open("GET", "get_sign_up_page", true);
                get_sign_up.send();
            }
        }
    };
    delete_request.open("POST", "delete_user", true);
    delete_request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    delete_request.send(data);
}