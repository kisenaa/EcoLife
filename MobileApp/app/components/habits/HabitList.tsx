import React from "react"
import { View, Alert, TouchableOpacity } from "react-native"
import { Text, Button } from "../"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import type { ViewStyle, TextStyle } from "react-native"

interface Habit {
  id: number
  name: string
  time: string
  completed: number
  reminder_start?: string
  reminder_end?: string
}

interface HabitListProps {
  habits: Habit[]
  habitsKey: string
  loading: boolean
  error?: string | null
  onEdit: (habit: Habit) => void
  onRemove: (habitId: number) => void
  onMarkDone: (habitId: number) => void
  onMarkUndone: (habitId: number) => void
}

export const HabitList: React.FC<HabitListProps> = ({
  habits,
  habitsKey,
  loading,
  error,
  onEdit,
  onRemove,
  onMarkDone,
  onMarkUndone,
}) => {
  const { themed, theme } = useAppTheme({ useForest: true })

  if (loading) {
    return (
      <View style={themed($loadingContainer)}>
        <Text style={themed($loadingText)} text="Loading habits..." />
      </View>
    )
  }

  if (error) {
    return (
      <View style={themed($errorContainer)}>
        <Text style={themed($errorText)} text={error} />
      </View>
    )
  }

  if (habits.length === 0) {
    return (
      <View style={themed($emptyContainer)}>
        <Text style={themed($emptyText)} text="No habits yet. Tap + to add your first habit!" />
      </View>
    )
  }

  return (
    <View style={themed($container)}>
      {habits.map((item) => (
        <TouchableOpacity
          key={item.id}
          onLongPress={() => {
            Alert.alert(item.name, "Choose an action:", [
              { text: "Edit", onPress: () => onEdit(item) },
              { text: "Remove", style: "destructive", onPress: () => onRemove(item.id) },
              { text: "Cancel", style: "cancel" },
            ])
          }}
          activeOpacity={0.9}
        >
          <View style={themed($habitCard)}>
            <View style={themed($habitInfo)}>
              <Text style={themed($habitName)} text={item.name} />
              <Text style={themed($habitTime)} text={item.time} />
            </View>
            <Button
              text={item.completed ? "Done" : "Mark Done"}
              style={themed(item.completed ? $doneButton : $markButton)}
              textStyle={themed($buttonText)}
              onPress={() => {
                if (item.completed) {
                  Alert.alert("Undo Reminder", "Do you want to mark this reminder as not done?", [
                    { text: "Cancel", style: "cancel" },
                    { text: "Undo", style: "destructive", onPress: () => onMarkUndone(item.id) },
                  ])
                } else {
                  onMarkDone(item.id)
                }
              }}
            />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.md,
})

const $loadingContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.lg,
  alignItems: "center",
})

const $loadingText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})

const $errorContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.lg,
  alignItems: "center",
})

const $errorText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.error,
  textAlign: "center",
})

const $emptyContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.xl,
  alignItems: "center",
})

const $emptyText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  textAlign: "center",
  fontStyle: "italic",
})

const $habitCard: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  backgroundColor: colors.background,
  padding: spacing.md,
  borderRadius: 12,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  shadowColor: colors.palette.neutral900,
  shadowOpacity: 0.08,
  shadowRadius: 4,
  elevation: 2,
})

const $habitInfo: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $habitName: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  fontSize: 16,
  fontWeight: "600",
})

const $habitTime: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  fontSize: 14,
  marginTop: 4,
})

const $markButton: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.tint,
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 8,
})

const $doneButton: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.neutral400,
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 8,
})

const $buttonText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.background,
  fontSize: 14,
  fontWeight: "600",
})
