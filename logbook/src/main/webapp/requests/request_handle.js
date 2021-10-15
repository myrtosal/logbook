'use strict';
var logged_in_user;

function check_email() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            document.getElementById("email_taken").innerHTML = xhttp.responseText;
        }
    };
    xhttp.open("POST", "handler", true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send("email=" + document.getElementById("email").value);
}

function check_username() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            document.getElementById("username_taken").innerHTML = xhttp.responseText;
        }
    };
    xhttp.open("POST", "username_handler", true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send("username=" + document.getElementById("username").value);
}

function patterns_check() { //returns true if there is an error
    var error_msg = "<b>Please be sure that these fields are correct: ";
    var error = false;
    if (!/[a-zA-Z0-9]{8,}/.test(document.getElementById("username").value)) {
        error_msg = error_msg + 'username ';
        error = true;
    }
    if (!/([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+).([a-zA-Z]{2,5})/.test(document.getElementById("email").value)) {
        error_msg = error_msg + 'email ';
        error = true;
    }
    if (!/(?=.*[`~!@#$%^&*_])(?=.*[a-zA-Z])(?=.*[0-9]).{8,10}/.test(document.getElementById("password").value)) {
        error_msg = error_msg + 'password ';
        error = true;
    }
    if (!/([a-zA-Z]|[α-ωΑ-Ω]){3,15}/.test(document.getElementById("first_name").value)) {
        error_msg = error_msg + 'firstname ';
        error = true;
    }
    if (!/([a-zA-Z]|[α-ωΑ-Ω]){3,15}/.test(document.getElementById("last_name").value)) {
        error_msg = error_msg + 'lastname ';
        error = true;
    }
    if (!/[a-zA-Zα-ωΑ-Ω]{2,20}/.test(document.getElementById("city").value)) {
        error_msg = error_msg + 'city ';
        error = true;
    }
    if (!/[a-zA-Zα-ωΑ-Ω]{3,15}/.test(document.getElementById("job").value)) {
        error_msg = error_msg + 'job ';
        error = true;
    }

    error_msg = error_msg + '</b>';
    if (error) {
        document.getElementById("wrong_input").innerHTML = error_msg;
    } else {
        document.getElementById("wrong_input").innerHTML = "";
    }
    return error;
}


function handle_sign_up() {
    if (!patterns_check()) {
        var data = 'username=' + document.getElementById('username').value + '&email=' + document.getElementById('email').value +
            '&first_name=' + document.getElementById('first_name').value +
            '&last_name=' + document.getElementById('last_name').value + '&city=' + document.getElementById('city').value +
            '&job=' + document.getElementById('job').value;

        var check_p = new XMLHttpRequest();
        check_p.onreadystatechange = function() {
            if (check_p.readyState === 4 && check_p.status === 200) {
                console.log("nothing wrong serverside check");
                var register_info = 'username=' + document.getElementById('username').value + '&email=' + document.getElementById('email').value +
                    '&password=' + MD5(document.getElementById('password').value) +
                    '&first_name=' + document.getElementById('first_name').value + '&last_name=' + document.getElementById('last_name').value +
                    '&bday=' + document.getElementById('bday').value + '&genders=' + document.querySelector('input[name="genders"]:checked').value +
                    '&country=' + document.getElementById('inputState').options[document.getElementById('inputState').selectedIndex].text +
                    '&city=' + document.getElementById('city').value + '&address=' + document.getElementById('address').value + '&job=' +
                    document.getElementById('job').value + '&interests=' + document.getElementById('interests').value + '&general_info=' + document.getElementById('general_info').value;

                var registration = new XMLHttpRequest();
                var response_msg;
                registration.onreadystatechange = function() {
                    if (registration.readyState === 4 && registration.status === 200) {
                        response_msg = JSON.parse(registration.responseText);
                        var username = response_msg.userName;
                        logged_in_user = username;
                        show_content_main_page(response_msg, "sign-up");
                    }
                };
                registration.open("POST", "register_user", true);
                registration.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                registration.send(register_info);

            } else if (check_p.readyState === 4 && check_p.status === 400) {
                console.log("server found patters to be wrong");
                document.getElementById("wrong_input_server").innerHTML = check_p.responseText;
            }
        };
        check_p.open("POST", "patterns_check", true);
        check_p.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        check_p.send(data);
    }
}
//uses the json object with user info and calls a function to load the main page,then renders the user info into an array
function show_content_main_page(response_msg, type) { //we have to draw the top 10 posts in general 
    var load_main_page = new XMLHttpRequest();
    load_main_page.onreadystatechange = function() {
        if (load_main_page.readyState === 4 && load_main_page.status === 200) {
            //var table_info = create_info_array(response_msg);
            document.getElementById("content").innerHTML = load_main_page.responseText;
            //document.getElementById("the_user_table").innerHTML = table_info;
            if (type === "sign-up") {
                document.getElementById("welcome_message").innerHTML = "Hi " + response_msg.firstName + ",registration was succesfull";
                (function() {
                    setTimeout(function() { document.getElementById("welcome_message").innerHTML = "Hi " + response_msg.firstName; }, 5000);
                })();

            } else if (type === "sign-in") {
                document.getElementById("welcome_message").innerHTML = "Hi " + response_msg.firstName;
            } else if (type === "update") {
                document.getElementById("welcome_message").innerHTML = "Hi " + response_msg.firstName + ",update was succesfull";
                (function() {
                    setTimeout(function() { document.getElementById("welcome_message").innerHTML = "Hi " + response_msg.firstName; }, 5000);
                })();
            }
            //draw here
            get_top_posts_general();
        }
    };
    load_main_page.open("GET", "get_main_page", true);
    load_main_page.send();

}

function load_sign_page() {
    var sign_in_request = new XMLHttpRequest();
    sign_in_request.onreadystatechange = function() {
        if (sign_in_request.readyState === 4 && sign_in_request.status === 200) {
            document.getElementById("content").innerHTML = sign_in_request.responseText;
        }
    };
    sign_in_request.open("GET", "get_sign_in_page", true);
    //check_p.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    sign_in_request.send();

}

function load_sign_up_page() {
    var sign_in_request = new XMLHttpRequest();
    sign_in_request.onreadystatechange = function() {
        if (sign_in_request.readyState === 4 && sign_in_request.status === 200) {
            document.getElementById("content").innerHTML = sign_in_request.responseText;
        }
    };
    sign_in_request.open("GET", "get_sign_up_page", true);
    //check_p.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    sign_in_request.send();

}

function delete_users() {
    var delete_users = new XMLHttpRequest();
    delete_users.onreadystatechange = function() {
        if (delete_users.readyState === 4 && delete_users.status === 200) {
            console.log("done");
        }
    };
    delete_users.open("GET", "delete_user", true);
    //check_p.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    delete_users.send();
}

function handle_log_out() {
    var sign_out = new XMLHttpRequest();
    sign_out.onreadystatechange = function() {
        if (sign_out.readyState === 4 && sign_out.status === 200) {
            document.getElementById("content").innerHTML = sign_out.responseText;
        }
    };
    sign_out.open("GET", "sign_out", true);
    //check_p.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    sign_out.send();
}

function handle_sign_in() {

    var log_in_info = 'username=' + document.getElementById('username').value +
        '&password=' + MD5(document.getElementById('password').value) + '&username_enrypted=' + MD5(document.getElementById('username').value);
    var log_in = new XMLHttpRequest();
    var response_msg;
    log_in.onreadystatechange = function() {
        if (log_in.readyState === 4 && log_in.status === 200) {

            response_msg = JSON.parse(log_in.responseText);

            if (response_msg.hasOwnProperty('result')) {

                if (response_msg.result === "wrong_password") {
                    console.log("wrong password");
                    document.getElementById("login_fails_msg").innerHTML = "wrong password,try again";
                } else if (response_msg.result === "username_not_existant") {
                    console.log("username doesnt exist");
                    document.getElementById("login_fails_msg").innerHTML = "username not existant,try again";
                }
            } else {
                document.getElementById("login_fails_msg").innerHTML = "";
                var username = response_msg.userName;
                logged_in_user = username;
                show_content_main_page(response_msg, "sign-in");
            }

        }
    };
    document.getElementById("login_fails_msg").innerHTML = "";
    log_in.open("POST", "sign_in_user", true);
    log_in.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    log_in.send(log_in_info);
}

function handle_content() {
    var load_content = new XMLHttpRequest();
    var response_msg;
    var user_info;
    load_content.onreadystatechange = function() {
        if (load_content.readyState === 4 && load_content.status === 200) {
            response_msg = JSON.parse(load_content.responseText);
            if (response_msg.result === "fresh_user") {
                load_sign_up_page();
            } else if (response_msg.result === "signed_in") {
                user_info = JSON.parse(response_msg.user);
                logged_in_user = user_info.userName;
                show_content_main_page(user_info, "sign-in");
            }
        }
    };
    load_content.open("GET", "resolve_content", true);
    load_content.send();
}

function create_info_array(response_msg) {
    var toreturn = "<tr>" +
        "<th> Your data </th>" +
        "<th> Value </th>" +
        "</tr>" +
        "<tr>" +
        "<td>Username</td>" +
        "<td>" + response_msg.userName + "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>Email</td>" +
        "<td>" + response_msg.email + "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>First Name</td>" +
        "<td>" + response_msg.firstName + "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>Last Name</td>" +
        "<td>" + response_msg.lastName + "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>Gender</td>" +
        "<td>" + response_msg.gender + "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>Birthdate</td>" +
        "<td>" + response_msg.birthDate + "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>Address</td>" +
        "<td>" + response_msg.address + "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>Town</td>" +
        "<td>" + response_msg.town + "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>Country</td>" +
        "<td>" + response_msg.country + "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>Job</td>" +
        "<td>" + response_msg.occupation + "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>Interests</td>" +
        "<td>" + response_msg.interests + "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>General Info</td>" +
        "<td>" + response_msg.info + "</td>" +
        "</tr>";
    return toreturn;

}


function update_info() {
    var sign_in_request = new XMLHttpRequest();
    sign_in_request.onreadystatechange = function() {
        if (sign_in_request.readyState === 4 && sign_in_request.status === 200) {
            document.getElementById("content").innerHTML = sign_in_request.responseText;
            var table_info;
            var load_user_info = new XMLHttpRequest();
            var user_info;
            var data = "username=" + logged_in_user;
            load_user_info.onreadystatechange = function() {
                if (load_user_info.readyState === 4 && load_user_info.status === 200) {
                    user_info = JSON.parse(load_user_info.responseText);
                    table_info = create_info_array(user_info);
                    document.getElementById("the_user_table").innerHTML = table_info;
                    fill_form_data(user_info);
                }
            };
            load_user_info.open("POST", "get_user_info", true);
            load_user_info.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            load_user_info.send(data);
        }
    };
    sign_in_request.open("GET", "get_update_page", true);
    //check_p.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    sign_in_request.send();
}

function show_user_info() { //we have to draw the top 10 posts for the logged in user
    var sign_in_request = new XMLHttpRequest();
    sign_in_request.onreadystatechange = function() {
        if (sign_in_request.readyState === 4 && sign_in_request.status === 200) {
            document.getElementById("content").innerHTML = sign_in_request.responseText;
            var table_info;
            var load_user_info = new XMLHttpRequest();
            var user_info;
            var data = "username=" + logged_in_user;
            load_user_info.onreadystatechange = function() {
                if (load_user_info.readyState === 4 && load_user_info.status === 200) {
                    user_info = JSON.parse(load_user_info.responseText);
                    document.getElementById("welcome_message").innerHTML = "Hi " + user_info.firstName;
                    table_info = create_info_array(user_info);
                    document.getElementById("the_user_table").innerHTML = table_info;
                    get_top10_user_posts();
                }
            };
            load_user_info.open("POST", "get_user_info", true);
            load_user_info.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            load_user_info.send(data);
        }
    };
    sign_in_request.open("GET", "get_main_page_user", true);
    //check_p.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    sign_in_request.send();

}


function patterns_check_update() { //returns true if there is an error
    var error_msg = "<b>Please be sure that these fields are correct: ";
    var error = false;
    if (!/([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+).([a-zA-Z]{2,5})/.test(document.getElementById("email").value)) {
        error_msg = error_msg + 'email ';
        error = true;
    }
    if (!/(?=.*[`~!@#$%^&*_])(?=.*[a-zA-Z])(?=.*[0-9]).{8,10}/.test(document.getElementById("password").value)) {
        error_msg = error_msg + 'password ';
        error = true;
    }
    if (!/([a-zA-Z]|[α-ωΑ-Ω]){3,15}/.test(document.getElementById("first_name").value)) {
        error_msg = error_msg + 'firstname ';
        error = true;
    }
    if (!/([a-zA-Z]|[α-ωΑ-Ω]){3,15}/.test(document.getElementById("last_name").value)) {
        error_msg = error_msg + 'lastname ';
        error = true;
    }
    if (!/[a-zA-Zα-ωΑ-Ω]{2,20}/.test(document.getElementById("city").value)) {
        error_msg = error_msg + 'city ';
        error = true;
    }
    if (!/[a-zA-Zα-ωΑ-Ω]{3,15}/.test(document.getElementById("job").value)) {
        error_msg = error_msg + 'job ';
        error = true;
    }

    error_msg = error_msg + '</b>';
    if (error) {
        document.getElementById("wrong_input").innerHTML = error_msg;
    } else {
        document.getElementById("wrong_input").innerHTML = "";
    }
    return error;
}

function fill_form_data(user_info) {
    document.getElementById("email").value = user_info.email;
    document.getElementById("bday").value = user_info.birthDate.split(" ")[0];
    document.getElementById("address").value = user_info.address;
    document.getElementById("first_name").value = user_info.firstName;
    document.getElementById("last_name").value = user_info.lastName;
    document.getElementById("general_info").value = user_info.info;
    document.getElementById("interests").value = user_info.interests;
    document.getElementById("job").value = user_info.occupation;
    document.getElementById("city").value = user_info.town;
}


function handle_update_info() {
    if (!patterns_check_update()) {
        var data = 'username=' + logged_in_user + '&email=' + document.getElementById('email').value +
            '&first_name=' + document.getElementById('first_name').value +
            '&last_name=' + document.getElementById('last_name').value + '&city=' + document.getElementById('city').value +
            '&job=' + document.getElementById('job').value;

        var check_p = new XMLHttpRequest();
        check_p.onreadystatechange = function() {
            if (check_p.readyState === 4 && check_p.status === 200) {
                console.log("nothing wrong serverside check");
                var update_information = 'username=' + logged_in_user + '&email=' + document.getElementById('email').value +
                    '&password=' + MD5(document.getElementById('password').value) +
                    '&first_name=' + document.getElementById('first_name').value + '&last_name=' + document.getElementById('last_name').value +
                    '&bday=' + document.getElementById('bday').value + '&genders=' + document.querySelector('input[name="genders"]:checked').value +
                    '&country=' + document.getElementById('inputState').options[document.getElementById('inputState').selectedIndex].text +
                    '&city=' + document.getElementById('city').value + '&address=' + document.getElementById('address').value + '&job=' +
                    document.getElementById('job').value + '&interests=' + document.getElementById('interests').value + '&general_info=' + document.getElementById('general_info').value;
                console.log(update_information);
                var update_request = new XMLHttpRequest();
                var response_msg;
                update_request.onreadystatechange = function() {
                    if (update_request.readyState === 4 && update_request.status === 200) {
                        response_msg = JSON.parse(update_request.responseText);
                        var username = response_msg.userName;
                        logged_in_user = username;
                        show_content_main_page(response_msg, "update");
                    }
                };
                update_request.open("POST", "update_user", true);
                update_request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                update_request.send(update_information);

            } else if (check_p.readyState === 4 && check_p.status === 400) {
                console.log("server found patters to be wrong");
                document.getElementById("wrong_input_server").innerHTML = check_p.responseText;
            }
        };
        check_p.open("POST", "patterns_check_update", true);
        check_p.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        check_p.send(data);
    }
}

function someFunction(msg) {
    console.log("hi " + msg);
}

function show_other_user_info(link) { //we have to draw the top 10 posts for that user 
    var sign_in_request = new XMLHttpRequest();
    sign_in_request.onreadystatechange = function() {
        if (sign_in_request.readyState === 4 && sign_in_request.status === 200) {
            document.getElementById("content").innerHTML = sign_in_request.responseText;
            var table_info;
            var load_user_info = new XMLHttpRequest();
            var user_info;
            var data = "username=" + link;
            load_user_info.onreadystatechange = function() {
                if (load_user_info.readyState === 4 && load_user_info.status === 200) {
                    user_info = JSON.parse(load_user_info.responseText);
                    document.getElementById("welcome_message").innerHTML = "Welcome to " + user_info.firstName + "'s profile";
                    table_info = create_info_array(user_info);
                    document.getElementById("the_user_table").innerHTML = table_info;
                    get_top_posts_for_user(link);
                }
            };
            load_user_info.open("POST", "get_user_info", true);
            load_user_info.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            load_user_info.send(data);
        }
    };
    sign_in_request.open("GET", "get_main_page_other_user", true);
    //check_p.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    sign_in_request.send();

}





function create_info_array_link_to_profile(response_msg) {
    var toreturn =
        "<tr>" +
        "<td>" + response_msg + "</td>" +
        "<td>" + "<a href=\"javascript:show_other_user_info('" + response_msg + "');\">www.csd.gr/database/users/" + response_msg + "</a>" + "</td>" +
        "</tr>" +
        "<tr>";
    return toreturn;
}


function show_users() {
    var sign_in_request = new XMLHttpRequest();
    sign_in_request.onreadystatechange = function() {
        if (sign_in_request.readyState === 4 && sign_in_request.status === 200) {
            document.getElementById("content").innerHTML = sign_in_request.responseText;
            document.getElementById("welcome_message").innerHTML = "All current users ";
            var table_info;
            var load_users_info = new XMLHttpRequest();
            var users_info;
            var data = "username=" + logged_in_user;
            load_users_info.onreadystatechange = function() {
                if (load_users_info.readyState === 4 && load_users_info.status === 200) {
                    users_info = JSON.parse(load_users_info.responseText);
                    table_info = "<tr>" +
                        "<th> Username </th>" +
                        "<th> link to profile </th>" +
                        "</tr>";
                    users_info.forEach(element => {
                        table_info = table_info + create_info_array_link_to_profile(element);
                    });
                    document.getElementById("the_user_table").innerHTML = table_info;
                }
            };
            load_users_info.open("GET", "get_usernames", true);
            //load_user_info.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            load_users_info.send();
        }
    };
    sign_in_request.open("GET", "get_main_page_users", true);
    //check_p.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    sign_in_request.send();
}

function show_main_page() { //here we have to draw the top 10 posts in general 
    var load_page = new XMLHttpRequest();
    load_page.onreadystatechange = function() {
        document.getElementById("content").innerHTML = load_page.responseText;
        var load_user_info = new XMLHttpRequest();
        var user_info;
        var data = "username=" + logged_in_user;
        load_user_info.onreadystatechange = function() {
            if (load_user_info.readyState === 4 && load_user_info.status === 200) {
                user_info = JSON.parse(load_user_info.responseText);
                document.getElementById("welcome_message").innerHTML = "Hi " + user_info.firstName;
                //draw here
                get_top_posts_general();
            }
        };
        load_user_info.open("POST", "get_user_info", true);
        load_user_info.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        load_user_info.send(data);
    };
    load_page.open("GET", "get_main_page", true);
    load_page.send();
}

function post_fields_check() {
    var error_msg = "<b>Please be sure that these fields are filled: ";
    var error = false;
    if (document.getElementById("post_description").value === "") {
        error_msg = error_msg + 'description ';
        error = true;
    }
    if (document.getElementById("lat").value === "") {
        error_msg = error_msg + 'lat ';
        error = true;
    }
    if (document.getElementById("lon").value === "") {
        error_msg = error_msg + 'lon ';
        error = true;
    }


    error_msg = error_msg + '</b>';
    if (error) {
        document.getElementById("wrong_input").innerHTML = error_msg;
    } else {
        document.getElementById("wrong_input").innerHTML = "";
    }
    return error;
}

function empty_post_fields() {
    document.getElementById("post_description").value = "";
    document.getElementById("lat").value = "";
    document.getElementById("lon").value = "";
    document.getElementById("image_url").value = "";
    document.getElementById("image_base64").value = "";
    document.getElementById("external_url").value = "";
}

function upload_post() {
    if (!post_fields_check()) {
        var data = 'username=' + logged_in_user + '&description=' + document.getElementById("post_description").value + "&lat=" +
            document.getElementById("lat").value + '&lon=' + document.getElementById("lon").value +
            '&external_url=' + document.getElementById("external_url").value;
        if (document.getElementById("image_base64").value !== "") {
            data += '&image_base64=' + document.getElementById("image_base64").value;
            data += '&image_url=' + "";
        } else {
            data += '&image_base64=' + "";
            if (document.getElementById("image_url").value !== "") {
                data += '&image_url=' + document.getElementById("image_url").value;
            } else {
                data += '&image_url=' + "";
            }
        }

        var create_post_request = new XMLHttpRequest();
        var response_msg;
        create_post_request.onreadystatechange = function() {
            if (create_post_request.readyState === 4 && create_post_request.status === 200) {
                response_msg = JSON.parse(create_post_request.responseText);
                console.log(response_msg);
                empty_post_fields();
                get_top10_user_posts();
            }
        };
        create_post_request.open("POST", "create_post", true);
        create_post_request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        create_post_request.send(data);
    }
}

function upload_post_main_page() {
    if (!post_fields_check()) {
        // var data = 'username=' + logged_in_user + '&description=' + document.getElementById("post_description").value + "&lat=" +
        //    document.getElementById("lat").value + '&lon=' + document.getElementById("lon").value + '&image_url=' + document.getElementById("image_url").value +
        //    '&external_url=' + document.getElementById("external_url").value;
        var data = 'username=' + logged_in_user + '&description=' + document.getElementById("post_description").value + "&lat=" +
            document.getElementById("lat").value + '&lon=' + document.getElementById("lon").value +
            '&external_url=' + document.getElementById("external_url").value;
        if (document.getElementById("image_base64").value !== "") {
            data += '&image_base64=' + document.getElementById("image_base64").value;
            data += '&image_url=' + "";
        } else {
            data += '&image_base64=' + "";
            if (document.getElementById("image_url").value !== "") {
                data += '&image_url=' + document.getElementById("image_url").value;
            } else {
                data += '&image_url=' + "";
            }
        }
        var create_post_request = new XMLHttpRequest();
        var response_msg;
        create_post_request.onreadystatechange = function() {
            if (create_post_request.readyState === 4 && create_post_request.status === 200) {
                response_msg = JSON.parse(create_post_request.responseText);
                empty_post_fields();
                get_top_posts_general();
            }
        };
        create_post_request.open("POST", "create_post", true);
        create_post_request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        create_post_request.send(data);
    }
}

function get_top10_user_posts() {
    var data = 'username=' + logged_in_user;
    var test = new XMLHttpRequest();
    test.onreadystatechange = function() {
        if (test.readyState === 4 && test.status === 200) {
            document.getElementById("posts_area").innerHTML = test.responseText;
            handle_posts_locations(document.getElementById("posts_area").children.length);
        }
    };
    test.open("POST", "get_top10_user_posts", true);
    test.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    test.send(data);

}

function get_top_posts_for_user(username) {
    var data = 'username=' + username;
    var test = new XMLHttpRequest();
    test.onreadystatechange = function() {
        if (test.readyState === 4 && test.status === 200) {
            document.getElementById("posts_area").innerHTML = test.responseText;
            handle_posts_locations(document.getElementById("posts_area").children.length);
        }
    };
    test.open("POST", "get_top10_specific_user_posts", true);
    test.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    test.send(data);

}

function get_top_posts_general() {
    var main_posts = new XMLHttpRequest();
    main_posts.onreadystatechange = function() {
        if (main_posts.readyState === 4 && main_posts.status === 200) {
            document.getElementById("posts_area").innerHTML = main_posts.responseText;
            handle_posts_locations(document.getElementById("posts_area").children.length);
        }
    };
    main_posts.open("GET", "get_top10_posts_general", true);
    main_posts.send();
}

function handle_posts_locations(iterator) { //gia 10 post to max post exei id 9
    if (iterator !== 0) {
        if (document.getElementById('lat' + (iterator - 1)).innerHTML !== "" && document.getElementById('lon' + (iterator - 1)).innerHTML !== "") {
            if (document.getElementById('lat' + (iterator - 1)).innerHTML !== "null" && document.getElementById('lon' + (iterator - 1)).innerHTML !== "null") {
                var find_location_info = new XMLHttpRequest();
                var response_msg;
                find_location_info.onreadystatechange = function() {
                    if (find_location_info.readyState === 4 && find_location_info.status === 200) {
                        response_msg = JSON.parse(find_location_info.responseText);
                        if (response_msg.error !== "Unable to geocode") {
                            var area_info = "";
                            if (response_msg.address.country) {
                                area_info = area_info + " " + response_msg.address.country;
                            }
                            if (response_msg.address.city) {
                                area_info = area_info + " " + response_msg.address.city;
                            }
                            if (response_msg.address.road) {
                                area_info = area_info + " " + response_msg.address.road;
                            }
                            document.getElementById('area_info_display' + (iterator - 1)).innerHTML = area_info;
                            document.getElementById('lat' + (iterator - 1)).style.display = "none";
                            document.getElementById('lon' + (iterator - 1)).style.display = "none";
                        }
                        handle_posts_locations(iterator - 1);
                    }
                };
                find_location_info.open("GET", "https://nominatim.openstreetmap.org/reverse?format=json&lat=" + document.getElementById('lat' + (iterator - 1)).innerHTML +
                    "&lon=" + document.getElementById('lon' + (iterator - 1)).innerHTML, true);
                find_location_info.send();
            } else {
                handle_posts_locations(iterator - 1);
            }
        } else {
            handle_posts_locations(iterator - 1);
        }
    }
}

function delete_post(postid) {
    var data = 'post_id=' + postid;
    var delete_post = new XMLHttpRequest();
    var response;
    delete_post.onreadystatechange = function() {
        if (delete_post.readyState === 4 && delete_post.status === 200) {
            response = JSON.parse(delete_post.responseText);
            console.log(response.result);
            get_top10_user_posts();
        }
    };
    delete_post.open("POST", "delete_post", true);
    delete_post.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    delete_post.send(data);
}


//function draw_camera_photo(postid, elementid) {
// var data = 'post_id=' + postid;
// var fetch_base64 = new XMLHttpRequest();
// var response;
//fetch_base64.onreadystatechange = function() {
// if (fetch_base64.readyState === 4 && fetch_base64.status === 200) {
//       response = JSON.parse(fetch_base64.responseText);
//     var canvas = document.getElementById(elementid);
//         var ctx = canvas.getContext("2d");
//           var image = new Image();
//            image.src = response.image_base64.split(' ').join('+');
//           ctx.drawImage(image, 0, 0);
//            console.log("done");
//        }
//    };
//    fetch_base64.open("POST", "get_post_base64", true);
//    fetch_base64.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
//    fetch_base64.send(data);
//}

//function draw_camera_photo(img, elementid) {
// var canvas = document.getElementById(elementid);
//  var ctx = canvas.getContext("2d");
//  var image = new Image();
//   image.src = img.split(' ').join('+');
//   ctx.drawImage(image, 0, 0);
//}

function draw_camera_photo(img, elementid) {
    var image = new Image();
    if (img.startsWith("null")) {
        return;
    }
    if (!img.startsWith("data")) {
        img = "data:image/jpeg;base64," + img;
    }
    image.id = "image0"; //use it only when viewing a detailed post so that id is unique!
    image.src = img.split(' ').join('+');
    document.getElementById(elementid).appendChild(image);
}

function draw_camera_photo_detailed(img, elementid) {
    var image = new Image();
    if (img.startsWith("null")) {
        return;
    }
    if (!img.startsWith("data")) {
        img = "data:image/jpeg;base64," + img;
    }
    image.id = "image0"; //use it only when viewing a detailed post so that id is unique!
    image.src = img.split(' ').join('+');
    document.getElementById(elementid).appendChild(image);
    handle_image_recognition();
}
//var global_img;

function readFile() {
    if (this.files && this.files[0]) {
        var FR = new FileReader();

        FR.addEventListener("load", function(e) {
            document.getElementById("image_base64").value = e.target.result;
            //global_img = e.target.result;
        });
        FR.readAsDataURL(this.files[0]);
    }

}

function add_listener_inp() {
    document.getElementById("inp").addEventListener("change", readFile);
}


function handle_detailed_post_location() { //gia 10 post to max post exei id 9

    if (document.getElementById('lat').innerHTML !== "" && document.getElementById('lon').innerHTML !== "") {
        if (document.getElementById('lat').innerHTML !== "null" && document.getElementById('lon').innerHTML !== "null") {
            var find_location_info = new XMLHttpRequest();
            var response_msg;
            find_location_info.onreadystatechange = function() {
                if (find_location_info.readyState === 4 && find_location_info.status === 200) {
                    response_msg = JSON.parse(find_location_info.responseText);
                    if (response_msg.error !== "Unable to geocode") {
                        var area_info = "";
                        if (response_msg.address.country) {
                            area_info = area_info + " " + response_msg.address.country;
                        }
                        if (response_msg.address.city) {
                            area_info = area_info + " " + response_msg.address.city;
                        }
                        if (response_msg.address.road) {
                            area_info = area_info + " " + response_msg.address.road;
                        }
                        document.getElementById("area_info_display").innerHTML = area_info;
                        document.getElementById('lat').style.display = "none";
                        document.getElementById('lon').style.display = "none";
                    }
                }
            };
            find_location_info.open("GET", "https://nominatim.openstreetmap.org/reverse?format=json&lat=" + document.getElementById('lat').innerHTML +
                "&lon=" + document.getElementById('lon').innerHTML, true);
            find_location_info.send();
        }
    }
}


function view_detailed_post(post_id) {
    var data = "post_id=" + post_id;
    var view_post = new XMLHttpRequest();
    var response;
    view_post.onreadystatechange = function() {
        if (view_post.readyState === 4 && view_post.status === 200) {
            response = view_post.responseText;
            document.getElementById("the_page_container").innerHTML = response;
            handle_detailed_post_location();
            var latit_detailed = document.getElementById("lat").innerHTML;
            var longi_detailed = document.getElementById("lon").innerHTML;
            show_on_map_detailed_post(latit_detailed, longi_detailed);
            if (document.getElementById("image0") !== null) {
                handle_image_recognition();
            }
            //
        }

    };
    view_post.open("POST", "view_detailed_post", true);
    view_post.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    view_post.send(data);

}

function show_on_map_detailed_post(latit, longi) {
    var themap = document.createElement("div");
    themap.id = "themap";
    document.getElementById("map_area").appendChild(themap); //bazw to map sto placeholder tou pou einai to map area
    document.getElementById("themap").style.height = "395px"; //fixed height for page cohession
    var map = new OpenLayers.Map("themap");
    map.addLayer(new OpenLayers.Layer.OSM()); //ftiaxnw to basic layer gia to map
    var fromProjection = new OpenLayers.Projection("EPSG:4326"); // Transform from WGS 1984
    var toProjection = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
    var position = new OpenLayers.LonLat(longi, latit).transform(fromProjection, toProjection);
    add_markers(map, position);
    var zoom = 16;
    map.setCenter(position, zoom); //kentrarw to xarth sth topo8esia
}
var MD5 = function(d) { var result = M(V(Y(X(d), 8 * d.length))); return result.toLowerCase() };

function M(d) { for (var _, m = "0123456789ABCDEF", f = "", r = 0; r < d.length; r++) _ = d.charCodeAt(r), f += m.charAt(_ >>> 4 & 15) + m.charAt(15 & _); return f }

function X(d) { for (var _ = Array(d.length >> 2), m = 0; m < _.length; m++) _[m] = 0; for (m = 0; m < 8 * d.length; m += 8) _[m >> 5] |= (255 & d.charCodeAt(m / 8)) << m % 32; return _ }

function V(d) { for (var _ = "", m = 0; m < 32 * d.length; m += 8) _ += String.fromCharCode(d[m >> 5] >>> m % 32 & 255); return _ }

function Y(d, _) {
    d[_ >> 5] |= 128 << _ % 32, d[14 + (_ + 64 >>> 9 << 4)] = _;
    for (var m = 1732584193, f = -271733879, r = -1732584194, i = 271733878, n = 0; n < d.length; n += 16) {
        var h = m,
            t = f,
            g = r,
            e = i;
        f = md5_ii(f = md5_ii(f = md5_ii(f = md5_ii(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_ff(f = md5_ff(f = md5_ff(f = md5_ff(f, r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 0], 7, -680876936), f, r, d[n + 1], 12, -389564586), m, f, d[n + 2], 17, 606105819), i, m, d[n + 3], 22, -1044525330), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 4], 7, -176418897), f, r, d[n + 5], 12, 1200080426), m, f, d[n + 6], 17, -1473231341), i, m, d[n + 7], 22, -45705983), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 8], 7, 1770035416), f, r, d[n + 9], 12, -1958414417), m, f, d[n + 10], 17, -42063), i, m, d[n + 11], 22, -1990404162), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 12], 7, 1804603682), f, r, d[n + 13], 12, -40341101), m, f, d[n + 14], 17, -1502002290), i, m, d[n + 15], 22, 1236535329), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 1], 5, -165796510), f, r, d[n + 6], 9, -1069501632), m, f, d[n + 11], 14, 643717713), i, m, d[n + 0], 20, -373897302), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 5], 5, -701558691), f, r, d[n + 10], 9, 38016083), m, f, d[n + 15], 14, -660478335), i, m, d[n + 4], 20, -405537848), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 9], 5, 568446438), f, r, d[n + 14], 9, -1019803690), m, f, d[n + 3], 14, -187363961), i, m, d[n + 8], 20, 1163531501), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 13], 5, -1444681467), f, r, d[n + 2], 9, -51403784), m, f, d[n + 7], 14, 1735328473), i, m, d[n + 12], 20, -1926607734), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 5], 4, -378558), f, r, d[n + 8], 11, -2022574463), m, f, d[n + 11], 16, 1839030562), i, m, d[n + 14], 23, -35309556), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 1], 4, -1530992060), f, r, d[n + 4], 11, 1272893353), m, f, d[n + 7], 16, -155497632), i, m, d[n + 10], 23, -1094730640), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 13], 4, 681279174), f, r, d[n + 0], 11, -358537222), m, f, d[n + 3], 16, -722521979), i, m, d[n + 6], 23, 76029189), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 9], 4, -640364487), f, r, d[n + 12], 11, -421815835), m, f, d[n + 15], 16, 530742520), i, m, d[n + 2], 23, -995338651), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 0], 6, -198630844), f, r, d[n + 7], 10, 1126891415), m, f, d[n + 14], 15, -1416354905), i, m, d[n + 5], 21, -57434055), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 12], 6, 1700485571), f, r, d[n + 3], 10, -1894986606), m, f, d[n + 10], 15, -1051523), i, m, d[n + 1], 21, -2054922799), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 8], 6, 1873313359), f, r, d[n + 15], 10, -30611744), m, f, d[n + 6], 15, -1560198380), i, m, d[n + 13], 21, 1309151649), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 4], 6, -145523070), f, r, d[n + 11], 10, -1120210379), m, f, d[n + 2], 15, 718787259), i, m, d[n + 9], 21, -343485551), m = safe_add(m, h), f = safe_add(f, t), r = safe_add(r, g), i = safe_add(i, e)
    }
    return Array(m, f, r, i)
}

