Illnesses = new Mongo.Collection('illnesses');
/*
IllnesseSchema = new SimpleSchema({
    illnessesName: {
      type: String,
      label: "IllnessesName",
    },
    description: {
      type: String,
      label: "Description",
    },
  fr: {
    illnessesName: {
      type: String,
      label: "IllnessesName",
    },
    description: {
      type: String,
      label: "Description",
    },
  },
});

Illnesses.attachSchema( IllnesseSchema )
*/
if(Meteor.isServer) {
  Illnesses._ensureIndex({d: 1, c: 1});
}
