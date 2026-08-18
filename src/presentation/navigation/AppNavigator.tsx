import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import CreateTaskScreen from "../screens/CreateTaskScreen";
import EditTaskScreen from "../screens/EditTaskScreen"; // ✅ NOVO
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import TaskDetailScreen from "../screens/TaskDetailScreen"; // ✅ NOVO
import TasksScreen from "../screens/TasksScreen";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Tasks: undefined;
  CreateTask: undefined;
  TaskDetail: { taskId: string }; // ✅ NOVO
  EditTask: { taskId: string }; // ✅ NOVO
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: "#2196F3" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
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
          options={{ title: "Criar Conta" }}
        />
        <Stack.Screen
          name="Tasks"
          component={TasksScreen}
          options={{
            title: "Minhas Tarefas",
            headerLeft: () => null,
          }}
        />
        <Stack.Screen
          name="CreateTask"
          component={CreateTaskScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="TaskDetail"
          component={TaskDetailScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="EditTask"
          component={EditTaskScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
