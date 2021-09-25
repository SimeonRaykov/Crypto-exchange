import {
    useEffect,
    useRef
} from "react";

/**
 * useUnmount
 * Runs when component is unmounted
 * @param {function} fn
 * @returns {void}
 */
const useUnmount = (fn) => {
    const fnRef = useRef(fn);
    fnRef.current = fn;

    useEffect(() => () => fnRef.current(), []);
};

export default useUnmount;