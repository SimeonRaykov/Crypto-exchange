const shouldOpenDetailsModal = (pathname) => {
    if (pathname.includes('details-')) {
        return true;
    }
    return false;
}

export default shouldOpenDetailsModal;