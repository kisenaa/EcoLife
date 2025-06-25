import React from "react"
import { View } from "react-native"
import { Text } from "../../components"
import { useAppTheme } from "@/utils/useAppTheme"

interface PlantHistorySectionProps {
  history: { date: string; event: string }[]
  formatDate: (date: string) => string
}

export const PlantHistorySection: React.FC<PlantHistorySectionProps> = ({ history, formatDate }) => {
  const { themed } = useAppTheme({ useForest: true })
  return (
    <View style={themed($section)}>
      <Text style={themed($sectionTitle)} text="History" />
      {history.map((h, i) => (
        <View key={i} style={themed($historyRow)}>
          <Text style={themed($historyDate)} text={formatDate(h.date)} />
          <Text style={themed($historyEvent)} text={h.event} />
        </View>
      ))}
    </View>
  )
}

const $section = ({ spacing }: any) => ({
  width: "100%" as const,
  marginTop: spacing.lg,
  marginBottom: spacing.md,
})

const $sectionTitle = ({ colors, spacing }: any) => ({
  color: colors.text,
  fontWeight: "bold" as const,
  fontSize: 18,
  marginBottom: spacing.xs,
})

const $historyRow = ({ spacing }: any) => ({
  flexDirection: "row" as const,
  justifyContent: "space-between" as const,
  marginBottom: 2,
})

const $historyDate = ({ colors }: any) => ({
  color: colors.textDim,
  fontSize: 14,
  width: 120,
})

const $historyEvent = ({ colors }: any) => ({
  color: colors.text,
  fontSize: 14,
  fontWeight: "500" as const,
})
