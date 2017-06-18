Illnesses = new Mongo.Collection('illnesses');
FrIllnesses = new Mongo.Collection('frIllnesses');
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
  Illnesses._ensureIndex({illnessesName: 1, description: 1});
  FrIllnesses._ensureIndex({illnessesName: 1, description: 1});
}
