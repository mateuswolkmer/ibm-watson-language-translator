// Resources: 
// https://cloud.ibm.com/apidocs/language-translator/language-translator?code=node
// https://github.com/watson-developer-cloud/node-sdk

const methods = require ('./methods.js');

methods.languages();
methods.models();
methods.translate('Definizioni specifiche possono essere date focalizzandosi o sui processi interni di ragionamento o sul comportamento esterno del sistema intelligente ed utilizzando come misura di efficacia o la somiglianza con il comportamento umano o con un comportamento ideale, detto razionale.', 'it', 'en');
methods.identify('Um ein Kriterium zu haben, wann eine Maschine eine dem Menschen gleichwertige Intelligenz simuliert, wurde von Alan Turing der nach ihm benannte Turing-Test vorgeschlagen.');
methods.translate('ia.txt', 'en', 'pt');