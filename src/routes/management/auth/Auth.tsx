import { Alert, Modal, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect } from 'react';
import { BiInfoCircle } from 'react-icons/bi';
import { useSearchParams } from 'react-router-dom';

function Auth() {
  const [searchParams] = useSearchParams();
  const [isOpened, { open, close }] = useDisclosure(false);

  const codeParam = searchParams.get('code');
  
  // force open modal if code is in URI
  useEffect(() => {
    if (codeParam) {
      open();
    }
  }, [codeParam]);

  return (
    <>
      <Modal 
        opened={isOpened} 
        onClose={close}
        title="Twitch Developer Authorization Code"
        size="xl"
      >
        <Alert 
          variant="light" 
          color="green" 
          title="Copy the code below and enter it in your form" 
          icon={
            <BiInfoCircle 
              size="1rem" 
              stroke={'1.5'}
            />
          }
        >
          <TextInput
            required
            label="Authorization Code"
            placeholder="Authorization Code"
            readOnly
            value={codeParam || 'Unknown'}
          />
        </Alert>
      </Modal>
    </>
  );
}

export default Auth;
