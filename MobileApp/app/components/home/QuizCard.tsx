import React, { useState } from "react"
import { View } from "react-native"
import { Text, Button } from "../../components"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import type { ViewStyle, TextStyle } from "react-native"

interface QuizCardProps {
  quiz: {
    question: string
    answer: string
    explanation: string
  }
}

export const QuizCard: React.FC<QuizCardProps> = ({ quiz }) => {
  const { themed } = useAppTheme({ useForest: true })
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <View style={themed($quizCard)}>
      {!isFlipped ? (
        <>
          <Text preset="subheading" style={themed($widgetTitle)}>Knowledge Sprout</Text>
          <Text style={themed($quizQuestion)}>{quiz.question}</Text>
          <Button
            text="Reveal Answer"
            preset="reversed"
            style={themed($quizButton)}
            onPress={() => setIsFlipped(true)}
          />
        </>
      ) : (
        <>
          <Text preset="subheading" style={themed($widgetTitle)}>{quiz.answer}</Text>
          <Text style={themed($quizQuestion)}>{quiz.explanation}</Text>
          <Button
            text="Got it!"
            preset="default"
            style={themed($quizButton)}
            onPress={() => setIsFlipped(false)}
          />
        </>
      )}
    </View>
  )
}

const $quizCard: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.background,
  borderRadius: 16,
  padding: spacing.md, // less padding
  minHeight: 120, // reduced minHeight
  justifyContent: 'space-between',
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
})
const $widgetTitle: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  fontSize: 20,
  fontFamily: "Poppins-SemiBold",
})
const $quizQuestion: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  fontSize: 16,
  lineHeight: 24,
  marginVertical: spacing.md,
  flex: 1,
})
const $quizButton: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.primary500,
  borderWidth: 0,
})
const $quizButtonText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: '#fff',
  fontWeight: 'bold',
})
