import React, { useEffect, useState } from "react"
import { View, ActivityIndicator, ScrollView } from "react-native"
import { Screen, Text } from "../components"
import { AppStackScreenProps } from "../navigators/AppNavigator"
import { fetchPlantById } from "@/services/supabase/supabaseData"
import { useAppTheme } from "@/utils/useAppTheme"
import { PlantDetailInfo } from "../components/plants/PlantDetailInfo"
import { PlantAnalysisSection } from "../components/plants/PlantAnalysisSection"
import { PlantHistorySection } from "../components/plants/PlantHistorySection"
import { StyleSheet } from "react-native"

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
}

export const PlantDetailScreen: React.FC<AppStackScreenProps<"PlantDetail">> = function PlantDetailScreen({ route }) {
  const { themed, theme } = useAppTheme({ useForest: true })
  const plantId = route.params?.plantId
  const [plant, setPlant] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPlant() {
      setLoading(true)
      setError(null)
      try {
        const { data, error } = await fetchPlantById(plantId)
        if (error) throw error
        setPlant(data)
      } catch (e: any) {
        setError(e.message || "Failed to load plant details")
      } finally {
        setLoading(false)
      }
    }
    if (plantId) loadPlant()
  }, [plantId])

  if (loading) {
    return (
      <Screen preset="scroll" safeAreaEdges={["top"]}>
        <View style={styles.centered}><ActivityIndicator size="large" color={theme.colors.tint} /></View>
      </Screen>
    )
  }
  if (error || !plant) {
    return (
      <Screen preset="scroll" safeAreaEdges={["top"]}>
        <View style={styles.centered}><Text style={{ color: theme.colors.error }}>{error || "Plant not found"}</Text></View>
      </Screen>
    )
  }

  // Mock history and analysis for demo
  const history = [
    { date: "2025-06-20", event: "Watered" },
    { date: "2025-06-18", event: "Fertilized" },
    { date: "2025-06-15", event: "Growth stage up" },
  ]
  const healthAnalysis = [
    "Growth is on track.",
    "No issues detected.",
    "Soil moisture optimal.",
  ]

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]}>
      <ScrollView contentContainerStyle={themed($container)}>
        <PlantDetailInfo plant={plant} />
        <PlantAnalysisSection healthAnalysis={healthAnalysis} />
        <PlantHistorySection history={history} formatDate={formatDate} />
      </ScrollView>
    </Screen>
  )
}

const $container = ({ spacing, colors }: any) => ({
  alignItems: "center" as const,
  padding: spacing.lg,
  backgroundColor: colors.background,
})

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    padding: 24,
  },
})
