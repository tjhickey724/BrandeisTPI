Session.set("summary",false);

Template.surveyform2.helpers({
  noResponses: function(){return Surveys.find({userId:Meteor.userId()}).fetch().length==0;},
  yourResponses: function(){
    var surveys = Surveys.find({userId:Meteor.userId()}).fetch();
    return _.map(surveys,
      function(x){
        console.dir(x);
         return {name:x["0_coursename"],semester:x["0_semester"], }})
  },
  questions:function(k){return _.filter(theQuestions,function(x){return x.section==k.section})},
  keys:function(){return keys},
  showSummaryzz: function(){ return Session.get("summary");},
  noSummaryzz: function(){ var summary = Session.get("summary"); return !summary},

  itemTemplate: function(){
    //console.log(this.q.type);console.dir(this.q);
    switch (this.q.type) {
      case "checkbox": return Template.checkboxItem; break;
      case "text": return Template.textItem; break;
      case "select": return Template.selectItem; break;
      case "other": return Template.otherItem; break;
      case "textarea": return Template.textareaItem; break;
    }
    //console.log("dropped through!");
    return Template.checkboxItem;
  }

})


Template.surveyform2.events({
  "submit": function(event){
    event.preventDefault();
    var results={};
    console.log("start");
    const cbvals=
    $("input:checkbox")
      .map(function(){results[this.id]=this.checked; return {id:this.id,checked:this.checked,val:$(this).val()};})
      .get();
    console.dir(cbvals);
    const tvals=
    $("input:text")
      .map(function(){results[this.id]=$(this).val(); return {id:this.id,val:$(this).val()};})
      .get();
    console.dir(tvals);
    const svals=
    $("select")
      .map(function(){results[this.id]=this.options[0].value; return {id:this.id,val:$(this).val()};})
      .get();
    console.dir(tvals);
    const paras =
    $("textarea")
      .map(function(){results[this.id]=$(this).val(); return {id:this.id,val:$(this).val()};})
      .get();
    console.dir(paras);
    console.log("done");
    results.userId=Meteor.userId();
    console.dir(results);
    Surveys.insert(results);
    Router.go("responses")
  }
})

Template.showanswers.helpers({
  answers:function(q){
    console.log("in showanswers");
    console.dir(q);
    var s = Surveys.find().fetch();
    console.dir(s);
    var as = _.map(s,function(x){return x[q.id];});
    console.dir(as);
    var sum = summarize(as);
    console.dir(sum);
    console.log("Here is the data for "+q.id+" "+q.label);
    return summarize(as);
  },
})

function summarize(as){
  var vals={};
  for (x of as) {
    if (vals[x]==undefined){
      vals[x]=1;
    }else {
      vals[x] += 1;
    }
  }
  var valarray=[];
  for (x in vals){
    valarray.push({val:x,count:vals[x]})
  }

  return valarray;
}


