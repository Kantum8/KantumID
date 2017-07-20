import { Meteor } from 'meteor/meteor';
import { EJSON } from 'meteor/ejson';

import '../imports/api/messages.js';
import '../imports/api/chats.js';

Meteor.startup(() => {
  // Dump ICD-10 in mongoDB
  const illnessesDump = Assets.getText('diagnosis_parents.dump').split('\n').filter(p => !!p);
  if(Illnesses.find().count() < illnessesDump.length) {
    console.log("adding initial set of illnesses (%s)", illnessesDump.length);
    for(let lc = 0; lc < illnessesDump.length; lc++) {
      if(lc > 0 && lc % 500 == 0) {
      //  console.log("  added illnesses: ", lc);
      }
      let i = illnessesDump[lc];
      i = EJSON.parse(i);
      console.log(i.d);
      SaveIllnesses(i.d, i);
    };
    console.log("dump completed!");
  }

  // Publish google oauth token
  Meteor.publish(null, function() {
    return Meteor.users.find(this.userId, { fields: {
      'services.google.accessToken': 1,
      'services.google.expiresAt': 1,
      //'services.google.refreshToken': 1
    }});
  });
});

// Define ICD-10
SearchSource.defineSource('illnesses', (searchText, options) => {
  var options = {sort: {isoScore: -1}, limit: 20};
  if(searchText) {
    const regExp = buildRegExp(searchText);
    const selector = {$or: [
      {c: regExp},
      {d: regExp}
    ]};
    return Illnesses.find(selector, options).fetch();
  } else {
    return Illnesses.find({}, options).fetch();
  }
});
function buildRegExp(searchText) {
  // this is a dumb implementation
  const parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp(`(${parts.join('|')})`, "ig");
}
