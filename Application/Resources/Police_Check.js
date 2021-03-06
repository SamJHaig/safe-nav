/*******************************************************************************
 * Takes a latitude and longitude in, and then queries the Police database API
 * for the number of incidents nearby. Does so for 4 months back due to this
 * being the most reliable and up to date log of crimes.
 *
 * @param {String} lat - Value for latitude
 * @param {String} long - Value for longitude
 * @param {function} done - Callback for when the job is complete
 ******************************************************************************/
function Police_Check(lat, long, done) {
	// Get the current date
	var count = 0,
		today = new Date();

	// Go back 4 months to the latest Police record
	today.setMonth(today.getMonth() - 4);

	// Create a string of YYYY-DD format for the API URL.
	var month = today.getFullYear() + "-" + ("0" + (today.getMonth() + 1)).slice(-2);

	// Query the police database for events
	var url = 'https://data.police.uk/api/crimes-street/all-crime?lat=' + lat + '&lng=' + long + '&date=' + month;
	Ti.API.debug('Police: ' + url);

	// Query the API server, and count the number of incidents
	var client = Ti.Network.createHTTPClient({
		onload: function(e) {
			var total = 0;
			total += (this.responseText.match(/anti-social-behaviour/g) || []).length;
			total += (this.responseText.match(/bicycle-theft/g) || []).length;
			total += (this.responseText.match(/burglary/g) || []).length;
			total += (this.responseText.match(/criminal-damage-arson/g) || []).length;
			total += (this.responseText.match(/drugs/g) || []).length;
			total += (this.responseText.match(/other-theft/g) || []).length;
			total += (this.responseText.match(/possession-of-weapons/g) || []).length;
			total += (this.responseText.match(/public-order/g) || []).length;
			total += (this.responseText.match(/robbery/g) || []).length;
			total += (this.responseText.match(/shoplifting/g) || []).length;
			total += (this.responseText.match(/theft-from-the-person/g) || []).length;
			total += (this.responseText.match(/vehicle-crime/g) || []).length;
			total += (this.responseText.match(/violent-crime/g) || []).length;
			total += (this.responseText.match(/other-crime/g) || []).length;
			done(total);
		},
		onerror: function(e) {
			done(null);
		},
		// Timeout of 10 seconds
		timeout: 10000
	});

	// Prepare the connection
	client.open("GET", url);

	// Send the request
	client.send();
}

module.exports = Police_Check;