function md5_cmn(d, _, m, f, r, i) { return safe_add(bit_rol(safe_add(safe_add(_, d), safe_add(f, i)), r), m) }

function md5_ff(d, _, m, f, r, i, n) { return md5_cmn(_ & m | ~_ & f, d, _, r, i, n) }

function md5_gg(d, _, m, f, r, i, n) { return md5_cmn(_ & f | m & ~f, d, _, r, i, n) }

function md5_hh(d, _, m, f, r, i, n) { return md5_cmn(_ ^ m ^ f, d, _, r, i, n) }

function md5_ii(d, _, m, f, r, i, n) { return md5_cmn(m ^ (_ | ~f), d, _, r, i, n) }

function safe_add(d, _) { var m = (65535 & d) + (65535 & _); return (d >> 16) + (_ >> 16) + (m >> 16) << 16 | 65535 & m }

function bit_rol(d, _) { return d << _ | d >>> 32 - _ }


function handle_image_recognition() {
    if (document.getElementById("image0") !== null) {
        console.log("hi");
        var image = document.getElementById("image0").src;
        var response_detect;
        var detect_face = new XMLHttpRequest();
        var data = new FormData();
        data.append('api_key', 'l2jNgKbk1HXSR4vMzNygHXx2g8c_xT9c');
        data.append('api_secret', '2T6XdZt4EYw-I7OhmZ6g1wtECl81e_Ip');
        // add also other query parameters based on the request
        // you have to send 
        if (!image.startsWith("data")) {
            data.append('image_url', image);
        } else {
            data.append('image_base64', image);
        }
        detect_face.onreadystatechange = function() {
            if (detect_face.readyState === 4 && detect_face.status === 200) {
                response_detect = JSON.parse(detect_face.responseText);
                console.log(response_detect);
                if (response_detect.faces.length > 0) { //borei na mhn anagnwristike face
                    //var thedata = new FormData();
                    ///thedata.append("api_key", faceAPI.apiKey);
                    //thedata.append("api_secret", faceAPI.apiSecret);
                    // thedata.append("face_token", response.faces[0].face_token);
                    //thedata.append("user_id", parent.document.getElementById("username").value); //access metablhtwn eksw apto iframe mesw parentzz
                    //parent.document.getElementById("face_not_recognized").style.display = "none";
                    //ajaxRequest("POST", faceAPI.setuserId, thedata);
                    var thedata = new FormData();
                    thedata.append("api_key", 'l2jNgKbk1HXSR4vMzNygHXx2g8c_xT9c');
                    thedata.append("api_secret", '2T6XdZt4EYw-I7OhmZ6g1wtECl81e_Ip');
                    if (!image.startsWith("data")) {
                        thedata.append('image_url', image);
                    } else {
                        thedata.append('image_base64', image);
                    }
                    thedata.append("outer_id", 'hy359');
                    var face_in_set = new XMLHttpRequest();
                    face_in_set.onreadystatechange = function() {
                        if (face_in_set.readyState === 4 && face_in_set.status === 200) {
                            var response = JSON.parse(face_in_set.responseText);
                            if (response.results) {
                                var username_to_test = response.results[0].user_id;
                                console.log(username_to_test);
                                var load_users_info = new XMLHttpRequest();
                                var users_info;
                                var flag = 0;
                                load_users_info.onreadystatechange = function() {
                                    if (load_users_info.readyState === 4 && load_users_info.status === 200) {
                                        users_info = JSON.parse(load_users_info.responseText);

                                        users_info.forEach(element => {
                                            if (element === username_to_test) {
                                                flag = 1;
                                            }
                                        });
                                        if (flag === 1) {
                                            document.getElementById("place_answer").innerHTML = "face of register user " + username_to_test + " recognised";
                                        } else {
                                            document.getElementById("place_answer").innerHTML = "face recognised in set hy359 but not registered ";
                                        }

                                    }
                                };
                                load_users_info.open("GET", "get_usernames", true);
                                //load_user_info.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                                load_users_info.send();
                            } else {
                                document.getElementById("place_answer").style.display = "face not in set hy359";
                            }
                        }
                    };
                    face_in_set.open("POST", "https://api-us.faceplusplus.com/facepp/v3/search", true);
                    face_in_set.send(thedata);
                } else {
                    document.getElementById("place_answer").innerHTML = "no face was recognized";
                }
            }
        };
        detect_face.open("POST", 'https://api-us.faceplusplus.com/facepp/v3/detect', true);
        detect_face.send(data);

    } else { console.log("hi2"); }
}