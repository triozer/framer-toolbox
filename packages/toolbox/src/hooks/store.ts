import { useEffect, useMemo, useRef, useState } from 'react'
import localforage from 'localforage'
import { useFramerPlugin } from '../providers'

/**
 * The return type of the useStore hook.
 *
 * @typeParam Store - The type of the store.
 *
 * @public
 */
export interface StoreReturn<Store extends object> {
  /** The store object. */
  store: Store
  /** The function to set the store object. */
  setStore: (value: Partial<Store>) => void
  /** The function to set a value in the store object. */
  setStoreValue: <Key extends keyof Store>(key: Key, value: Store[Key]) => void
  /** Whether the store is loaded. */
  isStoreLoaded: boolean
}

/**
 * A hook to manage a local store using IndexedDB via `localforage`.
 *
 * @typeParam Store - The type of the store.
 * @param name - The name of the store.
 * @param initState - The initial state of the store.
 *
 * @example
 * ```tsx
 * const { store, setStore, setStoreValue, isStoreLoaded } = useStore('myStore', { id: 'value1', name: 'value2' })
 *
 * const { id, name } = store
 * ```
 *
 * @public
 * @kind hook
 */
export function useStore<Store extends object>(
  name: string,
  initState: Store,
): StoreReturn<Store> {
  const storeId = useRef<string>()

  const plugin = useFramerPlugin()

  if (plugin) {
    storeId.current = plugin.id
  }
  else {
    fetch('/framer.json')
      .then(res => res.json())
      .then((config) => {
        storeId.current = config.id
      })
  }

  const idb = useMemo(() => {
    return localforage.createInstance({
      name: storeId.current,
      storeName: name,
    })
  }, [name, storeId.current])

  const [store, setStore] = useState<Store>(initState)
  const [isStoreLoaded, setStoreLoaded] = useState(false)

  const isInternalUpdate = useRef(false)

  useEffect(() => {
    let storedData: Store = initState

    idb.ready().then(() => {
      idb
        .iterate((value, key) => {
          storedData = { ...storedData, [key]: value }
        })
        .then(() => {
          isInternalUpdate.current = true
          setStore(storedData)
          setStoreLoaded(true)
        })
    })
  }, [])

  useEffect(() => {
    if (!isStoreLoaded)
      return // If the store is not loaded, we don't want to write to IndexedDB yet

    if (isInternalUpdate.current) {
      isInternalUpdate.current = false
      return
    }

    for (const key in store) {
      if (store[key] === undefined) {
        idb.removeItem(key)
        continue
      }
      idb.setItem(key, store[key]) // Save to local storage
    }
  }, [store]) // add isStoreLoaded as dependency

  const setState = (value: Partial<Store>) => {
    setStore({
      ...store,
      ...value,
    })
  }

  const setStoreValue = <Key extends keyof Store>(
    key: Key,
    value: Store[Key],
  ) => {
    setState({ [key]: value } as unknown as Partial<Store>)
  }

  return { store, setStore: setState, setStoreValue, isStoreLoaded }
}
