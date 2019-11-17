import React, { Component } from 'react';
import { Image } from 'react-native';
import { Query, QueryResult } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components/native';

import { INavigationTypes } from 'types/navigation.types';

import getTranslations from '@utils/locales';

import Box from '@shared/Box';
import Text from '@shared/Text';
import Button from '@shared/Button';

interface IProps {
  navigation: INavigationTypes;
}

const query = gql`
  {
    viewer {
      login
      avatarUrl
    }
  }
`;

class Github extends Component<IProps> {
  _goBack = () => {
    const { navigation } = this.props;

    navigation.goBack(null);
  };

  render() {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Query query={query}>
          {({ loading, error, data }: QueryResult) => {
            if (loading) return <Text>Loading...</Text>;
            if (error) return <Text>Some error happened :</Text>;

            const {
              viewer: { login, avatarUrl },
            } = data;

            return (
              <>
                <Text fontSize={4} mb={3}>
                  {getTranslations('github', 'page_title')}
                </Text>

                <SImage source={{ uri: avatarUrl }} />

                <Text fontSize={3} mt={3}>
                  {`${getTranslations(
                    'github',
                    'profil_name',
                    {
                      name: login,
                    },
                    'name'
                  )} ${login}`}
                </Text>

                <Button onPress={this._goBack}>
                  <Text mt={3}>
                    {getTranslations('github', 'navigation_back')}
                  </Text>
                </Button>
              </>
            );
          }}
        </Query>
      </Box>
    );
  }
}

const SImage = styled.Image`
  width: 100;
  height: 100;
  border-radius: 50;
`;

export default Github;