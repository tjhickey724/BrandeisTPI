Template.summary.helpers({
  keys: function(){
    const survey=Surveys.findOne();
    console.dir(survey);
    const k = Object.keys(survey);
    console.dir(k);
    return k;
  },
  surveys: function()
  {return Surveys.find()},
})
