document.addEventListener("DOMContentLoaded", function () {

  var payBtn = document.getElementById("payBtn");

  if (!payBtn) {
    console.error("Button not found");
    return;
  }

  payBtn.onclick = function () {

    var options = {
      key: "rzp_test_Sjds6IBGn2GEK5", 
      amount: 1200 * 100,
      currency: "INR",
      name: "Demo Store",
      description: "Test Payment",

      handler: function (response) {
        alert("Payment Successful: " + response.razorpay_payment_id);
      }
    };

    var rzp = new Razorpay(options);
    rzp.open();
  };

});