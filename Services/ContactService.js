const { where, Op, Sequelize } = require('sequelize');
const ContactModel = require('../Models/Contact')
const database = require('../databaseConnection')

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
        var flag = true;
        var idOfPrimary = null;
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
            idOfPrimary = checkEmailExists.id;
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
            idOfPrimary = checkPhoneNumberExists.id
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
        else{
            if(checkEmailExists.id===checkPhoneNumberExists.id){
                //both same do nothing
                idOfPrimary=checkEmailExists.id
                console.log("Same same");
            }
            else{
                if(checkEmailExists.linkPrecedence==="primary" && checkPhoneNumberExists.linkPrecedence==="primary"){
                    //update older id data to primary and newer id data to secondary
                    if(checkEmailExists.id>checkPhoneNumberExists.id){
                        checkEmailExists.linkedId = checkPhoneNumberExists.id;
                        checkEmailExists.linkPrecedence = 'secondary';
                        await checkEmailExists.save();
                        idOfPrimary=checkPhoneNumberExists.id;
                    }
                    else{
                        checkPhoneNumberExists.linkedId = checkEmailExists.id;
                        checkPhoneNumberExists.linkPrecedence = 'secondary';
                        await checkPhoneNumberExists.save();
                        idOfPrimary=checkEmailExists.id;
                    }
                    console.log("Contact Update Successful");
                }
                else if(checkEmailExists.linkPrecedence==="secondary" && checkPhoneNumberExists.linkPrecedence==="primary"){
                    //update checkEmailExists data with reference to that of checkPhoneNumber
                    checkEmailExists.linkedId = checkPhoneNumberExists.id;
                    checkEmailExists.linkPrecedence = 'secondary';
                    await checkEmailExists.save();
                    idOfPrimary = checkPhoneNumberExists.id;
                    console.log("Updating secondary Email Contact")
                }
                else if(checkEmailExists.linkPrecedence==="primary" && checkPhoneNumberExists.linkPrecedence==="secondary"){
                    //update checkPhonenumberExists data with reference to that of checkEmail
                    checkPhoneNumberExists.linkedId = checkEmailExists.id;
                    checkPhoneNumberExists.linkPrecedence = 'secondary';
                    await checkPhoneNumberExists.save();
                    idOfPrimary = checkEmailExists.id;
                    console.log("Updating secondary PhoneNumber Contact")
                }
                else{
                    //do nothing
                    flag=false;
                    //OR
                    //update the secodary contact with older id to become primary, then its previously linked primary contact to become secondary and the other secondary contact also become its secondary according to the login followed as when 1 out of 2 primary contact becomes secondary.
                    
                    // if(checkEmailExists.id<checkPhoneNumberExists.id){
                    //     //update parent to become secondary and secondary to become primary
                    //     console.log("Both Secondary Found. Updating records - ")
                    //     await database.transaction(async (t) => {
                    //         var parentContact = await ContactModel.findOne({
                    //             where:{
                    //                 id:checkEmailExists.linkedId
                    //             },
                    //             transaction: t
                    //         });
                    //         parentContact.linkedId = checkEmailExists.id;
                    //         parentContact.linkPrecedence = 'secondary';
                    //         await parentContact.save({ transaction: t });
                    //         checkEmailExists.linkedId = null;
                    //         checkEmailExists.linkPrecedence = 'primary';
                    //         await checkEmailExists.save({ transaction: t });
                    //         checkPhoneNumberExists.linkedId = checkEmailExists.id;
                    //         await checkPhoneNumberExists.save({ transaction: t });
                    //         console.log("Update Complete")
                    //     });
                    // }
                    // else{
                    //     console.log("Both Secondary Found. Updating records - ")
                    //     await database.transaction(async (t) => {
                    //         var parentContact = await ContactModel.findOne({
                    //             where:{
                    //                 id:checkPhoneNumberExists.linkedId
                    //             },
                    //             transaction: t
                    //         });
                    //         parentContact.linkedId = checkPhoneNumberExists.id;
                    //         parentContact.linkPrecedence = 'secondary';
                    //         await parentContact.save({ transaction: t });
                    //         checkPhoneNumberExists.linkedId = null;
                    //         checkPhoneNumberExists.linkPrecedence = 'primary';
                    //         await checkPhoneNumberExists.save({ transaction: t });
                    //         checkEmailExists.linkedId = checkPhoneNumberExists.id;
                    //         await checkEmailExists.save({ transaction: t });
                    //         console.log("Update Complete")
                    //     });
                    // }
                }
            }
        }
        var returnData = {};
        if(flag){
            returnData = await this.extractDataFromIdOfPrimary(idOfPrimary);
            console.log(returnData);
        }
        return {"flag":flag,"data":returnData};       
    }

    static async getDataFromEmailOnly(email){
        var checkEmailExists = await ContactModel.findOne({
            where:{
                email : email
            }
        })
        if(!checkEmailExists){
            return {"flag":false,"message":"No contact exists with this email! Insufficient data to create new contact."}
        }
        var returnData = await this.extractDataFromIdOfPrimary(checkEmailExists.id);
        return {"flag":true,"data":returnData};
    }

    static async getDataFromPhoneNumberOnly(phoneNumber){
        var checkPhoneNumberExists = await ContactModel.findOne({
            where:{
                phoneNumber : phoneNumber
            }
        })
        if(!checkPhoneNumberExists){
            return {"flag":false,"message":"No contact exists with this phone number! Insufficient data to create new contact."}
        }
        var returnData = await this.extractDataFromIdOfPrimary(checkPhoneNumberExists.id);
        return {"flag":true,"data":returnData};
    }


    static async extractDataFromIdOfPrimary(idOfPrimary){
        var returnData = {};
        const getContacts = await ContactModel.findAll({
            where:{
                [Op.or]:[
                    {id:idOfPrimary},
                    {linkedId:idOfPrimary}
                ]
            },
        });
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
        return returnData;
    }
}

module.exports = ContactService