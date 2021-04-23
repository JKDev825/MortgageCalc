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
   */

  function generatePaymentPlan() {

      let formData = createFormData();
      if (formData.dataOK == false) {
          return;
      }


      /*
       ** 04-19-21 jdj:.this is a complete rework of the logic using js objects
       **               to replace current logic dependencies on global variables.
       **              .need to double check object contents and write display
       **               then can replace calls to the original logic.
       */
      // temporarily comment out to deploy a bug fix on the original logic with form validation added.
      let paymentsObj = createPaymentObjData(formData);
      displayPaymentObjData(paymentsObj);
      return null;
      /* replace the original logic with the object array */

  } /* end of generatePaymentPlan() */



  /*
   ** .Display term totals in the Payment area
   **
   */
  function displayTermTotals(paymentObjData, amtTotMonthly, amtTotPrincipal, amtTotInterest, amtTotCost) {



      //    document.getElementById("resultMonPayment").innerHTML = numtoMoneyStrWDS(amtTotMonthly);
      //    document.getElementById("resultTotalPrincipal").innerHTML = numtoMoneyStrWDS(amtTotPrincipal);
      //    document.getElementById("resultTotalInterest").innerHTML = numtoMoneyStrWDS(amtTotInterest);
      //    document.getElementById("resultTotalCost").innerHTML = numtoMoneyStrWDS(amtTotCost);

      document.getElementById("resultMonPayment").innerHTML = numtoMoneyStrWDS(paymentObjData.summary_data.payment);
      document.getElementById("resultTotalPrincipal").innerHTML = numtoMoneyStrWDS(paymentObjData.summary_data.totalPrincipal);
      document.getElementById("resultTotalInterest").innerHTML = numtoMoneyStrWDS(paymentObjData.summary_data.totalInterest);
      document.getElementById("resultTotalCost").innerHTML = numtoMoneyStrWDS(paymentObjData.summary_data.totalCost);


      return null;
  } /* end of displayTermTotals() */


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
          showErrorMsg(errMsg);
      } else {
          formData.dataOK = true;
      }
      return null;

  } /* end of editFormData() */


  /*
   ** .Create the payment data object with payment array and summary.
   */
  function createPaymentObjData(formData) {

      //      payments_info.payment_table_rows = createPaymentDataArray(formData);
      let paymentsObj = createPaymentDataArray(formData);

      return paymentsObj;
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
      let payments_info = {
          payment_table_rows: [],
          summary_data: {}
      };

      let tbl_totPayment = 0;
      let tbl_totIntPaid = 0;
      let tbl_remBalance = 0;
      let tbl_intPaid = 0;
      let tbl_princPaid = 0;
      let tbl_accPay = 0;
      let tbl_totIntTerm = 0;
      let tbl_monIntAmt = 0;
      let tbl_monPayAmt = 0;
      let termRemBalance = 0;


      /*
       ** totmonthlypayment = (amount loan) * (rate / 1200) / (1-(1 + rate /1200)) huh?
       */

      tbl_totIntTerm = calcPercentage(formData.totLoanAmtNum, formData.interestRateNum);
      tbl_monIntAmt = tbl_totIntTerm / formData.totLoanMonthNum;
      tbl_monPayAmt = formData.totLoanAmtNum / formData.totLoanMonthNum;

      termRemBalance = formData.totLoanAmtNum;
      termRemBalance -= (tbl_monPayAmt - tbl_monIntAmt);

      tbl_totPayment = (formData.totLoanAmtNum) * (formData.interestRateNum / 1200) / (1 - Math.pow((1 + formData.interestRateNum / 1200), -formData.totLoanMonthNum));
      tbl_remBalance = formData.totLoanAmtNum;
      tbl_intPaid = tbl_remBalance * (formData.interestRateNum / 1200);



      for (let x = 0; x < formData.totLoanMonthNum; x++) {
          tbl_intPaid = tbl_remBalance * (formData.interestRateNum / 1200); /* needs to be before remaining balance is adjusted */

          tbl_totIntPaid += tbl_intPaid;
          tbl_princPaid = tbl_totPayment - tbl_intPaid;
          tbl_remBalance -= tbl_princPaid;

          //     tbl_intPaid = tbl_remBalance * (formData.interestRateNum / 1200);
          tbl_accPay += tbl_totPayment;

          let payments_info = {
              MonNumber: x + 1,
              TotPaid: tbl_totPayment,
              Principal: tbl_princPaid,
              Interest: tbl_intPaid,
              TotInterest: tbl_totIntPaid,
              remBalance: tbl_remBalance
          };

          /*   tbl_paymentArr.push(payments_info); */
          tbl_paymentArr.push(payments_info);
          //    payments_info.payment_table_rows.push(payments_info);

          //  tbl_remBalance -= (tbl_totPayment + tbl_totIntPaid);
          termRemBalance -= (tbl_monPayAmt + tbl_monIntAmt);
      }

      let payment_summary = {
          payment: tbl_totPayment,
          totalPrincipal: formData.totLoanAmtNum,
          totalInterest: tbl_totIntPaid,
          totalCost: (formData.totLoanAmtNum + tbl_totIntPaid)
      }

      // tbl_paymentArr.push(payment_summary);
      payments_info.summary_data = payment_summary;
      payments_info.payment_table_rows = tbl_paymentArr;


      return payments_info;
      //   return tbl_paymentArr;
  } /* end of createPaymentDataArray() */

  function displayPaymentObjData(paymentObjData) {
      const template = document.getElementById("Payment-Data-Template");
      const resultsBody = document.getElementById("resultsBody");

      resultsBody.innerHTML = "";

      for (let x = 0; x < paymentObjData.payment_table_rows.length; x++) {
          const dataRow = document.importNode(template.content, true);


          dataRow.getElementById("month").textContent = x + 1;


          dataRow.getElementById("payment").textContent = numtoMoneyStr(paymentObjData.payment_table_rows[x].TotPaid);
          dataRow.getElementById("principal").textContent = numtoMoneyStr(paymentObjData.payment_table_rows[x].Principal);
          dataRow.getElementById("interest").textContent = numtoMoneyStr(paymentObjData.payment_table_rows[x].Interest);
          dataRow.getElementById("totinterest").textContent = numtoMoneyStr(paymentObjData.payment_table_rows[x].TotInterest);
          dataRow.getElementById("balance").textContent = numtoMoneyStr(paymentObjData.payment_table_rows[x].remBalance);



          resultsBody.appendChild(dataRow);
      }

      /*
       ** .Running totals are calculated on iterations.  This impacts monthly values are rates are recalculated.
       ** .Update the global variables for total cost displays.
       ** .displayTermTotals() references the global totals.
       */
      displayTermTotals(paymentObjData, paymentObjData.summary_data.payment,
          paymentObjData.summary_data.totalPrincipal,
          paymentObjData.summary_data.totalInterest,
          paymentObjData.summary_data.totalCost);

      return null;


  } /* end of displayPaymentObjData() */



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
  } /* numtoMoneyStr() */

  function showErrorMsg(errMsgStr) {
      //   alert(errMsgStr);
      //   alert("windows alert is temporary until I can debug sweetalert");


      Swal.fire({
          icon: 'error',
          title: 'Oops...',
          /*    html: `<ol>${errorMessage}</ol>`, */
          html: `${errMsgStr}`,
      })

  } /* end of showErrorMsg() */


  /*
   ** end of site.js
   */