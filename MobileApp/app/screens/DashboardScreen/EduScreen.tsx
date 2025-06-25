import React, { useState } from "react"
import { View, ViewStyle, TextStyle, ScrollView, TouchableOpacity, ImageStyle } from "react-native"
import { Screen, Text, Icon } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import { LearnStackScreenProps } from "@/navigators/stack/Learn"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Card, Searchbar, Chip, Icon as MdIcon, Text as PaperText, Tooltip } from "react-native-paper"
import Svg, { Path, Circle, Rect } from "react-native-svg"

interface EduScreenProps extends LearnStackScreenProps<"LearnMain"> {}

// Sample data for educational content
const categories = [
  { id: "climate", label: "Climate Change", color: "#2196F3" },
  { id: "co2", label: "CO2 Carbon", color: "#4CAF50" },
  { id: "sustainable", label: "Sustainable Life", color: "#FF9800" },
  { id: "energy", label: "Energy Conservation", color: "#9C27B0" },
  { id: "waste", label: "Waste Reduction", color: "#F44336" },
]

const popularLessons = [
  {
    id: "1",
    title: "Climate Change",
    subtitle: "Understanding Global Warming",
    difficulty: "Intermediate",
    lessons: 25,
    duration: "6h 30min",
    rating: 4.9,
    videoId: "PBkmOhOk8nk",
    category: "climate",
    thumbnail: "climate",
  },
  {
    id: "2",
    title: "Eco-Friendly Habits",
    subtitle: "Sustainable Living Guide",
    difficulty: "Beginner",
    lessons: 18,
    duration: "4h 15min",
    rating: 4.8,
    videoId: "E2kSym9bcCM",
    category: "sustainable",
    thumbnail: "habits",
  },
  {
    id: "3",
    title: "Water & Energy Conservation",
    subtitle: "Save Resources at Home",
    difficulty: "Intermediate",
    lessons: 22,
    duration: "5h 45min",
    rating: 4.7,
    videoId: "HoWSO881-Bg",
    category: "energy",
    thumbnail: "conservation",
  },
]

// Better SVG Icons that match the original design
const TopPicksIcon = () => (
  <Svg width={60} height={60} viewBox="0 0 60 60">
    <Circle cx={30} cy={30} r={28} fill="#E3F2FD" />
    <Path d="M30 12l4 8L44 21l-7 6.5L39 40l-9-4.5L21 40l2-12.5L16 21l10-1L30 12z" fill="#2196F3" />
  </Svg>
)

const VideoThumbnailIcon = ({ category }: { category: string }) => (
  <Svg width={80} height={60} viewBox="0 0 80 60">
    <Rect width={80} height={60} rx={12} fill="#E3F2FD" stroke="#B3E5FC" strokeWidth={2} />
    <Circle cx={40} cy={30} r={12} fill="#2196F3" opacity={0.9} />
    <Path d="M35 24l14 6-14 6V24z" fill="white" />
    {/* Video progress bar */}
    <Rect x={8} y={48} width={64} height={4} rx={2} fill="#E0E0E0" />
    <Rect x={8} y={48} width={20} height={4} rx={2} fill="#2196F3" />
  </Svg>
)

