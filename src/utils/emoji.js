// Emoji utilities for chat
export const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;

export const parseEmojis = (text) => {
  return text.replace(emojiRegex, (match) => `<span class="emoji">${match}</span>`);
};

export const stripEmojis = (text) => {
  return text.replace(emojiRegex, '');
};

export const hasEmojis = (text) => {
  return emojiRegex.test(text);
};

// Common emoji shortcuts
export const emojiShortcuts = {
  ':)': '😊',
  ':D': '😃',
  ':(': '😢',
  ':P': '😛',
  ';)': '😉',
  '<3': '❤️',
  ':heart:': '❤️',
  ':fire:': '🔥',
  ':thumbsup:': '👍',
  ':thumbsdown:': '👎',
  ':laugh:': '😂',
  ':cry:': '😭',
  ':confused:': '😕',
  ':angry:': '😠',
  ':surprised:': '😲'
};

export const replaceShortcuts = (text) => {
  let result = text;
  Object.entries(emojiShortcuts).forEach(([shortcut, emoji]) => {
    result = result.replaceAll(shortcut, emoji);
  });
  return result;
};
