export const isTelegram = () => {
  return typeof window !== 'undefined' && (window as any).Telegram?.WebApp !== undefined;
};

export const getPlatformHints = () => {
  if (isTelegram()) {
    return {
      jump: 'Tap the screen to jump',
      start: 'Tap Start to begin',
      context: 'Telegram Mini App'
    };
  }
  return {
    jump: 'Press Space or Click to jump',
    start: 'Press Space or Click to begin',
    context: 'Web Browser'
  };
};
