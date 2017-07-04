UserData = new Mongo.Collection('userData', {connection: null});

const dbService = {

  saveData(data, callback) {
    const userData = UserData.findOne(data.id)
    if (userData === undefined) {
      UserData.insert({
        _id: data.id,
        subject: data.subject,
        data: data
      });
    } else {
      //console.log(data.id + ' is ever saved');
    }
  },

  fetchData(subject, callback) {
    userData = UserData.find({subject: subject}).fetch();
    return callback(null, userData);
  }
    /*
    Meteor.methods({
  'todos.updateText'({ todoId, newText }) {
    new SimpleSchema({
      medId: { type: String },
      subject: { type: String }
      data: { type: JSON}
    }).validate({ todoId, newText });
    const todo = Todos.findOne(todoId);
    if (!todo.editableBy(this.userId)) {
      throw new Meteor.Error('todos.updateText.unauthorized',
        'Cannot edit todos in a private list that is not yours');
    }
    Todos.update(todoId, {
      $set: { text: newText }
    });
  }
});
  }
*/


};

export default dbService;
/*
Accounts.oauth.registerService('facebook');

if (Meteor.isClient) {
  const loginWithFacebook = function(options, callback) {
    // support a callback without options
    if (! callback && typeof options === "function") {
      callback = options;
      options = null;
    }

    var credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback);
    Facebook.requestCredential(options, credentialRequestCompleteCallback);
  };
  Accounts.registerClientLoginFunction('facebook', loginWithFacebook);
  Meteor.loginWithFacebook = function () {
    return Accounts.applyLoginFunction('facebook', arguments);
  };
} else {
  Accounts.addAutopublishFields({
    // publish all fields including access token, which can legitimately
    // be used from the client (if transmitted over ssl or on
    // localhost). https://developers.facebook.com/docs/concepts/login/access-tokens-and-types/,
    // "Sharing of Access Tokens"
    forLoggedInUser: ['services.facebook'],
    forOtherUsers: [
      // https://www.facebook.com/help/167709519956542
      'services.facebook.id', 'services.facebook.username', 'services.facebook.gender'
    ]
  });
}
*/
