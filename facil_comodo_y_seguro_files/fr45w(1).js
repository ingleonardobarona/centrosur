// source --> https://centrosur.co/wp-content/plugins/centrosur-calculator/calculator-front.js?ver=6.9.4 
var $ = jQuery

$(document).ready(function() {
  $('.calculatorContainer').removeAttr('style');

  $('.calcbtn').click(function () {
    console.log('calculadora');
    $('.calculatorContainer').addClass('showCalculator');
  });

  $('.formInput > input').change(function () {

  });
});