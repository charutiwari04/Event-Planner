var autocomplete;
/* 
 * init() callback function for autocomplete functionality. 
 */
function init() {
	    // Create the autocomplete object, restricting the search to geographical
        // location types.
        autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */
			(document.getElementById('loc')),
            {types: ['geocode']});
        // When the user selects an address from the dropdown, populate the address
        // fields in the form.
        autocomplete.addListener('place_changed', fillInAddress);    
}
function fillInAddress(){
		var place = autocomplete.getPlace();
		
}
/*
 * constructor for storing error messages for various input form fields.
 */
function errorMsgs(){
	this.msgs = [];
}
/*
 * extention to errorMsgs for set() and get() methods.
 */
errorMsgs.prototype = {
	set: function(msg){
		this.msgs.push(msg);
	},
	get: function(){
		var msg = '';
		switch(this.msgs.length){
			case 0:
			    break;
			case 1:
			    msg = this.msgs[0];
				break;
			default:
			    msg = this.msgs.join('\n');
				break;
		}
		return msg;
	}
}
/*
 * reference to client side firebase database which stores event names.
 * function loads the database values onto the page as page loads.
 */
var eventsRef = new Firebase('https://myeventswithgulp.firebaseio.com/');
var events = [];
(function(){
	eventsRef.on("value", function(snapshot){
		var arr = snapshot.val();
		$('#list').html('');
		for(var i=0; i< arr.length;i++){
			$('#list').append('<a href="#" class="list-group-item">' + arr[i] + '</a>');
		}
		
	},
	function(errorObject){
		console.log("The Read from Firebase Failed: " + errorObject.code);
	});
})();
/*
 * callback function for click event on submit button and handling creation of the account.
 */
function createAccount(){
	var firstPasswdErrMsgs = new errorMsgs();
	var secondPasswdErrMsgs = new errorMsgs();
	var name = document.querySelector('#main-name');
	var email = document.querySelector('#main-email');
	var firstPasswd = document.querySelector('#main-paswd');
	var secondPasswd = document.querySelector('#second');
	var msg = '';
	function validateSignUpForm(){
		if(firstPasswd.value.length < 10){
			firstPasswdErrMsgs.set('< 10 characters');
		}
		else if(firstPasswd.value.length > 20){
			firstPasswdErrMsgs.set('> 20 characters');
		}
		if (!firstPasswd.value.match(/\d/g)) {
            firstPasswdErrMsgs.set("missing a number");
        }
		if (!firstPasswd.value.match(/[a-z]/g)) {
			firstPasswdErrMsgs.set("missing a lowercase letter");
		}
		if (!firstPasswd.value.match(/[A-Z]/g)) {
			firstPasswdErrMsgs.set("missing an uppercase letter");
		}

		var illegalCharacterGroup = firstPasswd.value.match(/[^A-z0-9\!\@\#\$\%\^\&\*]/g)
		if (illegalCharacterGroup) {
			illegalCharacterGroup.forEach(function (illegalChar) {
				firstPasswdErrMsgs.set("includes illegal character: " + illegalChar);
			});
		}
	}
	if(firstPasswd.value === secondPasswd.value && firstPasswd.value.length > 0){
		console.log("Inside Match");
		validateSignUpForm();
	}
	else{
		secondPasswdErrMsgs.set('Password Mismatch');
	}
	firstPasswd.setCustomValidity(firstPasswdErrMsgs.get());
	secondPasswd.setCustomValidity(secondPasswdErrMsgs.get());
    if(firstPasswdErrMsgs.get().length + secondPasswdErrMsgs.get().length === 0){
		console.log("Inside Reset");
	    $('#main-form')[0].reset();
		alert("Account Created");
	}
}
/*
 * callback function for submit button and creation of event.
 */
function createEvent(){
	var eventType = document.querySelector('#event-type');
	var eventHost = document.querySelector('#event-host');
	var eventName = document.querySelector('#event-name');
	var eventStart = document.querySelector('#event-start');
	var eventEnd = document.querySelector('#event-end');
	var guestList = document.querySelector('#guest-list');
	var loc = document.querySelector('#loc'); 
	var eventTypeErrMsgs = new errorMsgs();
	var eventDateErrMsg = new errorMsgs();
	var eventFormError = false;
	
	// Event Type Validation.
	if(eventType.value.length <= 0){
		eventFormError = true;
		eventTypeErrMsgs.set("Select Event Type");
	}
	eventType.setCustomValidity(eventTypeErrMsgs.get());
	
	// Event Start and End Date Validation.
	console.log(Date.parse(eventStart.value));
	console.log(Date.parse(eventEnd.value));
	console.log(Date.parse(eventEnd.value) - Date.parse(eventStart.value));
	if(Date.parse(eventStart.value) > Date.parse(eventEnd.value)){
		eventFormError = true;
		eventDateErrMsg.set("Start Date > End Date");
	}
	eventEnd.setCustomValidity(eventDateErrMsg.get());
	// validation for other fields.
	if(eventName.value <= 0 || eventHost.value <= 0 || eventStart.value <= 0 || eventEnd.value <= 0 || guestList.value <= 0 || loc.value <= 0){
		eventFormError = true;
	}
	
	if(!eventFormError){
	    var eventName = $("#event-name").val();
	    eventsRef.on("value", function(snapshot){
        events = snapshot.val();});
	    events.push(eventName);
        eventsRef.set(events);
		$('#event-form')[0].reset();
		alert("Event Created!!!");
    }
}
/*
 * Toggle(show/hide) account creation form when tab is clicked or touched.
 */
function toggleAccountTab(){
	
	$('#main-form').toggleClass('hidden-xs');
}
/*
 * Toggle(show/hide) event creation form when tab is clicked or touched.
 */
function toggleEventTab(){
	$('#event-form').toggleClass('hidden-xs');
}
/*
 * Toggle(show/hide) event list when tab is clicked or touched.
 */
function toggleEventsList(){
	$('#list').toggleClass('hidden-xs');
}
/*
 * Various event handlers.
 */
$('.sign-up-btn input').on('click', createAccount);
$('.sign-up-btn').on('touchstart', createAccount);

$('.event-submit input').on('click', createEvent);
$('.event-submit').on('touchstart', createEvent);

$('#toggle-sec-1 span').click(toggleAccountTab);
$('#toggle-sec-1').on('touchstart', toggleAccountTab);

$('#toggle-sec-2 span').on('click', toggleEventTab);
$('#toggle-sec-2').on('touchstart', toggleEventTab);

$('#toggle-sec-3 span').on('click', toggleEventsList);
$('#toggle-sec-3').on('touchstart', toggleEventsList);
