import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
  Meteor.publish(null, function() {
    return Meteor.users.find(this.userId, { fields: {
      'services.google.accessToken': 1,
      'services.google.expiresAt': 1,
      //'services.google.refreshToken': 1
    }});
  });
});
