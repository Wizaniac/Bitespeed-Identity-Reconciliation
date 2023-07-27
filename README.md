Hi Viewer,
This project is done according to the instructions mentioned in the below link - 

# Bitespeed-Identity-Reconciliation
Bitespeed Identity Reconciliation Assignment

https://bitespeed.notion.site/Bitespeed-Backend-Task-Identity-Reconciliation-53392ab01fe149fab989422300423199

The project is successfully deployed.

You can create a new contact using this endpoint - 

POST - https://bitespeed-identity-reco.onrender.com/addContact

Sample CURL attached - 

curl --location 'https://bitespeed-identity-reco.onrender.com/addContact' \
--header 'Content-Type: application/json' \
--data-raw '{
    "phoneNumber": "987654321",
    "email": "test@contact.com",
    "linkPrecedence": "primary"
}'

You can use the main functionality of identifying contacts using this endpoint - 

POST - https://bitespeed-identity-reco.onrender.com/identify

Sample CURL - 

curl --location 'https://bitespeed-identity-reco.onrender.com/identify' \
--header 'Content-Type: application/json' \
--data-raw '{
    "phoneNumber": 999999,
    "email": "tushar@bazooka.com"
}'

Assumptions - 

*Displaying error message if data of both input fields(contact and phoneNumber) passed of secondary Contacts. Code for handling such a situation with logic is commented.
*Displaying error message if only single input passed and no Contact exists.
*If a secondary contact if passed again with a different Primary contact, the secondary contact will now become secondary respective to the Primary contact passed.
*If both Primary contacts data is passed belonging to different contacts, the one with an older id stays primary and relatively newer one becomes secondary.