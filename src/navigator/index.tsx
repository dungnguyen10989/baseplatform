import React, { memo, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import firebaseDB from '@react-native-firebase/database';
import { NavigationContainer } from '@react-navigation/native';

import Main from '@containers/main';
import { _mFeatureSchema } from '@database/schemas';
import { Overlay } from '@containers/_nav';
import { containerNav } from './helper';
import { ROUTES } from './routes';

const Stack = createStackNavigator();

const MainStackScreen = memo(() => {
  const database = useDatabase();
  useEffect(() => {
    firebaseDB()
      .ref('/')
      .once('value')
      .then((snapshot) => {
        const data = snapshot.val();
        const { navigator } = data;
        _mFeatureSchema.addRecord(database, navigator);
      });
  }, []);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ROUTES.main}
        component={Main}
        options={(p) => {
          return {
            header: () => null,
          };
        }}
      />
    </Stack.Navigator>
  );
});

const RootStackScreen = memo(() => {
  return (
    <NavigationContainer ref={containerNav}>
      <Stack.Navigator
        headerMode="none"
        mode="modal"
        screenOptions={{
          cardStyleInterpolator: ({ current: { progress } }) => ({
            cardStyle: {
              opacity: progress.interpolate({
                inputRange: [0, 0.5, 0.9, 1],
                outputRange: [0, 0.25, 0.7, 1],
              }),
            },
            overlayStyle: {
              opacity: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.5],
                extrapolate: 'clamp',
              }),
            },
          }),
          gestureEnabled: false,
          cardOverlayEnabled: true,
          cardStyle: {
            backgroundColor: 'transparent',
          },
        }}>
        <Stack.Screen name={ROUTES._mainStack} component={MainStackScreen} />
        <Stack.Screen name={ROUTES._overlay} component={Overlay} />
      </Stack.Navigator>
    </NavigationContainer>
  );
});

export default RootStackScreen;
