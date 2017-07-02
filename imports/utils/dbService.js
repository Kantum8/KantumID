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
