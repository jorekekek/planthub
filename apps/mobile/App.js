import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import PlantDetailsScreen from "./src/screens/PlantDetailsScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import EditPlantScreen from "./src/screens/EditPlantScreen";
import { login } from "./src/api/client";
import { getToken, saveToken } from "./src/auth/auth";

import HomeScreen from "./src/screens/HomeScreen";
import PlantsScreen from "./src/screens/PlantsScreen";
import AlertsScreen from "./src/screens/AlertsScreen";
import GardenScreen from "./src/screens/GardenScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import AddPlantScreen from "./src/screens/AddPlantScreen";

const Tab = createBottomTabNavigator();
const PlantsStack = createNativeStackNavigator();

function PlantsNavigator() {
  return (
    <PlantsStack.Navigator>
      <PlantsStack.Screen
        name="PlantsHome"
        component={PlantsScreen}
        options={{
          headerShown: false,
        }}
      />

      <PlantsStack.Screen
        name="AddPlant"
        component={AddPlantScreen}
        options={{
          title: "Add Plant",
          headerBackTitle: "Back",
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
          tabBarLabel: "Home",
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
          tabBarLabel: "Alerts",
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
          tabBarLabel: "Plants",
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
          tabBarLabel: "Garden",
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
          tabBarLabel: "Settings",
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

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkAuthentication() {
      try {
        const token = await getToken();
        setAuthenticated(Boolean(token));
      } catch (error) {
        console.error("AUTH CHECK ERROR:", error);
        setAuthenticated(false);
      } finally {
        setCheckingAuth(false);
      }
    }

    checkAuthentication();
  }, []);

  async function handleLogin() {
    try {
      setLoading(true);

      const result = await login(email, password);

      await saveToken(result.token);

      setAuthenticated(true);
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

  if (checkingAuth) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>
          Checking your session...
        </Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  if (authenticated) {
    return <MainApp />;
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