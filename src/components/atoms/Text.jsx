import React from "react";

function Text({ children, align = "left", size = "normal" }) {
  return (
    <p className={`text ${size}`} style={{ textAlign: align }}>
      {children}
    </p>
  );
}

export default Text;
