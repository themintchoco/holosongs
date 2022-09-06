import { useEffect } from 'react'

import { useForm, Controller } from 'react-hook-form'
import { MdLaunch } from 'react-icons/md'
import {
  Alert,
  AlertIcon,
  AlertTitle,
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
  Spacer,
  Switch,
  Tooltip,
  VStack,
} from '@chakra-ui/react'

import useStorage from '../../hooks/useStorage'

const Options = () => {
  const [apiKey, setApiKey] = useStorage('apiKey', '')
  const [showDexButton, setShowDexButton] = useStorage('showDexButton', true)
  const [showSongControls, setShowSongControls] = useStorage('showSongControls', true)

  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: {
      isValid,
      isSubmitting,
      isSubmitted,
      errors,
      dirtyFields,
      isDirty
    }
  } = useForm({
    defaultValues: { apiKey, showDexButton, showSongControls },
    reValidateMode: 'onSubmit',
  })

  useEffect(() => {
    reset({ apiKey, showDexButton, showSongControls }, { keepIsSubmitted: true })
  }, [apiKey, showDexButton, showSongControls])

  const validateApiKey = (apiKey: string) => {  
    if (!dirtyFields.apiKey) return true

    return fetch('https://holodex.net/api/v2/videos', {
      headers: {
        'X-APIKEY': apiKey
      }
    }).then((r) => {
      if (r.status >= 500) return 'There was an error. Please try again at a later time.'
      if (r.status >= 400) return 'Invalid API Key. Please ensure that it has been entered correctly.'

      return true
    }).catch(() => {
      return 'Error validating key. Please try again at a later time.'
    })
  }

  const onSubmit = async (prefs) => {
    setApiKey(prefs.apiKey)
    setShowDexButton(prefs.showDexButton)
    setShowSongControls(prefs.showSongControls)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {
        isSubmitted && (
          <Alert status='success' variant='left-accent' mb='1em'>
            <AlertIcon />
            <AlertTitle>Saved changes</AlertTitle>
          </Alert>
        )
      }

      <FormControl isInvalid={!isValid} isRequired>
        <FormLabel htmlFor='apiKey'>API Key</FormLabel>
        <Input id='apiKey' type='text' {...register('apiKey', {
          required: 'API Key is required.',
          setValueAs: (v) => v.trim(),
          validate: validateApiKey,
        })} />
        <FormHelperText>
          Get your API key from your{' '}
          <Link href='https://holodex.net/login' isExternal>
            account settings <Icon as={MdLaunch} verticalAlign='middle' />
          </Link>
        </FormHelperText>
        <FormErrorMessage>
          { errors.apiKey?.message }
        </FormErrorMessage>
      </FormControl>

      <Divider my='2em' />

      <VStack spacing='1.5em'>
        <FormControl>
          <Flex>
            <FormLabel htmlFor='showSongControls'>Show song controls</FormLabel>
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
            <FormLabel htmlFor='showDexButton'>Show Holodex button in player</FormLabel>
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
        <Spacer />
        <Tooltip label='No changes to save' isDisabled={isDirty} shouldWrapChildren>
          <Button colorScheme='blue' isDisabled={!isDirty} isLoading={isSubmitting} type='submit'>Save</Button>
        </Tooltip>
      </Flex>
    </form>
  )
}

export default Options
