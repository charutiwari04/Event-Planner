
#Meet-Up Event Planner
##About the App 
This App is having three features:

1. User Sign-Up form - Users can sign up by entering few required details on the form and pressing Submit button. There are validations for each required input field and in case error, it will show. 
2. Event Creation Form - Users can create Events by entering few details on the form and pressing Submit button. Form validation happens and errors are shown in case something is wrong or missing. 
3. Events List - This is the list of Events created by users. Events stored in client side Firebase database are shown for the first time the site is opened. Any event created successfully will be added in the event list.

##How to Run the app.
This App is built in Gulp. 

1. Download all files on a folder in your system.
2. Locate the folder on the command line.
3. Either follow step 4 to 6 or step 7.
4. Install gulp if you do not have on your system. 
5. Install all the required gulp plugins, for this project required plugins are gulp-sass, gulp-autoprefixer, gulp-eslint, gulp-uglify, gulp-cssmin, browser-sync. It can be installed using coming line 
     * npm install --save-dev <plugin-name>*
6. Once everything is setup, type 'gulp' on the command line        
     * $<folder-name> gulp*

7. Or I have included package.json file, so instead of installing gulp and its plugins, just run command
     * npm install*.  
     In this case there is not need of typing gulp command. 

8. This will automatically open the browser and run the app on your computer. 
9. On command line it will give IP Address if we want to open this from mobile or outside. 
10. Use the IP address mentioned in command line to open the app on mobile.

##Skills used
HTML, CSS, JavaScript, Bootstrap, jQuery, Firebase and gulp.

##Limitations
This app is having few limitations as:

1. It does not save users data
2. It does not save all events data, only event name is saved. 

Improvements will be done in future.


  
