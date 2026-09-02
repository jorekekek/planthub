import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

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
      <LinearGradient
        colors={["#dff5e3", "#ffffff"]}
        style={styles.center}
      >
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>
          Loading your plants...
        </Text>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient
        colors={["#dff5e3", "#ffffff"]}
        style={styles.center}
      >
        <Text style={styles.error}>{error}</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#dff5e3", "#f7fcf8", "#ffffff"]}
      locations={[0, 0.4, 1]}
      style={styles.screen}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning</Text>
          <Text style={styles.title}>PlantHub</Text>
        </View>

        <Pressable style={styles.iconButton}>
          <Text style={styles.icon}>🔔</Text>
        </Pressable>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search your plants..."
          placeholderTextColor="#8a8a8a"
        />

        <Text style={styles.searchIcon}>⌕</Text>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroTextContainer}>
          <Text style={styles.heroTitle}>
            Support your plant's growth
            {"\n"}with smart illumination
          </Text>

          <Text style={styles.heroSubtitle}>
            Monitor your plants and keep them growing healthy.
          </Text>

          <Pressable style={styles.heroButton}>
            <Text style={styles.heroButtonText}>
              View lighting
            </Text>
          </Pressable>
        </View>

        <Text style={styles.heroPlant}>🌿</Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Plant Overview</Text>

        <Pressable>
          <Text style={styles.seeAll}>See all</Text>
        </Pressable>
      </View>

      <View style={styles.sensorGrid}>
        <SensorCard
          title="Humidity"
          value="72%"
          icon="💧"
        />

        <SensorCard
          title="Soil Moisture"
          value="64%"
          icon="🌱"
        />

        <SensorCard
          title="Temperature"
          value="27°C"
          icon="🌡️"
        />

        <SensorCard
          title="Water Level"
          value="82%"
          icon="💦"
        />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Plants</Text>

        <Text style={styles.plantCount}>
          {plants.length} plant{plants.length === 1 ? "" : "s"}
        </Text>
      </View>

      {plants.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>🪴</Text>

          <Text style={styles.emptyTitle}>
            No plants yet
          </Text>

          <Text style={styles.emptyText}>
            Add your first plant to start monitoring it.
          </Text>
        </View>
      ) : (
        <FlatList
          data={plants}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.plantList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.plantCard}>
              <View style={styles.plantIconContainer}>
                <Text style={styles.plantIcon}>🌿</Text>
              </View>

              <View style={styles.plantInfo}>
                <Text style={styles.plantName}>
                  {item.name}
                </Text>

                {item.species ? (
                  <Text style={styles.species}>
                    {item.species}
                  </Text>
                ) : null}

                {item.location ? (
                  <Text style={styles.location}>
                    📍 {item.location}
                  </Text>
                ) : null}
              </View>

              <Text style={styles.chevron}>›</Text>
            </View>
          )}
        />
      )}

    </LinearGradient>
  );
}

function SensorCard({ title, value, icon }) {
  return (
    <View style={styles.sensorCard}>
      <View style={styles.sensorTop}>
        <Text style={styles.sensorIcon}>{icon}</Text>

        <Text style={styles.sensorTitle}>{title}</Text>
      </View>

      <Text style={styles.sensorValue}>{value}</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 52,
    paddingHorizontal: 20,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
  },

  error: {
    color: "#b3261e",
    fontSize: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  greeting: {
    fontSize: 14,
    color: "#6b746d",
    marginBottom: 2,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#17351f",
  },

  iconButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.8)",
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    fontSize: 19,
  },

  searchContainer: {
    marginTop: 22,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#f5f5f5",
    flexDirection: "row",
    alignItems: "center",
  },

  searchInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#222",
  },

  searchIcon: {
    fontSize: 27,
    color: "#555",
    marginRight: 15,
    transform: [{ rotate: "-20deg" }],
  },

  heroCard: {
    marginTop: 20,
    minHeight: 175,
    borderRadius: 24,
    padding: 22,
    backgroundColor: "#2f7d46",
    flexDirection: "row",
    overflow: "hidden",
  },

  heroTextContainer: {
    flex: 1,
  },

  heroTitle: {
    fontSize: 21,
    lineHeight: 27,
    fontWeight: "800",
    color: "#ffffff",
  },

  heroSubtitle: {
    marginTop: 9,
    fontSize: 12,
    lineHeight: 18,
    color: "#e6f4e9",
    maxWidth: 240,
  },

  heroButton: {
    alignSelf: "flex-start",
    marginTop: 16,
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: "#ffffff",
  },

  heroButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2f7d46",
  },

  heroPlant: {
    position: "absolute",
    right: -4,
    bottom: -14,
    fontSize: 105,
    opacity: 0.9,
  },

  sectionHeader: {
    marginTop: 23,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#17351f",
  },

  seeAll: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2f7d46",
  },

  plantCount: {
    fontSize: 13,
    color: "#778078",
  },

  sensorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  sensorCard: {
    width: "48%",
    minHeight: 105,
    padding: 16,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.82)",
  },

  sensorTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  sensorIcon: {
    fontSize: 18,
    marginRight: 7,
  },

  sensorTitle: {
    flex: 1,
    fontSize: 12,
    color: "#68716a",
  },

  sensorValue: {
    marginTop: 12,
    fontSize: 25,
    fontWeight: "800",
    color: "#17351f",
  },

  emptyCard: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.8)",
  },

  emptyIcon: {
    fontSize: 38,
  },

  emptyTitle: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "700",
  },

  emptyText: {
    marginTop: 5,
    textAlign: "center",
    color: "#727872",
    fontSize: 14,
  },

  plantList: {
    paddingBottom: 120,
    gap: 10,
  },

  plantCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.88)",
  },

  plantIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#e4f3e7",
    alignItems: "center",
    justifyContent: "center",
  },

  plantIcon: {
    fontSize: 26,
  },

  plantInfo: {
    flex: 1,
    marginLeft: 13,
  },

  plantName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#18321f",
  },

  species: {
    marginTop: 2,
    fontSize: 12,
    color: "#747b76",
  },

  location: {
    marginTop: 5,
    fontSize: 12,
    color: "#59645d",
  },

  chevron: {
    fontSize: 28,
    color: "#94a198",
    marginLeft: 8,
  },

  bottomNav: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 18,
    height: 70,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.96)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    elevation: 10,
    shadowOpacity: 0.1,
    shadowRadius: 15,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  navItem: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
  },

  navIcon: {
    fontSize: 22,
    color: "#9aa49d",
  },

  navIconActive: {
    color: "#2f7d46",
  },

  navLabel: {
    marginTop: 3,
    fontSize: 9,
    color: "#8b938d",
  },

  navLabelActive: {
    color: "#2f7d46",
    fontWeight: "700",
  },
});