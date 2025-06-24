import React from "react"
import { View } from "react-native"
import { Button } from "../../components"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import type { ViewStyle, TextStyle } from "react-native"

interface HabitFABProps {
  onPress: () => void
}

export const HabitFAB: React.FC<HabitFABProps> = ({ onPress }) => {
  const { themed } = useAppTheme({ useForest: true })
  return (
    <View style={themed($fabContainer)}>
      <Button
        text="+"
        style={themed($fabButton)}
        textStyle={themed($fabButtonText)}
        onPress={onPress}
        accessibilityLabel="Add Habit"
      />
    </View>
  )
}

const $fabContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({ position: "absolute", right: spacing.lg, bottom: spacing.lg, zIndex: 10 })
const $fabButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({ backgroundColor: colors.tint, borderRadius: 32, width: 56, height: 56, justifyContent: "center", alignItems: "center", shadowColor: colors.palette.neutral900, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 })
const $fabButtonText: ThemedStyle<TextStyle> = ({ colors }) => ({ color: colors.background, fontSize: 32, fontWeight: "bold", textAlign: "center", paddingTop: 12, marginTop: 1 })
