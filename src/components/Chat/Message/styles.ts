export const getMessageStyles = (type: 'user' | 'ai' | 'human') => {
  const styles = {
    user: 'bg-white text-gray-800',
    ai: 'bg-blue-500 text-white',
    human: 'bg-green-500 text-white',
  };
  
  return styles[type];
};

export const getMessageAlignment = (type: 'user' | 'ai' | 'human') => {
  return type === 'user' ? 'left' : 'right';
};