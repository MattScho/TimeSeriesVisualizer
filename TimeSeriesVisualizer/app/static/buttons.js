
// Toggles for the state of each button
var performanceOn = false;
var variabilityOn = false;
var lengthOn = false;
var uniqueOn = false;

variability();
unique();
length();
confusionMatrix();
// init
/*
* Handles the performance button being clicked
* Either creates or destroys view
*
* Author: Matthew Schofield, Gulsum Alicioglu
* Version: 4/21/2020
*/
function performanceAction() {
	// Grab references to necessary elements
	var performanceViewPanel = document.getElementById("performanceViewPanel");
	var performanceButton = document.getElementById("performanceButton");

	// Flip button state
	performanceOn = !performanceOn;
	if(performanceOn){
		performanceButton.setAttribute('class', "buttonOn");
		performanceViewPanel.style.display = "block";
	}else{
		performanceButton.setAttribute('class', "buttonOff");
		performanceViewPanel.style.display = "none";
	}
}

/*
* Handles the variability button being clicked
* Either creates or destroys view
*
* Author: Matthew Schofield, Gulsum Alicioglu
* Version: 4/21/2020
*/
function variabilityAction() {
	// Grab references to necessary elements
	var variabilityViewPanel = document.getElementById("variabilityViewPanel");
	var variabilityButton = document.getElementById("variabilityButton");

	// Flip button state
	variabilityOn = !variabilityOn;
	if(variabilityOn){
		variabilityButton.setAttribute('class', "buttonOn");
		variabilityViewPanel.style.display = "block";
	}else{
		variabilityButton.setAttribute('class', "buttonOff");
		variabilityViewPanel.style.display = "none";
	}
}
/*
* Handles the length button being clicked
* Either creates or destroys view
*
* Author: Matthew Schofield, Gulsum Alicioglu
* Version: 4/21/2020
*/
function lengthAction() {
	// Grab references to necessary elements
	var lengthViewPanel = document.getElementById("lengthViewPanel");
	var lengthButton = document.getElementById("lengthButton");

	// Flip button state
	lengthOn = !lengthOn;
    if(lengthOn) {
        lengthButton.setAttribute('class', "buttonOn");
        lengthViewPanel.style.display = "block";
    }else{
        lengthButton.setAttribute('class', "buttonOff");
        lengthViewPanel.style.display = "none";
    }
}

/*
* Handles the unique button being clicked
* Either creates or destroys view
*
* Author: Matthew Schofield, Gulsum Alicioglu
* Version: 4/21/2020
*/
 function uniqueAction() {
   // Grab references to necessary elements
	var uniqueViewPanel = document.getElementById("uniqueViewPanel");
	var uniqueButton = document.getElementById("uniqueButton");


	// Flip button state
	uniqueOn = !uniqueOn;
	if(uniqueOn){
		uniqueButton.setAttribute('class', "buttonOn");
		uniqueViewPanel.style.display = "block";
	}else{
		uniqueButton.setAttribute('class', "buttonOff");
		uniqueViewPanel.style.display = "none";
	}
  }