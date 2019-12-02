const fs = require('fs');
const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const languageTranslator = new LanguageTranslatorV3({ 
	version: '2018-05-01' 
});

// Tradução de textos ou documentos
const translate = async (text, from, to) => {  
  if(text.includes('.txt')) {

    // Traduz documento
    const translateDocumentParams = {
        file: fs.createReadStream(`./${text}`),
        modelId: `${from}-${to}`,
        filename: text,
    };

    console.log(`\nTraduzindo documento "${text}", de ${from} para ${to}..`);
    languageTranslator.translateDocument(translateDocumentParams)
        .then(result => {
            console.log(JSON.stringify(result, null, 2));

            var documentId = result.result.document_id;
            console.log('\nId do documento: ' + documentId)

            // Busca status do documento
            const getDocumentStatusParams = {
                documentId: documentId,
            };
            languageTranslator.getDocumentStatus(getDocumentStatusParams)
                .then(result => {
                    console.log('\nStatus da tradução:');
                    console.log(JSON.stringify(result, null, 2));
                })
                .catch(err => {
                    console.log('error:', err);
                });

            // Busca documento traduzido
            const getTranslatedDocumentParams = {
                documentId: result.result.document_id,
            };
            console.log('\nBuscando documento traduzido e passando para o arquivo "translated.txt"..');
            languageTranslator.getTranslatedDocument(getTranslatedDocumentParams)
                .then(result => {
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

  } else {

    const translateParams = {
      text: text,
      modelId: `${from}-${to}`,
    };

    console.log(`\nTraduzindo "${text}", de ${from} para ${to}...`);
    await languageTranslator.translate(translateParams)
      .then(translationResult => {
        console.log(JSON.stringify(translationResult, null, 2));
      })
      .catch(err => {
        console.log('error:', err);
      });
    }
}

// Lista de linguagens disponíveis
const languages = async() => {
  console.log('\nListando as linguagens disponíveis...');
  await languageTranslator.listIdentifiableLanguages()
    .then(identifiedLanguages => {
      console.log(JSON.stringify(identifiedLanguages, null, 2));
    })
    .catch(err => {
      console.log('error:', err);
    });
}

// Identifica a linguagem do texto
const identify = async(text) => {
  const identifyParams = {
    text: text
  };
  console.log(`\nIdentificando a linguagem do texto "${text}"...`);
  languageTranslator.identify(identifyParams)
    .then(identifiedLanguages => {
      console.log(JSON.stringify(identifiedLanguages, null, 2));
    })
    .catch(err => {
      console.log('error:', err);
    });
}

module.exports = {
    translate, languages, identify
}