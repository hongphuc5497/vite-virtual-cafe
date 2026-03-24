import { useEffect, useState } from "react";

export function usePersistentState<T>(
  key: string,
  initialState: T,
  serialize?: (state: T) => string,
  deserialize?: (json: string) => T
) {
  const [state, setState] = useState<T>(initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const savedValue = window.localStorage.getItem(key);

    if (!savedValue) {
      return;
    }

    try {
      const parsed = deserialize ? deserialize(savedValue) : JSON.parse(savedValue);
      setState(parsed);
    } catch {
      window.localStorage.removeItem(key);
    }
  }, [key, deserialize]);

  // Save to localStorage whenever state changes
  useEffect(() => {
    const serialized = serialize ? serialize(state) : JSON.stringify(state);
    window.localStorage.setItem(key, serialized);
  }, [key, state, serialize]);

  return { state, setState };
}
