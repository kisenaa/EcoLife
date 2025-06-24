import React from "react"
import { TouchableOpacity, ImageBackground, View } from "react-native"
import { Text } from "../../components"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import type { ViewStyle, TextStyle } from "react-native"

interface DiscoveryCardProps {
  item: {
    title: string
    description: string
    imageUrl: string
    ctaText: string
    targetScreen: string
  }
  onNavigate: () => void
}

export const DiscoveryCard: React.FC<DiscoveryCardProps> = ({ item, onNavigate }) => {
  const { themed } = useAppTheme({ useForest: true })
  return (
    <TouchableOpacity onPress={onNavigate} activeOpacity={0.85}>
      <ImageBackground source={{ uri: item.imageUrl }} style={themed($discoveryCard)} imageStyle={{ borderRadius: 16 }}>
        <View style={themed($discoveryGradientOverlay)}>
          <View style={themed($discoveryTextContainer)}>
            <Text preset="heading" style={themed($discoveryTitle)} numberOfLines={2} ellipsizeMode="tail">
              {item.title}
            </Text>
            <Text style={themed($discoveryDescription)} numberOfLines={3} ellipsizeMode="tail">
              {item.description}
            </Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  )
}

const $discoveryCard: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  height: 140, // reduced height
  borderRadius: 16,
  justifyContent: "flex-end",
})
const $discoveryGradientOverlay: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  height: "100%",
  justifyContent: "flex-start",
  padding: spacing.md, // less padding
  borderRadius: 16,
  backgroundColor: "rgba(27, 94, 32, 0.45)", // dark green overlay
})
const $discoveryTextContainer: ThemedStyle<ViewStyle> = ({}) => ({
  flexShrink: 1,
  flexGrow: 1,
  maxWidth: "100%",
  paddingRight: 4, // add a little right padding for text
})
const $discoveryTitle: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: "#FFFFFF",
  fontFamily: "Poppins-Bold",
  fontSize: 30,
})
const $discoveryDescription: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: "#FFFFFF",
  fontSize: 14,
  marginTop: 4,
})
