import React, { useCallback, ReactElement } from 'react';

import { OtherPageScreenNavigationProp } from '@routes/routes.types';
import getTranslations from '@utils/locales';

import Button from '@shared/Button';
import { Flex, Title, Text } from '@shared/primitives';
import SafeView from '@shared/SafeView';

type Props = {
  navigation: OtherPageScreenNavigationProp;
};

const OtherPage = ({ navigation }: Props): ReactElement => {
  const goBack = useCallback(() => navigation.goBack(), []);

  return (
    <SafeView>
      <Flex justifyContent="center" alignItems="center">
        <Title fontWeight={600} testID="otherPage_title" variant="large">
          {getTranslations('otherPage', 'page_title')}
        </Title>

        <Button
          testID="back_button"
          onPress={goBack}
          bg="grey"
          py={5}
          px={15}
          alignItems="center"
          mt={20}
          borderRadius="medium"
        >
          <Text>{getTranslations('otherPage', 'navigation_back')}</Text>
        </Button>
      </Flex>
    </SafeView>
  );
};

export default OtherPage;