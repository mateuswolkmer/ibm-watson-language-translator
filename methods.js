const fs = require('fs');
const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const languageTranslator = new LanguageTranslatorV3({ 
	version: '2018-05-01' 
});

const verbose = false;

// Tradução de textos ou documentos
const translate = async (text, from, to) => {
  if(text.includes('.txt')) {

    // Traduz documento
    const translateDocumentParams = {
        file: fs.createReadStream(`./${text}`),
        modelId: `${from}-${to}`,
        filename: text,
    };

    console.log(`Traduzindo documento "${text}" de ${from} para ${to}...`);
    languageTranslator.translateDocument(translateDocumentParams)
        .then(async result => {
            console.log('\n-- TRADUÇÃO DE ARQUIVO')
            if(verbose) console.log(JSON.stringify(result, null, 2));

            var documentId = result.result.document_id;
            console.log('Id do documento: ' + documentId)

            console.log('Aguardando tradução...');
            // Busca status do documento
            const getDocumentStatusParams = {
                documentId: documentId
            };
            var processing = true;
            while(processing) {
                var get = async () => await languageTranslator.getDocumentStatus(getDocumentStatusParams)
                var result = await get();
                if(verbose) console.log(JSON.stringify(result, null, 2));

                let status = result.result.status;
                console.log('Status da tradução do documento: ' + status)
                processing = status == "processing";
            }

            // Busca documento traduzido
            const getTranslatedDocumentParams = {
                documentId: documentId,
            };
            console.log('Buscando documento traduzido e passando para o arquivo "translated.txt"...');
            languageTranslator.getTranslatedDocument(getTranslatedDocumentParams)
                .then(result => {
                    let outputFileName = 'translated.txt';
                    const outputFile = fs.createWriteStream(`./${outputFileName}`);
                    result.result.pipe(outputFile);
                    fs.readFile(text, 'utf8', (err, data) => console.log(`\n- Arquivo original (${from}): ${data}`));
                    fs.readFile(outputFileName, 'utf8', (err, data) => console.log(`\n- Arquivo traduzido (${to}): ${data}\n--\n`));
                })
                .catch(err => {
                    console.log('\ntranslate error:', err);
                });
        })
        .catch(err => {
            console.log('\ntranslate error:', err);
        });

  } else {

    const translateParams = {
      text: text,
      modelId: `${from}-${to}`,
    };

    console.log(`Traduzindo "${text}", de ${from} para ${to}...`);
    await languageTranslator.translate(translateParams)
        .then(translationResult => {
            console.log('\n-- TRADUÇÃO DE TEXTO')
            if(verbose) console.log(JSON.stringify(translationResult, null, 2));
            console.log(`- Texto original (${from}): "${text}"\n\n- Texto traduzido (${to}): "${translationResult.result.translations[0].translation}"`)
            console.log('--\n')
        })
        .catch(err => {
            console.log('\ntranslate error:', err);
        });
    }
}

// Lista de linguagens disponíveis
const languages = async() => {
  console.log('Listando as linguagens disponíveis...');
  await languageTranslator.listIdentifiableLanguages()
    .then(identifiedLanguages => {
        console.log('\n-- LINGUAGENS DISPONÍVEIS')
        if(verbose) console.log(JSON.stringify(identifiedLanguages, null, 2));
        console.log(`${identifiedLanguages.result.languages
            .sort(l => l.name)
            .map(l => `${l.name} (${l.language})`)
            .join(', ')}`);
        console.log('--\n')
    })
    .catch(err => {
        console.log('\nlanguages error:', err);
    });
}

// Identifica a linguagem do texto
const identify = async(text) => {
    const identifyParams = {
        text: text
    };
    console.log(`Identificando a linguagem do texto "${text}"...`);
    languageTranslator.identify(identifyParams)
        .then(identifiedLanguages => {
            console.log('\n-- IDENTIFICAÇÃO DE LINGUAGEM')
            if(verbose) console.log(JSON.stringify(identifiedLanguages, null, 2));
            let lang = identifiedLanguages.result.languages[0];
            console.log(`Linguagem mais provável do texto "${text}": ${lang.language} (confiança ${lang.confidence})`);
            console.log('--\n')
        })
        .catch(err => {
            console.log('\nidentify error:', err);
        });
}

const models = async() => {
    console.log('Listando os modelos de tradução disponíveis...');
    languageTranslator.listModels()
        .then(translationModels => {
            console.log('\n-- MODELOS DE TRADUÇÃO DISPONÍVEIS')
            if(verbose) console.log(JSON.stringify(translationModels, null, 2));
            console.log(translationModels.result.models.map(m => m.model_id).join(', '))
            console.log('--\n')
        })
        .catch(err => {
            console.log('error:', err);
        });
}

module.exports = {
    translate, languages, identify, models
}