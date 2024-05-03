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
  const [isStoreLoaded, setStoreLoaded] = useState(false);

  useEffect(() => {
    let storedData: StoreType = initState;

    idb.current.ready().then(() => {
      idb.current
        .iterate((value, key) => {
          storedData = { ...storedData, [key]: value };
        })
        .then(() => {
          setStore(storedData);
          setStoreLoaded(true);
        });
    });
  }, []);

  useEffect(() => {
    if (!isStoreLoaded) return; // If the store is not loaded, we don't want to write to IndexedDB yet

    for (const key in store) {
      if (store[key] === undefined) {
        idb.current.removeItem(key);
        continue;
      }
      idb.current.setItem(key, store[key]); // Save to local storage
    }
  }, [JSON.stringify(store), isStoreLoaded]); // add isStoreLoaded as dependency

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

  return [store as StoreType, setState, setKeyValue, isStoreLoaded] as const;
}
