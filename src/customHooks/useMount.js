import {
    useEffect
} from "react";

/**
 * useMount
 * Runs when component is mounted
 * @param {function} fn
 * @returns {void}
 */
// eslint-disable-next-line react-hooks/exhaustive-deps
const useMount = (fn) => useEffect(fn, []);
export default useMount;