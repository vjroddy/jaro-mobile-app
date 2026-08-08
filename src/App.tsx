import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeFirebase } from './firebase/config';
import AuthScreen from './screens/AuthScreen';
import FeedScreen from './screens/FeedScreen';
import CreatePostScreen from './screens/CreatePostScreen';
import ProfileScreen from './screens/ProfileScreen';
import SubscriptionScreen from './screens/SubscriptionScreen';
import { registerForPushNotificationsAsync } from './notifications';

initializeFirebase();

const Stack = createNativeStackNavigator();

export default function App() {
  React.useEffect(() => {
    // Register push notifications (logs token)
    registerForPushNotificationsAsync();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Feed" component={FeedScreen} />
        <Stack.Screen name="Create" component={CreatePostScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Subscribe" component={SubscriptionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
