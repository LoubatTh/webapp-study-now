export const parseISODateToMilis = (dateToParse: string) => {
  const date = new Date(dateToParse);
  return date.getTime();
};

export const getFormattedDate = (dateToParse: string) => {
  const date = new Date(dateToParse);
  return date.toLocaleDateString();
};

export function formatDateDayMonth(dateStr: string) {
  // Create a Date object from the date string
  const date = new Date(dateStr);

  // Extract the day, month, and year
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const year = date.getFullYear();

  // Format the date as day/month/year
  return `${day}/${month}/${year}`;
}
