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
 * Account form validations.
 */
function validateName(){
	var txt ="";
	if(document.getElementById('main-name').validity.valueMissing){
		txt ="Please fill out the field."
	}
	document.getElementById('main-name-err').innerHTML = txt;
 }
function validateEmail(){
	var txt="";
	if(document.getElementById('main-email').validity.valueMissing){
		txt ="Please fill out the field."
	}
	if(document.getElementById('main-email').validity.patternMismatch){
		txt ="Not Valid Email Format."
	}
	document.getElementById('main-email-err').innerHTML = txt;
} 
function validatePaswd(){
	var txt="";
	if(document.getElementById('main-paswd').validity.valueMissing){
		txt ="Please fill out the field."
	}
	if(document.getElementById('main-paswd').validity.patternMismatch){
		txt ="Please follow password requirements."
	}
	document.getElementById('main-paswd-err').innerHTML = txt;
} 
function passwordMatch(){
	if(document.getElementById('second').value === document.getElementById('main-paswd').value){
		document.getElementById('second').setCustomValidity("");
		document.getElementById('second-err').innerHTML = document.getElementById('second').validationMessage;
	}
	else{
		document.getElementById('second').setCustomValidity("Password Mismatch");
		document.getElementById('second-err').innerHTML = document.getElementById('second').validationMessage;
	}
}
var formName = document.getElementById('main-form');
formName.addEventListener("submit", function(evt) {
    if (formName.checkValidity() === false) {
		evt.preventDefault();
		return false;
	}
	else{
		$('#main-form')[0].reset();
	    alert("Account Created");
	}
	
});
/*
 * Event Form validations.
 */
function validateEname(){
	var txt ="";
	if(document.getElementById('event-name').validity.valueMissing){
		txt ="Please fill out the field."
	}
	document.getElementById('event-name-err').innerHTML = txt;
}
function validateEtype(){
	var txt ="";
	if(document.getElementById('event-type').validity.valueMissing){
		txt ="Please fill out the field."
	}
	document.getElementById('event-type-err').innerHTML = txt;
}
function validateEhost(){
	var txt ="";
	if(document.getElementById('event-host').validity.valueMissing){
		txt ="Please fill out the field."
	}
	document.getElementById('event-host-err').innerHTML = txt;
}
function validateEstart(){
	var txt ="";
	if(document.getElementById('event-start').validity.valueMissing){
		txt ="Please fill out the field."
	}
	document.getElementById('event-start-err').innerHTML = txt;
}
function validateEend(){
	var txt ="";
	var eventStart = document.querySelector('#event-start');
	var eventEnd = document.querySelector('#event-end');
	if(document.getElementById('event-start').validity.valueMissing){
		txt ="Please fill out the field."
	}
	if(Date.parse(eventStart.value) >= Date.parse(eventEnd.value)){
		txt="End Date/Time should be greater than Start Date/Time.";
	}
	document.getElementById('event-end').setCustomValidity(txt);
	document.getElementById('event-end-err').innerHTML = document.getElementById('event-end').validationMessage;
}
function validateEguest(){
	var txt ="";
	if(document.getElementById('guest-list').validity.valueMissing){
		txt ="Please fill out the field."
	}
	document.getElementById('guest-list-err').innerHTML = txt;
}
function validateEloc(){
	var txt ="";
	if(document.getElementById('loc').validity.valueMissing){
		txt ="Please fill out the field."
	}
	document.getElementById('loc-err').innerHTML = txt;
}
var formName1 = document.getElementById('event-form');
formName1.addEventListener("submit", function(evt) {
    if (formName1.checkValidity() === false) {
		evt.preventDefault();
		return false;
	}
	else{
		var eventType = document.querySelector('#event-type');
		var eventHost = document.querySelector('#event-host');
		var eventName = document.querySelector('#event-name');
		var eventStart = document.querySelector('#event-start');
		var eventEnd = document.querySelector('#event-end');
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
	    alert("Event Created");
	}
	
});
/*
 * Live Input fields validation - color change code.
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
/*
 * Check Active Tab and Focus Inputs accordingly.
 */
$(document).on( 'shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
	var target = $(e.target).attr("href") // activated tab
	if(target === '#event_create'){
		$('#event-name').focus();
	}
	if(target === '#account_create'){
		$('#main-name').focus();
	}
})
