
    
function AppViewModel(members) {
  var self = this;
  self.totalTimeAvailable = ko.observable(DEFAULT_TOTAL_AVAILABLE_TIME);
  self.memberSpeakingIndex = ko.observable(-1);
  self.allMembers = ko.observableArray([]);
  members.forEach(memberObj => {
      self.allMembers.push(new Member(memberObj.name));
  });
          
  self.attendees = ko.observableArray([]);
  self.start = function(){
    self.attendees.removeAll();
    var res = randomizeList(self.allMembers());
    var seconds = self.totalTimeAvailable() / res.length * 60;
    res.forEach(function(item) {
      item.completed(false);
      item.remainingTime(seconds);
      item.allocatedTime(seconds);
      self.attendees.push(item);
    });

    if(self.attendees().length>0){
      self.memberSpeakingIndex(0);
    }
  };
  
  this.currentTime = ko.observable(moment().format(MOMENTJS_TIME_WITH_SECONDS_FORMAT));

  this.tick = function() {
      self.currentTime(moment().format(MOMENTJS_TIME_WITH_SECONDS_FORMAT));
      if (self.memberSpeakingIndex() >= 0 && self.memberSpeakingIndex() < self.attendees().length){
        //we are actively in standup so deduct time from the current speaking member.
        self.attendees()[self.memberSpeakingIndex()].remainingTime(self.attendees()[self.memberSpeakingIndex()].remainingTime()-1);
      }
  };
  
  self.skipAttendee = function(member){
    
    for (var index=0;index< self.attendees().length; index++){
      if (self.attendees()[index] == member){
        self.attendees.remove(member);
        self.attendees.push(member);
        break;
      } 
    }
  };
  
  self.attendeeDone = function (member){
    for (var index=0;index< self.attendees().length; index++){
      if (self.attendees()[index] == member){
        member.completed(true);
        self.memberSpeakingIndex(self.memberSpeakingIndex()+1);
        break;
      }
    }
  };
  
  setInterval(self.tick, 1000);
  
  
  self.welcomeText = ko.pureComputed(function (){
      
  });
    
    
      
  function getAttendeesFilter (member){
    return member.present()===true;
  }
  
  function randomizeList(membersList){
    var usedIndicies = [];
  
    var tempAttendees = membersList.filter(getAttendeesFilter);
    if (tempAttendees.length ===0){
      alert("Attendees are empty!");
      return [];
    }
    var randomizedList =[];
    do {
      var memberIndex;
      do{
          memberIndex= Math.floor((Math.random() * tempAttendees.length));
      }
      while(usedIndicies.indexOf(memberIndex) >= 0 && memberIndex >= 0 && memberIndex < tempAttendees.length);
      randomizedList.push(tempAttendees[memberIndex]);
      usedIndicies.push(memberIndex);
    }
    while(randomizedList.length < tempAttendees.length);
    
    return randomizedList;
  }
}