//jshint esversion:6

module.exports.getDate= function()

   {
       var today= new Date();

   var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  
    return today.toLocaleDateString("en-US", options)

   }