import '/imports/startup/client';

/*/ add to i18n.js
import SimpleSchema from 'simpl-schema';
import i18n from 'meteor/universe:i18n';

const SimpleSchema = new SimpleSchema({

})
const registerSchemaMessages = () => {
/*
    SimpleSchema.messageBox.messages({
      en: {
        'required': i18n.__('SimpleSchema.required')
      }
    });/
    SimpleSchema.messageBox.messages({
    en: {
        wrongPassword: "Wrong password"
    }
});

};

i18n.onChangeLocale(registerSchemaMessages);
registerSchemaMessages();
*/
const registerSchemaMessages = () => {
    SimpleSchema.messages({
        'required': i18n.__('SimpleSchema.required')
    });
};

i18n.onChangeLocale(registerSchemaMessages);
registerSchemaMessages();
