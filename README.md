hy359-2019-a5

Web Programming - 2019 - A5


-task1 delete user: 

completed , phase1 does not check if each post had ratings or posts because not yet implemented

implementation : added button for delete user and main profile
                 confirmaration buttons apear 
                 if clicked cancel stops process
                 on yes sends request to servlet delete user with username as argument
                 that servlet itterates all posts of that user with a new function called getPostsOfUser in postdb 
                 calls delete for each post
                 then deletes user and invalidates session
                 it returns json with success or fail ,fail will be cause if a comment cant be deleted
                 then it fetches the sign up page
-task3 encryption:

completed

implementation :used md5 javascript side when sending passwords
                used md5 to store and encrypted password in database
                more specificly when signing up when login in and when updating password the passwords arrive encrypted at server
                when checking for the ability to sign in we compare the md5 of the encrypted password that user send with the version we stored in database
                if they match , he is in

-task6 face recognition:

completed

implementation: after clicking view detailed post we send a request to faceplusplus
                if it detects a face we check if it belongs to the set hy359
                after we check if there is a registered user with that username
                error handling messages and on success messages exist

-task7 rating:

tried at least. made a select, sent the value to servlet and then passed the rating to DB