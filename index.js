// Resources: 
// https://cloud.ibm.com/apidocs/language-translator/language-translator?code=node
// https://github.com/watson-developer-cloud/node-sdk

const methods = require ('./methods.js');

methods.translate('Testando método', 'pt', 'en');