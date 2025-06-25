import React from "react"
import { View, Modal } from "react-native"
import { Text, Button } from "../../components"
import { useAppTheme } from "@/utils/useAppTheme"

interface PlantDeleteConfirmModalProps {
  visible: boolean
  onCancel: () => void
  onConfirm: () => void
  deleting: boolean
}

export const PlantDeleteConfirmModal: React.FC<PlantDeleteConfirmModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  deleting,
}) => {
  const { theme } = useAppTheme({ useForest: true })
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onCancel}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 12, color: theme.colors.error }}>Delete Plant?</Text>
          <Text style={{ marginBottom: 20 }}>Are you sure you want to delete this plant? This action cannot be undone.</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Button
              text="Cancel"
              onPress={onCancel}
              style={{ flex: 1, marginRight: 8, backgroundColor: theme.colors.palette.neutral200 }}
              textStyle={{ color: theme.colors.text }}
            />
            <Button
              text={deleting ? "Deleting..." : "Delete"}
              onPress={onConfirm}
              style={{ flex: 1, marginLeft: 8, backgroundColor: theme.colors.error }}
              textStyle={{ color: "#fff" }}
              disabled={deleting}
            />
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = {
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: 320,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
}
