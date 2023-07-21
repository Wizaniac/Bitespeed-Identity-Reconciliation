const ContactModel = require('../Models/Contact')

class ContactService{
    static async createContact(contactData){
        var dataToAdd = {
            phoneNumber:addContactData['phoneNumber'],
            email:addContactData['email'],
            linkedId:addContactData['linkedId'],
            linkPrecedence:addContactData['linkPrecedence']
    };
        const addContact = ContactModel.create(dataToAdd);
        return addContact;
    }
}

module.exports = ContactService