import { useEffect, useRef, useState } from "react";

export function usePersistentState(
  key,
  initialState,
  serialize,
  deserialize
) {
  const [state, setState] = useState(initialState);
  const hasLoaded = useRef(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedValue = window.localStorage.getItem(key);

    if (!savedValue) {
      hasLoaded.current = true;
      return;
    }

    try {
      const parsed = deserialize ? deserialize(savedValue) : JSON.parse(savedValue);
      setState(parsed);
    } catch {
      window.localStorage.removeItem(key);
    }
    hasLoaded.current = true;
  }, [key, deserialize]);

  // Save to localStorage whenever state changes (skip initial write)
  useEffect(() => {
    if (!hasLoaded.current) return;
    const serialized = serialize ? serialize(state) : JSON.stringify(state);
    window.localStorage.setItem(key, serialized);
  }, [key, state, serialize]);

  return { state, setState };
}
