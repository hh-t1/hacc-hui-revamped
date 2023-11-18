import * as React from 'react';
// @ts-ignore
import classnames from 'classnames';
import { connectField, filterDOMProps } from 'uniforms';

/* eslint react/prop-types: 0 */
/* eslint max-len: 0 */
const RadioField = ({
  allowedValues,
  checkboxes,
  className,
  disabled,
  error,
  errorMessage,
  id,
  inline,
  label,
  name,
  onChange,
  required,
  showInlineError,
  transform,
  value,
  ...props
}) => (
  <div
    className={classnames(
      className,
      { disabled, error, inline },
      inline ? '' : 'grouped',
      'fields',
    )}
    {...filterDOMProps(props)}
  >
    {label && (
      <div className={classnames({ required }, 'field')}>
        <label>{label}</label>
      </div>
    )}

    {allowedValues.map((item) => (
      <div className="field" key={item}>
        <div className="ui radio checkbox">
          <input
            checked={item === value}
            disabled={disabled}
            id={`${id}-${item}`}
            name={name}
            onChange={() => onChange(item)}
            type="radio"
          />

          <label htmlFor={`${id}-${item}`}>
            {transform ? transform(item) : item}
          </label>
        </div>
      </div>
    ))}

    {!!(error && showInlineError) && (
      <div className="ui red basic pointing label">{errorMessage}</div>
    )}
  </div>
);

export default connectField(RadioField);
