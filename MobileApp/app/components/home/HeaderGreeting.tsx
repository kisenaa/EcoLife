import React from "react"
import { View, TouchableOpacity } from "react-native"
import { Text, Icon } from "../../components"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import type { ViewStyle, TextStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { useStores } from "@/models"

interface HeaderGreetingProps {
  user: { name: string }
}

export const HeaderGreeting: React.FC<HeaderGreetingProps> = observer(({ user }) => {
  const { themed, theme } = useAppTheme({ useForest: true })
  const {
    authenticationStore: { authUser },
  } = useStores()

  // Function to shorten long email addresses
  const getDisplayName = (email: string) => {
    if (!email) return "User"

    // If it's an email, get the part before @
    if (email.includes("@")) {
      const username = email.split("@")[0]
      // If username is still too long, truncate it
      return username.length > 15 ? username.substring(0, 15) + "..." : username
    }

    // If it's not an email but still too long
    return email.length > 20 ? email.substring(0, 20) + "..." : email
  }

  return (
    <View style={themed($headerContainer)}>
      <View style={themed($greetingContainer)}>
        <Text
          preset="heading"
          text={`Good morning, ${getDisplayName(authUser)}!`}
          style={themed($greetingText)}
          numberOfLines={2}
          ellipsizeMode="tail"
        />
      </View>
      <TouchableOpacity onPress={() => console.log("Navigate to Notifications")}>
        <Icon icon="bell" size={24} color={theme.colors.textDim} />
      </TouchableOpacity>
    </View>
  )
})

const $headerContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingVertical: spacing.md,
})

const $greetingContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  marginRight: 12,
})

const $greetingText: ThemedStyle<TextStyle> = () => ({
  flexShrink: 1,
})
