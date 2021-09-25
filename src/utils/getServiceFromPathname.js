const getServiceFromPathname = (pathname) => {
    if (!pathname) return;

    const lastIndexOfDash = pathname.lastIndexOf('-');
    if (lastIndexOfDash) {
        return pathname.substring(lastIndexOfDash + 1);
    }
    return;
}

export default getServiceFromPathname;