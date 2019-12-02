// Resources: 
// https://cloud.ibm.com/apidocs/language-translator/language-translator?code=node
// https://github.com/watson-developer-cloud/node-sdk

const fs = require('fs');
const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const languageTranslator = new LanguageTranslatorV3({ 
	version: '2018-05-01' 
});

// Tradução
const translateParams = {
  text: 'Hello',
  modelId: 'en-es',
};
languageTranslator.translate(translateParams)
  .then(translationResult => {
	console.log('\nTraduzindo "Hello", de inglês para espanhol:');
    console.log(JSON.stringify(translationResult, null, 2));
  })
  .catch(err => {
    console.log('error:', err);
  });

// Lista de linguagens disponíveis
languageTranslator.listIdentifiableLanguages()
  .then(identifiedLanguages => {
	console.log('\nListando as linguagens disponíveis:');
    console.log(JSON.stringify(identifiedLanguages, null, 2));
  })
  .catch(err => {
    console.log('error:', err);
  });

// Identifica a linguagem do texto
const identifyParams = {
  text: 'Inteligência artificial é a inteligência similar à humana exibida por mecanismos ou software'
};
languageTranslator.identify(identifyParams)
  .then(identifiedLanguages => {
	console.log('\nIdentificando a linguagem do texto "Inteligência artificial é a inteligência similar à humana exibida por mecanismos ou software":');
    console.log(JSON.stringify(identifiedLanguages, null, 2));
  })
  .catch(err => {
    console.log('error:', err);
  });

// Traduz documento
const translateDocumentParams = {
  file: fs.createReadStream('./ia.txt'),
  modelId: 'en-es',
  filename: 'ia.txt',
};
languageTranslator.translateDocument(translateDocumentParams)
  .then(result => {
	console.log('\nTraduzindo documento "ia.txt" do inglês para o espanhol:');
    console.log(JSON.stringify(result, null, 2));

	// Busca documento traduzido
	const getTranslatedDocumentParams = {
	  documentId: result.result.document_id,
	};
	languageTranslator.getTranslatedDocument(getTranslatedDocumentParams)
	  .then(result => {
		console.log('\nBuscando documento traduzido e passando para o arquivo "translated-ia.txt".');
	    const outputFile = fs.createWriteStream('./translated-ia.txt');
	    result.pipe(outputFile);
	  })
	  .catch(err => {
	    console.log('error:', err);
	  });
  })
  .catch(err => {
    console.log('error:', err);
  });