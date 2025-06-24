import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { Screen } from "../components"
import { AppStackScreenProps } from "../navigators/AppNavigator"

export const PlantDetailScreen: React.FC<AppStackScreenProps<"PlantDetail">> = function PlantDetailScreen(_props) {
  return (
    <Screen preset="scroll" safeAreaEdges={["top"]}>
      <View style={styles.container}>
        <Text style={styles.heading}>Plant Detail</Text>
        <Text style={styles.text}>This is the Plant Detail screen. Show plant info here!</Text>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
  },
})
