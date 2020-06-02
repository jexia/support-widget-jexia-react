// This credentials is for test project can be change at any time. 
// Please, use your credentials.
const projectID = "90455dd3-42ba-4f10-8c9e-7a5799e383be";
const key = "def6b422-8bc5-4687-be25-0d595e07339b";
const secret = "/H+BRheP5lP3qSKYTpauhe9UEP1LKw7O05ur20SfZHiCPMI6Hm92fyWnJ0S59C7aXrPu9YuOoUFSDQID+6ifSrw==";

// Here is Project User what you created in point 3 from Readme
const agent_cred = {
    email: 'project@user.com',
    password: '123'
}

const jexiaSDK = require("jexia-sdk-js/browser");
const rtc = jexiaSDK.realTime();
const ds = jexiaSDK.dataOperations();
const ums = new jexiaSDK.UMSModule()

jexiaSDK.jexiaClient().init({
    projectID: `${projectID}`,
    key: `${key}`,
    secret: `${secret}`
}, ds, rtc, ums);

const clients = ds.dataset('clients')
const chat = ds.dataset('chat')

export {
    clients,
    chat,
    rtc,
    ums,
    agent_cred
}