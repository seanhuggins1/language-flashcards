import { useEffect, useRef } from "react";

interface KeyDownHandler {
  readonly key: string;
  readonly handler: (event: KeyboardEvent) => void;
}

const useKeyDown = ({ key, handler }: KeyDownHandler) => {
  const eventListenerRef = useRef<(event: KeyboardEvent) => void>(() => null);

  useEffect(() => {
    // eslint-disable-next-line functional/immutable-data
    eventListenerRef.current = (event: KeyboardEvent) => {
      if (event.key !== key) return;
      event.preventDefault();
      handler?.(event);
    };
  }, [key, handler]);

  useEffect(() => {
    // Create event listener for key
    const eventListener: (this: Window, event: KeyboardEvent) => void = (
      event
    ) => {
      eventListenerRef.current(event);
    };

    window.addEventListener(`keydown`, eventListener);
    return () => {
      window.removeEventListener(`keydown`, eventListener);
    };
  }, []);
};
export default useKeyDown;
