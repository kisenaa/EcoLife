import React from "react"
import { View, TouchableOpacity } from "react-native"
import { Text, Icon } from "../../components"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import type { ViewStyle, TextStyle } from "react-native"

interface HeaderGreetingProps {
  user: { name: string }
}

export const HeaderGreeting: React.FC<HeaderGreetingProps> = ({ user }) => {
  const { themed, theme } = useAppTheme({ useForest: true })
  return (
    <View style={themed($headerContainer)}>
      <Text preset="heading" text={`Good morning, ${user.name}!`} />
      <TouchableOpacity onPress={() => console.log("Navigate to Notifications")}>
        <Icon icon="bell" size={24} color={theme.colors.textDim} />
      </TouchableOpacity>
    </View>
  )
}

const $headerContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingVertical: spacing.md,
})
