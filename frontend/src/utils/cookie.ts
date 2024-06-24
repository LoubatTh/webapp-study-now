export const setCookie = (name: string, value: string, expiresDate?: string): void => {
    const secure: string = window.location.protocol === 'https:' ? '; Secure' : '';
    let cookieValue: string = `${name}=${encodeURIComponent(value)}; Path=/; SameSite=Strict${secure}`;
    
    if (expiresDate) {
        const date = new Date(expiresDate).toUTCString();
        cookieValue += `; Expires=${date}`;
    }

    document.cookie = cookieValue;
};

export const getCookie = (name: string): string | undefined => {
    const value: string = `; ${document.cookie}`;
    const parts: string[] = value.split(`; ${name}=`);
    if (parts.length === 2) {
        const cookiePart: string = parts.pop()!;
        return decodeURIComponent(cookiePart.split(';').shift()!);
    }
    return undefined;
};

export const getCookieExpirationDate = (name: string): string | undefined => {
    const value: string = `; ${document.cookie}`;
    const parts: string[] = value.split(`; ${name}=`);
    if (parts.length === 2) {
        const cookiePart: string = parts.pop()!;
        return cookiePart.split(';').slice(-1)[0];
    }
    return undefined;
}

export const deleteCookie = (name: string): void => {
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};