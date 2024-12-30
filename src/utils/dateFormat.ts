// export const formatMessageTime = (date: Date): string => {
//   return new Intl.DateTimeFormat('zh-HK', {
//     hour: 'numeric',
//     minute: 'numeric',
//     hour12: true
//   }).format(date);
// };

export const formatMessageTime = (date: Date | null | undefined): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    console.error("Invalid date object passed to formatMessageTime:", date);
    return "N/A"; // Or another appropriate fallback value
  }
  try {
    return new Intl.DateTimeFormat("zh-HK", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error, date);
    return "N/A"; // Or another appropriate fallback value
  }
};
