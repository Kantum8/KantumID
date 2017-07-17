import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { _ } from 'lodash';


export const Chats = new Mongo.Collection('chat');

if (Meteor.isServer) {
  Meteor.publish('chats', function chatsPublication() {
      return Chats.find({});
  });
  Meteor.methods({
    'chats.insert'(chatId, profilePicture, recipient, userType, lastMessage) {
      const chatID = Chats.findOne({chatId: chatId});
      if (chatID === undefined) {
        Chats.insert({
          chatId: chatId,
          profilePicture: profilePicture,
          recipient: recipient,
          userType: userType,
          lastMessage: lastMessage,
          createdAt: new Date()
        });
      }
    },

    'chats.updateLastMessage' (chatId, lastMessage) {
      console.log(chatId);
      console.log(lastMessage);
      return Chats.update(chatId, {$set: {lastMessage: lastMessage}});
    },

    'chats.updateStep' (_id, step) {
      return Chats.update(_id, {$set: {step: step}});
    },

    'chats.updateSessionContext' (_id, sessionContext) {
      return Chats.update(_id, {$set: {sessionContext: sessionContext}});
    },

    'chats.appendError' (_id, error) {
      return Chats.update(_id, { $push: { errors: error } });
    }
  });
}