import TelegramBot, { EditMessageTextOptions, Message, SendMessageOptions } from 'node-telegram-bot-api';
import { InlineKeyboard, InlineKeyboardButton, Row } from 'node-telegram-keyboard-wrapper';
import { ListItem } from '../models';

export async function sendMessage(chat_id: number, buttons: InlineKeyboard, message_text: string, bot: TelegramBot): Promise<void> {
  const options: SendMessageOptions = {
    parse_mode: 'MarkdownV2',
    reply_markup: buttons.length > 0 ? buttons.getMarkup() : undefined,
  };
  await bot.sendMessage(chat_id, message_text, options);
}

export async function changeMessage(
  message_text: string,
  buttons: InlineKeyboard,
  query_id: string,
  message: Message,
  bot: TelegramBot,
): Promise<void> {
  bot.answerCallbackQuery(query_id, { text: '' }).then(async () => {
    const options: EditMessageTextOptions = {
      chat_id: message.chat.id,
      message_id: message.message_id,
      parse_mode: 'MarkdownV2',
      reply_markup: buttons.length > 0 ? buttons.getMarkup() : undefined,
    };
    bot.editMessageText(message_text, options);
  });
}

export async function buttons(items: ListItem[]): Promise<InlineKeyboard> {
  const buttons = new InlineKeyboard();
  items.forEach((item: ListItem) => {
    const row = new Row(new InlineKeyboardButton(item.text, 'callback_data', item.id.toString()));
    buttons.push(row);
  });
  return buttons;
}