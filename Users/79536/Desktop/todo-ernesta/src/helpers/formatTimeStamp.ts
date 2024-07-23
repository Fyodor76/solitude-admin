export const formatTimeStamp = (timestampInSeconds: string) => {
  const date = new Date(+timestampInSeconds); // Умножаем на 1000, так как timestamp в миллисекундах
  const day = date.getDate().toString().padStart(2, "0"); // Получаем день
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Получаем месяц (нумерация начинается с 0)
  const year = date.getFullYear().toString(); // Получаем год
  const hours = date.getHours().toString().padStart(2, "0"); // Получаем часы
  const minutes = date.getMinutes().toString().padStart(2, "0"); // Получаем минуты

  return `${day}.${month}.${year} ${hours}:${minutes}`;
};
