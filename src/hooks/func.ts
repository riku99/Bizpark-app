import { useState } from 'react';

export function useFunctionAsState(fn) {
  const [val, setVal] = useState(() => fn);

  function setFunc(fn) {
    setVal(() => fn);
  }

  return [val, setFunc];
}
