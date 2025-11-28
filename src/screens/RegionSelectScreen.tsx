import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface RegionItem {
  id: string;
  name: string;
  venueCount: number;
}

interface RegionSelectScreenProps {
  regions: RegionItem[];
  onSelectRegion: (id: string) => void;
  onBackToHome: () => void;
}

export const RegionSelectScreen: React.FC<RegionSelectScreenProps> = ({
  regions,
  onSelectRegion,
  onBackToHome,
}) => {
  const renderItem = ({ item }: { item: RegionItem }) => (
    <TouchableOpacity
      style={styles.regionButton}
      onPress={() => onSelectRegion(item.id)}
    >
      <View style={styles.regionRow}>
        <Text style={styles.regionName}>{item.name}</Text>
        <Text style={styles.regionMeta}>{item.venueCount} venues</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Select a Region</Text>
      <Text style={styles.subHeader}>Where in the quiz world?</Text>

      <FlatList
        data={regions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={styles.list}
      />

      <TouchableOpacity style={styles.backButton} onPress={onBackToHome}>
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#F9FAFB",
    marginBottom: 4,
  },
  subHeader: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
  regionButton: {
    backgroundColor: "#1F2937",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  regionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  regionName: {
    color: "#F9FAFB",
    fontSize: 16,
    fontWeight: "600",
  },
  regionMeta: {
    color: "#9CA3AF",
    fontSize: 13,
  },
  backButton: {
    backgroundColor: "#374151",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 16,
  },
  backButtonText: {
    color: "#F9FAFB",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
