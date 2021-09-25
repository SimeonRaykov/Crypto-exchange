import React from "react";
import PropTypes from "prop-types";

import styles from "./Symbol.module.scss";

function Symbol({
  serviceName,
  firstSymbol,
  secondSymbol,
  price,
  error,
  onClick,
}) {
  return (
    <li onClick={onClick} className={styles.symbolContainer}>
      {error ? (
        <div className={styles.errorMessage}>
          <div className={styles.serviceName}>{serviceName}&nbsp;</div>
          <div>
            does not support {firstSymbol} - {secondSymbol} currency pair
          </div>
        </div>
      ) : (
        <>
          <div className={styles.serviceName}> {serviceName}&nbsp;</div>
          <div>
            1 {firstSymbol} = {price} {secondSymbol}
          </div>
        </>
      )}
    </li>
  );
}

Symbol.propTypes = {
  serviceName: PropTypes.string.isRequired,
  firstSymbol: PropTypes.string,
  secondSymbol: PropTypes.string,
  price: PropTypes.number,
  error: PropTypes.bool,
};

export default Symbol;
