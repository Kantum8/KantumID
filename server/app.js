import { Meteor } from 'meteor/meteor';

SearchSource.defineSource('illnesses', function(searchText, options) {
  var options = {sort: {isoScore: -1}, limit: 20};

  if(searchText) {
    var regExp = buildRegExp(searchText);
    var selector = {$or: [
      {illnessesName: regExp},
      {description: regExp}
    ]};

    return Illnesses.find(selector, options).fetch();
  } else {
    return Illnesses.find({}, options).fetch();
  }
});

function buildRegExp(searchText) {
  // this is a dumb implementation
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}
/*
import i18n from 'meteor/universe:i18n';


var lang = 'frIllnesses';
var majLang = FrIllnesses
SearchSource.defineSource(lang, function(searchText, options) {
  var options = {sort: {isoScore: -1}, limit: 20};

  if(searchText) {
    var regExp = buildRegExp(searchText);
    var selector = {$or: [
      {illnessesName: regExp},
      {description: regExp}
    ]};

    return majLang.find(selector, options).fetch();
  } else {
    return majLang.find({}, options).fetch();
  }
});

function buildRegExp(searchText) {
  // this is a dumb implementation
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}
*/
