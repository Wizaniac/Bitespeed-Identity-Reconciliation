const { where, Op } = require('sequelize');
const ContactModel = require('../Models/Contact')

class ContactService{
    static async createContact(addContactData){
        var dataToAdd = {
            phoneNumber:addContactData['phoneNumber'],
            email:addContactData['email'],
            linkedId:addContactData['linkedId'],
            linkPrecedence:addContactData['linkPrecedence']
    };
        const addContact = ContactModel.create(dataToAdd);
        return addContact;
    }

    static async getDataFromEmailAndPhoneNumber(email,phoneNumber){

        phoneNumber = phoneNumber.toString();

        var checkEmailExists = await ContactModel.findOne({
            where:{
                email : email
            }
        })
        
        var checkPhoneNumberExists = await ContactModel.findOne({
            where:{
                phoneNumber:phoneNumber
            }
        })
        // return [checkEmailExists,checkPhoneNumberExists];
        // console.log(checkEmailExists,checkPhoneNumberExists);
        if(checkEmailExists && !checkPhoneNumberExists){
            var dataToAdd = {
                phoneNumber:phoneNumber,
                email:email,
                linkedId:checkEmailExists.id,
                linkPrecedence:"secondary"
            };
            const addContact = await ContactModel.create(dataToAdd);
        }
        if(checkPhoneNumberExists && !checkEmailExists){
            console.log("Here 2")
            var dataToAdd = {
                phoneNumber:phoneNumber,
                email:email,
                linkedId:checkPhoneNumberExists.id,
                linkPrecedence:"secondary"
            };
            const addContact = await ContactModel.create(dataToAdd);
        }
        if(!checkEmailExists && !checkPhoneNumberExists){
            var dataToAdd = {
                phoneNumber:phoneNumber,
                email:email,
                linkedId:null,
                linkPrecedence:"primary"
            };
            const addContact = await ContactModel.create(dataToAdd);
        }
        // else{
        //     if(checkEmailExists.id===checkPhoneNumberExists.id){
        //         //both same do nothing
        //     }
        //     else{
        //         if(checkEmailExists.linkPrecedence==="primary" && checkPhoneNumberExists.linkPrecedence==="primary"){
        //             //update phoneNumberExists data to secondary with link to email data
        //         }
        //         else if(checkEmailExists.linkPrecedence==="secondary" && checkPhoneNumberExists.linkPrecedence==="primary"){
        //             //update checkEmailExists data with reference to that of checkPhoneNumber
        //         }
        //         else if(checkEmailExists.linkPrecedence==="primary" && checkPhoneNumberExists.linkPrecedence==="secondary"){
        //             //update checkPhonenumberExists data with reference to that of checkEmail
        //         }
        //         else{
        //             //do nothing
        //         }
        //     }
            const getContacts = await ContactModel.findAll({
                where:{
                    [Op.or]:[
                        {email:email},
                        {phoneNumber:phoneNumber}
                    ]
                },
            });
            var returnData = [];
            returnData['emails'] = new Set([]);
            returnData['secondaryContactIds'] = new Set([]);
            returnData['phoneNumbers'] = new Set([]);
            getContacts.forEach(contact => {
                const contactJson = contact.toJSON();
                console.log(contactJson);
                if(contact.linkPrecedence==="primary"){
                    returnData['primaryContactId'] = contact.id;
                }
                else{
                    returnData['secondaryContactIds'].add(contact.id)
                }
                returnData['emails'].add(contact.email);
                returnData['phoneNumbers'].add(contact.phoneNumber);
            });

            returnData['secondaryContactIds'] = [...returnData['secondaryContactIds']];
            returnData['emails'] = [...returnData['emails']];
            returnData['phoneNumbers'] = [...returnData['phoneNumbers']];
            console.log(returnData);

            return returnData;
        // }
    }
}

module.exports = ContactService