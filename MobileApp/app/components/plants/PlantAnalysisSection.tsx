import React from "react"
import { View } from "react-native"
import { Text } from "../../components"
import { useAppTheme } from "@/utils/useAppTheme"

interface PlantAnalysisSectionProps {
  healthAnalysis: string[]
}

export const PlantAnalysisSection: React.FC<PlantAnalysisSectionProps> = ({ healthAnalysis }) => {
  const { themed } = useAppTheme({ useForest: true })
  return (
    <View style={themed($section)}>
      <Text style={themed($sectionTitle)} text="Health Analysis" />
      {healthAnalysis.map((line, i) => (
        <Text key={i} style={themed($analysisLine)} text={`• ${line}`} />
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

const $analysisLine = ({ colors }: any) => ({
  color: colors.textDim,
  fontSize: 15,
  marginBottom: 2,
})
