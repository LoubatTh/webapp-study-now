export const parseISODateToMilis = (dateToParse: string) => {
    const date = new Date(dateToParse);
    return date.getTime();
}

export const getFormattedDate = (dateToParse: string) => {
    const date = new Date(dateToParse);
    return date.toLocaleDateString();
}