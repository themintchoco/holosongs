import { useEffect, useMemo, useState } from 'react'

import { Trans, useTranslation } from 'react-i18next'
import { useForm, Controller } from 'react-hook-form'
import { MdCheck, MdLaunch } from 'react-icons/md'
import {
  Button,
  Center,
  CircularProgress,
  Collapse,
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
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Switch,
  Text,
  Tooltip,
  VStack,
  useToast,
} from '@chakra-ui/react'

import useStorage from '../../hooks/useStorage'
import useChannelWhitelist from '../../hooks/useChannelWhitelist'
import { WHITELIST_UPDATE_INTERVAL } from '../../common/utils/channel-whitelist'
import { BrowserMessageType } from '../../common/types/BrowserMessage'
import { messageAll } from '../../common/utils/message'
import { validateKey } from '../../common/utils/api'
import { KeyValidationResultType } from '../../common/types/KeyValidationResult'

const Options = () => {
  const [t, i18n] = useTranslation('options')
  const [updatedWhitelist, setUpdatedWhitelist] = useState(false)
  const [shouldAutomaticallyUpdateWhitelist, setShouldAutomaticallyUpdateWhitelist] = useState(true)

  const toast = useToast()

  const [apiKey, setApiKey] = useStorage('apiKey', '')
  const [useApiKey, setUseApiKey] = useStorage('useApiKey', false)
  const [showDexButton, setShowDexButton] = useStorage('showDexButton', true)
  const [fadePlayedSongs, setFadePlayedSongs] = useStorage('fadePlayedSongs', false)
  const [showSongControls, setShowSongControls] = useStorage('showSongControls', true)
  const [enableWhitelist, setEnableWhitelist] = useStorage('enableWhitelist', false)

  const { whitelist, updateWhitelist, whitelistLastUpdated, isWhitelistUpdating } = useChannelWhitelist()

  const prefs = { apiKey, useApiKey, showDexButton, fadePlayedSongs, showSongControls, enableWhitelist }

  const {
    handleSubmit,
    register,
    reset,
    control,
    watch,
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

  const watchUseApiKey = watch('useApiKey')
  const watchEnableWhitelist = watch('enableWhitelist')

  const whitelistLength = useMemo(() => {
    return whitelist ? Object.keys(whitelist).length : 0
  }, [whitelist])

  useEffect(() => {
    reset(prefs)
  }, Object.values(prefs))

  const validateApiKey = async (apiKey: string) => {
    if (!dirtyFields.useApiKey && !dirtyFields.apiKey || !watchUseApiKey) return true

    const result = await validateKey(apiKey)

    switch (result.type) {
    case KeyValidationResultType.valid:
      return true
    case KeyValidationResultType.invalid:
      return result.message ?? t('apiKey.errors.invalidKey')
    case KeyValidationResultType.error:
      return result.message ?? t('apiKey.errors.serverError')
    }
  }

  const handleUpdateWhitelist = async () => {
    await updateWhitelist()
    setUpdatedWhitelist(true)
  }

  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    await i18n.changeLanguage(e.target.value)
    void messageAll({ type: BrowserMessageType.languageChanged })
  }

  const onSubmit = (newPrefs: typeof prefs) => {
    setApiKey(newPrefs.apiKey)
    setUseApiKey(newPrefs.useApiKey)
    setShowDexButton(newPrefs.showDexButton)
    setFadePlayedSongs(newPrefs.fadePlayedSongs)
    setShowSongControls(newPrefs.showSongControls)
    setEnableWhitelist(newPrefs.enableWhitelist)

    if (newPrefs.enableWhitelist) {
      void chrome.alarms.create('whitelist-updater', {
        periodInMinutes: WHITELIST_UPDATE_INTERVAL,
      })
    } else {
      void chrome.alarms.clear('whitelist-updater')
    }

    toast({
      title: t('savedChanges'),
      status: 'success',
      isClosable: true,
    })
  }

  if (
    shouldAutomaticallyUpdateWhitelist &&
    watchEnableWhitelist &&
    !isWhitelistUpdating &&
    whitelistLastUpdated !== undefined && (
      whitelistLastUpdated === null ||
      Date.now() - whitelistLastUpdated.getTime() > WHITELIST_UPDATE_INTERVAL * 60 * 1000
    )
  ) {
    setShouldAutomaticallyUpdateWhitelist(false)
    void handleUpdateWhitelist()
  }

  return Object.values(prefs).some((v) => v === undefined) ? (
    <Center>
      <CircularProgress isIndeterminate />
    </Center>
  ) : (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={4} align='stretch'>
        <VStack spacing={3}>
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

          <FormControl>
            <Flex>
              <FormLabel htmlFor='fadePlayedSongs'>{t('fadePlayedSongs.label')}</FormLabel>
              <Spacer />
              <Controller
                name='fadePlayedSongs'
                control={control}
                render={({ field: { onChange, onBlur, value, name, ref } }) => (
                  <Switch id='fadePlayedSongs' onChange={onChange} onBlur={onBlur} isChecked={value} name={name} ref={ref} />
                )}
              />
            </Flex>
          </FormControl>
        </VStack>

        <Flex align='center' gap={4}>
          <Text whiteSpace='nowrap' textTransform='uppercase'>{t('advanced.label')}</Text>
          <Divider />
        </Flex>

        <VStack spacing={3} align='stretch'>
          <FormControl>
            <Flex>
              <FormLabel htmlFor='useApiKey'>{t('useApiKey.label')}</FormLabel>
              <Spacer />
              <Controller
                name='useApiKey'
                control={control}
                render={({ field: { onChange, onBlur, value, name, ref } }) => (
                  <Switch id='useApiKey' onChange={onChange} onBlur={onBlur} isChecked={value} name={name} ref={ref} />
                )}
              />
            </Flex>
            <FormHelperText m={0}>
              { t('useApiKey.helper') }
            </FormHelperText>
          </FormControl>

          <Collapse
            in={watchUseApiKey}
            style={{flexGrow: 1}}>
            <FormControl isInvalid={!!errors.apiKey} isRequired={watchUseApiKey}>
              <FormLabel htmlFor='apiKey'>{t('apiKey.label')}</FormLabel>
              <Input id='apiKey' type='text' {...register('apiKey', {
                required: watchUseApiKey ? t('apiKey.errors.required') : undefined,
                setValueAs: (v: string) => v.trim(),
                validate: (v: string | undefined) => v === undefined ? false : validateApiKey(v),
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
          </Collapse>
        </VStack>

        <VStack spacing={3} align='stretch'>
          <FormControl>
            <Flex>
              <FormLabel htmlFor='enableWhitelist'>{t('enableWhitelist.label')}</FormLabel>
              <Spacer />
              <Controller
                name='enableWhitelist'
                control={control}
                render={({ field: { onChange, onBlur, value, name, ref } }) => (
                  <Switch id='enableWhitelist' onChange={onChange} onBlur={onBlur} isChecked={value} name={name} ref={ref} />
                )}
              />
            </Flex>
            <FormHelperText m={0}>
              { t('enableWhitelist.helper') }
            </FormHelperText>
          </FormControl>

          <Flex style={{marginInline: '-20px'}}>
            <Collapse
              in={watchEnableWhitelist}
              style={{flexGrow: 1}}>
              <VStack align='stretch'>
                <Stat px='20px'>
                  <StatLabel>{t('whitelistStat.label')}</StatLabel>
                  <StatNumber>{t('whitelistStat.length', { length: whitelistLength })}</StatNumber>
                  <StatHelpText>
                    { whitelistLastUpdated ? t('whitelistStat.lastUpdated', { whitelistLastUpdated }) : t('whitelistStat.lastUpdatedNever')}
                  </StatHelpText>
                </Stat>

                <Button
                  colorScheme='blue'
                  variant='ghost'
                  px='20px'
                  borderRadius={0}
                  justifyContent='space-between'
                  isLoading={isWhitelistUpdating}
                  isDisabled={updatedWhitelist}
                  spinnerPlacement='end'
                  rightIcon={!isWhitelistUpdating && updatedWhitelist ? <MdCheck /> : undefined}
                  loadingText={t('updateChannels.title.loading')}
                  onClick={handleUpdateWhitelist}>
                  { !isWhitelistUpdating && updatedWhitelist ? t('updateChannels.title.success') : t('updateChannels.title.default') }
                </Button>
              </VStack>
            </Collapse>
          </Flex>
        </VStack>
      </VStack>

      <Flex
        mt={4}
        py={4}
        mx='-20px'
        px='20px'
        position='sticky'
        bottom={0}
        bgColor='Background'
        borderTop='1px'
        borderColor='inherit'>
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
