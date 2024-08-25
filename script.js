document.getElementById("submitBtn").addEventListener("click", function() {
    const jsonInput = document.getElementById("jsonInput").value.trim();
    
    try {
        const jsonData = JSON.parse(jsonInput);
        
        if (!jsonData.data || !Array.isArray(jsonData.data)) {
            throw new Error("Invalid JSON format. 'data' should be an array.");
        }

        // Display the multi-select dropdown
        document.getElementById("dropdownContainer").classList.remove("hidden");

        // Call the API with the parsed JSON
        fetch('https://your-backend-api-endpoint.com/your-api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)
        })
        .then(response => response.json())
        .then(data => {
            handleApiResponse(data);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
        
    } catch (error) {
        alert("Invalid JSON input: " + error.message);
    }
});

document.getElementById("filterSelect").addEventListener("change", function() {
    const selectedFilters = Array.from(this.selectedOptions).map(option => option.value);
    const apiResponse = JSON.parse(localStorage.getItem("apiResponse") || "{}");
    
    if (apiResponse.data) {
        const filteredData = filterData(apiResponse.data, selectedFilters);
        document.getElementById("filteredResponse").textContent = filteredData.join(',');
        document.getElementById("responseContainer").classList.remove("hidden");
    }
});

function handleApiResponse(data) {
    localStorage.setItem("apiResponse", JSON.stringify(data));
    const selectedFilters = Array.from(document.getElementById("filterSelect").selectedOptions).map(option => option.value);
    
    if (selectedFilters.length > 0) {
        const filteredData = filterData(data.data, selectedFilters);
        document.getElementById("filteredResponse").textContent = filteredData.join(',');
        document.getElementById("responseContainer").classList.remove("hidden");
    }
}

function filterData(data, filters) {
    let filteredData = [];

    if (filters.includes("alphabets")) {
        filteredData = filteredData.concat(data.filter(item => /^[a-zA-Z]$/.test(item)));
    }

    if (filters.includes("numbers")) {
        filteredData = filteredData.concat(data.filter(item => /^[0-9]+$/.test(item)));
    }

    if (filters.includes("highestLowercase")) {
        const lowercaseLetters = data.filter(item => /^[a-z]$/.test(item));
        const highest = lowercaseLetters.sort().reverse()[0];
        if (highest) {
            filteredData.push(highest);
        }
    }

    return filteredData;
}