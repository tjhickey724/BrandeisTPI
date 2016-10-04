
Template.responses.events({
  "change #showresults":
      function(){
        console.log($("#showresults").prop('checked'));
        var summary = Session.get("summary");
        Session.set("summary", !summary)},

})
