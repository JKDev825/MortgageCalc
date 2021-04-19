 /*
  ** 04-18-21 jdj: Mortgage Loan Calculator:
  **
  ** .for initial app build keep global scope variables.
  **
  */
 let g_termPayAmt = 0; /* total loan amount: user input */
 let g_termPayMon = 0; /* total months: this will be user input */
 let g_termIntRate = 0; /* term interest rate: user input */
 let g_monPayAmt = 0; /* total montly payment */
 let g_remBalance = 0; /* running balance.  1st month reflects 1st payment paid */
 let g_termIntTotal = 0; /* total interest for the loan */
 let g_monIntAmt = 0; /* monthly interest amount */

 let g_totMonPayment = 0; /* total monthly payment calc from requirements doc */

 function generatePaymentPlan() {

     let termPayAmt = 0; /* total loan amount: user input */
     let termPayMon = 0; /* total years: this will be user input */
     let termIntRate = 0; /* term interest rate: user input */


     termPayAmt = parseInt(document.getElementById("loanAmount").value, 10);
     termPayMon = parseInt(document.getElementById("loanTerm").value, 10);
     termIntRate = parseInt(document.getElementById("loanInterest").value, 10);

     g_termPayAmt = termPayAmt;
     g_remBalance = g_termPayAmt;
     g_termPayMon = termPayMon;
     g_termIntRate = termIntRate;

     g_monPayAmt = g_termPayAmt / g_termPayMon;
     g_termIntTotal = calcPercentage(g_termPayAmt, g_termIntRate);
     g_monIntAmt = g_termIntTotal / g_termPayMon;

     /*
      ** totmonthlypayment = (amount loan) * (rate / 1200) / (1-(1 + rate /1200)) huh?
      */
     // g_totMonPayment = g_termPayAmt * (g_termIntRate / 1200);
     // g_totMonPayment /= (1 - (1 + g_termIntRate / 1200));

     g_totMonPayment = (g_termPayAmt) * (g_termIntRate / 1200) / (1 - Math.pow((1 + g_termIntRate / 1200), -g_termPayMon));

     displayPaymentPlan();

     return null;
 } /* end of generatePaymentPlan() */

 function displayPaymentPlan() {
     const template = document.getElementById("Payment-Data-Template");
     const resultsBody = document.getElementById("resultsBody");
     let tbl_totIntPaid = 0;
     let tbl_remBalance = 0;
     let tbl_intPaid = 0;
     let tbl_princPaid = 0;
     let tbl_accPay = 0;

     resultsBody.innerHTML = "";

     g_remBalance -= (g_monPayAmt - g_monIntAmt); /* first month rem balance shows is 1st payments made */

     tbl_remBalance = g_termPayAmt;
     tbl_intPaid = tbl_remBalance * (g_termIntRate / 1200);




     for (let x = 0; x < g_termPayMon; x++) {
         const dataRow = document.importNode(template.content, true);

         tbl_totIntPaid += tbl_intPaid;
         tbl_princPaid = g_totMonPayment - tbl_intPaid;
         tbl_remBalance -= tbl_princPaid;
         tbl_intPaid = tbl_remBalance * (g_termIntRate / 1200);
         tbl_accPay += g_totMonPayment;

         dataRow.getElementById("month").textContent = x + 1;

         /* first attempt
         dataRow.getElementById("payment").textContent = numtoMoneyStr(g_monPayAmt + g_monIntAmt);
         dataRow.getElementById("principal").textContent = numtoMoneyStr(g_monPayAmt);
         dataRow.getElementById("interest").textContent = numtoMoneyStr(g_monIntAmt);
         dataRow.getElementById("totinterest").textContent = "";
         dataRow.getElementById("balance").textContent = numtoMoneyStr(g_remBalance);
         */

         dataRow.getElementById("payment").textContent = numtoMoneyStr(g_totMonPayment);
         dataRow.getElementById("principal").textContent = numtoMoneyStr(tbl_princPaid);
         dataRow.getElementById("interest").textContent = numtoMoneyStr(tbl_intPaid);
         dataRow.getElementById("totinterest").textContent = numtoMoneyStr(tbl_totIntPaid);
         dataRow.getElementById("balance").textContent = numtoMoneyStr(tbl_remBalance);

         g_remBalance -= (g_monPayAmt + g_monIntAmt);


         resultsBody.appendChild(dataRow);
     }

     /*
      ** .Running totals are calculated on iterations.  This impacts monthly values are rates are recalculated.
      ** .Update the global variables for total cost displays.
      ** .displayTermTotals() references the global totals.
      */

     g_termIntTotal = tbl_totIntPaid;

     displayTermTotals();
     return null;
 } /* end of displayPaymentPlan() */

 /*
  ** .Display term totals in the Payment area
  **
  */
 function displayTermTotals() {

     document.getElementById("resultMonPayment").innerHTML = numtoMoneyStrWDS(g_totMonPayment);
     document.getElementById("resultTotalPrincipal").innerHTML = numtoMoneyStrWDS(g_termPayAmt);
     document.getElementById("resultTotalInterest").innerHTML = numtoMoneyStrWDS(g_termIntTotal);
     document.getElementById("resultTotalCost").innerHTML = numtoMoneyStrWDS(g_termPayAmt + g_termIntTotal);


     return null;
 } /* end of displayTermTotals() */



 function calcPercentage(num, percent) {

     return (num / 100) * percent;

 }

 function numtoMoneyStrWDS(money_num) {
     let returnStr = `$ ${numtoMoneyStr(money_num)}`;
     return returnStr;
 }

 function numtoMoneyStr(money_num) {
     let tmpStr = "";
     let returnMoneyStr = "";
     /*
      ** .This will take 41.666666 and show "US$41.67".  Note this rounds up.
      ** .strip "US$" from the result string.
      */
     tmpStr = money_num.toLocaleString("en-GB", {
         style: "currency",
         currency: "USD",
         minimumFractionDigits: 2
     });

     /*
      ** .negative values will report "-US$0.00".  toLocalString changes negatives to 0.00
      ** .until additional work is applied also remove the negative sign.
      */
     returnMoneyStr = tmpStr.replace("US$", "");
     returnMoneyStr = returnMoneyStr.replace("-", "");
     return returnMoneyStr;
 }
 /**
  ** end of site.js
  */