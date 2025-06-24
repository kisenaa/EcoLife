import React, { useState, useEffect, useMemo } from "react"
import { View, ScrollView, ActivityIndicator } from "react-native"
import { Screen, Text } from "../components"
import { useAppTheme } from "@/utils/useAppTheme"
import type { AppStackScreenProps } from "../navigators/AppNavigator"
import { HabitTimeGraph } from "../components/HabitTimeGraph"
import { fetchHabits, createHabit, updateHabit, deleteHabit, editHabit } from "@/services/supabase/supabaseData"
import { getCurrentUser } from "@/services/supabase/supabaseAuth"
import DatePicker from "react-native-date-picker"
import { HabitList } from "../components/habits/HabitList"
import { HabitModal } from "../components/habits/HabitModal"
import { HabitFAB } from "../components/habits/HabitFAB"

const TIME_RANGES = [24, 12, 6, 3]

const formatTime = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")
  return `${hours}:${minutes}`
}

const formatTimeString = (time: string | null | undefined): string => {
  if (!time) return ""
  return time.split(":").slice(0, 2).join(":")
}

export const HabitsScreen: React.FC<AppStackScreenProps<"Habits">> = function HabitsScreen(_props) {
  const { themed, theme } = useAppTheme({ useForest: true })
  const [selectedRange, setSelectedRange] = useState(24)
  const [habitList, setHabitList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [newHabitName, setNewHabitName] = useState("")
  const [newHabitStart, setNewHabitStart] = useState("")
  const [newHabitEnd, setNewHabitEnd] = useState("")
  const [creating, setCreating] = useState(false)
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [isStartPickerVisible, setStartPickerVisible] = useState(false)
  const [isEndPickerVisible, setEndPickerVisible] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [editHabitId, setEditHabitId] = useState<number | null>(null)
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    // Wait for user session before loading habits
    getCurrentUser().then((userRes) => {
      const id = userRes?.data?.user?.id || null
      setUserId(id)
      if (id) loadHabits(id)
      else setLoading(false)
    })
  }, [])

  const loadHabits = async (uid: string) => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await fetchHabits(uid)
      if (error) throw error
      setHabitList(data || [])
    } catch (e: any) {
      setError(e.message || "Failed to load habits")
    } finally {
      setLoading(false)
    }
  }

  const resetModalState = () => {
    setNewHabitName("")
    setNewHabitStart("")
    setNewHabitEnd("")
    setStartDate(new Date())
    setEndDate(new Date())
    setCreating(false)
    setEditMode(false)
    setEditHabitId(null)
  }

  const handleOpenModal = () => {
    resetModalState()
    setModalVisible(true)
  }

  const handleCloseModal = () => setModalVisible(false)

  const handleAddHabit = async () => {
    if (!newHabitName || !newHabitStart || !userId) return
    setCreating(true)
    try {
      const { error } = await createHabit({
        user_id: userId,
        name: newHabitName,
        reminder_start: newHabitStart,
        reminder_end: newHabitEnd || null,
        completed: 0,
        total: 1,
      })
      if (error) throw error
      handleCloseModal()
      await loadHabits(userId)
    } catch (e: any) {
      setError(e.message || "Failed to add habit")
    } finally {
      setCreating(false)
    }
  }

  const markHabitDone = async (habitId: number) => {
    if (!userId) return
    setLoading(true)
    setError(null)
    try {
      const { error } = await updateHabit(habitId, { completed: 1 })
      if (error) throw error
      await loadHabits(userId)
    } catch (e: any) {
      setError(e.message || "Failed to mark habit as done")
    } finally {
      setLoading(false)
    }
  }

  const markHabitUndone = async (habitId: number) => {
    if (!userId) return
    setLoading(true)
    setError(null)
    try {
      const { error } = await updateHabit(habitId, { completed: 0 })
      if (error) throw error
      await loadHabits(userId)
    } catch (e: any) {
      setError(e.message || "Failed to mark habit as not done")
    } finally {
      setLoading(false)
    }
  }

  const handleEditHabit = (habit: any) => {
    setEditHabitId(habit.id)
    setNewHabitName(habit.name)
    setNewHabitStart(habit.reminder_start)
    setNewHabitEnd(habit.reminder_end || "")
    setStartDate(new Date())
    setEndDate(new Date())
    setEditMode(true)
    setModalVisible(true)
  }

  const handleRemoveHabit = async (habitId: number) => {
    if (!userId) return
    setLoading(true)
    setError(null)
    try {
      const { error } = await deleteHabit(habitId)
      if (error) throw error
      await loadHabits(userId)
    } catch (e: any) {
      setError(e.message || "Failed to remove habit")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveEditHabit = async () => {
    if (!editHabitId || !newHabitName || !newHabitStart || !userId) return
    setCreating(true)
    try {
      const { error } = await editHabit(editHabitId, {
        name: newHabitName,
        reminder_start: newHabitStart,
        reminder_end: newHabitEnd || null,
      })
      if (error) throw error
      setEditMode(false)
      setEditHabitId(null)
      handleCloseModal()
      await loadHabits(userId)
    } catch (e: any) {
      setError(e.message || "Failed to edit habit")
    } finally {
      setCreating(false)
    }
  }

  // Calculate completed and total habits from habitList
  const completedCount = habitList.filter((h) => h.completed).length
  const totalCount = habitList.length

  const displayHabits = useMemo(
    () =>
      habitList
        .slice()
        .sort((a, b) => {
          // 1. Not done (completed: 0) at the top, done (completed: 1) at the bottom
          if (a.completed !== b.completed) return a.completed - b.completed
          // 2. Earliest start time at the top
          if (!a.reminder_start) return 1
          if (!b.reminder_start) return -1
          const startCompare = a.reminder_start.localeCompare(b.reminder_start)
          if (startCompare !== 0) return startCompare
          // 3. Earliest end time at the top (nulls last)
          if (!a.reminder_end && b.reminder_end) return 1
          if (a.reminder_end && !b.reminder_end) return -1
          if (!a.reminder_end && !b.reminder_end) return 0
          return a.reminder_end.localeCompare(b.reminder_end)
        })
        .map((h) => ({
          ...h,
          time: h.reminder_start
            ? h.reminder_end
              ? `${formatTimeString(h.reminder_start)} - ${formatTimeString(h.reminder_end)}`
              : formatTimeString(h.reminder_start)
            : "",
        })),
    [habitList],
  )

  const habitsKey = useMemo(() => habitList.map((h) => `${h.id}:${h.completed}`).join("|"), [habitList])

  return (
    <>
      <Screen preset="fixed" contentContainerStyle={themed($container)}>
        <Text preset="heading" style={themed($heading)} text="Your Habits" />
        <Text preset="subheading" style={themed($subheading)} text={`Completed: ${completedCount} / ${totalCount}`} />
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View style={themed($graphContainer)}>
            <View style={themed($rangeSelector)}>
              {TIME_RANGES.map((range) => (
                <Text
                  key={range}
                  style={themed(selectedRange === range ? $selectedRangeButton : $rangeButton)}
                  onPress={() => setSelectedRange(range)}
                >
                  {range + "h"}
                </Text>
              ))}
            </View>
            <HabitTimeGraph key={habitsKey} habits={displayHabits} timeRange={selectedRange as 24 | 12 | 6 | 3} />
          </View>
          <HabitList
            habits={displayHabits}
            habitsKey={habitsKey}
            loading={loading}
            error={error}
            onEdit={handleEditHabit}
            onRemove={handleRemoveHabit}
            onMarkDone={markHabitDone}
            onMarkUndone={markHabitUndone}
          />
        </ScrollView>
        <HabitFAB onPress={handleOpenModal} />
      </Screen>
      <HabitModal
        visible={modalVisible}
        editMode={editMode}
        creating={creating}
        newHabitName={newHabitName}
        newHabitStart={newHabitStart}
        newHabitEnd={newHabitEnd}
        onChangeName={setNewHabitName}
        onOpenStart={() => setStartPickerVisible(true)}
        onOpenEnd={() => setEndPickerVisible(true)}
        onClose={handleCloseModal}
        onSave={editMode ? handleSaveEditHabit : handleAddHabit}
        onCancel={() => {
          setEditMode(false)
          setEditHabitId(null)
          handleCloseModal()
        }}
      />
      <DatePicker
        modal
        open={isStartPickerVisible}
        date={startDate}
        mode="time"
        onConfirm={(date) => {
          setStartPickerVisible(false)
          setStartDate(date)
          setNewHabitStart(formatTime(date))
        }}
        onCancel={() => setStartPickerVisible(false)}
      />
      <DatePicker
        modal
        open={isEndPickerVisible}
        date={endDate}
        mode="time"
        onConfirm={(date) => {
          setEndPickerVisible(false)
          setEndDate(date)
          setNewHabitEnd(formatTime(date))
        }}
        onCancel={() => setEndPickerVisible(false)}
      />
    </>
  )
}

const $container = ({ spacing, colors }: any) => ({
  flex: 1,
  backgroundColor: colors.background,
  marginTop: spacing.xl,
  padding: spacing.lg,
})

const $heading = ({ spacing, colors }: any) => ({
  color: colors.text,
  marginBottom: spacing.sm,
  textAlign: "center" as const,
})

const $subheading = ({ spacing, colors }: any) => ({
  color: colors.textDim,
  marginBottom: spacing.lg,
  textAlign: "center" as const,
})

const $graphContainer = ({ spacing, colors }: any) => ({
  backgroundColor: colors.palette.neutral100,
  borderRadius: 16,
  padding: spacing.md,
  marginBottom: spacing.lg,
  shadowColor: colors.palette.neutral900,
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 2,
})

const $rangeSelector = ({ spacing }: any) => ({
  flexDirection: "row" as const,
  justifyContent: "center" as const,
  marginBottom: spacing.sm,
  gap: 8,
})

const $rangeButton = ({ colors, spacing }: any) => ({
  backgroundColor: colors.palette.neutral300,
  borderRadius: 8,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.xs,
  minWidth: 48,
  marginHorizontal: 2,
})

const $selectedRangeButton = ({ colors, spacing }: any) => ({
  backgroundColor: colors.tint,
  borderRadius: 8,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.xs,
  minWidth: 48,
  marginHorizontal: 2,
})
