var orderId ;
$(document).ready(function(){
    var settings = {
  "url": "/createOrderId",
  "method": "POST",
  "timeout": 0,
  "headers": {
    "Content-Type": "application/json"
  },
  "data": JSON.stringify({
    "amount": "50000"
  }),
};
//creates new orderId everytime
$.ajax(settings).done(function (response) {
    orderId=response.orderId;
    console.log(orderId);
    $("button").show();
  });
  });
  document.getElementById('rzp-button1').onclick = function(e){
    var options = {
    "key": "rzp_test_hZUEKNvCfMICwO", // Enter the Key ID generated from the Dashboard
    "amount": "50000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    "currency": "INR",
    "name": "Abhay Travels",
    "description": "Test Transaction",
    "image": "https://images.unsplash.com/photo-1654290062270-29c47454839d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=464&q=80",
    "order_id": orderId.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    "handler": function (response){
        console.log(response)
        
        var settings = {
  "url": "/api/payment/verify",
  "method": "POST",
  "timeout": 0,
  "headers": {
    "Content-Type": "application/json"
  },
  "data": JSON.stringify({response}),
}
$.ajax(settings).done(function (response) {
 alert(response.signatureIsValid);
});

    },
    "theme": {
        "color": "#3399cc"
    }
 };
 var rzp1 = new Razorpay(options);
 rzp1.on('payment.failed', function (response){
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
    });
    rzp1.open();
    e.preventDefault();
 };