MedHistory = new Mongo.Collection('medHistory', {connection: null});
//const MedHistory = new Mongo.Collection(null);

const dbService = {

  saveData(data, callback) {
  //MedHistory._collection.insert({_id: 'my-medHistory'});
      MedHistory.insert({
        _id: data.id,
        subject: data.subject,
        data: data
      });
  },

  fetchData(data, callback) {
    medHistory = MedHistory.find({}).fetch();
    console.log(medHistory);
  }
    /*
    Meteor.methods({
  'todos.updateText'({ todoId, newText }) {
    new SimpleSchema({
      todoId: { type: String },
      newText: { type: String }
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

/*
      Medhistory.insert({
        _id: data.id,
        subject: data.subject,
        //data: decryptedData,
        from: decryptedData.dateOfIllnesses.from,
        to: decryptedData.dateOfIllnesses.to,
        illnesses: decryptedData.illnesses
      });
*/



};

export default dbService;

// thonquehoa@gmail.com
