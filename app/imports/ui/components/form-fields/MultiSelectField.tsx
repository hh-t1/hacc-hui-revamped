import React from 'react';
import classnames from 'classnames';
import { connectField, filterDOMProps } from 'uniforms';
import { Dropdown } from 'react-bootstrap';

/* eslint react/prop-types: 0 */
const renderDropdown = ({
  allowedValues,
  disabled,
  placeholder,
  onChange,
  transform,
  value,
}) => {
  const options = allowedValues.map((val, index) => ({
    key: index,
    text: transform ? transform(val) : val,
    value: val,
  }));
  return (
    <Dropdown
      fluid
      multiple
      placeholder={placeholder}
      selection
      disabled={disabled}
      options={options}
      onChange={(event, data) => onChange(data.value)}
      value={value}
    />
  );
};
/* eslint max-len: 0 */
const MultiSelect = ({
  allowedValues,
  checkboxes,
  className,
  disabled,
  error,
  errorMessage,
  fieldType,
  id,
  inputRef,
  label,
  name,
  onChange,
  placeholder,
  required,
  showInlineError,
  transform,
  value,
  ...props
}) => (
  <div
    className={classnames({ disabled, error, required }, className, 'field')}
    {...filterDOMProps(props)}
  >
    {label && <label htmlFor={id}>{label}</label>}
    {renderDropdown({
      allowedValues,
      disabled,
      placeholder,
      onChange,
      transform,
      value,
    })}
    {!!(error && showInlineError) && (
      <div className="ui red basic pointing label">{errorMessage}</div>
    )}
  </div>
);

export default connectField(MultiSelect);
