import { useState, useEffect, useRef, useMemo } from "react";
import localforage from "localforage";
import { useFramerPlugin } from "../providers/framer-plugin";

export function useStore<StoreType extends {}>(
  name: string,
  initState: StoreType
) {
  let storeId = useRef<string>();
  const queue = useRef<Array<() => void>>([]);

  try {
    const { id } = useFramerPlugin();
    storeId.current = id;
  } catch (error) {
    console.warn(
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
    idb.ready().then(() => {
      setStoreLoaded(true);
    });
  }, [idb]);

  useEffect(() => {
    if (!isStoreLoaded) return;

    for (const key in store) {
      if (store[key] === undefined) {
        idb.removeItem(key);
        continue;
      }

      idb.setItem(key, store[key]);
    }
  }, [JSON.stringify(store), isStoreLoaded]);

  useEffect(() => {
    if (isStoreLoaded) {
      idb.iterate((value, key) => {
        setStore((prev) => ({
          ...prev,
          [key]: value,
        }));
      });
      queue.current.forEach((action) => action());
      queue.current = [];
    }
  }, [isStoreLoaded]);

  const setState = (value: Partial<StoreType>) => {
    const action = () => {
      if (Object.keys(value).length === Object.keys(store).length) {
        setStore(value as StoreType);
        return;
      }

      setStore({
        ...store,
        ...value,
      });
    };

    if (!isStoreLoaded) {
      queue.current.push(action);
    } else {
      action();
    }
  };

  const setKeyValue = <Key extends keyof StoreType>(
    key: Key,
    value: StoreType[Key]
  ) => {
    setState({ [key]: value } as unknown as Partial<StoreType>);
  };

  return [store as StoreType, setState, setKeyValue, isStoreLoaded] as const;
}
