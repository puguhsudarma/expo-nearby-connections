import { TextReceived, onTextReceived } from "expo-nearby-connections";
import { useEffect, useState } from "react";

export function usePayloadListener<T = TextReceived>(
  transformer?: (data: TextReceived) => T
) {
  const [data, setData] = useState<T[]>([]);

  useEffect(() => {
    const unsubscribe = onTextReceived((data) => {
      console.log("onTextReceived: ", data);

      setData(
        (pData) => [...pData, transformer ? transformer(data) : data] as T[]
      );
    });

    return () => {
      unsubscribe();
    };
  }, [transformer]);

  return { data, setData };
}
