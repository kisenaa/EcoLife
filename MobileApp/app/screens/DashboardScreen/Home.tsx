import React, { useEffect, useState } from "react"
import { View, FlatList, ActivityIndicator } from "react-native"
import { Screen, Text, Button } from "../../components"
import { DashboardTabScreenProps } from "../../navigators/DashboardNavigator"
import { useAppTheme } from "@/utils/useAppTheme"
import { fetchUserProfile, fetchHabits } from "@/services/supabase"
import { userData, habitsData, plantData, discoveryData, quizData } from "@/data/homeDummyData"
import { HeaderGreeting } from "@/components/home/HeaderGreeting"
import { HabitHero } from "@/components/home/HabitHero"
import { GardenPlantCard } from "@/components/home/GardenPlantCard"
import { DiscoveryCard } from "@/components/home/DiscoveryCard"
import { QuizCard } from "@/components/home/QuizCard"
import type { ThemedStyle } from "@/theme"
import type { ViewStyle, TextStyle } from "react-native"

export const Home: React.FC<DashboardTabScreenProps<"Home">> = function Home(_props) {
  const { navigation } = _props
  const { themed, theme } = useAppTheme({ useForest: true })
  const allHabitsDone = habitsData.completed === habitsData.total

  return (
    <Screen preset="scroll" contentContainerStyle={themed($container)}>
      <HeaderGreeting user={userData} />
      <HabitHero habits={habitsData} onNavigate={() => navigation.navigate("Habits")} />
      <View style={themed($cardSection)}>
        <View style={themed($cardHeader)}>
          <Text style={themed($widgetTitle)} text="Your Garden" />
          <Button
            text="View All"
            style={themed($viewAllButton)}
            textStyle={themed($viewAllButtonText)}
            onPress={() => navigation.navigate("Plants")}
          />
        </View>
        <View style={{ flexDirection: "row" }}>
          {plantData.map((item) => (
            <GardenPlantCard
              key={item.id}
              plant={item}
              onNavigate={() => navigation.navigate("PlantDetail", { plantId: item.id })}
            />
          ))}
        </View>
      </View>
      <View style={themed($cardSection)}>
        <View style={themed($cardHeader)}>
          <Text style={themed($widgetTitle)} text="Discovery" />
        </View>
        <DiscoveryCard item={discoveryData} onNavigate={() => navigation.navigate("Learn")} />
      </View>
      <View style={themed($cardSection)}>
        <View style={themed($cardHeader)}>
          <Text style={themed($widgetTitle)} text="Eco Quiz" />
        </View>
        <QuizCard quiz={quizData} />
      </View>
    </Screen>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  marginTop: spacing.xxl,
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.lg,
  backgroundColor: colors.background,
})
const $primaryCTA: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  marginTop: spacing.sm,
  marginBottom: spacing.xl,
  backgroundColor: colors.palette.primary500,
  borderWidth: 0,
})
const $primaryCTAText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: "#fff",
  fontWeight: "bold",
})
const $cardSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md, // tighter vertical spacing
})
const $cardHeader: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: spacing.sm, // less space below header
})
const $widgetTitle: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  fontSize: 20,
  fontFamily: "Poppins-SemiBold",
})
const $viewAllButton: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.xs,
  borderRadius: 8,
  backgroundColor: colors.palette.accent100,
})
const $viewAllButtonText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.primary600,
  fontWeight: "bold",
})