export const EduScreen: React.FC<EduScreenProps> = function EduScreen(props) {
  const { navigation } = props
  const { themed, theme } = useAppTheme()
  const insets = useSafeAreaInsets()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const handleVideoPress = (lesson: (typeof popularLessons)[0]) => {
    navigation.navigate("VideoPlayer", {
      videoId: lesson.videoId,
      title: lesson.title,
      description: lesson.subtitle,
      duration: lesson.duration,
      category: lesson.category,
    })
  }

  const filteredLessons = popularLessons.filter((lesson) => {
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || lesson.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const [favorites, setFavorites] = useState<string[]>([])

  const toggleFavorite = (lessonId: string) => {
    setFavorites((prev) => (prev.includes(lessonId) ? prev.filter((id) => id !== lessonId) : [...prev, lessonId]))
  }

  const handleQuizPress = () => {
    navigation.navigate("Quiz", {
      category: selectedCategory || "general",
      title: selectedCategory ? `${selectedCategory} Quiz` : "Eco Knowledge Quiz",
    })
  }

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} backgroundColor={theme.colors.background}>
      <View style={themed($container)}>
        {/* Header */}
        <View style={themed($header)}>
          <TouchableOpacity style={themed($headerButton)}>
            <MdIcon source="bell" size={22} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity style={themed($headerButton)}>
            <MdIcon source="menu" size={22} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={themed($searchContainer)}>
          <Searchbar
            placeholder="Search for..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={themed($searchBar)}
            inputStyle={themed($searchInput)}
            iconColor="#9E9E9E"
            placeholderTextColor="#9E9E9E"
          />
          <Tooltip title="Filter">
            <TouchableOpacity style={themed($filterButton)}>
              <MdIcon source="tune" size={18} color="white" />
            </TouchableOpacity>
          </Tooltip>
        </View>

        {/* Top Picks Banner */}
        <Card style={themed($topPicksCard)} mode="elevated">
          <Card.Content style={themed($topPicksContent)}>
            <View style={themed($topPicksText)}>
              <Text style={themed($topPicksLabel)}>Discover Top Picks</Text>
              <Text style={themed($topPicksNumber)}>+100</Text>
              <Text style={themed($topPicksSubtext)}>lessons</Text>
              <TouchableOpacity style={themed($exploreButton)}>
                <Text style={themed($exploreButtonText)}>Explore more</Text>
              </TouchableOpacity>
            </View>
            <View style={themed($topPicksIcon)}>
              <TopPicksIcon />
            </View>
          </Card.Content>
        </Card>

        {/* Categories */}
        <View style={themed($categoriesSection)}>
          <View style={themed($sectionHeader)}>
            <Text style={themed($sectionTitle)}>Categories</Text>
            <TouchableOpacity>
              <Text style={themed($seeAllButton)}>SEE ALL</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={themed($categoriesContainer)}>
            {categories.map((category) => (
              <Chip
                key={category.id}
                selected={selectedCategory === category.id}
                onPress={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                style={[themed($categoryChip), selectedCategory === category.id && { backgroundColor: category.color }]}
                textStyle={[themed($categoryChipText), selectedCategory === category.id && { color: "white" }]}
                mode="flat"
              >
                {category.label}
              </Chip>
            ))}
          </ScrollView>
        </View>

        {/* Quiz Challenge Button */}
        <Card style={themed($quizCard)} mode="elevated">
          <TouchableOpacity style={themed($quizButton)} onPress={handleQuizPress} activeOpacity={0.8}>
            <View style={themed($quizContent)}>
              <View style={themed($quizIcon)}>
                <MdIcon source="head-question" size={24} color="#FF6B35" />
              </View>
              <View style={themed($quizText)}>
                <PaperText variant="titleMedium" style={themed($quizTitle)}>
                  Take Quiz Challenge
                </PaperText>
                <PaperText variant="bodySmall" style={themed($quizSubtitle)}>
                  Test your eco knowledge • 10 questions
                </PaperText>
              </View>
              <MdIcon source="chevron-right" size={20} color="#4CAF50" />
            </View>
          </TouchableOpacity>
        </Card>

        {/* Popular Lessons */}
        <View style={themed($lessonsSection)}>
          <View style={themed($sectionHeader)}>
            <Text style={themed($sectionTitle)}>Popular lessons</Text>
            <TouchableOpacity>
              <Text style={themed($seeAllButton)}>See All</Text>
            </TouchableOpacity>
          </View>

          {filteredLessons.map((lesson) => (
            <TouchableOpacity
              key={lesson.id}
              style={themed($lessonCard)}
              onPress={() => handleVideoPress(lesson)}
              activeOpacity={0.8}
            >
              <View style={themed($lessonThumbnail)}>
                <VideoThumbnailIcon category={lesson.category} />
              </View>

              <View style={themed($lessonContent)}>
                <Text style={themed($lessonTitle)}>{lesson.title}</Text>
                <Text style={themed($lessonSubtitle)}>
                  {lesson.difficulty} • {lesson.lessons} lessons
                </Text>

                <View style={themed($lessonFooter)}>
                  <View style={themed($ratingContainer)}>
                    <MdIcon source="star" size={14} color="#FFD700" />
                    <Text style={themed($ratingText)}>{lesson.rating}</Text>
                    <Text style={themed($durationText)}>• {lesson.duration}</Text>
                  </View>

                  <TouchableOpacity style={themed($favoriteButton)} onPress={() => toggleFavorite(lesson.id)}>
                    <MdIcon source={favorites.includes(lesson.id) ? "heart" : "heart-outline"} size={16} color="#F44336" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom spacing for tab bar */}
        <View style={{ height: 100 }} />
      </View>
    </Screen>
  )
}

// Fixed Styles
const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  paddingHorizontal: spacing.md,
})

const $header: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingTop: spacing.sm,
  marginBottom: spacing.lg,
})

