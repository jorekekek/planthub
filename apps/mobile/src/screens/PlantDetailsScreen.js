import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { deletePlant, getPlantById } from "../api/client";

export default function PlantDetailsScreen({ route, navigation }) {
  const { plantId } = route.params;

  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadPlant() {
      try {
        setLoading(true);

        const data = await getPlantById(plantId);
        setPlant(data);
      } catch (error) {
        console.error("LOAD PLANT ERROR:", error);

        Alert.alert(
          "Unable to load plant",
          error instanceof Error
            ? error.message
            : "Something went wrong.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadPlant();
  }, [plantId]);

  async function performDelete() {
    console.log("STARTING DELETE");
    console.log("DELETE PLANT ID:", plant?.id);

    if (!plant) {
      console.log("DELETE STOPPED: plant is missing");
      return;
    }

    try {
      setDeleting(true);

      const result = await deletePlant(plant.id);

      console.log("DELETE REQUEST SUCCESS:", result);

      if (Platform.OS === "web") {
        window.alert(`${plant.name} has been deleted.`);
        navigation.goBack();
        return;
      }

      Alert.alert(
        "Plant deleted",
        `${plant.name} has been removed.`,
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error) {
      console.error("DELETE PLANT ERROR:", error);

      if (Platform.OS === "web") {
        window.alert(
          error instanceof Error
            ? error.message
            : "Something went wrong.",
        );
      } else {
        Alert.alert(
          "Failed to delete plant",
          error instanceof Error
            ? error.message
            : "Something went wrong.",
        );
      }
    } finally {
      setDeleting(false);
    }
  }

  function handleDelete() {
    console.log("DELETE BUTTON PRESSED");
    console.log("PLANT ID:", plant?.id);
    console.log("PLANT NAME:", plant?.name);

    if (!plant || deleting) {
      console.log(
        "DELETE STOPPED: no plant or already deleting",
      );
      return;
    }

    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        `Are you sure you want to delete ${plant.name}?\n\nThis action cannot be undone.`,
      );

      console.log("DELETE CONFIRMED:", confirmed);

      if (confirmed) {
        performDelete();
      }

      return;
    }

    Alert.alert(
      "Delete plant?",
      `Are you sure you want to delete ${plant.name}?\n\nThis action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: performDelete,
        },
      ],
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#2f7d46"
        />

        <Text style={styles.loadingText}>
          Loading plant...
        </Text>
      </View>
    );
  }

  if (!plant) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>
          Plant not found.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
    >
      <View style={styles.hero}>
        <View style={styles.plantIcon}>
          <Text style={styles.iconText}>🌿</Text>
        </View>

        <Text style={styles.name}>
          {plant.name}
        </Text>

        {plant.species ? (
          <Text style={styles.species}>
            {plant.species}
          </Text>
        ) : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Plant Information
        </Text>

        <InfoRow
          label="Location"
          value={plant.location}
        />

        <InfoRow
          label="Sunlight"
          value={plant.sunlight}
        />

        <InfoRow
          label="Watering Frequency"
          value={
            plant.wateringFrequency
              ? `Every ${plant.wateringFrequency} day${
                  plant.wateringFrequency === 1
                    ? ""
                    : "s"
                }`
              : null
          }
        />
      </View>

      {plant.description ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Description
          </Text>

          <Text style={styles.description}>
            {plant.description}
          </Text>
        </View>
      ) : null}

      <View style={styles.actions}>
        <Pressable
          style={styles.editButton}
          onPress={() =>
            navigation.navigate("EditPlant", {
              plantId: plant.id,
              plant,
            })
          }
          disabled={deleting}
        >
          <Text style={styles.editText}>
            Edit Plant
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.deleteButton,
            deleting && styles.deleteButtonDisabled,
          ]}
          onPress={handleDelete}
          disabled={deleting}
        >
          {deleting ? (
            <ActivityIndicator color="#b3261e" />
          ) : (
            <Text style={styles.deleteText}>
              Delete Plant
            </Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

function InfoRow({ label, value }) {
  if (!value) {
    return null;
  }

  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>
        {label}
      </Text>

      <Text style={styles.infoValue}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f7fcf8",
  },

  content: {
    paddingBottom: 30,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f7fcf8",
  },

  loadingText: {
    marginTop: 12,
    color: "#657168",
  },

  error: {
    color: "#b3261e",
    fontSize: 16,
  },

  hero: {
    alignItems: "center",
    paddingTop: 35,
    paddingBottom: 28,
    paddingHorizontal: 20,
    backgroundColor: "#e2f3e5",
  },

  plantIcon: {
    width: 90,
    height: 90,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  iconText: {
    fontSize: 48,
  },

  name: {
    marginTop: 15,
    fontSize: 30,
    fontWeight: "800",
    color: "#17351f",
    textAlign: "center",
  },

  species: {
    marginTop: 4,
    fontSize: 15,
    color: "#68736b",
    fontStyle: "italic",
  },

  section: {
    marginTop: 16,
    marginHorizontal: 20,
    padding: 18,
    borderRadius: 18,
    backgroundColor: "#fff",
  },

  sectionTitle: {
    marginBottom: 15,
    fontSize: 18,
    fontWeight: "800",
    color: "#17351f",
  },

  infoRow: {
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#edf1ed",
  },

  infoLabel: {
    fontSize: 12,
    color: "#7b847d",
    marginBottom: 3,
  },

  infoValue: {
    fontSize: 16,
    color: "#26372b",
    fontWeight: "600",
  },

  description: {
    fontSize: 15,
    lineHeight: 23,
    color: "#4e5b52",
  },

  actions: {
    padding: 20,
    gap: 10,
  },

  editButton: {
    height: 52,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2f7d46",
  },

  editText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  deleteButton: {
    height: 52,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d8ddd9",
  },

  deleteButtonDisabled: {
    opacity: 0.6,
  },

  deleteText: {
    color: "#b3261e",
    fontSize: 16,
    fontWeight: "700",
  },
});

