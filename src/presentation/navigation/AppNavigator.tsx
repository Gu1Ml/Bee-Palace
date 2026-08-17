import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import TasksScreen from '../screens/TasksScreen';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Tasks: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: '#2196F3' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: 'Criar Conta' }}
        />
        <Stack.Screen
          name="Tasks"
          component={TasksScreen}
          options={{
            title: 'Minhas Tarefas',
            headerLeft: () => null, // sem botão voltar
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}