var theQuestions = [
  {id:"0_school", section:"0", label:"Your School", type:"select",
     options:["Science", "Social Science","Humanities","Creative Arts","Heller","IBS","Rabb/MKTYP/GPS",]},
  {id:"0_rank", section:"0", label:"Your Teaching Rank", type:"select",
        options:["part-time contract","full-time contract","tenure-track","tenured","emeritus"]},
  {id:"0_years", section:"0", label:"Years of Prior Teaching Experience", type:"select",
           options:["<1","1","2-5","6-10",">10"]},

  {id:"0_coursename", section:"0", label:"Course Name", type:"text"},
  {id:"0_semester",section:"0",label:"Semester",type:"select",options:["Fall15","Spr16","Sum16","Fall16"]},
  {id:"0_coursesize", section:"0", label:"Number of Students in Course", type:"text"},
  {id:"0_classmeetings", section:"0", label:"Number of class meetings per week", type:"select",
      options:[0,1,2,3,4,5],},
  {id:"0_classlength", section:"0", label:"Duration of each class in hours", type:"select",
     options:["1","1.5","2.0","2.5","3.0","4.0","> 4.0"]},
  {id:"0_coursetype", section:"0", label:"Additional Comments", type:"textarea"},

  {id:"I_topics", section:"I", label:"", type:"checkbox",
     label:"List of topics to be covered"},
  {id:"I_specificcompetencies", section:"I", label:"", type:"checkbox",
        label:"List of topic-specific competencies (skills, expertise, …) students should achieve"
  },
  {id:"I_generalcompetencies", section:"I", label:"", type:"checkbox",
        label:"List of competencies that are not topic related (critical thinking, problem solving, …)"
  },
  {id:"I_affectivegoals", section:"I", label:"", type:"checkbox",
        label:"Affective goals – changing students’ attitudes and beliefs (interest, motivation, ...)"
  },
  {id:"I_other", section:"I", label:"", type:"other",
        label:"Other (please specify)"
  },






{id:"II_studentwiki", section:"II", type:"checkbox",
 label:"Student wikis or discussion boards with little or no contribution from you."
},


{id:"II_teacherwiki", section:"II", type:"checkbox",
 label:"Student wikis or discussion boards with significant contribution from you or TA."
},


{id:"II_hwanswers", section:"II", type:"checkbox",
 label:"Solutions to homework assignments"
},


{id:"II_sampleanswers", section:"II", type:"checkbox",
 label:"Worked examples"
},


{id:"II_practiceexams", section:"II", type:"checkbox",
 label:"Practice exams or previous year’s exams"
},


{id:"II_animations", section:"II", type:"checkbox",
 label:"Animations, video clips, or simulations related to course material"
},


{id:"II_coursenotes", section:"II", type:"checkbox",
 label:"Lecture notes or course PowerPoint presentations (partial/skeletal or complete)"
},


{id:"II_othernotes", section:"II", type:"checkbox",
 label:"Other instructor-selected notes or supporting materials, pencasts, etc."
},


{id:"II_articles", section:"II", type:"checkbox",
 label:"Articles from Professional or Research literature"
},
{id:"II_other", section:"II", label:"", type:"textarea",
      label:"Any other supporting materials? (please specify)"
},

{id:"IIIA_pause", section:"III.A", type:"select",
   label:"Pause and ask if there are any questions",
   options:["0","1-2","3-10",">10"]
},
{id:"IIIA_smallgroups", section:"III.A", type:"select",
   label:"Have students discuss or problem solve in small groups",
   options:["0","1-2","3-5",">5"]
},

{id:"IIIA_tps", section:"III.A", type:"select",
   label:"Have students answer a question then discuss it with their neighbors ",
   options:["0","1-2","3-5",">5"]

},

{id:"IIIA_lecture", section:"III.A", type:"select",
   label:"Present information to the class (with lecturing, powerpoint, etc.)?",
   options:["rarely","0-20%","20-40%","40-60%","60-80%","80-100%","all class"]
 },
 {id:"IIIA_classdiscussion", section:"III.A", type:"select",
    label:"Have students discussing a topic with the entire class?",
    options:["rarely","0-20%","20-40%","40-60%","60-80%","80-100%","all class"]
  },

  {id:"IIIB_prework", section:"III.B", type:"checkbox",
   label:"Students asked to read/view material for upcoming class session"
  },
  {id:"IIIB_gradedprework", section:"III.B", type:"checkbox",
   label:"Students asked to read/view material for upcoming class session and complete assignments or quizzes on it shortly before class or at beginning of class"
  },
  {id:"IIIB_oneminutepaper", section:"III.B", type:"checkbox",
   label:"Reflective activity at end of class, e.g. “one minute paper” or similar (students briefly answering questions, reflecting on lecture and/or their learning, etc.)"
  },
  {id:"IIIB_studentpresentations", section:"III.B", type:"checkbox",
   label:"Student presentations (verbal or poster)"
  },


  {id:"IIIC_clickers", section:"III.C", type:"checkbox",
   label:"electronic clickers with student idenfier"
  },
  {id:"IIIC_anonclickers", section:"III.C", type:"checkbox",
   label:"electronic clickers with no student idenfiers"
  },
  {id:"IIIC_coloredcards", section:"III.C", type:"checkbox",
   label:"colored cards"
  },
  {id:"IIIC_raisinghands", section:"III.C", type:"checkbox",
   label:"raising hands"
  },
  {id:"IIIC_writtennotes", section:"III.C", type:"checkbox",
   label:"written student responses that are collected and reviewed in real time"
  },
  {id:"IIIC_other", section:"III.C", label:"", type:"textarea",
        label:"Any other personal response systems used? (please specify)"
  },


  {id:"IV_ungradedHW", section:"IV", type:"checkbox",
   label:"Problem sets/homework assigned or suggested but did not contribute to course grade"
  },
  {id:"IV_gradedHW", section:"IV", type:"checkbox",
   label:"Problem sets/homework assigned and contributed to course grade at intervals of 2 weeks or less"
  },
  {id:"IV_project", section:"IV", type:"checkbox",
   label:"Paper or project (an assignment taking longer than two weeks and involving some degree of student control in choice of topic or design)"
  },
  {id:"IV_collaboration", section:"IV", type:"checkbox",
   label:"Encouragement and facilitation for students to work collaboratively on their assignments"
  },
  {id:"IV_groupwork", section:"IV", type:"checkbox",
   label:"Explicit group assignments"
  },
  {id:"IV_other", section:"IV", label:"", type:"textarea",
        label:"Any other types of assignments (please specify)"
  },

  {id:"VA_midtermCourseEval", section:"V.A", type:"checkbox",
   label:"Midterm course evaluation"
  },
  {id:"VA_clickerCourseEval", section:"V.A", type:"checkbox",
   label:"Repeated online or paper feedback or via some other collection means, such as clickers"
  },
  {id:"VA_other", section:"V.A", label:"", type:"textarea",
        label:"Any other student course evalations (please specify)"
  },



  {id:"VB_redoHW", section:"V.B", type:"checkbox",
   label:"Assignments with feedback before grading or with opportunity to redo work to improve grade"
  },
  {id:"VB_seeGradedHW", section:"V.B", type:"checkbox",
   label:"Students see their graded assignments"
  },
  {id:"VB_publishRubric", section:"V.B", type:"checkbox",
   label:"Students see assignment answer key and/or grading rubric"
  },
  {id:"VB_seeGradedMidterm", section:"V.B", type:"checkbox",
   label:"Students see their graded midterm exam(s)"
  },
  {id:"VB_seeMidtermAnswers", section:"V.B", type:"checkbox",
   label:"Students see midterm exam(s) answer key(s)"
  },
  {id:"VB_meetWithEachStudent", section:"V.B", type:"checkbox",
   label:"Students explicitly encouraged to meet individually with you"
  },
  {id:"VB_other", section:"V.B", label:"", type:"textarea",
        label:"Any other feedback to students (please specify)"
  },



  {id:"VB_numMidterms", section:"V.B", type:"select",
   label:"Number of Midterm Exams",
   options:["0","1","2","3",">3"]
  },
  {id:"VB_explainReasoning", section:"V.B", type:"select",
   label:"Approximate fraction of exam grades from questions that required students to explain reasoning",
   options:["0-5%","5-15%","15-25%","25-40%",">40%"]
  },


  {id:"VC_", section:"V.C", type:"select",
   label:"Final Exam",
   options:[">70%","61-70%","51-60%","41=50%","30-40%","<30%"]
   },

   {id:"VC_midterms", section:"V.C", type:"select",
    label:"midterm(s)",
    options:["0%","5%","10%","15%","20%","25%","30%","35%","40%","50%",">50%"]
   },

   {id:"VC_hw", section:"V.C", type:"select",
    label:"homework",
    options:["0%","5%","10%","15%","20%","25%","30%","35%","40%","50%",">50%"]
   },
   {id:"VC_projects", section:"V.C", type:"select",
    label:"Paper(s) or Project(s)",
    options:["0%","5%","10%","15%","20%","25%","30%","35%","40%","50%",">50%"]
   },
   {id:"VC_inClassActivities", section:"V.C", type:"select",
    label:"In-class activities",
    options:["0%","5%","10%","15%","20%","25%","30%","35%","40%","50%",">50%"]
   },
   {id:"VC_inClassQuizzes", section:"V.C", type:"select",
    label:"In-class Quizzes",
    options:["0%","5%","10%","15%","20%","25%","30%","35%","40%","50%",">50%"]
   },
   {id:"VC_onlineQuizzes", section:"V.C", type:"select",
    label:"Online Quizzes",
    options:["0%","5%","10%","15%","20%","25%","30%","35%","40%","50%",">50%"]
   },
   {id:"VC_participation", section:"V.C", type:"select",
    label:"Participation",
    options:["0%","5%","10%","15%","20%","25%","30%","35%","40%","50%",">50%"]
   },
   {id:"VC_lab", section:"V.C", type:"select",
    label:"lab work",
    options:["0%","5%","10%","15%","20%","25%","30%","35%","40%","50%",">50%"]
   },
   {id:"VC_other", section:"V.C", label:"", type:"textarea",
         label:"Any other components of the grading? (please specify)"
   },


  {id:"VI_placementExam", section:"VI", type:"checkbox",
   label:"Assessment given at beginning of course to assess background knowledge"
  },
  {id:"VI_conceptInventory", section:"VI", type:"checkbox",
   label:"Use of instructor-independent pre-post test (e.g. concept inventory) to measure learning."
  },
  {id:"VI_multiplePrePost", section:"VI", type:"checkbox",
   label:"Use of pre-post test that is repeated in multiple offerings of the course to measure and compare learning"
  },
  {id:"VI_interestsPrePost", section:"VI", type:"checkbox",
   label:"Use of pre-post survey of student interest and/or perceptions about the subject"
  },
  {id:"VI_learningSelfEval", section:"VI", type:"checkbox",
   label:"Opportunities for students’ self-evaluation of learning"
  },
  {id:"VI_agency", section:"VI", type:"checkbox",
   label:"Students provided with opportunities to have some control over their learning, such as choice of topics for course, paper, or project, choice of assessment methods, etc."
  },
  {id:"VI_newPedagogy", section:"VI", type:"checkbox",
   label:"New teaching methods or materials were tried along with measurements to determine their impact on student learning"
  },
  {id:"VI_other", section:"VI", label:"", type:"textarea",
        label:"Any other non-summative assessments? (please specify)"
  },



  {id:"VII_noTAs", section:"VII", type:"checkbox",
   label:"No TAs for course"
  },
  {id:"VII_engTestTAs", section:"VII", type:"checkbox",
   label:"TAs must satisfy English language skills criteria"
  },
  {id:"VII_trainingTAs", section:"VII", type:"checkbox",
   label:"TAs receive ½ day or more of training in teaching"
  },
  {id:"VII_meetingTAs", section:"VII", type:"checkbox",
   label:"There are Instructor-TA meetings every two weeks or more frequently, where student learning and difficulties, and the teaching of upcoming material are discussed."
  },
  {id:"VII_ugradTAs", section:"VII", type:"checkbox",
   label:"TAs are undergraduates"
  },
  {id:"VII_gradTAs", section:"VII", type:"checkbox",
   label:"TAs are graduates"
  },
  {id:"VII_other", section:"VII", label:"", type:"textarea",
        label:"Any other TA training/guidance? (please specify)"
  },


  {id:"VIII_usedColleagueMaterials", section:"VIII", type:"checkbox",
   label:"Used or adapted materials provided by colleague(s)"
  },
  {id:"VIII_usedDeptMaterials", section:"VIII", type:"checkbox",
   label:"Used “Departmental” course materials that all instructors of this course are expected to use"
  },
  {id:"VIII_talkWithColleague", section:"VIII", type:"select",
   label:"Discussed how to teach the course with colleague(s)",
   options:["1 Never","2","3","4","5 Very Frequently"]
  },
  {id:"VIII_readLiterature", section:"VIII", type:"select",
   label:"Read literature about teaching and learning relevant to this course",
   options:["1 Never","2","3","4","5 Very Frequently"]
  },
  {id:"VIII_observedColleague", section:"VIII", type:"select",
   label:"Sat in on colleague's class (any class) to get/share ideas for teaching",
   options:["1 Never","2","3","4","5 Very Frequently"]
  },


  {id:"IX_general", section:"IX", type:"textarea",
   label:"Any Additional Comments about your teaching."},

   {id:"X_feedback", section:"X", type:"textarea",
    label:"Any Additional Comments about the Teaching Practices Inventory."},
];


