// math with numbers from the form.
function printNumbers() {
    let startNum = parseInt(document.getElementById("numOne").value);
    let endNum = parseInt(document.getElementById("numTwo").value);

    displayData(startNum, endNum);

}


// Display the numbers in a table.
function displayData(startNum, endNum) {

    // get the template from the bottom of the html

    const myTemplate = document.getElementById("Data-Template");
    const resultsBody = document.getElementById("resultsBody");
    resultsBody.innerHTML = "";


    // loop over values from start to end
    for (let i = startNum; i <= endNum; i += 10) {
        const dataRow = document.importNode(myTemplate.content, true); // grabs the html tr,td elements; true gets new row each time

        dataRow.getElementById("col1").textContent = i;
        dataRow.getElementById("col2").textContent = i + 1;
        dataRow.getElementById("col3").textContent = i + 2;
        dataRow.getElementById("col4").textContent = i + 3;
        dataRow.getElementById("col5").textContent = i + 4;
        dataRow.getElementById("col6").textContent = i + 5;
        dataRow.getElementById("col7").textContent = i + 6;
        dataRow.getElementById("col8").textContent = i + 7;
        dataRow.getElementById("col9").textContent = i + 8;
        dataRow.getElementById("col10").textContent = i + 9;

        resultsBody.appendChild(dataRow);
    }

}