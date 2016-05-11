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
		switch(this.msgs.length){
			case 0:
			    return '';
			case 1:
			    return this.msgs[0];
			default:
			    return this.msgs.join('\n');
		}
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
		if(arr !== null){
			var htmlText = "<tr><th>Name</th>"+
						   "<th>Type</th>"+
						   "<th>Host</th>"+
						   "<th>Start Date/Time</th>"+
						   "<th>End Date/Time</th></tr>";
		    for(var i=0; i< arr.length;i++){
			
			    htmlText = htmlText + "<tr><td>" + arr[i].eName + "</td>" + 
			               "<td>" + arr[i].eType + "</td>" +
						   "<td>" + arr[i].eHost + "</td>" +
						   "<td>" + arr[i].eStart + "</td>" +
						   "<td>" + arr[i].eEnd + "</td></tr>";
			}
			$('#list').append(htmlText);
		}
		else{
			var htmlText = "<tr><th>Name</th>"+
						   "<th>Type</th>"+
						   "<th>Host</th>"+
						   "<th>Start Date/Time</th>"+
						   "<th>End Date/Time</th></tr>";
			$('#list').append(htmlText);
		}
		
	},
	function(errorObject){
		console.log("The Read from Firebase Failed: " + errorObject.code);
	});
})();
/*
 * callback function for click event on submit button and 
 * handling creation of the account.
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
		if(firstPasswd.value.length > 20){
			firstPasswdErrMsgs.set('20 or less characters required.');
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
				firstPasswdErrMsgs.set("includes illegal character " +'"'+ illegalChar+'"');
			});
		}
	}
	
	if(firstPasswd.value === secondPasswd.value && firstPasswd.value.length > 0){
		validateSignUpForm();
	}
	else{
		secondPasswdErrMsgs.set('Password Mismatch');
	}
	
	firstPasswd.setCustomValidity(firstPasswdErrMsgs.get());
	secondPasswd.setCustomValidity(secondPasswdErrMsgs.get());
	if(firstPasswdErrMsgs.get().length + secondPasswdErrMsgs.get().length === 0){
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
	
	// Event Start and End Date Validation.
	if(Date.parse(eventStart.value) < Date.parse(eventEnd.value)){
		eventDateErrMsg.set('');
	}
	else{
		eventFormError = true;
		eventDateErrMsg.set("End Date/Time should be greater than Start Date/Time.");
	}
	eventEnd.setCustomValidity(eventDateErrMsg.get());
	
	if(!eventFormError && eventType.value.length > 0 && eventName.value.length > 0 && eventHost.value.length > 0 && guestList.value.length > 0 && loc.value.length > 0){
		eventStartNew = eventStart.value.replace('T','@');
		eventEndNew = eventEnd.value.replace('T', '@');
	    var eventObj = {
			eName: eventName.value,
		    eType: eventType.value,
            eHost: eventHost.value,
			eStart: eventStartNew,
			eEnd: eventEndNew
		}
		eventsRef.on("value", function(snapshot){
        events = snapshot.val() || [];
		});
	    events.push(eventObj);
        eventsRef.set(events);
		$('#event-form')[0].reset();
		alert("Event Created!!!");
    }
}
/*
 * Various event handlers.
 */
$('.sign-up-btn').on('click', createAccount);
$('.sign-up-btn').on('touchstart', createAccount);

$('.event-submit').on('click', createEvent);
$('.event-submit').on('touchstart', createEvent);
/*
 * Live Input fields validation.
 */
var inputs = document.getElementsByTagName("input");
var inputs_len = inputs.length;
var addDirtyClass = function(evt) {
  evt.srcElement.classList.toggle("dirty", true);
};
for (var i = 0; i < inputs_len; i++) {
  var input = inputs[i];
  input.addEventListener("blur", addDirtyClass);
  input.addEventListener("invalid", addDirtyClass);
  input.addEventListener("valid", addDirtyClass);
}