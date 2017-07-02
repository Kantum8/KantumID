/* global alert */

import i18n from 'meteor/universe:i18n';
import { $ } from 'meteor/jquery';
import './errorService.html'
/*
  export const errorService = (error) => {
    if (error) {
      Template.errorService.helpers({
      $('.message-error').addClass('active');
        setTimeout(function(){
          $('.btn').removeClass('loading');
        }, 500);

      function closeMessage() {
        $('.message-error').removeClass('active');
      }

      $('.close').click(closeMessage);

    })
      // It would be better to not alert the error here but inform the user in some
      // more subtle way
      //alert(TAPi18n.__(error.error)); // eslint-disable-line no-alert
    }
  };
*/
/*
var errorService = errorService.extendComponent({
  template: function () {
    //return
    $('.message-error').addClass('active');
      setTimeout(function(){
        $('.btn').removeClass('loading');
      }, 500);

    function closeMessage() {
      $('.message-error').removeClass('active');
    }

    $('.close').click(closeMessage);;
  },

  events: function () {
    return AutoSelectTextareaComponent.__super__.events.call(this).concat({
      'change textarea': this.onChange,
      'click textarea': this.onClick
    });
  }
}).register('errorService');
*/
var errorService;

export default errorService;
