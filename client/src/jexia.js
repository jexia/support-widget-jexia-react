//This credentials is for test project can be change at any time. 
// Please, use your credentials.

//General test project:
const projectID = "4debe611-fb9b-4734-949c-6d39bb9ec4ae";
const key =  "53e18a75-eab7-446b-b688-e0929c32c9de";
const secret = "/vwM4wf65APCjWc26Zl1ZfSqJI8pFssTMa6ZKAUE3e1uY3WAu5SbkKhE3jseyd96URh6G0AOVi21n98Z9aAs+Q==";

// Here is Project User what you created in point 3 from Readme
const agent_cred ={    
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
