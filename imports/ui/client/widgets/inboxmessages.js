import {Template} from 'meteor/templating';
import {$} from 'meteor/jquery';
import {Messages} from '/imports/api/messages.js';
import {Chats} from '/imports/api/chats.js'
import EmojiPanel from 'emoji-panel';

import './inboxmessages.html';

Meteor.subscribe('messages');
Meteor.subscribe('chats');

Template.inboxmessages.helpers({
  chats() {
    chats = Chats.find({}).fetch();
    chatsThread = [];
    chats.forEach(function(entry) {
      console.log(entry);
      chatsThread.push(entry);
    });
    return chatsThread;
  },
  messages() {
    messages = Messages.find({chatId: Session.get('chatId')}).fetch();
    messagesThread = [];
    messages.forEach(function(entry) {
      console.log(entry);
      messagesThread.push(entry);
    });
    return messagesThread;
  },
});


Template.inboxmessages.events({
  /*'submit .search'(event) {
    const searchFilter = {
      options: { valueNames: ['name'] },
      init() {
        const userList = new List('people-list', this.options);
        const noItems = $('<li id="no-items-found">No items found</li>');

        userList.on('updated', list => {
          if (list.matchingItems.length === 0) {
            $(list.list).append(noItems);
          } else {
            noItems.detach();
          }
        });
      }
    };

    searchFilter();
  },*/
  'submit #smiley'(event) {
    new EmojiPanel(document.getElementById('example-3'));
    document.getElementById('smiley').addEventListener('click', () => {
      document.getElementById('example-3-container').classList.toggle('open');
    });
  },
  'click .person'(event) {
    currentTarget = event.currentTarget;
    console.log(currentTarget);
      if ($(currentTarget).hasClass('.active')) {
        return false;
      } else {
        const findChat = $(currentTarget).attr('data-chat');
        const personName = $(currentTarget).find('.name').text();
        let address = Session.get('address');
        let username = Session.get('connexionSigned').username;
        let chatId =
        {
          chatId: `${address}${username}${personName}`,
          recipient: personName
        }
        console.log(chatId);
        // Recipient can be undefined
        Session.set('chatId', chatId);
        $('.right .top .name').html(personName);
        $('.chat').removeClass('active-chat');
        $('.left .person').removeClass('active');
        $(currentTarget).addClass('active');
        $(`.chat[data-chat = ${findChat}]`).addClass('active-chat');
      }
    },
  'change #attach'(event, instance) {
    const image = $('#attach')[0].files[0];
    const fileReader = new FileReader()
    fileReader.readAsDataURL(image);
    fileReader.onload = () => {
      let images = fileReader.result;
      let content = images;
      Meteor.call('chats.insert', chatId.chatId, null, chatId.recipient);
      Meteor.call('messages.insert', chatId, 'user', 'image', content);
      document.getElementById("scroll-content").scrollTop += $('#scroll-content').height();

/*
      //Let you to create new chat
      //recipient = 'SkinCancerBot'
      recipient = 'MinisterAssistantBot'
      address = Session.get('address')
      username = Session.get('connexionSigned').username
      let chatId = `${address}${username}${recipient}`;
      Meteor.call('chats.insert', chatId, content, recipient, 'bot');
*/


      // Call skin cancer api
      images = images.slice(22);
      url = 'https://cors-anywhere.herokuapp.com/http://skincancer.herokuapp.com/melanoma/predict';
      url = 'https://cors-anywhere.herokuapp.com/https://52c76251.ngrok.io/melanoma/predict';
      HTTP.post(url, {
        data: [{"content": images}]
      }, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          data = res.data[0];
          result = data.result;
          confidence = data.confidence * 100;
          if (result === 'negative') {
            // ${emoji.unifiedToHTML('🎉')}
            content = `🎉  Cool with a confidence level of ${confidence} % you don\'t have a skin cancer.`
          } else {
            content = `😞 I'm very sorry but with a confidence level of ${confidence} you have a skin cancer.`
          }
          Meteor.call('messages.insert', chatId, 'bot', 'text', content);
        }
      });
      }
    },
    'click .smiley'(event) {
      new EmojiPanel(document.getElementById('smiley-panel'));
      document.getElementById('smiley-container').classList.toggle('open');
    },
    'submit .write'(event) {
      event.preventDefault();
      // Get value from form element
      let content = $('input#textSubmit').val();
      console.log(content);

      if (content.length !== 0) {
        currentTarget = event.currentTarget;
        console.log(currentTarget);
          if ($(currentTarget).hasClass('.active')) {
            return false;
          } else {
            let chatId = Session.get('chatId');
            Meteor.call('chats.insert', chatId.chatId, null, chatId.recipient);
            Meteor.call('chats.updateLastMessage', chatId.chatId, content)
            Meteor.call('messages.insert', chatId, 'user', 'text', content);
            document.getElementById("scroll-content").scrollTop += $('#scroll-content').height();
        //    document.getElementById("scroll-content").scrollBottom -= 10000000000;
          }
      $('input#textSubmit').val('').removeAttr('checked').removeAttr('selected');

    }
  },
});
