import React, { useState } from 'react';
import cx from "classnames";
import Collapse from "@kunukn/react-collapse";

const CollapseItem = ({ title, children, open = false }) => {
  const [isOpen, setOpen] = useState(open);
  const toggle = index => {
    setOpen(!isOpen);
  };
  return (
    <div className="collapse_item">
      <button
        className={cx("app__toggle", {
          "app__toggle--active": isOpen
        })}
        onClick={toggle}
      >
        <span className="app__toggle-text text-white">{title}</span>
        <div className="text-white">
          {isOpen ? (
            <i className="fa fa-chevron-down"></i>
          ) : (
            <i className="fa fa-chevron-up"></i>
          )}
        </div>
      </button>
      <Collapse
        isOpen={isOpen}
        className={
          "app__collapse app__collapse--gradient " +
          (isOpen ? "app__collapse--active" : "")
        }
      >
        <div className="app__content">
          {children}
        </div>
      </Collapse>
    </div>
  )
}

export default CollapseItem;