import React, { useState, useEffect } from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import { Screen, Text } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import { LearnStackScreenProps } from "@/navigators/stack/Learn"
import { Card, Button, Icon as MdIcon, Text as PaperText, ProgressBar } from "react-native-paper"
import { TouchableOpacity } from "react-native"

interface QuizScreenProps extends LearnStackScreenProps<"Quiz"> {}

// Quiz questions data
const quizQuestions = [
  {
    id: 1,
    question: "What is the main cause of climate change?",
    options: ["Solar flares", "Greenhouse gas emissions", "Ocean currents", "Volcanic activity"],
    correctAnswer: 1,
    explanation: "Greenhouse gas emissions from human activities are the primary driver of climate change.",
  },
  {
    id: 2,
    question: "Which gas contributes most to global warming?",
    options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Helium"],
    correctAnswer: 2,
    explanation: "Carbon dioxide (CO2) is the most significant greenhouse gas contributing to global warming.",
  },
  {
    id: 3,
    question: "What percentage of plastic waste is recycled globally?",
    options: ["Less than 10%", "About 25%", "Around 50%", "Over 75%"],
    correctAnswer: 0,
    explanation:
      "Less than 10% of plastic waste is actually recycled globally, highlighting the importance of reducing plastic use.",
  },
  {
    id: 4,
    question: "Which renewable energy source is most widely used?",
    options: ["Solar", "Wind", "Hydroelectric", "Geothermal"],
    correctAnswer: 2,
    explanation: "Hydroelectric power is currently the most widely used renewable energy source globally.",
  },
  {
    id: 5,
    question: "How much water can a leaky faucet waste per day?",
    options: ["1 gallon", "5 gallons", "10 gallons", "20+ gallons"],
    correctAnswer: 3,
    explanation: "A single leaky faucet can waste over 20 gallons of water per day, emphasizing the importance of fixing leaks.",
  },
  {
    id: 6,
    question: "What is the most effective way to reduce your carbon footprint?",
    options: ["Recycling more", "Using public transport", "Eating less meat", "All of the above"],
    correctAnswer: 3,
    explanation: "All these actions significantly reduce carbon footprint, with transportation and diet being major factors.",
  },
  {
    id: 7,
    question: "How long does it take for a plastic bottle to decompose?",
    options: ["1 year", "10 years", "100 years", "450+ years"],
    correctAnswer: 3,
    explanation: "Plastic bottles can take 450+ years to decompose, making plastic reduction crucial for environmental health.",
  },
  {
    id: 8,
    question: "Which appliance uses the most energy in most homes?",
    options: ["Refrigerator", "Air conditioning", "Water heater", "Television"],
    correctAnswer: 1,
    explanation: "Air conditioning typically uses the most energy in homes, especially in warmer climates.",
  },
  {
    id: 9,
    question: "What percentage of the Earth's water is fresh water?",
    options: ["50%", "25%", "10%", "Less than 3%"],
    correctAnswer: 3,
    explanation: "Less than 3% of Earth's water is fresh water, making water conservation extremely important.",
  },
  {
    id: 10,
    question: "Which transportation method produces the least CO2 per mile?",
    options: ["Car", "Bus", "Train", "Bicycle"],
    correctAnswer: 3,
    explanation: "Bicycles produce zero direct emissions and are the most environmentally friendly transportation option.",
  },
]

