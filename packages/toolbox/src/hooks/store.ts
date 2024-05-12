import { useState, useEffect, useRef, useMemo } from "react";
import localforage from "localforage";
import { useFramerPlugin } from "../providers/framer-plugin";

export function useStore<StoreType extends {}>(
  name: string,
  initState: StoreType
) {
  let storeId = useRef<string>();

  try {
    const { id } = useFramerPlugin();
    storeId.current = id;
  } catch (error) {
    console.error(
      "useStore must be used within a FramerPluginProvider. Defaulting to plugin id (by fetch call)."
    );
    fetch("/framer.json")
      .then((res) => res.json())
      .then((config) => {
        storeId.current = config.id;
      });
  }

  const idb = useMemo(() => {
    return localforage.createInstance({
      name: storeId.current,
      storeName: name,
    });
  }, [name, storeId.current]);

  const [store, setStore] = useState<StoreType>(initState);
  const [isStoreLoaded, setStoreLoaded] = useState(false);

  useEffect(() => {
    let storedData: StoreType = initState;

    idb.ready().then(() => {
      idb
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
        idb.removeItem(key);
        continue;
      }
      idb.setItem(key, store[key]); // Save to local storage
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
