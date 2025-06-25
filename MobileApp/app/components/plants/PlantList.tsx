import React from "react"
import { FlatList } from "react-native"
import { PlantCard } from "./PlantCard"

interface PlantListProps {
  plants: any[]
  onPress: (id: string) => void
  onLongPress: (plant: any) => void
}

export const PlantList: React.FC<PlantListProps> = ({ plants, onPress, onLongPress }) => {
  return (
    <FlatList
      data={plants}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <PlantCard plant={item} onPress={onPress} onLongPress={onLongPress} />
      )}
      contentContainerStyle={{ gap: 16 }}
    />
  )
}
