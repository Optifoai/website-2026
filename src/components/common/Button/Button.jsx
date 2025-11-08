import React from 'react';
// import './Button.css'; // Or .scss

function Button({ children, onClick, type = 'button', ...props }) {
  return (
    <button type={type} onClick={onClick} className="custom-button" {...props}>
      {children}
    </button>
  );
}

export default Button;
