import { useState } from 'react';

export function useInput(initialValue, validator) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState("");

  const onChange = (e) => {
    setValue(e.target.value);
    if (!validator(e.target.value)) {
      setError(`Invalid ${e.target.name}`);
    } else {
      setError("");
    }
  };
  
  return {
    value,
    error,
    onChange
  }
}
