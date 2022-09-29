import { useEffect, useState } from 'react'

import { Trans, useTranslation } from 'react-i18next'
import { useForm, Controller } from 'react-hook-form'
import { MdLaunch } from 'react-icons/md'
import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Icon,
  Input,
  Link,
  Select,
  Spacer,
  Switch,
  Tooltip,
  VStack,
  useToast,
} from '@chakra-ui/react'

import useStorage from '../../hooks/useStorage'
import { BrowserMessageType } from '../../common/types/BrowserMessage'
import { messageAll } from '../../common/utils/message'

const Options = () => {
  const [t, i18n] = useTranslation('options')
  const toast = useToast()

  const [apiKey, setApiKey] = useStorage('apiKey', '')
  const [showDexButton, setShowDexButton] = useStorage('showDexButton', true)
  const [showSongControls, setShowSongControls] = useStorage('showSongControls', true)

  const prefs = { apiKey, showDexButton, showSongControls }

  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: {
      isDirty,
      dirtyFields,
      isSubmitting,
      errors,
    },
  } = useForm({
    defaultValues: prefs,
    reValidateMode: 'onSubmit',
  })

  useEffect(() => {
    reset(prefs)
  }, Object.values(prefs))

  const validateApiKey = (apiKey: string) => {
    if (!dirtyFields.apiKey) return true

    return fetch('https://holodex.net/api/v2/videos', {
      headers: {
        'X-APIKEY': apiKey
      }
    }).then((r) => {
      if (r.status >= 500) throw new Error(t('apiKey.errors.serverError'))
      if (r.status >= 400) throw new Error(t('apiKey.errors.invalidKey'))

      return true
    }).catch((e) => {
      return e.message ?? t('apiKey.errors.serverError')
    })
  }

  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    await i18n.changeLanguage(e.target.value)
    messageAll({ type: BrowserMessageType.languageChanged })
  }

  const onSubmit = async (newPrefs: typeof prefs) => {
    setApiKey(newPrefs.apiKey)
    setShowDexButton(newPrefs.showDexButton)
    setShowSongControls(newPrefs.showSongControls)

    toast({
      title: t('savedChanges'),
      status: 'success',
      isClosable: true,
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={!!errors.apiKey} isRequired>
        <FormLabel htmlFor='apiKey'>{t('apiKey.label')}</FormLabel>
        <Input id='apiKey' type='text' {...register('apiKey', {
          required: t('apiKey.errors.required'),
          setValueAs: (v) => v.trim(),
          validate: validateApiKey,
        })} />
        <FormErrorMessage>
          { errors.apiKey?.message }
        </FormErrorMessage>
        <FormHelperText>
          <Trans i18nKey='options:apiKey.helper'>
            Get your API key from your
            <Link href='https://holodex.net/login' isExternal>
              account settings <Icon as={MdLaunch} verticalAlign='middle' />
            </Link>
          </Trans>
        </FormHelperText>
      </FormControl>

      <Divider my='2em' />

      <VStack spacing='1.5em'>
        <FormControl>
          <Flex>
            <FormLabel htmlFor='showSongControls'>{t('showSongControls.label')}</FormLabel>
            <Spacer />
            <Controller
              name='showSongControls'
              control={control}
              render={({ field: { onChange, onBlur, value, name, ref } }) => (
                <Switch id='showSongControls' onChange={onChange} onBlur={onBlur} isChecked={value} name={name} ref={ref} />
              )}
            />
          </Flex>
        </FormControl>

        <FormControl>
          <Flex>
            <FormLabel htmlFor='showDexButton'>{t('showDexButton.label')}</FormLabel>
            <Spacer />
            <Controller
              name='showDexButton'
              control={control}
              render={({ field: { onChange, onBlur, value, name, ref } }) => (
                <Switch id='showDexButton' onChange={onChange} onBlur={onBlur} isChecked={value} name={name} ref={ref} />
              )}
            />
          </Flex>
        </FormControl>
      </VStack>

      <Divider my='2em' />

      <Flex>
        <Select variant='filled' onChange={handleLanguageChange} defaultValue={i18n.language} display='inline-block' width='auto'>
          <option value='en-US'>English</option>
          <option value='ja-JP'>日本語</option>
          <option value='zh-CN'>中文（简体）</option>
          <option value='zh-TW'>中文（繁體）</option>
        </Select>

        <Spacer />

        <Tooltip label={t('submit.noChanges')} isDisabled={isDirty} shouldWrapChildren>
          <Button colorScheme='blue' isDisabled={!isDirty} isLoading={isSubmitting} type='submit'>{t('submit.title')}</Button>
        </Tooltip>
      </Flex>
    </form>
  )
}

export default Options
