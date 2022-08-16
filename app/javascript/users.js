// Document ready.

$(document).on('turbolinks:load', function(){
  var theForm = $('#pro_form');
  var submitBtn = $('#form-submit-btn');

// Set Stripe public key.
  Stripe.setPublishableKey( $('meta[name="stripe-key"]').attr('content') );

// When user clicks form submit btn,
submitBtn.click(function(event){
	// Prevent default submission behaviour.
	event.preventDefault();

	// Collect the credit card fields.
	var ccNum = $('#card_number').val(), 
	    cvcNum = $('#card_code').val(),
	    expMouth = $('#card_month').val(),
	    expYear = $('#card_year').val();

    // Send the card info to Stripe.
    Stripe.createToken({
        number: ccNum,
        cvc: cvcNum,
        exp_month: expMonth,
        exp_year: expYear
    }, stripeResponseHandler);
})



// Stripe will return a card token.
// Inject card token as hidden fields into form.
// Submit form to our Rails app.
})
