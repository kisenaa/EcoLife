import React from "react"
import { View, Image, TouchableOpacity } from "react-native"
import { Text } from "../../components"
import { useAppTheme } from "@/utils/useAppTheme"

interface PlantCardProps {
  plant: {
    id: string
    nickname: string
    growth_stage: number
    status: string
    imageUrl: string
  }
  onPress: (id: string) => void
  onLongPress: (plant: any) => void
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

export const PlantCard: React.FC<PlantCardProps> = ({ plant, onPress, onLongPress }) => {
  const { themed } = useAppTheme({ useForest: true })
  const totalStages = GROWTH_STAGE_NAMES.length
  const stageIndex = Math.max(0, Math.min((plant.growth_stage || 1) - 1, totalStages - 1))
  const stageName = GROWTH_STAGE_NAMES[stageIndex]

  return (
    <TouchableOpacity
      onPress={() => onPress(plant.id)}
      onLongPress={() => onLongPress(plant)}
      activeOpacity={0.8}
    >
      <View style={themed($plantCard)}>
        <Image source={{ uri: plant.imageUrl }} style={themed($plantImage)} />
        <View style={themed($plantInfo)}>
          <Text style={themed($plantName)} text={plant.nickname} />
          <Text style={themed($plantStatus)} text={`Status: ${plant.status}`} />
          <Text style={themed($plantStage)} text={`Growth Stage: ${plant.growth_stage} - ${stageName}`} />
        </View>
      </View>
    </TouchableOpacity>
  )
}

const $plantCard = ({ colors, spacing }: any) => ({
  flexDirection: "row" as const,
  alignItems: "center" as const,
  backgroundColor: colors.palette.neutral100,
  borderRadius: 16,
  padding: spacing.md,
  marginBottom: spacing.sm,
  shadowColor: colors.palette.neutral900,
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 2,
})

const $plantImage = ({ spacing }: any) => ({
  width: 64,
  height: 64,
  borderRadius: 32,
  marginRight: spacing.md,
  backgroundColor: "#e0e0e0",
})

const $plantInfo = ({}) => ({ flex: 1 })

const $plantName = ({ colors }: any) => ({
  color: colors.text,
  fontWeight: "bold" as const,
  fontSize: 16,
  marginBottom: 2,
})

const $plantStatus = ({ colors }: any) => ({
  color: colors.textDim,
  fontSize: 14,
})

const $plantStage = ({ colors }: any) => ({
  color: colors.textDim,
  fontSize: 13,
})
