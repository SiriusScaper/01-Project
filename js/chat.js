$("document").ready(function() {
  $("button").on("click", function() {
    $("#card-body-1")
      .animate({
        bottom: (500)[100],
      })
      .delay(100)
      .hide();
  });
});