export const QuizScreen: React.FC<QuizScreenProps> = function QuizScreen(props) {
  const { navigation, route } = props
  const { category, title } = route.params
  const { themed, theme } = useAppTheme()

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(10)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [answers, setAnswers] = useState<boolean[]>([])

  // Timer logic
  useEffect(() => {
    if (timeLeft > 0 && !showResult && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showResult) {
      handleNextQuestion()
    }
  }, [timeLeft, showResult, quizCompleted])

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer === null) {
      setSelectedAnswer(answerIndex)
      const isCorrect = answerIndex === quizQuestions[currentQuestion].correctAnswer

      if (isCorrect) {
        setScore(score + 1)
      }

      setAnswers([...answers, isCorrect])
      setShowResult(true)
    }
  }

  const handleNextQuestion = () => {
    if (selectedAnswer === null) {
      // Time ran out, mark as incorrect
      setAnswers([...answers, false])
    }

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setTimeLeft(10)
    } else {
      setQuizCompleted(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setScore(0)
    setShowResult(false)
    setTimeLeft(10)
    setQuizCompleted(false)
    setAnswers([])
  }

  const getScoreColor = () => {
    const percentage = (score / quizQuestions.length) * 100
    if (percentage >= 80) return "#4CAF50"
    if (percentage >= 60) return "#FF9800"
    return "#F44336"
  }

  const getScoreMessage = () => {
    const percentage = (score / quizQuestions.length) * 100
    if (percentage >= 80) return "Excellent! You're an eco champion! 🌟"
    if (percentage >= 60) return "Good job! Keep learning about sustainability! 🌱"
    return "Keep studying! Every step towards eco-awareness counts! 📚"
  }

  if (quizCompleted) {
    return (
      <Screen preset="scroll" safeAreaEdges={["top"]} backgroundColor={theme.colors.background}>
        <View style={themed($container)}>
          {/* Header */}
          <View style={themed($header)}>
            <TouchableOpacity style={themed($backButton)} onPress={() => navigation.goBack()}>
              <MdIcon source="arrow-left" size={24} color={theme.colors.onSurface} />
            </TouchableOpacity>
            <PaperText variant="titleMedium" style={themed($headerTitle)}>
              Quiz Complete
            </PaperText>
            <View style={themed($backButton)} />
          </View>

          <View style={themed($resultContainer)}>
            <Card style={themed($resultCard)} mode="elevated">
              <Card.Content style={themed($resultContent)}>
                <View style={themed($scoreCircle)}>
                  <PaperText variant="headlineLarge" style={[themed($scoreText), { color: getScoreColor() }]}>
                    {score}
                  </PaperText>
                  <PaperText variant="bodyMedium" style={themed($scoreTotal)}>
                    / {quizQuestions.length}
                  </PaperText>
                </View>

                <PaperText variant="headlineSmall" style={themed($resultTitle)}>
                  {getScoreMessage()}
                </PaperText>

                <View style={themed($resultStats)}>
                  <View style={themed($statItem)}>
                    <MdIcon source="check-circle" size={24} color="#4CAF50" />
                    <PaperText variant="bodyMedium" style={themed($statText)}>
                      {score} Correct
                    </PaperText>
                  </View>
                  <View style={themed($statItem)}>
                    <MdIcon source="close-circle" size={24} color="#F44336" />
                    <PaperText variant="bodyMedium" style={themed($statText)}>
                      {quizQuestions.length - score} Wrong
                    </PaperText>
                  </View>
                </View>

                <View style={themed($resultActions)}>
                  <Button mode="outlined" onPress={resetQuiz} style={themed($retryButton)} labelStyle={themed($retryButtonText)}>
                    Try Again
                  </Button>
                  <Button
                    mode="contained"
                    onPress={() => navigation.goBack()}
                    style={themed($doneButton)}
                    labelStyle={themed($doneButtonText)}
                  >
                    Done
                  </Button>
                </View>
              </Card.Content>
            </Card>
          </View>
        </View>
      </Screen>
    )
  }

  const question = quizQuestions[currentQuestion]
  const progress = (currentQuestion + 1) / quizQuestions.length

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} backgroundColor={theme.colors.background}>
      <View style={themed($container)}>
        {/* Header */}
        <View style={themed($header)}>
          <TouchableOpacity style={themed($backButton)} onPress={() => navigation.goBack()}>
            <MdIcon source="arrow-left" size={24} color={theme.colors.onSurface} />
          </TouchableOpacity>
          <PaperText variant="titleMedium" style={themed($headerTitle)}>
            {title}
          </PaperText>
          <View style={themed($timerContainer)}>
            <PaperText variant="titleMedium" style={themed($timerText)}>
              {timeLeft}s
            </PaperText>
          </View>
        </View>

        {/* Progress */}
        <View style={themed($progressContainer)}>
          <PaperText variant="bodyMedium" style={themed($progressText)}>
            Question {currentQuestion + 1} of {quizQuestions.length}
          </PaperText>
          <ProgressBar progress={progress} color="#4CAF50" style={themed($progressBar)} />
        </View>

        {/* Question */}
        <Card style={themed($questionCard)} mode="elevated">
          <Card.Content>
            <PaperText variant="headlineSmall" style={themed($questionText)}>
              {question.question}
            </PaperText>
          </Card.Content>
        </Card>

        {/* Options */}
        <View style={themed($optionsContainer)}>
          {question.options.map((option, index) => {
            let optionStyle = themed($option)
            let optionTextStyle = themed($optionText)

            if (showResult && selectedAnswer !== null) {
              if (index === question.correctAnswer) {
                optionStyle = [optionStyle, themed($correctOption)]
                optionTextStyle = [optionTextStyle, themed($correctOptionText)]
              } else if (index === selectedAnswer) {
                optionStyle = [optionStyle, themed($wrongOption)]
                optionTextStyle = [optionTextStyle, themed($wrongOptionText)]
              }
            }

            return (
              <TouchableOpacity
                key={index}
                style={optionStyle}
                onPress={() => handleAnswerSelect(index)}
                disabled={showResult}
                activeOpacity={0.7}
              >
                <View style={themed($optionContent)}>
                  <View style={themed($optionNumber)}>
                    <PaperText variant="bodyMedium" style={themed($optionNumberText)}>
                      {String.fromCharCode(65 + index)}
                    </PaperText>
                  </View>
                  <PaperText variant="bodyLarge" style={optionTextStyle}>
                    {option}
                  </PaperText>
                </View>
              </TouchableOpacity>
            )
          })}
        </View>

        {/* Explanation */}
        {showResult && (
          <Card style={themed($explanationCard)} mode="elevated">
            <Card.Content>
              <PaperText variant="bodyMedium" style={themed($explanationText)}>
                {question.explanation}
              </PaperText>
            </Card.Content>
          </Card>
        )}

        {/* Next Button */}
        {showResult && (
          <Button mode="contained" onPress={handleNextQuestion} style={themed($nextButton)} labelStyle={themed($nextButtonText)}>
            {currentQuestion < quizQuestions.length - 1 ? "Next Question" : "Finish Quiz"}
          </Button>
        )}
      </View>
    </Screen>
  )
}

