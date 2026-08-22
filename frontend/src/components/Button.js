import React from 'react';

export default function Button({ children, onClick, type = "button", className = '', style, ...rest }) {
  return (
    <button className={`button ${className}`} style={style} type={type} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}
