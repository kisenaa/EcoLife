import React from "react"
import { View, Image } from "react-native"
import { Text } from "../../components"
import { useAppTheme } from "@/utils/useAppTheme"

interface PlantDetailInfoProps {
  plant: any
}

const GROWTH_STAGE_NAMES = [
  "Seed",
  "Sprout",
  "Seedling",
  "Vegetative",
  "Budding",
  "Flowering",
  "Mature",
]

export const PlantDetailInfo: React.FC<PlantDetailInfoProps> = ({ plant }) => {
  const { themed } = useAppTheme({ useForest: true })
  const totalStages = GROWTH_STAGE_NAMES.length
  const stageIndex = Math.max(0, Math.min((plant?.growth_stage || 1) - 1, totalStages - 1))
  const stageName = GROWTH_STAGE_NAMES[stageIndex]

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <>
      <Image source={{ uri: plant.image_url }} style={themed($plantImage)} />
      <Text style={themed($nickname)} text={plant.nickname} />
      <View style={themed($statusBadge)}>
        <Text style={themed($statusText)} text={plant.status} />
      </View>
      <View style={themed($row)}>
        <Text style={themed($label)} text="Growth Stage:" />
        <Text style={themed($value)} text={`Stage ${plant.growth_stage} - ${stageName}`} />
      </View>
      <View style={themed($progressBarBg)}>
        <View style={[themed($progressBarFill), { width: `${Math.min((plant.growth_stage / totalStages) * 100, 100)}%` }]} />
      </View>
      <View style={themed($row)}>
        <Text style={themed($label)} text="Created:" />
        <Text style={themed($value)} text={formatDate(plant.created_at)} />
      </View>
    </>
  )
}

const $plantImage = ({ spacing }: any) => ({
  width: 128,
  height: 128,
  borderRadius: 64,
  marginBottom: spacing.md,
  backgroundColor: "#e0e0e0",
})

const $nickname = ({ colors, spacing }: any) => ({
  paddingTop: spacing.lg,
  fontSize: 28,
  fontWeight: "bold" as const,
  color: colors.text,
  marginBottom: spacing.xs,
})

const $statusBadge = ({ colors, spacing }: any) => ({
  backgroundColor: colors.palette.primary100,
  borderRadius: 12,
  paddingHorizontal: spacing.md,
  paddingVertical: 4,
  marginBottom: spacing.md,
})

const $statusText = ({ colors }: any) => ({
  color: colors.palette.primary700,
  fontWeight: "bold" as const,
  fontSize: 15,
})

const $row = ({ spacing }: any) => ({
  flexDirection: "row" as const,
  alignItems: "center" as const,
  marginBottom: spacing.xs,
})

const $label = ({ colors }: any) => ({
  color: colors.textDim,
  fontSize: 15,
  marginRight: 8,
})

const $value = ({ colors }: any) => ({
  color: colors.text,
  fontWeight: "bold" as const,
  fontSize: 16,
})

const $progressBarBg = ({ colors, spacing }: any) => ({
  width: 200,
  height: 12,
  backgroundColor: colors.palette.neutral200,
  borderRadius: 6,
  marginBottom: spacing.md,
  overflow: "hidden" as const,
})

const $progressBarFill = ({ colors }: any) => ({
  height: 12,
  backgroundColor: colors.tint,
  borderRadius: 6,
})
