import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useAuth } from "../context/AuthContext";

export default function SettingsScreen() {
  const { logout } = useAuth();

function handleLogout() {
  if (Platform.OS === "web") {
    const confirmed = window.confirm(
      "Are you sure you want to log out of PlantHub?",
    );

    if (!confirmed) {
      return;
    }

    logout().catch((error) => {
      console.error("LOGOUT ERROR:", error);
      window.alert("Unable to log out. Please try again.");
    });

    return;
  }

  Alert.alert(
    "Log out?",
    "Are you sure you want to log out of PlantHub?",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            console.error("LOGOUT ERROR:", error);
            Alert.alert(
              "Logout failed",
              "Unable to log out. Please try again.",
            );
          }
        },
      },
    ],
  );
}
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <Text style={styles.subtitle}>
        Manage your PlantHub account.
      </Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Account
        </Text>

        <Text style={styles.info}>
          Your PlantHub session is stored securely for
          authentication.
        </Text>
      </View>

     <Pressable
  style={styles.logoutButton}
  onPress={handleLogout}
>
  <Text style={styles.logoutText}>
    Log Out
  </Text>
</Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 55,
    backgroundColor: "#f7fcf8",
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#17351f",
  },

  subtitle: {
    marginTop: 6,
    marginBottom: 24,
    fontSize: 14,
    color: "#6d776f",
  },

  card: {
    padding: 20,
    borderRadius: 18,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e1e8e2",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#17351f",
    marginBottom: 8,
  },

  info: {
    fontSize: 14,
    lineHeight: 21,
    color: "#68736b",
  },

  logoutButton: {
    height: 52,
    marginTop: 20,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d8ddd9",
  },

  logoutText: {
    color: "#b3261e",
    fontSize: 16,
    fontWeight: "700",
  },
});

