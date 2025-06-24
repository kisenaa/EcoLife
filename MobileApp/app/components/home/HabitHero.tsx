import React, { useRef, useEffect } from "react"
import { Animated, TouchableOpacity, View } from "react-native"
import { Text, Icon } from "../../components"
import { useAppTheme } from "@/utils/useAppTheme"
import { WaveProgress } from "./WaveProgress"
import type { ThemedStyle } from "@/theme"
import type { ViewStyle, TextStyle } from "react-native"

interface HabitHeroProps {
  habits: { completed: number; total: number }
  onNavigate: () => void
}

export const HabitHero: React.FC<HabitHeroProps> = ({ habits, onNavigate }) => {
  const { themed, theme } = useAppTheme({ useForest: true })
  const progress = habits.total > 0 ? habits.completed / habits.total : 0

  // Animated progress for smooth wave animation
  const animatedProgress = useRef(new Animated.Value(progress)).current

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 800,
      useNativeDriver: false,
    }).start()
  }, [progress])

  return (
    <TouchableOpacity style={themed($heroWrapper)} onPress={onNavigate} activeOpacity={0.8}>
      <View style={themed($heroCircle)}>
        <WaveProgress
          size={180}
          progress={progress}
          waveColor={theme.colors.palette.accent100}
          bgColor={theme.colors.palette.neutral300}
          borderColor={theme.colors.palette.primary500}
          icon={<Icon icon="home" size={80} color={theme.colors.palette.primary500} />}
        />
      </View>
      <Text preset="subheading" style={themed($heroText)}>
        {`${habits.completed}/${habits.total} Habits Completed`}
      </Text>
    </TouchableOpacity>
  )
}

const $heroWrapper: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  marginVertical: spacing.md,
})
const $heroCircle: ThemedStyle<ViewStyle> = ({}) => ({
  width: 180,
  height: 180,
  borderRadius: 90,
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
})
const $heroText: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  marginTop: spacing.md,
  color: colors.text,
  fontWeight: "600",
})
