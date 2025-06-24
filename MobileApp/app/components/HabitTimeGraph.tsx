import React from "react"
import { View, Dimensions, ScrollView } from "react-native"
import { Text } from "./Text"
import { BarChart } from "react-native-chart-kit"
import { useAppTheme } from "@/utils/useAppTheme"

interface Habit {
  id: string
  name: string
  completed: boolean
  time: string // e.g. "08:00" or "08:00-08:30"
}

interface HabitTimeGraphProps {
  habits: Habit[]
  timeRange: 24 | 12 | 6 | 3
}

function getTimeLabels() {
  // Always return 24 hour labels, starting at 00:00
  return Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`)
}

export const HabitTimeGraph: React.FC<HabitTimeGraphProps> = ({ habits, timeRange }) => {
  const { theme } = useAppTheme({ useForest: true })
  const screenWidth = Dimensions.get("window").width
  const labels = getTimeLabels()
  const data = Array(24).fill(0)

  habits.forEach(habit => {
    let times: number[] = []
    if (habit.time.includes("-")) {
      const [start, end] = habit.time.split("-").map(t => t.trim())
      const startHour = parseInt(start.split(":")[0], 10)
      const endHour = parseInt(end.split(":")[0], 10)
      for (let h = startHour; h <= endHour; h++) {
        times.push(h)
      }
    } else {
      times.push(parseInt(habit.time.split(":")[0], 10))
    }
    times.forEach(h => {
      if (h >= 0 && h < data.length) data[h]++
    })
  })

  // X-axis label logic: show only some hour labels to avoid crowding
  let displayLabels = labels.map((l, i) => {
    if (timeRange === 24) return i % 3 === 0 ? l : ""
    if (timeRange === 12) return i % 2 === 0 ? l : ""
    if (timeRange === 6) return l // show all for 6h and 3h
    if (timeRange === 3) return l
    return l
  })

  // Chart width logic: zoom level
  let chartWidth = screenWidth
  if (timeRange === 12) chartWidth = screenWidth * 2
  if (timeRange === 6) chartWidth = screenWidth * 4
  if (timeRange === 3) chartWidth = screenWidth * 8

  return (
    <View style={{ marginBottom: theme.spacing.lg }}>
      <Text
        preset="subheading"
        text={`Habits Timeline (Zoom: ${timeRange}h)`}
        style={{ textAlign: "center", marginBottom: 8 }}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        <View>
          <BarChart
            data={{
              labels: displayLabels,
              datasets: [
                {
                  data: data,
                },
              ],
            }}
            width={chartWidth}
            height={180}
            yAxisLabel={""}
            yAxisSuffix={""}
            chartConfig={{
              backgroundColor: theme.colors.background,
              backgroundGradientFrom: theme.colors.background,
              backgroundGradientTo: theme.colors.background,
              decimalPlaces: 0,
              color: () => theme.colors.tint,
              labelColor: () => theme.colors.textDim,
              style: { borderRadius: 8 },
              propsForBackgroundLines: {
                stroke: theme.colors.border,
                strokeDasharray: "2,2",
              },
            }}
            style={{
              borderRadius: 8,
              marginLeft: -90, // This pulls the chart left to remove the default padding
            }}
            fromZero
            showBarTops={false}
            withInnerLines
            withHorizontalLabels={false}
            withVerticalLabels={true}
          />
        </View>
      </ScrollView>
    </View>
  )
}
