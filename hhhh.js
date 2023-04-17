const mineflayer = require('mineflayer');
const moment = require('moment-timezone');
const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const token = '5955630582:AAHRcA46_dfno6baRjdOdykh4yidQWmrhTw';
const telegramBot = new TelegramBot(token, { polling: true });
const timezone = 'Europe/Moscow'; // часовой пояс, в котором нужно записывать дату и время
const date2 = moment.tz(timezone).format('DD_MM_YYYY');
const logChat = fs.createWriteStream(`./Logs/Chat/logs-${date2}.txt`, { flags: 'a' });
const levenshtein = require('fast-levenshtein');

const bot = mineflayer.createBot({
  host: 'limbo.teslacraft.org', // limbo.teslacraft.org
  username: 'Ошибка',
  password: 'kopplopp',
  version: '1.12.2',
  port: 25565
});

const chatId = "5230010894"
telegramBot.sendMessage(chatId, `бот запустился`);
 //const logchat = fs.createWriteStream(`./Logs/Chat/logs-${date2}.txt`, { flags: 'a' });
const logCases = fs.createWriteStream(`./Logs/Cases/cases-logs-${date2}.txt`, { flags: 'a' });
const logTg = fs.createWriteStream(`./Logs/Telegram/tg-logs-${date2}.txt`, { flags: 'a' });

bot.once('spawn', function () {
    console.log("🟩 Бот зашел на сервер");
    bot.chat("/hub");
    console.log("📦 Бот перемещен в Лобби");
    bot.chat("/limbo");
    console.log("📦 Бот перемещен в Лимбо");
    bot.chat("/hub");
    console.log("📦 Бот перемещен в Лобби");
});

bot.on('message', (message) => {
    let msg = message.toString();
    const date = moment.tz(timezone).format('DD.MM.YYYY HH:mm:ss');
    if(!msg.startsWith(' ')){
        logChat.write(`[${date}] ${message}\n`);
        console.log(`[${date}] ${message}`);
    }});



const badWords = ['лох', 'петух', 'Урод', 'Обосрыш', 'Свиноматка', 'соси', 'сосни', 'сасай', 'Лох', 'Лошара', 'Идиот', 'Шкура', 'Петух', 'свинья', 'Имбицил',
 'Бездар', 'Бомж', 'Чушка', 'нищий', 'нищая', 'саси', 'соси', 'сосёт', 'сосет', 'высер',];

const players = {};

 

function checkMessage(player, message) {
    let count = 0;
    for (const word of badWords) {
      if (message.includes(word)) {
         count++;
      }
    }
    players[player] = players[player] || 0;
    players[player] += count;
    const date = moment.tz(timezone).format('DD.MM.YYYY HH:mm:ss');
    if (players[player] >= 3) {
    telegramBot.sendMessage(chatId, `[${date}] ${player} отправил 3 плохих слова`);
      players[player] = 0;
    }
}

setInterval(() => {
    for (const player in players) {
       players[player] = 0;
   }
}, 20 * 68 * 1000);


bot.on('chat', (username, message) => {
    checkMessage(username, message);
    });

    const similarMessagesThreshold = 4;
const similarMessagesInterval = 90 * 1000; // 1.5 minutes in milliseconds

let lastMessages = {};

bot.on('chat', (username, message) => {
    const now = Date.now();

    checkMessage(username, message);

    if (!lastMessages[username]) {
        lastMessages[username] = { count: 1, timestamp: now, message };
    } else if (levenshtein.get(message.toLowerCase(), lastMessages[username].message.toLowerCase()) <= 2
      && now - lastMessages[username].timestamp < similarMessagesInterval) {
        lastMessages[username].count++;
        if (lastMessages[username].count >= similarMessagesThreshold) {
             const date = moment.tz(timezone).format('DD.MM.YYYY HH:mm:ss');
             const userIds = [5230010894, 1626707905];
             telegramBot.sendMessage(userId,
              `📅:[${date}]\nИгрок ${username} флудит\n\nОтправка ${lastMessages[username].count} похожих сообщений за 1.5 минуты\n\nКоманды:\n\n<code>/lookup ${username}</code>\n<code>/warn ${username} флуд</code>`, { parse_mode: 'html' });
             }}
            });
 
 function searchWordsByTemplate(template, words) {
    const regexString = template.replace(/\?/g, '.');
    const regex = new RegExp('^' + regexString + '$');
    let matchingWords = words.filter(word => regex.test(word));
    for (let i = 0; i < template.length; i++) {
      if (template[i] !== '?' && template[i] !== regexString[i]) {
        matchingWords = matchingWords.filter(word => word[i] === template[i]);
      }
    }
    return matchingWords;
}

telegramBot.onText(/\.с (.+)/, (msg, match) => {
  const words = fs.readFileSync('words.txt', 'utf-8').split('\n').map(word => word.trim()); // words.txt заменяешь на своё название. текстовый документ уже должен быть создан, должен находится там же, где и основной класс бота (index.js)
  const chatId = msg.chat.id;
  const template = match[1];
  const foundWords = searchWordsByTemplate(template, words);
  const reply = foundWords.length === 0 ? 'Слов не найдено' : foundWords.join(', ');
  telegramBot.sendMessage(chatId, reply);
});





























































