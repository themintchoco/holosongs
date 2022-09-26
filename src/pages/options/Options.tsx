import { useEffect, useMemo, useState } from 'react'

import { Trans, useTranslation } from 'react-i18next'
import { useForm, Controller } from 'react-hook-form'
import { MdCheck, MdLaunch } from 'react-icons/md'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
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
  Tooltip,
  VStack,
} from '@chakra-ui/react'

import useStorage from '../../hooks/useStorage'
import useChannelWhitelist from '../../hooks/useChannelWhitelist'
import { BrowserMessageType } from '../../common/types/BrowserMessage'
import { messageAll } from '../../common/utils/message'

const Options = () => {
  const [t, i18n] = useTranslation('options')
  const [showAlert, setShowAlert] = useState(false)

  const [updatingWhitelist, setUpdatingWhitelist] = useState(false)
  const [updatedWhitelist, setUpdatedWhitelist] = useState(false)

  const [apiKey, setApiKey] = useStorage('apiKey', '')
  const [showDexButton, setShowDexButton] = useStorage('showDexButton', true)
  const [showSongControls, setShowSongControls] = useStorage('showSongControls', true)
  const [enableWhitelist, setEnableWhitelist] = useStorage('enableWhitelist', false)

  const { whitelist, updateWhitelist, lastUpdated } = useChannelWhitelist()
  
  const prefs = { apiKey, showDexButton, showSongControls, enableWhitelist }

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

  const watchEnableWhitelist = watch('enableWhitelist')

  const whitelistLength = useMemo(() => {
    return Object.keys(whitelist).length
  }, [whitelist])

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

  const handleUpdateWhitelist = async () => {
    setUpdatingWhitelist(true)
    await updateWhitelist()

    setUpdatingWhitelist(false)
    setUpdatedWhitelist(true)
  }

  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    await i18n.changeLanguage(e.target.value)
    messageAll({ type: BrowserMessageType.languageChanged })
  }

  const onSubmit = async (newPrefs: typeof prefs) => {
    setApiKey(newPrefs.apiKey)
    setShowDexButton(newPrefs.showDexButton)
    setShowSongControls(newPrefs.showSongControls)
    setEnableWhitelist(newPrefs.enableWhitelist)

    setShowAlert(true)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {
        showAlert && (
          <Alert status='success' variant='left-accent' mb={2}>
            <AlertIcon />
            <AlertTitle>{t('savedChanges')}</AlertTitle>
          </Alert>
        )
      }

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

      <Divider my={4} />

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
      </VStack>

      <Divider my={4} />

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
          <FormHelperText>
            { t('enableWhitelist.helper') }
          </FormHelperText>
        </FormControl>

        <Flex style={{marginInline: '-20px'}}>
          <Collapse
            in={watchEnableWhitelist}
            style={{flexGrow: 1}}>
            <VStack align='stretch'>
              <Button
                colorScheme='blue'
                variant='ghost'
                px='20px'
                borderRadius={0}
                justifyContent='space-between'
                isLoading={updatingWhitelist}
                isDisabled={updatedWhitelist}
                spinnerPlacement='end'
                rightIcon={updatedWhitelist && <MdCheck />}
                loadingText={t('updateChannels.title.loading')}
                onClick={handleUpdateWhitelist}>
                { updatedWhitelist ? t('updateChannels.title.success') : t('updateChannels.title.default') }
              </Button>

              <Stat px='20px'>
                <StatLabel>{t('whitelistStat.label')}</StatLabel>
                <StatNumber>{t('whitelistStat.length', { length: whitelistLength })}</StatNumber>
                <StatHelpText>
                  { lastUpdated ? t('whitelistStat.lastUpdated', { lastUpdated }) : t('whitelistStat.lastUpdatedNever')}
                </StatHelpText>
              </Stat>
            </VStack>
          </Collapse>
        </Flex>
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
