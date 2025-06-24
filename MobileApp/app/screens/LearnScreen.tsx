import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { Screen } from "../components"
import { AppStackScreenProps } from "../navigators/AppNavigator"

export const LearnScreen: React.FC<AppStackScreenProps<"Learn">> = function LearnScreen(_props) {
  return (
    <Screen preset="scroll" safeAreaEdges={["top"]}>
      <View style={styles.container}>
        <Text style={styles.heading}>Learn</Text>
        <Text style={styles.text}>This is the Learn screen. Add your educational content here!</Text>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
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
