  /*
   ** 04-18-21 jdj: Mortgage Loan Calculator:
   **
   ** .using globally scoped variables for ease of use
   **  and proof of concept.
   **
   ** 04-19-21 jdj:.rework code to remove global variables.
   **
   **  Personal Notes: re: javascript objects.
   **
   ** ."complex" objects are an object that contain, whose properties, contain 
   **  other objects.
   **
   ** .definition for the object happens at the time time of declaration.
   **  let payments_info = {
   **    payment_table_rows: [],
   **    summary_data: {}
   **  };
   **
   ** .at this point payments_info{} above is typed as one array property and one property typed as an object.
   **  Don't know what's inside yet and this can be done in the beginning of the function.
   **
   ** .then declare another object that will be used to represent the data we need for the table
   **
   **
   ** let inlinevarhere? = 0;    js script types this as a number because of the zero assignment.  Can do "" string, etc.
   **
   **  let payments_info = {
   **     MonNumber:   inlinevarhere1,  (this initializes it with the variable and also types it from the variable.
   **     TotPaid:     inlinevarhere2,   
   **     Principal:   inlinevarhere3,
   **     Interest:    inlinevarhere4,
   **     TotInterest: inlinevarhere5,
   **     remBalance:  inlinevarhere6
   **  };
   **
   **
   **
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



      let formData = createFormData();
      if (formData.dataOK == false) {
          return;
      }
      createPaymentDataObj(formData);


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
      g_totMonPayment = (g_termPayAmt) * (g_termIntRate / 1200) / (1 - Math.pow((1 + g_termIntRate / 1200), -g_termPayMon));

      displayPaymentPlan();

      return null;
  } /* end of generatePaymentPlan() */


  /**
   ** .aquire the html template
   ** .loop through the payment term and update tables rows
   **
   */
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

          tbl_intPaid = tbl_remBalance * (g_termIntRate / 1200); /* needs to be before remaining balance is adjusted */

          tbl_totIntPaid += tbl_intPaid;
          tbl_princPaid = g_totMonPayment - tbl_intPaid;
          tbl_remBalance -= tbl_princPaid;
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
      /*
       ** 04-19-21 jdj: remove global references.
       **  .tbl_totIntPaid is the total interest for the term
       ** g_termIntTotal = tbl_totIntPaid;
       */
      displayTermTotals(g_totMonPayment, g_termPayAmt, tbl_totIntPaid, (g_termPayAmt + tbl_totIntPaid));

      return null;
  } /* end of displayPaymentPlan() */

  /*
   ** .Display term totals in the Payment area
   **
   */
  function displayTermTotals(amtTotMonthly, amtTotPrincipal, amtTotInterest, amtTotCost) {


      /* 04-19-21: get away from global variables.  Change to pass these few as parms.
      document.getElementById("resultMonPayment").innerHTML = numtoMoneyStrWDS(g_totMonPayment);
      document.getElementById("resultTotalPrincipal").innerHTML = numtoMoneyStrWDS(g_termPayAmt);
      document.getElementById("resultTotalInterest").innerHTML = numtoMoneyStrWDS(g_termIntTotal);
      document.getElementById("resultTotalCost").innerHTML = numtoMoneyStrWDS(g_termPayAmt + g_termIntTotal);
*/

      document.getElementById("resultMonPayment").innerHTML = numtoMoneyStrWDS(amtTotMonthly);
      document.getElementById("resultTotalPrincipal").innerHTML = numtoMoneyStrWDS(amtTotPrincipal);
      document.getElementById("resultTotalInterest").innerHTML = numtoMoneyStrWDS(amtTotInterest);
      document.getElementById("resultTotalCost").innerHTML = numtoMoneyStrWDS(amtTotCost);


      return null;
  } /* end of displayTermTotals() */


  /*
   ** .isolate the form variables into an object and return to the caller.
   */
  function createFormData() {

      let formData = {
          totLoanAmtStr: document.getElementById("loanAmount").value,
          /* keep original field strings */
          totLoanMonthStr: document.getElementById("loanTerm").value,
          interestRateStr: document.getElementById("loanInterest").value,

          totLoanAmtNum: parseInt(document.getElementById("loanAmount").value, 10),
          /* convert to a num should they be ok */
          totLoanMonthNum: parseInt(document.getElementById("loanTerm").value, 10),
          interestRateNum: parseInt(document.getElementById("loanInterest").value, 10),
          dataOK: false
      }

      validateFormData(formData);
      return formData;

  } /* end of createFormData() */


  function validateFormData(formData) {
      let errMsg = "";
      let errFldName = "";

      // note: revisit: changed input types to number so isNaN() may not work
      if (isNaN(formData.totLoanAmtNum) == true) {
          errFldName = "Loan Amount, ";
      }
      if (isNaN(formData.totLoanMonthNum) == true) {
          errFldName = errFldName + "Term Months, ";
      }
      if (isNaN(formData.interestRateNum) == true) {
          errFldName = errFldName + "Interest Rate";
      }

      if (errFldName != "") {
          errMsg = `${errFldName} must be a non-zero number please.`
          alert(errMsg);
      } else {
          formData.dataOK = true;
      }
      return null;

  } /* end of editFormData() */


  /*
   ** .Create the payment data object with payment array and summary.
   */
  function createPaymentDataObj(formData) {

      let payments_info = {
          payment_table_rows: [],
          summary_data: {}
      };

      payments_info.payment_table_rows = createPaymentDataArray();

      return payments_info;
  }


  /*
   ** .Calculate all rows for the payment information and summary data
   **  using the new object.
   **
   **
   **
   */
  function createPaymentDataArray(formData) {
      let tbl_paymentArr = [];

      let tbl_totPayment = 0;
      let tbl_totIntPaid = 0;
      let tbl_remBalance = 0;
      let tbl_intPaid = 0;
      let tbl_princPaid = 0;
      let tbl_accPay = 0;


      /*
       ** totmonthlypayment = (amount loan) * (rate / 1200) / (1-(1 + rate /1200)) huh?
       */
      tbl_totPayment = (formData.totLoanAmtNum) * (formData.interestRateNum / 1200) / (1 - Math.pow((1 + formData.interestRateNum / 1200), -formData.totLoanMonthNum));
      tbl_remBalance = formData.totLoanAmtNum;
      tbl_intPaid = tbl_remBalance * (formData.interestRateNum / 1200);


      for (let x = 0; x < formData.totLoanMonthNum; x++) {
          tbl_intPaid = tbl_remBalance * (formData.interestRateNum / 1200); /* needs to be before remaining balance is adjusted */

          tbl_totIntPaid += tbl_intPaid;
          tbl_princPaid = g_totMonPayment - tbl_intPaid;
          tbl_remBalance -= tbl_princPaid;
          tbl_intPaid = tbl_remBalance * (formData.interestRateNum / 1200);
          tbl_accPay += g_totMonPayment;

          let payments_info = {
              MonNumber: x + 1,
              TotPaid: tbl_totPayment,
              Principal: tbl_princPaid,
              Interest: tbl_intPaid,
              TotInterest: tbl_totIntPaid,
              remBalance: tbl_remBalance
          };

          paymentArr.push(payments_info);

          tbl_remBalance -= (tbl_totPayment + tbl_totIntPaid);
      }

      let payment_summary = {
          payment: tbl_totPayment,
          totalPrincipal: formData.totLoanAmtNum,
          totalInterest: tbl_totIntPaid,
          totalCost: (amount + totalInterest)
      }

      payments.push(payment_summary);


      return paymentArr;
  } /* end of createPaymentDataArray() */


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
       ** .strip "US$" from the result string.  "en-US" formats it with the dollar sign
       ** ."en-US" formats it with the dollar sign.  I mistakenly left "en-GB" which gives USD$
       ** .add to the code below the dollar sign alone.  
       */
      tmpStr = money_num.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2
      });

      /*
       ** .negative values will report "-US$0.00".  toLocalString changes negatives to 0.00
       ** .until additional work is applied also remove the negative sign.
       */
      returnMoneyStr = tmpStr.replace("US$", "");
      returnMoneyStr = tmpStr.replace("$", "");
      returnMoneyStr = returnMoneyStr.replace("-", "");
      return returnMoneyStr;
  }
  /**
   ** end of site.js
   */