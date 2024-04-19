function calculateFuelConsumption() {
    var averageConsumption = parseFloat(document.getElementById("average-consumption").value);
    var distance = parseFloat(document.getElementById("distance").value);
    var resultElement = document.getElementById("result");

    // Retrieve fuel price data from API
    $.ajax({
        url: 'http://apis.is/petrol',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            var prices = response.results;
            var dieselPrices = prices.filter(price => price.company && price.diesel);
            var bensinPrices = prices.filter(price => price.company && price.bensin95);

            // Sort prices in ascending order
            dieselPrices.sort((a, b) => parseFloat(a.diesel) - parseFloat(b.diesel));
            bensinPrices.sort((a, b) => parseFloat(a.bensin95) - parseFloat(b.bensin95));

            // Get the second cheapest prices and corresponding name and company
            var secondCheapestDiesel = dieselPrices[1];
            var secondCheapestBensin = bensinPrices[1];

            // Check if the input values and fuel prices are valid
            if (isNaN(averageConsumption) || isNaN(distance) || !secondCheapestDiesel || !secondCheapestBensin) {
                resultElement.innerHTML = "<span class='error'>Vinsamlegast skrifaðu númer.</span>";
                return;
            }

            // Calculate fuel consumption
            var fuelConsumption = (averageConsumption * distance) / 100;

            // Calculate total cost of fuel
            var totalCost;
            var fuelType = document.getElementById("fuel-type").value;
            var name, company;
            if (fuelType === "diesel") {
                totalCost = fuelConsumption * parseFloat(secondCheapestDiesel.diesel);
                name = secondCheapestDiesel.name;
                company = secondCheapestDiesel.company;
            } else if (fuelType === "bensin") {
                totalCost = (fuelConsumption * parseFloat(secondCheapestBensin.bensin95));
                name = secondCheapestBensin.name;
                company = secondCheapestBensin.company;
            }

            resultElement.innerHTML = "Mögulegt verð (" + fuelType.charAt(0).toUpperCase() + fuelType.slice(1) + "): ISK " + totalCost.toFixed(2) + "kr<br>";
            resultElement.innerHTML += "Staður: " + name + "<br>";
            resultElement.innerHTML += "Fyrirtæki: " + company;

            

        }
    });
}

function calculateDistanceWithFuelBudget() {
    var budget = parseFloat(document.getElementById("budget").value);
    var averageConsumption = parseFloat(document.getElementById("average-consumption1").value);
    var resultElement = document.getElementById("result1");

    // Retrieve fuel price data from API
    $.ajax({
        url: 'http://apis.is/petrol',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            var prices = response.results;
            var dieselPrices = prices.filter(price => price.company && price.diesel);
            var bensinPrices = prices.filter(price => price.company && price.bensin95);

            // Sort prices in ascending order
            dieselPrices.sort((a, b) => parseFloat(a.diesel) - parseFloat(b.diesel));
            bensinPrices.sort((a, b) => parseFloat(a.bensin95) - parseFloat(b.bensin95));

            // Get the second cheapest prices and corresponding name and company
            var secondCheapestDiesel = dieselPrices[1];
            var secondCheapestBensin = bensinPrices[1];

            // Check if the input values and fuel prices are valid
            if (isNaN(budget) || isNaN(averageConsumption) || !secondCheapestDiesel || !secondCheapestBensin) {
                resultElement.innerHTML = "<span class='error'>Vinsamlegast skrifaðu rétt númer.</span>";
                return;
            }

            // Calculate distance with the given budget
            var fuelType = document.getElementById("fuel-type1").value;
            var distance;
            if (fuelType === "diesel") {
                distance = (budget * averageConsumption / parseFloat(secondCheapestDiesel.diesel));
            } else if (fuelType === "bensin") {
                distance = (budget * averageConsumption / parseFloat(secondCheapestBensin.bensin95));
            }

            resultElement.innerHTML = "Möguleg lengd (" + fuelType.charAt(0).toUpperCase() + fuelType.slice(1) + "): " + distance.toFixed(2) + " km<br>";
        }
    });
}


        // Initialize the Google Places Autocomplete for origin and destination inputs
function initializeAutocomplete() {
    var originAutocomplete = new google.maps.places.Autocomplete(document.getElementById('origin'));
    var destinationAutocomplete = new google.maps.places.Autocomplete(document.getElementById('destination'));
}

// Define the callback function
function callback(response, status) {
    var resultElement = document.getElementById('result2');

    if (status == 'OK') {
        var distance = response.rows[0].elements[0].distance.text;
        var duration = response.rows[0].elements[0].duration.text;

        resultElement.innerHTML = 'Vegalengd: ' + distance + '<br>Tími: ' + duration;
    } else {
        resultElement.innerHTML = 'Error: Unable to calculate distance.';
    }
}

// Attach the event listener to the button click event
document.getElementById('calculateBtn').addEventListener('click', function () {
    // Get the origin and destination values
    var origin = document.getElementById('origin').value;
    var destination = document.getElementById('destination').value;

    // Check if both origin and destination are provided
    if (origin && destination) {
        // Use the Distance Matrix API to calculate the distance
        var service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix({
            origins: [origin],
            destinations: [destination],
            travelMode: 'DRIVING',
            unitSystem: google.maps.UnitSystem.METRIC,
            avoidHighways: false,
            avoidTolls: false
        }, callback);
    } else {
        alert('Please enter both origin and destination.');
    }
});

// Attach the event listener to the window load event to initialize the Autocomplete
google.maps.event.addDomListener(window, 'load', initializeAutocomplete);