import { useEffect, useState } from 'react'

const useStorage = <T>(key: string, defaultValue?: T) : [T | undefined, (newValue: T | undefined) => void] => {
  const [value, setValue] = useState<T>()

  const storageArea = chrome.storage.local

  const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
    if (changes[key]) {
      setValue(changes[key].newValue as T)
    }
  }

  const setStorageValue = (newValue: T | undefined) => {
    return newValue === undefined ? storageArea.remove(key) : storageArea.set({ [key]: newValue })
  }

  useEffect(() => {
    void storageArea.get(key)
      .then(({ [key]: value }) => setValue(value === undefined ? defaultValue : value as T))

    storageArea.onChanged.addListener(handleStorageChange)

    return () => {
      storageArea.onChanged.removeListener(handleStorageChange)
    }
  }, [key])

  return [value, setStorageValue]
}

export default useStorage
