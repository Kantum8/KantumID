SaveIllnesses = function(name, data) {
  data = _.clone(data);
  delete data._id;
  Illnesses.update(name, {$set: data}, {upsert: true});
};
