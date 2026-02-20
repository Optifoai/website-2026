import React from 'react';
// import './InputField.css'; // Or .scss

function InputField({ label, type, value, onChange, required, ...props }) {
  return (
    <div className="input-field-container">
      <label>
        {label}
        {required && <span className="required">*</span>}
      </label>
      <input type={type} value={value} onChange={onChange} required={required} {...props} />
    </div>
  );
}

export default InputField;
