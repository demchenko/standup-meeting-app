function Member(memberName){
  var self = this;
  self.name= memberName;
  self.present = ko.observable(true);
  self.allocatedTime = ko.observable(0);
  //the members remaining time to speak.
  self.remainingTime = ko.observable(0);
  self.completed = ko.observable(false);
  self.remainingTimeText = ko.pureComputed(function (){
    if(self.completed()){
      var timeSpent = self.allocatedTime() - self.remainingTime();
      return moment.duration(timeSpent, "seconds").format(MOMENTJS_DURATION_TIME_WITH_SECONDS_FORMAT, {trim: false});
    }
    else{
      if (self.remainingTime()>=1){
        return moment.duration(self.remainingTime(), "seconds").format(MOMENTJS_DURATION_TIME_WITH_SECONDS_FORMAT, {trim: false}) + " remaining";
      }
      else if (self.remainingTime() < 1 && self.remainingTime() >= -1){
        return "TIMES UP!";
      }
      else if (self.remainingTime() < -1){
        return "OVERTIME: "+ self.remainingTime().toString() + " SECONDS";
      }
    }
  });
  self.togglePresent= function(){
    self.present(!self.present());
  };
  self.remainingTimeProgress = ko.pureComputed(function (){
      var val = Math.abs(Math.floor((self.remainingTime()/self.allocatedTime()*100)));
      return (val > 100 ? 100: val);
  });
}