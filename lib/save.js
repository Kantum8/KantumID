SaveIllnesses = function(name, data) {
  data = _.clone(data);
  delete data._id;
  Illnesses.update(name, {$set: data}, {upsert: true});
};

FrSaveIllnesses = function(name, data) {
  data = _.clone(data);
  delete data._id;
  FrIllnesses.update(name, {$set: data}, {upsert: true});
};