// Styles
const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  paddingHorizontal: spacing.md,
})

const $header: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingVertical: spacing.md,
  marginBottom: spacing.md,
})

const $backButton: ThemedStyle<ViewStyle> = () => ({
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: "#F5F5F5",
  justifyContent: "center",
  alignItems: "center",
})

const $headerTitle: ThemedStyle<TextStyle> = () => ({
  color: "#4CAF50",
  flex: 1,
  textAlign: "center",
  fontWeight: "600",
})

const $timerContainer: ThemedStyle<ViewStyle> = () => ({
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: "#FF6B35",
  justifyContent: "center",
  alignItems: "center",
})

const $timerText: ThemedStyle<TextStyle> = () => ({
  color: "white",
  fontWeight: "bold",
  fontSize: 14,
})

const $progressContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $progressText: ThemedStyle<TextStyle> = ({ spacing }) => ({
  color: "#757575",
  marginBottom: spacing.sm,
  textAlign: "center",
})

const $progressBar: ThemedStyle<ViewStyle> = () => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: "#E0E0E0",
})

const $questionCard: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
  elevation: 3,
  backgroundColor: "white",
  borderRadius: 16,
})

const $questionText: ThemedStyle<TextStyle> = () => ({
  color: "#212121",
  textAlign: "center",
  lineHeight: 28,
  fontSize: 18,
  fontWeight: "600",
})

const $optionsContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.md,
  marginBottom: spacing.lg,
})

const $option: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  backgroundColor: "white",
  borderRadius: 12,
  padding: spacing.md,
  elevation: 1,
  borderWidth: 2,
  borderColor: "#E0E0E0",
})

const $correctOption: ThemedStyle<ViewStyle> = () => ({
  backgroundColor: "#E8F5E8",
  borderColor: "#4CAF50",
})

const $wrongOption: ThemedStyle<ViewStyle> = () => ({
  backgroundColor: "#FFEBEE",
  borderColor: "#F44336",
})

const $optionContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.md,
})

const $optionNumber: ThemedStyle<ViewStyle> = () => ({
  width: 32,
  height: 32,
  borderRadius: 16,
  backgroundColor: "#F5F5F5",
  justifyContent: "center",
  alignItems: "center",
})

const $optionNumberText: ThemedStyle<TextStyle> = () => ({
  color: "#757575",
  fontWeight: "600",
})

const $optionText: ThemedStyle<TextStyle> = () => ({
  color: "#212121",
  flex: 1,
})

const $correctOptionText: ThemedStyle<TextStyle> = () => ({
  color: "#2E7D32",
  fontWeight: "600",
})

const $wrongOptionText: ThemedStyle<TextStyle> = () => ({
  color: "#C62828",
  fontWeight: "600",
})

const $explanationCard: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
  backgroundColor: "#E3F2FD",
  elevation: 1,
})

const $explanationText: ThemedStyle<TextStyle> = () => ({
  color: "#1565C0",
  fontStyle: "italic",
  lineHeight: 20,
})

const $nextButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  backgroundColor: "#4CAF50",
  borderRadius: 12,
  marginBottom: spacing.lg,
})

const $nextButtonText: ThemedStyle<TextStyle> = () => ({
  color: "white",
  fontWeight: "600",
  fontSize: 16,
})

const $resultContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  justifyContent: "center",
})

const $resultCard: ThemedStyle<ViewStyle> = () => ({
  elevation: 4,
  borderRadius: 20,
})

const $resultContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  gap: spacing.lg,
})

const $scoreCircle: ThemedStyle<ViewStyle> = () => ({
  alignItems: "center",
  justifyContent: "center",
  width: 120,
  height: 120,
  borderRadius: 60,
  backgroundColor: "#F5F5F5",
})

const $scoreText: ThemedStyle<TextStyle> = () => ({
  fontWeight: "bold",
})

const $scoreTotal: ThemedStyle<TextStyle> = () => ({
  color: "#757575",
})

const $resultTitle: ThemedStyle<TextStyle> = () => ({
  color: "#212121",
  textAlign: "center",
  fontWeight: "600",
})

const $resultStats: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  gap: spacing.xl,
})

const $statItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  gap: spacing.sm,
})

const $statText: ThemedStyle<TextStyle> = () => ({
  color: "#757575",
  fontWeight: "500",
})

const $resultActions: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  gap: spacing.md,
  width: "100%",
})

const $retryButton: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  borderColor: "#4CAF50",
})

const $retryButtonText: ThemedStyle<TextStyle> = () => ({
  color: "#4CAF50",
  fontWeight: "600",
})

const $doneButton: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  backgroundColor: "#4CAF50",
})

const $doneButtonText: ThemedStyle<TextStyle> = () => ({
  color: "white",
  fontWeight: "600",
})
