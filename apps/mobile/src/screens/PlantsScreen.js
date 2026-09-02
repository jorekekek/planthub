import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { getPlants } from "../api/client";

export default function PlantsScreen({ navigation }) {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPlants = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPlants();
      setPlants(data || []);
    } catch (error) {
      console.error("LOAD PLANTS ERROR:", error);
      Alert.alert(
        "Unable to load plants",
        error instanceof Error ? error.message : "Something went wrong.",
      );
      setPlants([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPlants();
    }, [loadPlants]),
  );

  function renderPlantItem({ item }) {
    return (
      <View style={styles.card}>
        <Text style={styles.plantName}>{item.name}</Text>
        {item.species ? (
          <Text style={styles.plantMeta}>{item.species}</Text>
        ) : null}
        {item.location ? (
          <Text style={styles.plantMeta}>Location: {item.location}</Text>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Plants</Text>
        <Pressable
          style={styles.addButton}
          onPress={() => navigation.navigate("AddPlant")}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#2f7d46" />
        </View>
      ) : plants.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No plants yet</Text>
          <Text style={styles.emptyText}>
            Add your first plant to start tracking your collection.
          </Text>
          <Pressable
            style={styles.primaryButton}
            onPress={() => navigation.navigate("AddPlant")}
          >
            <Text style={styles.primaryButtonText}>Add Plant</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={plants}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderPlantItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7fcf8",
    paddingHorizontal: 20,
    paddingTop: 48,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#17351f",
  },
  addButton: {
    backgroundColor: "#2f7d46",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#dfe7e0",
  },
  plantName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#17351f",
    marginBottom: 6,
  },
  plantMeta: {
    color: "#4f5a52",
    fontSize: 14,
    marginBottom: 4,
  },
  primaryButton: {
    marginTop: 16,
    backgroundColor: "#2f7d46",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#17351f",
    marginBottom: 8,
  },
  emptyText: {
    color: "#657168",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 8,
  },
});
