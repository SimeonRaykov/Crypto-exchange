import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";

import { FILTER_STATES } from "constants/constants";

import styles from "./Filter.module.scss";

function Filter({ title, state, onClick }) {
  return (
    <div className={styles.filterContainer} onClick={onClick}>
      <div className={styles.title}> {title} </div>
      <FontAwesomeIcon
        color="black"
        icon={state === FILTER_STATES.ASC ? faArrowUp : faArrowDown}
      ></FontAwesomeIcon>
    </div>
  );
}

Filter.propTypes = {
  title: PropTypes.string,
  state: PropTypes.oneOf([FILTER_STATES.ASC, FILTER_STATES.DESC]).isRequired,
  onClick: PropTypes.func,
};

export default Filter;
