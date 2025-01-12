import { 
  Alert,
  Box,
  Button,
  Code,
  Group,
  List,
  Modal,
  Space,
  TextInput,
} from '@mantine/core';
import { Settings as Interface_Settings } from './useGetSettings';
import { useForm } from '@mantine/form';
import classes from '../../../css/Nav.module.css';
import { BiCheck, BiError, BiInfoCircle } from 'react-icons/bi';
import { useContext, useEffect, useState } from 'react';
import { theme } from '../../../theme';
import { useNavigate, useSearchParams } from 'react-router-dom';
import WsContext from '../../../wsContext';

interface Props {
  settings?: Interface_Settings,
  isOpened: boolean,
  close: () => void,
}

function Settings(props: Props) {
  const WsConnection = useContext(WsContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const RegistrationForm = useForm({
    initialValues: {
      listener_client_id: props?.settings?.listener_client_id || window.localStorage.getItem('listener_client_id') || '',
      listener_secret: props?.settings?.listener_secret || window.localStorage.getItem('listener_secret') || '',
      listener_user_name: props?.settings?.listener_user_name || window.localStorage.getItem('listener_user_name') || '',
      channel_name: props?.settings?.channel_name || window.localStorage.getItem('channel_name') || '',
    },

    validate: {
      listener_client_id: (value) => value ? null : 'Required',
      listener_secret: (value) => value ? null : 'Required',
      listener_user_name: (value) => value ? null : 'Required',
      channel_name: (value) => value ? null : 'Required',
    },
  });

  const [settingsStore, setSettingsStore] = useState<Interface_Settings>({
    listener_auth_code: props?.settings?.listener_auth_code || window.localStorage.getItem('listener_auth_code') || '',
    listener_client_id: props?.settings?.listener_client_id || window.localStorage.getItem('listener_client_id') || '',
    listener_secret: props?.settings?.listener_secret || window.localStorage.getItem('listener_secret') || '',
    listener_user_name: props?.settings?.listener_user_name || window.localStorage.getItem('listener_user_name') || '',
    channel_name: props?.settings?.channel_name || window.localStorage.getItem('channel_name') || '',
  });
  const [isGeneratedAuthCodeSubmitted, setIsGeneratedAuthCodeSubmitted] = useState(searchParams.get('code') ? true : false);
  const [isSubmitted, SetIsSubmitted] = useState(props?.settings?.is_connected ? true : false);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');

  useEffect(() => {
    if (props?.settings) {
      setSettingsStore({
        listener_auth_code: props?.settings?.listener_auth_code,
        listener_client_id: props?.settings?.listener_client_id,
        listener_secret: props?.settings?.listener_secret,
        listener_user_name: props?.settings?.listener_user_name,
        channel_name: props?.settings?.channel_name,
      });

      if (props?.settings?.is_connected) {
        SetIsSubmitted(true);
      }
    } else {
      setSettingsStore({
        listener_auth_code: '',
        listener_client_id: '',
        listener_secret: '',
        listener_user_name: '',
        channel_name: '',
      });
      SetIsSubmitted(false);
    }
  }, [props?.settings]); 

  useEffect(() => {
    if (props.isOpened) {
      if (isSubmitted && WsConnection?.isConnected && WsConnection?.connectedSocket) {
        try {
          WsConnection?.connectedSocket.send(JSON.stringify({ 
            message: 'status',
          }));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [props.isOpened, isSubmitted, WsConnection?.isConnected]);

  return (
    <Modal 
      opened={props.isOpened} 
      onClose={() => {
        if (isSubmitted) {
          setWarning('');
          props.close();
        } else {
          return null;
        }
      }}
      title="Settings"
      size="xl"
    >

      {!props?.settings && (
        <Alert 
          className={classes['margin-bottom-1']}
          variant="light" 
          color="indigo" 
          title="Register Your Application" 
          icon={
            <BiInfoCircle 
              size="1rem" 
              stroke={'1.5'}
            />
          }
        >
          <div style={{ display: 'flex' }}>
            Log into the
            <Space w="xs" />
            <a href="https://dev.twitch.tv/console/apps/" target="_blank">Twitch Developer Console</a>
            <Space w="xs" />
            and
            <Space w="xs" />
            <b>Register Your Application</b>. Use the following values:
          </div>
          <Space h="xs" />
          <List withPadding>
            <List.Item>Name: Health Bar Overlay</List.Item>
            <List.Item>{'OAuth Redirect URLs: ' + window.location.origin + '/auth'}</List.Item>
            <List.Item>Category: Chat Bot</List.Item>
          </List>
          <Space h="xs" />
          <div style={{ display: 'flex' }}>
            After choosing to
            <Space w="xs" />
            <b>Create</b>, 
            click
            <Space w="xs" />
            <b>Manage</b>
            <Space w="xs" />
            and create a
            <Space w="xs" />
            <b>New Secret</b>.
          </div>
          <Space h="xs" />
          <div style={{ display: 'flex' }}>
            Copy the
            <Space w="xs" />
            <Code>Client ID</Code>
            <Space w="xs" />
            and
            <Space w="xs" />
            <Code>Secret</Code>
            <Space w="xs" />
            for use with this form.
          </div>
        </Alert>
      )}
      
      <Box 
        mx="auto" 
        className={classes['margin-bottom-2']}
      >
        <form onSubmit={RegistrationForm.onSubmit((values) => {
          window.localStorage.setItem('channel_name', values.channel_name);
          window.localStorage.setItem('listener_user_name', values.listener_user_name);
          window.localStorage.setItem('listener_client_id', values.listener_client_id);
          window.localStorage.setItem('listener_secret', values.listener_secret);

          setSettingsStore({
            listener_auth_code: '',
            is_connected: false,
            ...values,
          });
          setIsGeneratedAuthCodeSubmitted(true);
        })}>
          <TextInput
            className={classes['margin-bottom-1']}
            required
            label="Channel Name"
            placeholder="Your Twitch Username"
            {...RegistrationForm.getInputProps('channel_name')}
            // value={settingsStore?.channel_name || props?.settings?.channel_name}
          />

          <TextInput
            className={classes['margin-bottom-1']}
            required
            label="Bot Name"
            placeholder="Health Bar Listener"
            {...RegistrationForm.getInputProps('listener_user_name')}
            // value={settingsStore?.listener_user_name || props?.settings?.listener_user_name}
          />

          <TextInput
            className={classes['margin-bottom-1']}
            required
            label="Client ID"
            placeholder="Client ID generated in the Twitch Developer Console"
            {...RegistrationForm.getInputProps('listener_client_id')}
            // value={settingsStore?.listener_client_id || props?.settings?.listener_client_id}
          />

          <TextInput
            className={classes['margin-bottom-1']}
            required
            label="Secret"
            placeholder="Secret generated in the Twitch Developer Console"
            {...RegistrationForm.getInputProps('listener_secret')}
            // value={settingsStore?.listener_secret || props?.settings?.listener_secret}
          />

          {!props?.settings?.listener_auth_code && (
            <Group justify="flex-end" mt="md">
              <Button 
                color={theme.colors.indigo[5]} 
                type="submit"
              >
                Generate Auth Link
              </Button>
            </Group>
          )}

        </form>
      </Box>

      {!props?.settings?.listener_auth_code && isGeneratedAuthCodeSubmitted && (
        <Alert 
          className={classes['margin-bottom-1']}
          variant="light" 
          color="indigo" 
          title="Authorize Your Application" 
          icon={
            <BiInfoCircle 
              size="1rem" 
              stroke={'1.5'}
            />
          }
        >
          <div>
            Click the generated link below and choose to authorize the app.
            <Space h="xs" />
            <a href={
                'https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=' + 
                settingsStore.listener_client_id + 
                '&redirect_uri=' + 
                window.location.origin + '/auth' + 
                '&scope=channel:read:redemptions+moderator:read:chatters+chat:read&state=123'
              } 
              target="_blank"
            >
              {
                'https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=' + 
                settingsStore.listener_client_id + 
                '&redirect_uri=' + 
                window.location.origin + '/auth' + 
                '&scope=channel:read:redemptions+moderator:read:chatters+chat:read&state=123'
              }
            </a>
            <Space h="xs" />
          </div>
          {/* <div style={{ display: 'flex' }}>
            The Auth Code is the
            <Space w="xs" />
            <Code>code=</Code>
            <Space w="xs" />
            parameter
            <Space w="xs" />
            of the URL in your browser upon redirect after authorization.
          </div> */}
        </Alert>
      )}

      {(props?.settings?.listener_auth_code || settingsStore.listener_auth_code || isGeneratedAuthCodeSubmitted) && (
        <Box mx="auto">
          {error && (
            <Alert 
              className={classes['margin-bottom-1']}
              variant="light" 
              color="red" 
              title="Error" 
              icon={
                <BiError 
                  size="1rem" 
                  stroke={'1.5'}
                />
              }
            >
              {error}
            </Alert>
          )}

          {searchParams.get('code') && (
            <Alert 
              mb='md'
              mt='lg'
              variant="light" 
              color="green" 
              title="Success" 
              icon={
                <BiCheck 
                  size="1rem" 
                  stroke={'1.5'}
                />
              }
            >
                Authorization code acquired!
            </Alert>
          )}

          {!isSubmitted && (settingsStore?.listener_auth_code || props?.settings?.listener_auth_code || searchParams.get('code')) && (
            <>
              <TextInput
                className={classes['margin-bottom-1']}
                required
                autoFocus
                label="Auth Code"
                placeholder="Auth Code generated by the authorization redirect URL"
                value={settingsStore?.listener_auth_code || props?.settings?.listener_auth_code || searchParams.get('code') || ''}
                onChange={(e) => {
                  setSettingsStore((prev) => ({
                    ...prev,
                    listener_auth_code: e.target.value,
                    is_connected: true,
                  }));
                }}
              />

              <Group justify="flex-end" mt="md">
                <Button
                  color={theme.colors.green[8]}
                  onClick={async (e) => {
                    e.preventDefault();
                    if (!(settingsStore?.listener_auth_code || props?.settings?.listener_auth_code || searchParams.get('code') || '')) {
                      return setError('Auth Code is required.');
                    }

                    try {
                      const result = await fetch(
                        '/api/settings',
                        { 
                          method: 'PUT',
                          headers: {
                            "Content-type": "application/json",
                          },
                          body: JSON.stringify({
                            listener_client_id: settingsStore?.listener_client_id || props?.settings?.listener_client_id || window.localStorage.getItem('listener_client_id'),
                            listener_secret: settingsStore?.listener_secret || props?.settings?.listener_secret || window.localStorage.getItem('listener_secret') || '',
                            listener_user_name: settingsStore?.listener_user_name || props?.settings?.listener_user_name || window.localStorage.getItem('listener_user_name') || '',
                            channel_name: settingsStore?.channel_name || props?.settings?.channel_name || window.localStorage.getItem('channel_name') || '',
                            redirect_uri: window.location.origin + '/auth',
                            listener_auth_code: settingsStore?.listener_auth_code || props?.settings?.listener_auth_code || searchParams.get('code') || '',
                          }),
                        },
                      );

                      if (result) {
                        const responseJson = await result.json();
                        if (responseJson.success) {
                          setError('');
                          SetIsSubmitted(true);
                          searchParams.delete('code');
                          setSearchParams(searchParams);
                          navigate(0);
                        } 
                        // throw true;
                      }
                    } catch (e) {

                      console.log(e);
                      setError('Could not submit settings');
                    }
                  }}
                >
                  Submit
                </Button>
              </Group>
            </>
          )}
        </Box>
      )}

      {isSubmitted && (
        <>
          {warning && (
            <Alert 
              className={classes['margin-bottom-1']}
              variant="light" 
              color="yellow" 
              title="Warning" 
              icon={
                <BiError 
                  size="1rem" 
                  stroke={'1.5'}
                />
              }
            >
              {warning}
            </Alert>
          )}

          <Group justify="flex-end" mt="md">
            {WsConnection?.isConnected ? (
              <Button 
                disabled={warning ? true : false}
                color="yellow" 
                onClick={(e) => {
                  e.preventDefault();
                  if (WsConnection?.isConnected && WsConnection?.connectedSocket) {
                    try {
                      WsConnection?.connectedSocket.send(JSON.stringify({ 
                        message: 'unsubscribe',
                        data: 'twitch-chat',
                      }));
                    } catch (e) {
                      console.error(e);
                    }
                  }
                }}
              >
                Disconnect
              </Button>
            ) : (
              <Button 
                disabled={warning ? true : false}
                color='indigo'
                onClick={(e) => {
                  e.preventDefault();
                  if (!WsConnection?.isConnected && WsConnection?.connectedSocket) {
                    try {
                      WsConnection?.connectedSocket.send(JSON.stringify({ 
                        message: 'subscribe',
                        data: 'twitch-chat',
                        channels: ['update'],
                      }));
                    } catch (e) {
                      console.error(e);
                    }
                  }
                }}
              >
                Connect
              </Button>
            )}

            <Button 
              disabled={warning ? true : false}
              variant="gradient"
              gradient={{ from: theme.colors.indigo[9], to: 'red', deg: 90 }}
              onClick={(e) => {
                e.preventDefault();
                setWarning('This will disable any active connections between the bot and Twitch chat. In order to completely remove this information, you must unregister the application in the Twitch Developer Console.');
              }}
            >
              {warning ? 'Are you sure?' : 'Delete'}
            </Button>
            {warning && (
              <Button 
                variant="gradient"
                gradient={{ from: theme.colors.yellow[9], to: 'red', deg: 90 }}
                onClick={async (e) => {
                  e.preventDefault();

                  try {
                    const result = await fetch(
                      '/api/settings',
                      { 
                        method: 'DELETE',
                      },
                    );
                    if (result) {
                      const responseJson = await result.json();
                      if (responseJson.success) {
                        setSettingsStore({
                          listener_auth_code: '',
                          listener_client_id: '',
                          listener_secret: '',
                          listener_user_name: '',
                          channel_name: '',
                        });
                        setIsGeneratedAuthCodeSubmitted(false);
                        SetIsSubmitted(false);
                        setError('');
                        setWarning('');

                        searchParams.delete('code');
                        setSearchParams(searchParams);

                        window.localStorage.removeItem('channel_name');
                        window.localStorage.removeItem('listener_user_name');
                        window.localStorage.removeItem('listener_secret');
                        window.localStorage.removeItem('listener_client_id');

                        navigate(0);
                      } 
                    }
                  } catch (e) {
                    console.log(e);
                    setError('Could not submit settings');
                  }
                }}
              >
                Delete
              </Button>
            )}
          </Group>
        </>
      )}

    </Modal>
  );
}

export default Settings;
