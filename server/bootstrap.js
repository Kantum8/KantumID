import { Meteor } from 'meteor/meteor';
import { EJSON } from 'meteor/ejson';

var illnessesDump = Assets.getText('illnesses.dump').split('\n').filter(function(p) {
  return !!p;
});

if(Illnesses.find().count() < illnessesDump.length) {
  console.log("adding initial set of illnesses (%s)", illnessesDump.length);
  for(var lc=0; lc<illnessesDump.length; lc++) {
    if(lc > 0 && lc % 500 == 0) {
      console.log("  added packages: ", lc);
    }
    var i = illnessesDump[lc];
    i = EJSON.parse(i);
    SaveIllnesses(i.illnessesName, i);
  };
  console.log("completed!");
}


/*
var FrillnessesDump = Assets.getText('fr-illnesses.dump').split('\n').filter(function(p) {
  return !!p;
});

if(FrIllnesses.find().count() < FrillnessesDump.length) {
  console.log("adding initial set of Frillnesses (%s)", FrillnessesDump.length);
  for(var lc=0; lc<FrillnessesDump.length; lc++) {
    if(lc > 0 && lc % 500 == 0) {
      console.log("  added packages: ", lc);
    }
    var i = FrillnessesDump[lc];
    i = EJSON.parse(i);
    FrSaveIllnesses(i.FrillnessesName, i);
  };
  console.log("completed!");
}
*/
