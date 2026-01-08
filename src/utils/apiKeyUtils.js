export const generateApiKey = (type = 'dev') => {
  return `tvly-${type}-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
};

export const maskApiKey = (key) => {
  if (!key) return '';
  const parts = key.split('-');
  if (parts.length >= 3) {
    const prefix = parts.slice(0, 2).join('-');
    const masked = '*'.repeat(27);
    return `${prefix}-${masked}`;
  }
  return key.substring(0, 8) + '*'.repeat(key.length - 8);
};
