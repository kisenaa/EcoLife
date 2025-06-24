import React from "react"
import { Modal, View, TextInput, TouchableOpacity } from "react-native"
import { Text } from "../../components"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import type { ViewStyle, TextStyle } from "react-native"

interface HabitModalProps {
  visible: boolean
  editMode: boolean
  creating: boolean
  newHabitName: string
  newHabitStart: string
  newHabitEnd: string
  onChangeName: (v: string) => void
  onOpenStart: () => void
  onOpenEnd: () => void
  onClose: () => void
  onSave: () => void
  onCancel: () => void
}

export const HabitModal: React.FC<HabitModalProps> = ({
  visible,
  editMode,
  creating,
  newHabitName,
  newHabitStart,
  newHabitEnd,
  onChangeName,
  onOpenStart,
  onOpenEnd,
  onClose,
  onSave,
  onCancel,
}) => {
  const { themed, theme } = useAppTheme({ useForest: true })
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={themed($modalOverlay)}>
        <View style={themed($modalContent)}>
          <Text
            preset="heading"
            text={editMode ? "Edit Reminder" : "Add Reminder"}
            style={{ textAlign: "center", marginBottom: 24 }}
          />
          <TextInput
            placeholder="Reminder name (e.g., 'Morning Jog')"
            value={newHabitName}
            onChangeText={onChangeName}
            style={themed($textInput)}
            placeholderTextColor={theme.colors.textDim}
            autoFocus
          />
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
            <TouchableOpacity style={[themed($textInput), { flex: 1, marginBottom: 0, marginRight: 4 }]} onPress={onOpenStart}>
              <Text style={!newHabitStart && { color: theme.colors.textDim }}>{newHabitStart || "Start time"}</Text>
            </TouchableOpacity>
            <Text style={{ marginHorizontal: 4, fontSize: 18, color: theme.colors.text }}>-</Text>
            <TouchableOpacity style={[themed($textInput), { flex: 1, marginBottom: 0, marginLeft: 4 }]} onPress={onOpenEnd}>
              <Text style={!newHabitEnd && { color: theme.colors.textDim }}>{newHabitEnd || "End time"}</Text>
            </TouchableOpacity>
          </View>
          <View style={themed($modalActions)}>
            <TouchableOpacity
              style={[themed($modalButton), { backgroundColor: theme.colors.palette.neutral300 }]}
              onPress={onCancel}
              disabled={creating}
            >
              <Text style={{ textAlign: "center", color: theme.colors.text }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                themed($modalButton),
                { backgroundColor: theme.colors.tint, opacity: !newHabitName || !newHabitStart || creating ? 0.5 : 1 },
              ]}
              onPress={onSave}
              disabled={!newHabitName || !newHabitStart || creating}
            >
              <Text style={themed($modalButtonText)}>
                {creating ? (editMode ? "Saving..." : "Adding...") : editMode ? "Save" : "Add"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
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
  width: "90%",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
})
const $textInput: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: 8,
  padding: 12,
  marginBottom: 16,
  color: colors.text,
  fontSize: 16,
  justifyContent: "center",
})
const $modalActions: ThemedStyle<ViewStyle> = ({}) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 16,
  gap: 12,
})
const $modalButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  padding: spacing.md,
  borderRadius: 8,
  alignItems: "center",
})
const $modalButtonText: ThemedStyle<TextStyle> = ({ colors }) => ({ color: colors.background, fontWeight: "bold" })
