MedHistory = new Mongo.Collection('medHistory', {connection: null});

const dbService = {

  saveData(data, callback) {
    const medHistory = MedHistory.findOne(data.id)
    if (medHistory === undefined) {
      MedHistory.insert({
        _id: data.id,
        subject: data.subject,
        data: data
      });
    } else {
      //console.log(data.id + ' is ever saved');
    }
  },

  fetchData(subject, callback) {
    medHistory = MedHistory.find({subject: subject}).fetch();
    return callback(null, medHistory);
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
