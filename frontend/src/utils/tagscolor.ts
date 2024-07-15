// colors for tags
export const colorPalette: { [key: string]: string } = {
  history: "bg-orange-100 text-orange-800",
  geography: "bg-green-100 text-green-800",
  mathematics: "bg-red-100 text-red-800",
  french: "bg-blue-100 text-blue-800",
  english: "bg-violet-100 text-violet-800",
  technology: "bg-rose-100 text-rose-800",
  art: "bg-indigo-100 text-indigo-800",
  physics: "bg-yellow-100 text-yellow-800",
  chemistry: "bg-teal-100 text-teal-800",
  spanish: "bg-lime-100 text-lime-800",
  german: "bg-amber-100 text-amber-800",
  music: "bg-pink-100 text-pink-800",
  sports: "bg-gray-100 text-gray-800",
  economics: "bg-emerald-100 text-emerald-800",
  biology: "bg-cyan-100 text-cyan-800",
  "earth sciences": "bg-indigo-100 text-indigo-800",
  "computer science": "bg-fuchsia-100 text-fuchsia-800",
  medicine: "bg-purple-100 text-purple-800",
  architecture: "bg-sky-100 text-sky-800",
  "general culture": "bg-lime-100 text-lime-800",
  "civic education": "bg-orange-100 text-orange-800",
};


// method to define tag color
export const getColorClass = (tagName: string) => {
  return colorPalette[tagName.toLowerCase()] || "bg-gray-100 text-gray-800";
};

getColorClass("history"); // bg-orange-100 text-orange-800
getColorClass("earth sciences"); // bg-indigo-100 text-indigo-800