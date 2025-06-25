import React, { useState } from "react"
import { FlatList, TouchableOpacity, View, Alert, Modal } from "react-native"
import { Text, Button } from "../../components"
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
  const [actionModalVisible, setActionModalVisible] = useState(false)
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false)
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null)

  function openActionModal(habit: Habit) {
    setSelectedHabit(habit)
    setActionModalVisible(true)
  }

  function handleEdit() {
    if (selectedHabit) onEdit(selectedHabit)
    setActionModalVisible(false)
  }

  function handleDelete() {
    setActionModalVisible(false)
    setConfirmDeleteVisible(true)
  }

  function confirmDelete() {
    if (selectedHabit) onRemove(selectedHabit.id)
    setConfirmDeleteVisible(false)
  }

  function handleCancel() {
    setActionModalVisible(false)
    setSelectedHabit(null)
  }

  return loading ? (
    <Text style={{ textAlign: "center", marginTop: 32 }}>Loading...</Text>
  ) : error ? (
    <Text style={{ color: theme.colors.error, textAlign: "center", marginTop: 32 }}>{error}</Text>
  ) : (
    <>
      <FlatList
        key={habitsKey}
        data={habits}
        keyExtractor={(item) => item.id?.toString()}
        contentContainerStyle={themed($list)}
        renderItem={({ item }) => (
          <TouchableOpacity
            onLongPress={() => openActionModal(item)}
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
                disabled={false}
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
        )}
        scrollEnabled={false}
      />
      {/* Action Modal */}
      <Modal
        visible={actionModalVisible}
        animationType="fade"
        transparent
        onRequestClose={handleCancel}
      >
        <View style={themed($modalOverlay)}>
          <View style={themed($modalContent)}>
            <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 12 }}>{selectedHabit?.name}</Text>
            <Text style={{ marginBottom: 20 }}>{selectedHabit?.time}</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
              <Button
                text="Cancel"
                onPress={handleCancel}
                style={{ flex: 1, marginRight: 8, backgroundColor: theme.colors.palette.neutral200 }}
                textStyle={{ color: theme.colors.text }}
              />
              <Button
                text="Edit"
                onPress={handleEdit}
                style={{ flex: 1, marginLeft: 8, marginRight: 8, backgroundColor: theme.colors.tint }}
                textStyle={{ color: theme.colors.background }}
              />
              <Button
                text="Delete"
                onPress={handleDelete}
                style={{ flex: 1, marginLeft: 8, backgroundColor: theme.colors.error }}
                textStyle={{ color: "#fff" }}
              />
            </View>
          </View>
        </View>
      </Modal>
      {/* Confirm Delete Modal */}
      <Modal
        visible={confirmDeleteVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setConfirmDeleteVisible(false)}
      >
        <View style={themed($modalOverlay)}>
          <View style={themed($modalContent)}>
            <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 12, color: theme.colors.error }}>Delete Habit?</Text>
            <Text style={{ marginBottom: 20 }}>Are you sure you want to delete this habit? This action cannot be undone.</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Button
                text="Cancel"
                onPress={() => setConfirmDeleteVisible(false)}
                style={{ flex: 1, marginRight: 8, backgroundColor: theme.colors.palette.neutral200 }}
                textStyle={{ color: theme.colors.text }}
              />
              <Button
                text="Delete"
                onPress={confirmDelete}
                style={{ flex: 1, marginLeft: 8, backgroundColor: theme.colors.error }}
                textStyle={{ color: "#fff" }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}

const $list: ThemedStyle<ViewStyle> = ({}) => ({
  gap: 16,
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

const $buttonText: ThemedStyle<TextStyle> = ({ colors }) => {
  return {
    color: colors.text,
    fontWeight: "bold",
    textAlign: "center",
  }
}

const $modalOverlay: ThemedStyle<ViewStyle> = ({}) => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
})
const $modalContent: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.background,
  borderRadius: 16,
  padding: spacing.lg,
  width: 320,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
})
