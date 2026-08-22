import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { getPlants } from "../api/client";

export default function HomeScreen() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPlants() {
      try {
        const data = await getPlants();
        setPlants(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load plants.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadPlants();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading your plants...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Plants</Text>

      {plants.length === 0 ? (
        <Text style={styles.empty}>
          You don't have any plants yet.
        </Text>
      ) : (
        <FlatList
          data={plants}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.plantName}>{item.name}</Text>

              {item.species ? (
                <Text style={styles.species}>{item.species}</Text>
              ) : null}

              {item.location ? (
                <Text style={styles.detail}>
                  Location: {item.location}
                </Text>
              ) : null}

              {item.sunlight ? (
                <Text style={styles.detail}>
                  Sunlight: {item.sunlight}
                </Text>
              ) : null}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 20,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },

  empty: {
    fontSize: 16,
    color: "#666",
  },

  error: {
    fontSize: 16,
    color: "#c62828",
    textAlign: "center",
  },

  list: {
    gap: 12,
    paddingBottom: 24,
  },

  card: {
    padding: 18,
    borderRadius: 16,
    backgroundColor: "#f5f5f5",
  },

  plantName: {
    fontSize: 20,
    fontWeight: "700",
  },

  species: {
    marginTop: 4,
    fontSize: 15,
    color: "#666",
  },

  detail: {
    marginTop: 8,
    fontSize: 14,
    color: "#444",
  },
});
