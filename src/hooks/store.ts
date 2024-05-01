import { useState, useEffect, useRef } from "react";
import localforage from "localforage";
import { useFramerPlugin } from "../providers/framer-plugin";

export function useStore<StoreType extends {}>(
  name: string,
  initState: StoreType
) {
  const { id } = useFramerPlugin();
  const idb = useRef(
    localforage.createInstance({
      name: id,
      storeName: name,
    })
  );

  const [store, setStore] = useState<StoreType>(initState);

  useEffect(() => {
    idb.current.iterate((value, key) => {
      setStore((prev) => ({ ...prev, [key]: value }));
    });
  }, []);

  useEffect(() => {
    for (const key in store) {
      if (store[key] === undefined) {
        idb.current.removeItem(key);
        return;
      }

      idb.current.setItem(key, store[key]);
    }
  }, [JSON.stringify(store)]);

  const setState = (value: Partial<StoreType>) => {
    if (Object.keys(value).length === Object.keys(store).length) {
      setStore(value as StoreType);
      return;
    }

    setStore({
      ...store,
      ...value,
    });
  };

  const setKeyValue = <Key extends keyof StoreType>(
    key: Key,
    value: StoreType[Key]
  ) => {
    setState({ [key]: value } as unknown as Partial<StoreType>);
  };

  return [store as StoreType, setState, setKeyValue] as const;
}
