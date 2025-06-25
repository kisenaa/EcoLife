import React, { useState } from "react"
import { View, ViewStyle, TextStyle, ScrollView, TouchableOpacity, Linking, StyleSheet } from "react-native"
import { Screen, Text, Icon } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import { LearnStackScreenProps } from "@/navigators/stack/Learn"
import { Card, Chip, List, Divider, Icon as MdIcon, Text as PaperText } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import Svg, { Path, Circle, Rect, Stop, Defs, LinearGradient } from "react-native-svg"

interface VideoPlayerScreenProps extends LearnStackScreenProps<"VideoPlayer"> {}

// Sample lesson data
const lessonContent = [
  {
    id: "1",
    title: "Introduction",
    duration: "04:28 min",
    completed: false,
  },
  {
    id: "2",
    title: "Understanding the Basics",
    duration: "06:12 min",
    completed: false,
  },
  {
    id: "3",
    title: "Create Your First Goal",
    duration: "43:58 min",
    completed: false,
  },
]

// Custom Video Thumbnail SVG
// Fixed Custom Video Thumbnail SVG
// Fixed Custom Video Thumbnail SVG with proper container filling
const VideoThumbnailPlayer = ({ category }: { category: string }) => (
  <Svg
    width="100%"
    height="100%"
    viewBox="0 0 350 200"
    preserveAspectRatio="xMidYMid slice"
    style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
  >
    <Defs>
      <LinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#81C784" stopOpacity={0.3} />
        <Stop offset="50%" stopColor="#64B5F6" stopOpacity={0.2} />
        <Stop offset="100%" stopColor="#FFB74D" stopOpacity={0.1} />
      </LinearGradient>
    </Defs>

    {/* Background with gradient-like effect - fills entire viewBox */}
    <Rect width="100%" height="100%" fill="#B0BEC5" />
    <Rect width="100%" height="100%" fill="url(#gradient)" opacity={0.8} />

    {/* Mountains/landscape silhouette */}
    <Path d="M0 120 L80 80 L140 100 L200 60 L280 90 L350 70 L350 200 L0 200 Z" fill="#37474F" opacity={0.6} />
    <Path d="M0 140 L60 110 L120 130 L180 100 L240 120 L300 105 L350 115 L350 200 L0 200 Z" fill="#263238" opacity={0.4} />

    {/* Play button */}
    <Circle cx={175} cy={100} r={30} fill="#2196F3" opacity={0.95} />
    <Path d="M165 85 L195 100 L165 115 Z" fill="white" />

    {/* Decorative elements */}
    <Circle cx={50} cy={50} r={8} fill="#64B5F6" opacity={0.6} />
    <Circle cx={300} cy={40} r={6} fill="#81C784" opacity={0.7} />
    <Circle cx={320} cy={80} r={4} fill="#FFB74D" opacity={0.5} />
  </Svg>
)

export const VideoPlayerScreen: React.FC<VideoPlayerScreenProps> = function VideoPlayerScreen(props) {
  const { navigation, route } = props
  const { videoId, title, description, duration, category } = route.params
  const { themed, theme } = useAppTheme()
  const insets = useSafeAreaInsets()

  const [activeTab, setActiveTab] = useState<"lessons" | "description">("lessons")
  const [favorited, setFavorited] = useState(false)

  const openYouTubeVideo = async () => {
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`
    const youtubeAppUrl = `vnd.youtube://watch?v=${videoId}`

    try {
      // Try to open in YouTube app first
      const canOpenApp = await Linking.canOpenURL(youtubeAppUrl)
      if (canOpenApp) {
        await Linking.openURL(youtubeAppUrl)
      } else {
        // Fallback to web browser
        await Linking.openURL(youtubeUrl)
      }
    } catch (error) {
      console.error("Failed to open video:", error)
    }
  }

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

          <TouchableOpacity style={themed($favoriteHeaderButton)} onPress={() => setFavorited(!favorited)}>
            <MdIcon
              source={favorited ? "heart" : "heart-outline"}
              size={24}
              color={favorited ? "#4CAF50" : theme.colors.onSurfaceVariant}
            />
          </TouchableOpacity>
        </View>

        {/* Video Thumbnail/Player */}
        <Card style={themed($videoCard)} mode="elevated">
          <TouchableOpacity style={themed($videoThumbnail)} onPress={openYouTubeVideo} activeOpacity={0.8}>
            <VideoThumbnailPlayer category={category} />
            <View style={themed($videoDuration)}>
              <PaperText variant="labelSmall" style={themed($videoDurationText)}>
                {duration}
              </PaperText>
            </View>
          </TouchableOpacity>
        </Card>

        {/* Video Info */}
        <View style={themed($videoInfo)}>
          <PaperText variant="headlineSmall" style={themed($videoTitle)}>
            {title}
          </PaperText>
          <View style={themed($videoMeta)}>
            <View style={themed($videoStats)}>
              <MdIcon source="clock-outline" size={16} color="#4CAF50" />
              <PaperText variant="bodySmall" style={themed($videoStatsText)}>
                6h 30min
              </PaperText>
              <PaperText variant="bodySmall" style={themed($videoStatsText)}>
                •
              </PaperText>
              <PaperText variant="bodySmall" style={themed($videoStatsText)}>
                25 lessons
              </PaperText>
            </View>
            <View style={themed($videoRating)}>
              <MdIcon source="star" size={16} color="#FFD700" />
              <PaperText variant="bodyMedium" style={themed($ratingText)}>
                4.9
              </PaperText>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={themed($tabsContainer)}>
          <TouchableOpacity
            style={[themed($tab), activeTab === "lessons" && themed($activeTab)]}
            onPress={() => setActiveTab("lessons")}
          >
            <PaperText variant="titleSmall" style={[themed($tabText), activeTab === "lessons" && themed($activeTabText)]}>
              Lessons
            </PaperText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[themed($tab), activeTab === "description" && themed($activeTab)]}
            onPress={() => setActiveTab("description")}
          >
            <PaperText variant="titleSmall" style={[themed($tabText), activeTab === "description" && themed($activeTabText)]}>
              Description
            </PaperText>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === "lessons" ? (
          <View style={themed($lessonsContent)}>
            {lessonContent.map((lesson, index) => (
              <TouchableOpacity key={lesson.id} style={themed($lessonItem)} onPress={openYouTubeVideo} activeOpacity={0.7}>
                <View style={themed($lessonIcon)}>
                  <MdIcon source="play" size={20} color="#2196F3" />
                </View>

                <View style={themed($lessonDetails)}>
                  <PaperText variant="titleSmall" style={themed($lessonTitle)}>
                    {lesson.title}
                  </PaperText>
                  <PaperText variant="bodySmall" style={themed($lessonDuration)}>
                    {lesson.duration}
                  </PaperText>
                </View>

                <MdIcon source="chevron-right" size={20} color="#4CAF50" />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={themed($descriptionContent)}>
            <PaperText variant="bodyLarge" style={themed($descriptionText)}>
              {description ||
                "Learn about sustainable living and how to make eco-friendly choices in your daily life. This comprehensive course covers various aspects of environmental conservation and practical tips for reducing your carbon footprint."}
            </PaperText>

            <View style={themed($descriptionDetails)}>
              <PaperText variant="titleMedium" style={themed($detailsTitle)}>
                Course Details:
              </PaperText>
              <PaperText variant="bodyMedium" style={themed($detailsText)}>
                • Interactive video lessons
              </PaperText>
              <PaperText variant="bodyMedium" style={themed($detailsText)}>
                • Practical exercises and tips
              </PaperText>
              <PaperText variant="bodyMedium" style={themed($detailsText)}>
                • Expert guidance and insights
              </PaperText>
              <PaperText variant="bodyMedium" style={themed($detailsText)}>
                • Suitable for all experience levels
              </PaperText>
            </View>
          </View>
        )}

        {/* Bottom spacing */}
        <View style={{ height: 100 }} />
      </View>
    </Screen>
  )
}

