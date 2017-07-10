import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import {Lokka} from 'lokka';
import {Transport} from 'lokka-transport-http';

import './melanoma.html';


const client = new Lokka({
  transport: new Transport('http://127.0.0.1:5000')
});

Template.melanoma.onCreated(function melanomaOnCreated() {
  // result starts at 0
  this.result = new ReactiveVar();
  this.confidence = new ReactiveVar();
});

Template.melanoma.helpers({
  result() {
    return Template.instance().result.get();
  },
  confidence() {
    return Template.instance().confidence.get();
  },
});

Template.melanoma.events({
  "change #input"(event, instance) {
    var image = $('#input')[0].files[0];
    // IDEA: test if is a image

    const fileReader = new FileReader()
    fileReader.readAsDataURL(image)
    fileReader.onload = function () {
      images = fileReader.result.slice(22)
      HTTP.post('https://cors-anywhere.herokuapp.com/https://87090eac.ngrok.io/melanoma/predict', {
        data: [{"content": images}]
      }, function(err, res){
        if (err) {
          console.log(err);
        } else {
          data = res.data[0];
          result = data.result;
          confidence = data.confidence;
          console.log(data);
          console.log(result);
          console.log(confidence);
          instance.result.set(result);
          instance.confidence.set(confidence)
        }
      });
      // FOR THE graphql API
      /*
      client.mutate(`
        myFirstMutation {
            createPerson(images: ${images}) {
                person {
                    images
                }
            }
        }
      `).then(result => {
          console.log(result);
      });
      */
    }
  },
});
