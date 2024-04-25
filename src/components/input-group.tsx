import React, { useMemo } from "react";

import "../styles/input-group.css";

type InputGroupProps = {
  title?: string;
  children: React.ReactNode;
};

const InputGroup: React.FC<InputGroupProps> = ({ title, children }) => {
  const hasMultipleChildren = useMemo(
    () => React.Children.count(children) > 1,
    [children]
  );

  return (
    <div className={`input-group ${!hasMultipleChildren ? "full" : ""}`}>
      {title && <label>{title}</label>}
      {children}
    </div>
  );
};

export default InputGroup;
