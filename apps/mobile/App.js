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

import { login } from "./src/api/client";
import { getToken, saveToken } from "./src/auth/auth";
import HomeScreen from "./src/screens/HomeScreen";

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
    return <HomeScreen />;
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
