import { useState, useEffect } from "react";
import localforage from "localforage";

export function useStore<StoreType extends {}>(
  name: string,
  initState?: StoreType
) {
  const [store, setStore] = useState<Partial<StoreType>>(
    Object.freeze(initState ?? {})
  );

  useEffect(() => {
    localforage.getItem<Partial<StoreType>>(name).then((value) => {
      if (value !== null) {
        setState(value);
      }
    });
  }, []);

  useEffect(() => {
    if (store !== null) {
      localforage.setItem(name, store);
    }
  }, [store]);

  const setState = (value: Partial<StoreType>) => {
    setStore(value);
  };

  const setKeyValue = (
    key: keyof StoreType,
    value: StoreType[keyof StoreType]
  ) => {
    setState({ ...store, [key]: value });
  };

  return [store as StoreType, setState, setKeyValue] as const;
}
