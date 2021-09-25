const getSymbolFromPathName = (pathname) => {
    if (!pathname) return;

    let removedSlash = pathname;
    if (pathname.charAt(0) === '/') {
        removedSlash = pathname.substring(1);
    }

    let symbols = '';
    for (let i = 0; i <= removedSlash.length; i += 1) {
        if (removedSlash.charAt(i) === '/') {
            break;
        }
        symbols += removedSlash.charAt(i);
    }
    return symbols;
}

export default getSymbolFromPathName;