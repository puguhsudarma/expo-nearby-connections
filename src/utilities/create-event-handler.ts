export type Unsubscribe = () => void;

export function createEventHandler<T>() {
  const listeners = new Set<(data: T) => void>();

  return {
    emit: (data: T): void => {
      listeners.forEach((cb) => cb(data));
    },
    subscribe: (callback: (data: T) => void): Unsubscribe => {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
  };
}