var keys=[
  {section:"0",
    text:"Course Information",
    subtext:"Your teaching practices may vary depending on which course you are teaching. Large classes require different techniques than small seminars. We encourage you to complete a teaching practice inventory for each course you taught this past year."
  },
  {section:"I",
    text:"Syllabus -- provided to students via hard copy or course webpage.",
    subtext:" (check all that occurred in your course)"
  },
  {section:"II",
    text:"Supporting materials provided to students.",
    subtext:" (check all that occurred in your course)"
  },
  {section:"III.A",
    text:"In-class Features and Activities. ",
    subtext:"On an average day, how often do you ..."
  },
  {section:"III.B",
    text:"In-class Features and Activities. ",
    subtext:" (check all that occurred in your course)"
  },
  {section:"III.C",
    text:"In-class Features and Activities. ",
    subtext:"Personal Response Systems.  If a student response system is used to collect responses from all students IN REAL TIME IN CLASS, what method is used? (check all that occurred in your course)"
  },
  {section:"IV",
    text:"Assignments.",
    subtext:" (check all that occurred in your course)"
  },
  {section:"V.A",
    text:"Feedback -- from students to instructor during the term.",
    subtext:" (check all that occurred in your course)"
  },
  {section:"V.B",
    text:"Feedback -- to students from instructor during the term.",
    subtext:" (check all that occurred in your course)"
  },
  {section:"V.C",
    text:"Testing and Grading.",
    subtext:"Enter the approximate breakdown of course grade from these assessments"
  },

  {section:"VI",
    text:"Other Assessments.",
    subtext:" (check all that occurred in your course)"
  },
  {section:"VII",
    text:"Training and Guidance of Teaching Assistants.",
    subtext:" (check all that occurred in your course)"
  },
  {section:"VIII",
    text:"Collaboration or sharing in teaching.",
    subtext:" (check all that occurred in your course)"
  },
  {section:"IX",
    text:"General.",
    subtext:" (open ended comments about your teaching practices)"
  },
  {section:"X",
    text:"Comments about this Teaching Practices Inventory",
    subtext:"Please give us feedback, suggestions, questions, etc. about this Inventory"
  },



];
