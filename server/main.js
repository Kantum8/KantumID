import { Meteor } from 'meteor/meteor';
import {Lokka} from 'lokka';
import {Transport} from 'lokka-transport-http';

Meteor.startup(() => {
  // code to run on server at startup
  Meteor.publish(null, function() {
    return Meteor.users.find(this.userId, { fields: {
      'services.google.accessToken': 1,
      'services.google.expiresAt': 1,
      //'services.google.refreshToken': 1
    }});
  });

  const client = new Lokka({
    transport: new Transport('http://127.0.0.1:5000')
  });


        client.mutate(`
          myFirstMutation {
              createPerson(images: "images"}) {
                  person {
                      images
                  }
              }
          }
        `).then(result => {
            console.log(result);
        });







});
