import { useEffect, useState } from 'react'

const useStorage = <T>(key: string, defaultValue?: T) : [T, (newValue: T) => void] => {
  const [value, setValue] = useState(defaultValue)

  const storageArea = chrome.storage.local

  const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
    if (changes[key]) {
      setValue(changes[key].newValue)
    }
  }

  const setStorageValue = (newValue: T) => {
    storageArea.set({ [key]: newValue })
  }

  useEffect(() => {
    storageArea.get(key)
      .then(({ [key]: value }) => setValue(value))

    storageArea.onChanged.addListener(handleStorageChange)

    return () => {
      storageArea.onChanged.removeListener(handleStorageChange)
    }
  }, [key])

  return [value, setStorageValue]
}

export default useStorage
