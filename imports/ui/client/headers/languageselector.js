import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import i18n from 'meteor/universe:i18n';
import { $ } from 'meteor/jquery';

import './languageselector.html';


Template.languageSelector.events = {
  "click": function(e) {
    var lang = $(e.target).val();
    console.log(lang);
    i18n.setLocale(lang);
  }
};
