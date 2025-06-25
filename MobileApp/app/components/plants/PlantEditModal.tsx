import React from "react"
import { View, TextInput, Modal } from "react-native"
import { Text, Button } from "../../components"
import { useAppTheme } from "@/utils/useAppTheme"

interface PlantEditModalProps {
  visible: boolean
  plantName: string
  onChangeName: (v: string) => void
  onCancel: () => void
  onSave: () => void
  onDelete: () => void
  deleting: boolean
}

export const PlantEditModal: React.FC<PlantEditModalProps> = ({
  visible,
  plantName,
  onChangeName,
  onCancel,
  onSave,
  onDelete,
  deleting,
}) => {
  const { theme } = useAppTheme({ useForest: true })
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onCancel}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 12 }}>Edit Plant</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter new plant name"
            value={plantName}
            onChangeText={onChangeName}
            autoFocus
          />
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
            <Button
              text="Cancel"
              onPress={onCancel}
              style={{ flex: 1, marginRight: 8, backgroundColor: theme.colors.palette.neutral200 }}
              textStyle={{ color: theme.colors.text }}
            />
            <Button
              text="Save"
              onPress={onSave}
              disabled={!plantName.trim()}
              style={{ flex: 1, marginLeft: 8 }}
            />
          </View>
          <Button
            text={deleting ? "Deleting..." : "Delete Plant"}
            onPress={onDelete}
            style={{ marginTop: 20, backgroundColor: theme.colors.error, width: "100%" }}
            textStyle={{ color: "#fff" }}
            disabled={deleting}
          />
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
}
