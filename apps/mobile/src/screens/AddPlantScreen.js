import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";

import { createPlant } from "../api/client";

export default function AddPlantScreen({ navigation }) {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [sunlight, setSunlight] = useState("");
  const [wateringFrequency, setWateringFrequency] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleCreatePlant() {
    if (!name.trim()) {
      Alert.alert(
        "Missing information",
        "Please enter a plant name.",
      );
      return;
    }

    if (
      wateringFrequency.trim() &&
      (!Number.isInteger(Number(wateringFrequency)) ||
        Number(wateringFrequency) <= 0)
    ) {
      Alert.alert(
        "Invalid watering frequency",
        "Please enter a positive whole number.",
      );
      return;
    }

    try {
      setLoading(true);

      const plantData = {
        name: name.trim(),
        ...(species.trim() && {
          species: species.trim(),
        }),
        ...(description.trim() && {
          description: description.trim(),
        }),
        ...(location.trim() && {
          location: location.trim(),
        }),
        ...(sunlight.trim() && {
          sunlight: sunlight.trim(),
        }),
        ...(wateringFrequency.trim() && {
          wateringFrequency: Number(wateringFrequency),
        }),
      };

      await createPlant(plantData);

      Alert.alert(
        "Plant added",
        `${name.trim()} has been added to your collection.`,
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        "Failed to add plant",
        error instanceof Error
          ? error.message
          : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Add Plant</Text>

      <Text style={styles.subtitle}>
        Add a plant to your PlantHub collection.
      </Text>

      <Text style={styles.label}>Plant name *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Monstera"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Species</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Monstera deliciosa"
        value={species}
        onChangeText={setSpecies}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Tell us about your plant..."
        value={description}
        onChangeText={setDescription}
        multiline
        textAlignVertical="top"
      />

      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Bedroom"
        value={location}
        onChangeText={setLocation}
      />

      <Text style={styles.label}>Sunlight</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Bright indirect"
        value={sunlight}
        onChangeText={setSunlight}
      />

      <Text style={styles.label}>Watering frequency</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 3"
        keyboardType="numeric"
        value={wateringFrequency}
        onChangeText={setWateringFrequency}
      />

      <Pressable
        style={[
          styles.button,
          loading && styles.buttonDisabled,
        ]}
        onPress={handleCreatePlant}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            Add Plant
          </Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 40,
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
    color: "#6d776f",
    fontSize: 14,
  },

  label: {
    marginBottom: 7,
    fontSize: 14,
    fontWeight: "700",
    color: "#314237",
  },

  input: {
    height: 50,
    paddingHorizontal: 15,
    marginBottom: 18,
    borderRadius: 14,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dfe7e0",
    fontSize: 15,
  },

  multiline: {
    height: 110,
    paddingTop: 14,
  },

  button: {
    height: 52,
    marginTop: 8,
    marginBottom: 30,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2f7d46",
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});