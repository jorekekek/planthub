import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

import { login as loginRequest } from "./src/api/client";
import {
  useAuth,
  AuthProvider,
} from "./src/context/AuthContext";

import HomeScreen from "./src/screens/HomeScreen";
import PlantsScreen from "./src/screens/PlantsScreen";
import AlertsScreen from "./src/screens/AlertsScreen";
import GardenScreen from "./src/screens/GardenScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import AddPlantScreen from "./src/screens/AddPlantScreen";
import PlantDetailsScreen from "./src/screens/PlantDetailsScreen";
import EditPlantScreen from "./src/screens/EditPlantScreen";

const Tab = createBottomTabNavigator();
const PlantsStack = createNativeStackNavigator();

function PlantsNavigator() {
  return (
    <PlantsStack.Navigator>
      <PlantsStack.Screen
        name="PlantsHome"
        component={PlantsScreen}
        options={{ headerShown: false }}
      />

      <PlantsStack.Screen
        name="AddPlant"
        component={AddPlantScreen}
        options={{
          title: "Add Plant",
        }}
      />

      <PlantsStack.Screen
        name="PlantDetails"
        component={PlantDetailsScreen}
        options={{
          title: "Plant Details",
        }}
      />

      <PlantsStack.Screen
        name="EditPlant"
        component={EditPlantScreen}
        options={{
          title: "Edit Plant",
        }}
      />
    </PlantsStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2f7d46",
        tabBarInactiveTintColor: "#9aa49d",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="home-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Alerts"
        component={AlertsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="notifications-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Plants"
        component={PlantsNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="leaf-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Garden"
        component={GardenScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="flower-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="settings-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function MainApp() {
  return (
    <NavigationContainer>
      <MainTabs />
    </NavigationContainer>
  );
}

function LoginScreen() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    try {
      setLoading(true);

      const result = await login(email, password);

      setPassword("");

      Alert.alert(
        "Login successful",
        `Welcome, ${result.user.firstName}!`,
      );
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      Alert.alert(
        "Login failed",
        error instanceof Error
          ? error.message
          : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PlantHub</Text>

      <Text style={styles.subtitle}>
        Login to your account
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button
          title="Login"
          onPress={handleLogin}
        />
      )}

      <StatusBar style="auto" />
    </View>
  );
}

function Root() {
  const {
    authenticated,
    checkingAuth,
  } = useAuth();

  if (checkingAuth) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Checking your session...
        </Text>
      </View>
    );
  }

  return authenticated ? (
    <MainApp />
  ) : (
    <LoginScreen />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Root />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "stretch",
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },

  title: {
    fontSize: 36,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
});