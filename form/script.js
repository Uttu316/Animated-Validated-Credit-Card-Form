$(function() {
  handleChange();
  handleSubmit();
  handleAnimations();
});

function handleChange() {
  $("input").on("keypress", function(event) {
    let currentInput = this;
    if (currentInput.type === "number") {
      showError("#" + currentInput.id, "");
      var charCode = event.which ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
      if (
        (currentInput.id === "expiry-month" &&
          currentInput.value.length === 2) ||
        (currentInput.id === "expiry-year" &&
          currentInput.value.length === 4) ||
        (currentInput.id === "cvv" && currentInput.value.length === 3)
      ) {
        return false;
      }
      return true;
    }
  });
  $("input").on("input", function() {
    let currentInput = this;
    showError("#" + currentInput.id, "");
    if (this.id === "email" && currentInput.value.indexOf("@") !== -1) {
      $("datalist").remove();
      let domains = handleDomainCompletion(currentInput.value);
      if (domains !== [] && domains) {
        let value = currentInput.value.split("@")[0];
        showSuggestions("#email", value, domains, false);
      } else {
        $("datalist").remove();
      }
    } else {
      $("datalist").remove();
    }
  });
}
function handleSubmit() {
  $("input").keyup(function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      event.preventDefault();
      $("#submit-btn").click();
    }
  });
  $("#submit-btn").on("click", function(event) {
    event.preventDefault();
    let isEmailValidated = validateEmail();
    let isPasswordValidated = validatePassword();
    let isCardNameValidated = validateCardName();
    let isCardNumberValidated = validateCardNumber();
    let isExipryMonthValidated = validateExpiryMonth();
    let isExipryYearhValidated = validateExpiryYear();
    let isCvvValidated = validateCvv();

    if (
      isEmailValidated &&
      isPasswordValidated &&
      isCardNameValidated &&
      isCardNumberValidated &&
      isExipryMonthValidated &&
      isExipryYearhValidated &&
      isCvvValidated
    ) {
      console.log("Assume, Payment Successfull");
    }
  });
}

function validateEmail() {
  let emailInput = $("#email");
  let email = emailInput.val().trim();
  let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!email) {
    showError("#email", "Email can not be empty!");
    return false;
  } else if (emailRegex.test(email)) {
    return true;
  } else {
    showError("#email", "Email is not valid!");
    return false;
  }
}

function validatePassword() {
  let passwordInput = $("#password");
  let password = passwordInput.val();
  if (!password) {
    showError("#password", "Password can not be empty!");
    return false;
  } else if (password.length < 8) {
    showError("#password", "Password is not valid!");
    return false;
  } else {
    return true;
  }
}

function validateCardName() {
  let nameInput = $("#name");
  let name = nameInput.val().trim();
  var nameRegex = /^[a-z ,.'-]+$/i;
  if (!name) {
    showError("#name", "Card Holder name can not be empty!");
    return false;
  } else if (nameRegex.test(name)) {
    return true;
  } else {
    showError("#name", "Card Holder name is not valid!");
    return false;
  }
}

function validateCardNumber() {
  return true;
}

function validateExpiryMonth() {
  let expiryMonthInput = $("#expiry-month");
  let expiryMonth = expiryMonthInput.val();
  var expiryMonthRegex = /^01|02|03|04|05|06|07|08|09|10|11|12$/;
  if (!expiryMonth) {
    showError("#expiry-month", "Expiry month can not be empty!");
    return false;
  } else if (expiryMonthRegex.test(expiryMonth)) {
    return true;
  } else {
    showError("#expiry-month", "Expiry month is not valid!");
    return false;
  }
}
function validateExpiryYear() {
  let expiryYearInput = $("#expiry-year");
  let expiryYear = parseInt(expiryYearInput.val());
  if (!expiryYear) {
    showError("#expiry-year", "Expiry year can not be empty!");
    return false;
  } else if (expiryYear >= 2000 && expiryYear <= 2999) {
    return true;
  } else {
    showError("#expiry-year", "Expiry year is not valid!");
    return false;
  }
}

function validateCvv() {
  let cvvInput = $("#cvv");
  let cvv = cvvInput.val();
  let cvvRegex = /^[0-9]{3,3}$/;
  if (!cvv) {
    showError("#cvv", "CVV can not be empty!");
    return false;
  } else if (cvvRegex.test(cvv)) {
    return true;
  } else {
    showError("#cvv", "Cvv is not valid!");
    return false;
  }
}
function showError(id, errorMessage) {
  let targetError = $(id).siblings(".error");
  errorMessage ? targetError.show().addClass("shake") : targetError.hide();

  targetError.html(errorMessage).css("color", "red");
}

function handleDomainCompletion(currEmail) {
  let domains = [
    "eclerx.com",
    "yahoo.com",
    "hotmail.com",
    "gmail.com",
    "me.com",
    "aol.com",
    "mac.com",
    "live.com",
    "comcast.net",
    "googlemail.com",
    "msn.com",
    "hotmail.co.uk",
    "yahoo.co.uk",
    "facebook.com",
    "verizon.net",
    "sbcglobal.net",
    "att.net",
    "gmx.com",
    "outlook.com",
    "icloud.com"
  ];

  let emailName = currEmail.split("@");
  let predictDomain = "";
  if (emailName.length > 1) {
    predictDomain = emailName.pop();
    if (!predictDomain.length) {
      return "";
    }
  } else {
    return "";
  }
  let match =
    domains.filter(function(domain) {
      return domain.indexOf(predictDomain) === 0;
    }) || "";

  return match;
}
function showSuggestions(elementID, value, domains) {
  $(elementID).attr("list", "suggestions");
  var datalist = $("<datalist />", {
    id: "suggestions"
  }).insertAfter("#email");
  let i,
    newOptionsString = "";
  for (i = 0; i < domains.length; i++) {
    newOptionsString += "<option value='" + value + "@" + domains[i] + "'>";
  }
  datalist.html(newOptionsString);
}
function handleAnimations() {
  $("form").toggleClass("slide");
  $(".error").on(
    "webkitAnimationEnd mozAnimationEnd msAnimationEnd oAnimationEnd animationEnd",
    function(e) {
      $(".error")
        .delay(200)
        .removeClass("shake");
    }
  );
}
/*
Email validation source:  https://www.w3resource.com/javascript/form/email-validation.php

Other Regex validation source: https://phppot.com/jquery/jquery-credit-card-validator/
*/
