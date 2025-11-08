import React from "react";

function Title({ children, level = 1 }) {
  const Tag = `h${level}`;
  return <Tag className="title">{children}</Tag>;
}

export default Title;
