import { Client, Intents, MessagePayload } from 'discord.js';
import { deeplApiKey, languageApiKey, token } from './config';

import translate from 'deepl';

import DetectLanguage from 'detectlanguage';
const language = new DetectLanguage(languageApiKey);

// Unlimited alternative
// import LanguageDetect from 'languagedetect';
// const language = new LanguageDetect();

const client = new Client({ intents: new Intents(32767) });

client.on('messageCreate', async message => {
    if(message.author === client.user) return;

    const detected = (await language.detect(message.content))[0];

    if(detected && detected.language === 'fr' && detected.isReliable) {
        if(message.content.length < 500) {
            const translated = (await translate({
                free_api: true,
                target_lang: 'SK',
                text: message.content,
                auth_key: deeplApiKey
            }) as any).data.translations[0];

            if(translated.detected_source_language !== 'FR') return;

            message.reply(translated.text);
        }
        else {
            message.reply('Je ne peux pas traduire plus de 500 caractères.');
        }
    }
});

client.login(token);