// Enhanced Styles
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

const $backButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: "#F5F5F5",
  justifyContent: "center",
  alignItems: "center",
})

const $headerTitle: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: "#4CAF50",
  flex: 1,
  textAlign: "center",
  fontWeight: "600",
})

const $favoriteHeaderButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: "#F5F5F5",
  justifyContent: "center",
  alignItems: "center",
})

const $videoCard: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
  overflow: "hidden",
  elevation: 3,
  borderRadius: 16,
})

const $videoThumbnail: ThemedStyle<ViewStyle> = () => ({
  height: 200,
  position: "relative",
  overflow: "hidden",
})

const $videoDuration: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  position: "absolute",
  bottom: spacing.sm,
  right: spacing.sm,
  backgroundColor: "rgba(0,0,0,0.8)",
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xs,
  borderRadius: 8,
})

const $videoDurationText: ThemedStyle<TextStyle> = () => ({
  color: "white",
  fontWeight: "600",
})

const $videoInfo: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $videoTitle: ThemedStyle<TextStyle> = ({ spacing }) => ({
  color: "#4CAF50",
  marginBottom: spacing.sm,
  fontWeight: "700",
})

const $videoMeta: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
})

const $videoStats: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.xs,
})

const $videoStatsText: ThemedStyle<TextStyle> = () => ({
  color: "#757575",
})

const $videoRating: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.xs,
})

const $ratingText: ThemedStyle<TextStyle> = () => ({
  fontWeight: "600",
  color: "#212121",
})

const $tabsContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  marginBottom: spacing.lg,
  borderBottomWidth: 1,
  borderBottomColor: "#E0E0E0",
})

const $tab: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  paddingVertical: spacing.md,
  alignItems: "center",
})

const $activeTab: ThemedStyle<ViewStyle> = () => ({
  borderBottomWidth: 3,
  borderBottomColor: "#2196F3",
})

const $tabText: ThemedStyle<TextStyle> = () => ({
  color: "#9E9E9E",
})

const $activeTabText: ThemedStyle<TextStyle> = () => ({
  color: "#2196F3",
  fontWeight: "600",
})

const $lessonsContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.sm,
})

const $lessonItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  padding: spacing.md,
  backgroundColor: "white",
  borderRadius: 16,
  gap: spacing.md,
  elevation: 1,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 4,
})

const $lessonIcon: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: 44,
  height: 44,
  borderRadius: 22,
  backgroundColor: "#E3F2FD",
  justifyContent: "center",
  alignItems: "center",
})

const $lessonDetails: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $lessonTitle: ThemedStyle<TextStyle> = () => ({
  color: "#212121",
  marginBottom: 4,
  fontWeight: "600",
})

const $lessonDuration: ThemedStyle<TextStyle> = () => ({
  color: "#4CAF50",
  fontWeight: "500",
})

const $descriptionContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.lg,
})

const $descriptionText: ThemedStyle<TextStyle> = ({ spacing }) => ({
  color: "#424242",
  lineHeight: 24,
  marginBottom: spacing.lg,
})

const $descriptionDetails: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.sm,
})

const $detailsTitle: ThemedStyle<TextStyle> = ({ spacing }) => ({
  color: "#212121",
  marginBottom: spacing.sm,
  fontWeight: "600",
})

const $detailsText: ThemedStyle<TextStyle> = () => ({
  color: "#757575",
  lineHeight: 22,
})
