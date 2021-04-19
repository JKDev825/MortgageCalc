/*
 ** 04-18-21 jdj: Mortgage Loan Calculator:
 **
 */

function generatePaymentPlan() {

    let termPayAmt = 0; /* total loan amount: user input */
    let termPayMos = 0; /* total years: this will be user input */
    let termIntRate = 0; /* term interest rate: user input */


    termPayAmt = parseInt(document.getElementById("loanAmount").value, 10);
    termPayMoss = parseInt(document.getElementById("loanTerm").value, 10);
    termIntRate = parseInt(document.getElementById("loanInterest").value, 10);
   



} /* end of generatePaymentPlan()




/**
 ** test code 
 **
 */
/* testPaymentCalc(); */


/************************************

function loadEventData() {
    let eventData = [];
    eventData = getEventData();
    displayEventData(eventData);

    return null;
} // end of loadEventData()

function saveEventFormData() {

    // grab the events out of local storage
    let eventData = JSON.parse(localStorage.getItem("eventArray")) || eventArray;

    let obj = {};

    obj["event"] = document.getElementById("newEvent").value;
    obj["city"] = document.getElementById("newCity").value;
    obj["state"] = document.getElementById("newState").value;
    obj["attendance"] = document.getElementById("newAttendance").value;
    obj["date"] = document.getElementById("newDate").value;

    eventData.push(obj);

    localStorage.setItem("eventArray", JSON.stringify(eventData));

    return null;
} // end of saveEventData()

function displayEventData(eventData) {
    const template = document.getElementById("Event-Data-Template");
    const resultsBody = document.getElementById("resultsBody");

    resultsBody.innerHTML = "";

    for (let i = 0; i < eventData.length; i++) {
        const dataRow = document.importNode(template.content, true);

        dataRow.getElementById("eventname").textContent = eventData[i].event;
        dataRow.getElementById("city").textContent = eventData[i].city;
        dataRow.getElementById("state").textContent = eventData[i].state;
        dataRow.getElementById("attendance").textContent = eventData[i].attendance;
        dataRow.getElementById("date").textContent = formatDateMMDDYYYY(eventData[i].date);

        resultsBody.appendChild(dataRow);
    }
    return null;
} // end of displayEvenData()

****************************************************************/


function testPaymentCalc() {

    /*
     **
     ** From Bobby Davis to Everyone: 05: 44 PM in chat
     ** rate = rate / 1200;
     **  Converts to a monthly rate
     */
    let termPayAmt = 0; /* total loan amount: user input */
    let termPayYrs = 0; /* total years: this will be user input */
    let termIntRate = 0; /* term interest rate: user input */
    let totInterestAmt = 0; /* total dollar amt for full term */
    let termPayMos = 0; /* total number of months: yrs * 12 */
    let totInterestAmt = 0; /* total dollar amt for full term */

    let totMoPrincAmt = 0; /* monthly loan amt */
    let totMoInterest = 0; /* monthly interest amt */


    // initialize variables
    termPayMos = totPayYrs * 12; /* get the total months for the term */

    // set up test values
    termPayAmt = 10000.00; /* total loan amount */
    termPayYrs = 5; /* will be from user input */
    termIntRate = 5; /* term interest rate as a decimal; not a true percent */
    totMoInterest = termIntamt / termPayMos; /* monthly interest payment is total interest divided total months */


    totMoPrincAmt = totPayAmt / (totPayYrs / 12);
    totInterestAmt = calcPercentage(totPayAmt, 5); /* total interest dollar amt for the full term */

    console.log(`totamt:${totPayAmt} totmos:${totPayMos} totPer:${totPerAmt}`);
    alert("in test payment calc")

}

function calcPercentage(num, percent) {

    return (num / 100) * percent;

}
function moneyNumFromStr(str_money)
{


}

/**
 ** end of site.js
 */