import React from "react"
import { TouchableOpacity, View } from "react-native"
import { Text, Icon } from "../../components"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import type { ViewStyle, TextStyle } from "react-native"

interface GardenPlantCardProps {
  plant: {
    id: string
    nickname: string
    growthStage: number
    status: string
    imageUrl: string
  }
  onNavigate: () => void
}

export const GardenPlantCard: React.FC<GardenPlantCardProps> = ({ plant, onNavigate }) => {
  const { themed, theme } = useAppTheme({ useForest: true })
  return (
    <TouchableOpacity style={themed($plantCard)} onPress={onNavigate}>
      <View style={themed($plantImagePlaceholder)}>
        <Icon icon="heart" size={48} color={theme.colors.palette.primary500} />
      </View>
      <Text style={themed($plantNickname)}>{plant.nickname}</Text>
      {plant.status !== "Happy" && (
        <View style={themed($plantStatusBadge)}>
          <Icon icon="history" size={14} color={theme.colors.palette.accent500} />
          <Text style={themed($plantStatusText)}>{plant.status}</Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

const $plantCard: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  width: 140,
  height: 180,
  backgroundColor: colors.palette.neutral200,
  borderRadius: 16,
  padding: spacing.md,
  marginRight: spacing.md,
  alignItems: "center",
  justifyContent: "space-between",
  shadowColor: colors.palette.neutral800,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 4,
  elevation: 3,
})
const $plantImagePlaceholder: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 80,
  height: 80,
  borderRadius: 40,
  backgroundColor: colors.palette.neutral300,
  justifyContent: "center",
  alignItems: "center",
})
const $plantNickname: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  fontWeight: "bold",
  textAlign: "center",
  marginTop: 8,
})
const $plantStatusBadge: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: colors.palette.accent100,
  borderRadius: 12,
  paddingVertical: spacing.xxs,
  paddingHorizontal: spacing.sm,
})
const $plantStatusText: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.palette.accent500,
  fontSize: 12,
  fontWeight: "bold",
  marginLeft: spacing.xs,
})
