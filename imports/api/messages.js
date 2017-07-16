import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';
import {HTTP} from 'meteor/http';
const apiai = require('apiai');



const motionAiRequest = function (msg, session, callback) {
    HTTP.get('https://api.motion.ai/messageBot', {
        params: {
            msg: msg,
            session: session,
            bot: 39872,
            key: '41dbde35b62de513f017bb2c3b0c0ce4',
        },
    }, (error, result) => {
        callback(error, result);
    });
};

export const Messages = new Mongo.Collection('message');

if (Meteor.isServer) {
    Meteor.publish('messages', function tasksPublication() {
        return Messages.find({});
    });
}

if (Meteor.isServer) {
    const API_AI_CLIENT_ACCESS_TOKEN = "e019f0e895e44c78bc31b411ec88e9aa";
    const api = apiai(API_AI_CLIENT_ACCESS_TOKEN);
    Meteor.methods({
        'messages.insert'(chatId, user, contentType, content) {
            Messages.insert({
                chatId: chatId,
                user: user,
                contentType: contentType,
                content: content,
                createdAt: new Date()
            });
        },
        'messages.callMotionAi'(text, chatId) {
            motionAiRequest(text, chatId, (error, response) => {
                if (error) {
                    console.log(error);
                    return;
                }

                response.data.botResponse.split("::next::").map(responsePart => {
                    Meteor.call('messages.insert', responsePart, chatId, 'bot', response.data);
                });


            });
        },
        'messages.callApiAi'(text, chatId) {
            let options = {
                sessionId: chatId
            };
            let request = api.textRequest(text, options);

            request.on('response', Meteor.bindEnvironment(function (response) {
                console.log(response);
                Meteor.call('messages.insert', response.result.fulfillment.speech, chatId, 'bot', response.result.metadata.intentName);

            }, function (error) {
                console.log(error);
            }));

            request.end();
        },
        'messages.remove'(messageId) {
            //NOOP
        }
    });
}






if (Meteor.isServer) {
  var metrics = new Mongo.Collection('metrics');
  var pipeline = [
    {$group: {_id: null, resTime: {$sum: "$resTime"}}}
  ];
  var result = metrics.aggregate(pipeline);
  console.log(result);
}