const $headerButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: "#F5F5F5",
  justifyContent: "center",
  alignItems: "center",
})

const $searchContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  marginBottom: spacing.lg,
  gap: spacing.sm,
})

const $searchBar: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  backgroundColor: "white",
  elevation: 0,
  borderWidth: 1,
  borderColor: "#E0E0E0",
})

const $searchInput: ThemedStyle<TextStyle> = () => ({
  color: "#424242",
})

const $filterButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  backgroundColor: "#2196F3",
  width: 40,
  height: 40,
  borderRadius: 12,
  justifyContent: "center",
  alignItems: "center",
})

const $topPicksCard: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
  backgroundColor: "#E3F2FD",
  elevation: 0,
  borderRadius: 16,
})

const $topPicksContent: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
})

const $topPicksText: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $topPicksLabel: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  fontWeight: "500",
  color: "#1976D2",
  marginBottom: 4,
})

const $topPicksNumber: ThemedStyle<TextStyle> = () => ({
  fontSize: 36,
  fontWeight: "bold",
  color: "#1976D2",
  lineHeight: 40,
})

const $topPicksSubtext: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  color: "#1976D2",
  opacity: 0.8,
})

const $exploreButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  backgroundColor: "#2196F3",
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.sm,
  borderRadius: 10,
  marginTop: spacing.md,
  alignSelf: "flex-start",
})

const $exploreButtonText: ThemedStyle<TextStyle> = () => ({
  color: "white",
  fontWeight: "600",
  fontSize: 14,
})

const $topPicksIcon: ThemedStyle<ViewStyle> = () => ({
  marginLeft: 16,
})

const $categoriesSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $sectionHeader: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: spacing.md,
})

const $sectionTitle: ThemedStyle<TextStyle> = () => ({
  fontSize: 18,
  fontWeight: "600",
  color: "#212121",
})

const $seeAllButton: ThemedStyle<TextStyle> = () => ({
  fontSize: 14,
  fontWeight: "600",
  color: "#2196F3",
})

const $categoriesContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.sm,
  paddingRight: spacing.md,
})

const $categoryChip: ThemedStyle<ViewStyle> = () => ({
  backgroundColor: "#F5F5F5",
  borderColor: "#E0E0E0",
})

const $categoryChipText: ThemedStyle<TextStyle> = () => ({
  color: "#424242",
  fontSize: 14,
})

const $lessonsSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $lessonCard: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  backgroundColor: "white",
  borderRadius: 16,
  padding: spacing.md,
  marginBottom: spacing.md,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 8,
  elevation: 2,
})

const $lessonThumbnail: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginRight: spacing.md,
  justifyContent: "center",
  alignItems: "center",
})

const $lessonContent: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  justifyContent: "space-between",
})

const $lessonTitle: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  fontWeight: "600",
  color: "#212121",
  marginBottom: 4,
})

const $lessonSubtitle: ThemedStyle<TextStyle> = () => ({
  fontSize: 14,
  color: "#757575",
  marginBottom: 8,
})

const $lessonFooter: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
})

const $ratingContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.xs,
})

const $ratingText: ThemedStyle<TextStyle> = () => ({
  fontSize: 12,
  color: "#757575",
  fontWeight: "600",
})

const $durationText: ThemedStyle<TextStyle> = () => ({
  fontSize: 12,
  color: "#757575",
})

const $favoriteButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.xs,
})

const $quizCard: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
  elevation: 2,
  borderRadius: 16,
})

const $quizButton: ThemedStyle<ViewStyle> = () => ({
  borderRadius: 16,
})

const $quizContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  padding: spacing.md,
  gap: spacing.md,
})

const $quizIcon: ThemedStyle<ViewStyle> = () => ({
  width: 48,
  height: 48,
  borderRadius: 24,
  backgroundColor: "#FFF3E0",
  justifyContent: "center",
  alignItems: "center",
})

const $quizText: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $quizTitle: ThemedStyle<TextStyle> = () => ({
  color: "#212121",
  fontWeight: "600",
  marginBottom: 2,
})

const $quizSubtitle: ThemedStyle<TextStyle> = () => ({
  color: "#757575",
})
