import React from "react";
import PropTypes from "prop-types";

import styles from "./Modal.module.scss";

function Modal({ children, title, handleClose }) {

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalContainer}>
        <div className={styles.titleCloseBtn}>
          <button onClick={handleClose}>X</button>
        </div>
        <div className={styles.title}>
          <h1>{title}</h1>
        </div>
        <div className={styles.body}>{children}</div>
        <div className={styles.footer}>
          <button onClick={handleClose} className={styles.cancelBtn}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  children: PropTypes.node,
  show: PropTypes.bool,
  handleClose: PropTypes.func,
};

export default Modal;
