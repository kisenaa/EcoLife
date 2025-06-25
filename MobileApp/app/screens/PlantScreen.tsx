import React, { useEffect, useState } from "react"
import { View, ActivityIndicator, TouchableOpacity, Modal, TextInput, StyleSheet } from "react-native"
import { Screen, Text, Button } from "../components"
import { useAppTheme } from "@/utils/useAppTheme"
import type { AppStackScreenProps } from "../navigators/AppNavigator"
import { fetchPlants, createPlant, updatePlant, deletePlant } from "@/services/supabase/supabaseData"
import { getCurrentUser } from "@/services/supabase/supabaseAuth"
import { PlantList } from "../components/plants/PlantList"
import { PlantEditModal } from "../components/plants/PlantEditModal"
import { PlantDeleteConfirmModal } from "../components/plants/PlantDeleteConfirmModal"

interface Plant {
  id: string
  nickname: string
  growth_stage: number
  status: string
  imageUrl: string
}

export const PlantScreen: React.FC<AppStackScreenProps<"Plants">> = function PlantScreen({ navigation }) {
  const { themed, theme } = useAppTheme({ useForest: true })
  const [plants, setPlants] = useState<Plant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [newPlantName, setNewPlantName] = useState("")
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null)
  const [editPlantName, setEditPlantName] = useState("")
  const [deleting, setDeleting] = useState(false)
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false)

  useEffect(() => {
    getCurrentUser().then(userRes => {
      const id = userRes?.data?.user?.id || null
      setUserId(id)
      if (id) loadPlants(id)
      else setLoading(false)
    })
  }, [])

  async function loadPlants(uid: string) {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await fetchPlants(uid)
      if (error) throw error
      setPlants(data || [])
    } catch (e: any) {
      setError(e.message || "Failed to load plants")
    } finally {
      setLoading(false)
    }
  }

  function handleCardPress(plantId: string) {
    navigation.navigate("PlantDetail", { plantId })
  }

  function handleCardLongPress(plant: Plant) {
    setSelectedPlant(plant)
    setEditPlantName(plant.nickname)
    setEditModalVisible(true)
  }

  async function handleAddPlant() {
    setModalVisible(true)
  }

  async function handleSubmitPlant() {
    if (!userId || !newPlantName.trim()) return
    setLoading(true)
    setError(null)
    setModalVisible(false)
    try {
      const { error } = await createPlant({
        user_id: userId,
        nickname: newPlantName.trim(),
        growth_stage: 1,
        status: "Happy",
        image_url: "https://placehold.co/64x64/green/white?text=Plant",
      })
      if (error) throw error
      setNewPlantName("")
      await loadPlants(userId)
    } catch (e: any) {
      setError(e.message || "Failed to add plant")
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdatePlant() {
    if (!selectedPlant || !editPlantName.trim()) return
    setLoading(true)
    setEditModalVisible(false)
    try {
      const { error } = await updatePlant(selectedPlant.id, { nickname: editPlantName.trim() })
      if (error) throw error
      await loadPlants(userId!)
    } catch (e: any) {
      setError(e.message || "Failed to update plant")
    } finally {
      setLoading(false)
    }
  }

  function handleDeletePlant() {
    setConfirmDeleteVisible(true)
  }

  async function confirmDeletePlant() {
    if (!selectedPlant) return
    setDeleting(true)
    try {
      const { error } = await deletePlant(selectedPlant.id)
      if (error) throw error
      setEditModalVisible(false)
      setConfirmDeleteVisible(false)
      await loadPlants(userId!)
    } catch (e: any) {
      setError(e.message || "Failed to delete plant")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Screen preset="fixed" contentContainerStyle={themed($container)}>
      <Text preset="heading" style={themed($heading)} text="Your Plants" />
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.tint} style={{ marginTop: 32 }} />
      ) : error ? (
        <Text style={{ color: theme.colors.error, textAlign: "center", marginTop: 32 }}>{error}</Text>
      ) : (
        <PlantList
          plants={plants}
          onPress={handleCardPress}
          onLongPress={handleCardLongPress}
        />
      )}
      <TouchableOpacity style={themed($fab)} onPress={handleAddPlant}>
        <Text style={themed($fabText)}>+</Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 12 }}>Add Plant</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter plant name"
              value={newPlantName}
              onChangeText={setNewPlantName}
              autoFocus
            />
            <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 16 }}>
              <Button text="Cancel" onPress={() => { setModalVisible(false); setNewPlantName("") }} style={{ marginRight: 8 }} />
              <Button text="Add" onPress={handleSubmitPlant} disabled={!newPlantName.trim()} />
            </View>
          </View>
        </View>
      </Modal>
      <PlantEditModal
        visible={editModalVisible}
        plantName={editPlantName}
        onChangeName={setEditPlantName}
        onCancel={() => setEditModalVisible(false)}
        onSave={handleUpdatePlant}
        onDelete={handleDeletePlant}
        deleting={deleting}
      />
      <PlantDeleteConfirmModal
        visible={confirmDeleteVisible}
        onCancel={() => setConfirmDeleteVisible(false)}
        onConfirm={confirmDeletePlant}
        deleting={deleting}
      />
    </Screen>
  )
}

const $container = ({ spacing, colors }: any) => ({
  marginTop: spacing.xl,
  flex: 1,
  backgroundColor: colors.background,
  padding: spacing.lg,
})

const $heading = ({ spacing, colors }: any) => ({
  color: colors.text,
  marginBottom: spacing.lg,
  textAlign: "center" as const,
})

const $fab = ({ colors, spacing }: any) => ({
  position: "absolute" as const,
  right: spacing.lg,
  bottom: spacing.lg,
  backgroundColor: colors.tint,
  borderRadius: 32,
  width: 56,
  height: 56,
  justifyContent: "center" as const,
  alignItems: "center" as const,
  shadowColor: colors.palette.neutral900,
  shadowOpacity: 0.15,
  shadowRadius: 8,
  elevation: 4,
})

const $fabText = ({ colors }: any) => ({
  color: colors.background,
  fontSize: 32,
  fontWeight: 'bold' as const,
  textAlign: "center" as const,
  paddingTop: 12,
  marginTop: 1,
})

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
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
})
