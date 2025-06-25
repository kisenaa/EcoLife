import React, { useState, useRef } from "react"
import { View, ScrollView, Alert, StyleSheet } from "react-native"
import {
  Card,
  Text,
  Button,
  IconButton,
  Avatar,
  Chip,
  Menu,
  FAB,
  Portal,
  Modal,
  TextInput,
  Snackbar,
  Divider,
} from "react-native-paper"
import { Screen } from "../../components"
import { DashboardTabScreenProps } from "../../navigators/DashboardNavigator"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface FeedItem {
  id: string
  title: string
  content: string
  author: string
  avatar: string
  timestamp: string
  likes: number
  comments: number
  tags: string[]
  liked: boolean
}

// Custom colors
const colors = {
  primary: "#4CAF50",
  background: "#F8FBF8",
  surface: "#FFFFFF",
  text: "#2E7D32",
  textSecondary: "#66BB6A",
  textDim: "#81C784",
  border: "#C8E6C9",
  error: "#F44336",
  success: "#4CAF50",
}

export const FeedPost: React.FC<DashboardTabScreenProps<"feed">> = function FeedPost(_props) {
  const insets = useSafeAreaInsets()

  // Sample initial data
  const [feeds, setFeeds] = useState<FeedItem[]>([
    {
      id: "1",
      title: "My Garden Progress",
      content:
        "Just harvested my first batch of tomatoes from my home garden! The feeling of growing your own food is incredible. Started with just a small patch in my backyard and now I have enough vegetables to share with neighbors. 🍅🌱",
      author: "Sarah Green",
      avatar: "https://i.pravatar.cc/150?img=1",
      timestamp: "2 hours ago",
      likes: 24,
      comments: 8,
      tags: ["gardening", "harvest", "organic"],
      liked: false,
    },
    {
      id: "2",
      title: "Solar Panel Installation",
      content:
        "Finally installed solar panels on my roof! It took 3 months of planning and research, but I'm excited to start generating clean energy. The installation team was professional and the panels look great. Can't wait to see my first energy bill! ☀️⚡",
      author: "Mike Johnson",
      avatar: "https://i.pravatar.cc/150?img=2",
      timestamp: "5 hours ago",
      likes: 42,
      comments: 15,
      tags: ["solar", "renewable", "sustainability"],
      liked: true,
    },
    {
      id: "3",
      title: "Zero Waste Challenge Week 1",
      content:
        "Completed my first week of the zero waste challenge! It's harder than I thought, but I'm learning so much about mindful consumption. Switched to reusable containers, composting food scraps, and buying in bulk. Small steps towards a greener lifestyle! 🌍♻️",
      author: "Emma Davis",
      avatar: "https://i.pravatar.cc/150?img=3",
      timestamp: "1 day ago",
      likes: 18,
      comments: 12,
      tags: ["zerowaste", "challenge", "lifestyle"],
      liked: false,
    },
  ])

  // Modal states
  const [modalVisible, setModalVisible] = useState(false)
  const [editingFeed, setEditingFeed] = useState<FeedItem | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Form states
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState("")
  const [loading, setLoading] = useState(false)

  // Menu states
  const [visibleMenus, setVisibleMenus] = useState<{ [key: string]: boolean }>({})
  const [snackbar, setSnackbar] = useState({ visible: false, message: "" })

  const scrollRef = useRef<ScrollView>(null)

  const openMenu = (feedId: string) => {
    setVisibleMenus({ ...visibleMenus, [feedId]: true })
  }

  const closeMenu = (feedId: string) => {
    setVisibleMenus({ ...visibleMenus, [feedId]: false })
  }

  const handleAddFeed = () => {
    setIsEditing(false)
    setTitle("")
    setContent("")
    setTags("")
    setEditingFeed(null)
    setModalVisible(true)
  }

  const handleEditFeed = (feed: FeedItem) => {
    setIsEditing(true)
    setTitle(feed.title)
    setContent(feed.content)
    setTags(feed.tags.join(", "))
    setEditingFeed(feed)
    setModalVisible(true)
  }

  const handleDeleteFeed = (feedId: string) => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post? This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setFeeds(feeds.filter((f) => f.id !== feedId))
          setSnackbar({ visible: true, message: "Post deleted successfully" })
        },
      },
    ])
  }

  const handleSaveFeed = async () => {
    if (!title.trim() || !content.trim()) {
      setSnackbar({ visible: true, message: "Please fill in all required fields" })
      return
    }

    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const feedData = {
      title: title.trim(),
      content: content.trim(),
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      author: "You",
      avatar: "https://i.pravatar.cc/150?img=5",
      timestamp: "now",
      likes: 0,
      comments: 0,
      liked: false,
    }

    if (isEditing && editingFeed) {
      setFeeds(
        feeds.map((f) => (f.id === editingFeed.id ? { ...f, ...feedData, timestamp: `${editingFeed.timestamp} (edited)` } : f)),
      )
      setSnackbar({ visible: true, message: "Post updated successfully" })
    } else {
      const newFeed: FeedItem = {
        id: Date.now().toString(),
        ...feedData,
      }
      setFeeds([newFeed, ...feeds])
      setSnackbar({ visible: true, message: "Post created successfully" })
    }

    setLoading(false)
    setModalVisible(false)
    resetForm()
  }

  const resetForm = () => {
    setTitle("")
    setContent("")
    setTags("")
    setEditingFeed(null)
    setIsEditing(false)
  }

  const handleLike = (feedId: string) => {
    setFeeds(
      feeds.map((feed) =>
        feed.id === feedId
          ? {
              ...feed,
              liked: !feed.liked,
              likes: feed.liked ? feed.likes - 1 : feed.likes + 1,
            }
          : feed,
      ),
    )
  }

  const formatTimestamp = (timestamp: string) => {
    if (timestamp === "now") return "Just now"
    return timestamp
  }

  const renderFeedCard = (feed: FeedItem) => (
    <Card key={feed.id} style={styles.feedCard} mode="elevated">
      <Card.Content>
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={styles.authorInfo}>
            <Avatar.Image size={40} source={{ uri: feed.avatar }} />
            <View style={styles.authorDetails}>
              <Text variant="titleMedium" style={styles.authorName}>
                {feed.author}
              </Text>
              <Text variant="bodySmall" style={styles.timestamp}>
                {formatTimestamp(feed.timestamp)}
              </Text>
            </View>
          </View>

          <Menu
            visible={visibleMenus[feed.id] || false}
            onDismiss={() => closeMenu(feed.id)}
            anchor={<IconButton icon="dots-vertical" size={20} onPress={() => openMenu(feed.id)} />}
          >
            <Menu.Item
              onPress={() => {
                closeMenu(feed.id)
                handleEditFeed(feed)
              }}
              title="Edit"
              leadingIcon="pencil"
            />
            <Menu.Item
              onPress={() => {
                closeMenu(feed.id)
                handleDeleteFeed(feed.id)
              }}
              title="Delete"
              leadingIcon="delete"
            />
          </Menu>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text variant="titleMedium" style={styles.feedTitle}>
            {feed.title}
          </Text>
          <Text variant="bodyMedium" style={styles.feedContent}>
            {feed.content}
          </Text>
        </View>

        {/* Tags */}
        {feed.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {feed.tags.map((tag, index) => (
              <Chip key={index} mode="outlined" compact style={styles.tag} textStyle={styles.tagText}>
                #{tag}
              </Chip>
            ))}
          </View>
        )}

        <Divider style={styles.divider} />

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            mode={feed.liked ? "contained" : "text"}
            icon={feed.liked ? "heart" : "heart-outline"}
            onPress={() => handleLike(feed.id)}
            style={styles.actionButton}
            contentStyle={styles.actionButtonContent}
            labelStyle={styles.actionButtonLabel}
            buttonColor={feed.liked ? colors.primary : undefined}
          >
            {feed.likes}
          </Button>
          <Button
            mode="text"
            icon="comment-outline"
            style={styles.actionButton}
            contentStyle={styles.actionButtonContent}
            labelStyle={styles.actionButtonLabel}
          >
            {feed.comments}
          </Button>
          <Button
            mode="text"
            icon="share-variant"
            style={styles.actionButton}
            contentStyle={styles.actionButtonContent}
            labelStyle={styles.actionButtonLabel}
          >
            Share
          </Button>
        </View>
      </Card.Content>
    </Card>
  )

  return (
    <>
      <View style={styles.container}>
        {/* Header - Fixed at top */}
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <Text variant="headlineMedium" style={styles.headerTitle}>
            Community Feed
          </Text>
          <Text variant="bodyMedium" style={styles.headerSubtitle}>
            Share your eco-friendly journey
          </Text>
        </View>

        {/* Feed List */}
        <ScrollView
          ref={scrollRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {feeds.map(renderFeedCard)}
        </ScrollView>

        {/* FAB */}
        <FAB
          icon="plus"
          style={[styles.fab, { bottom: insets.bottom + 20 }]}
          onPress={handleAddFeed}
          label="New Post"
          buttonColor={colors.primary}
        />
      </View>

      {/* Modal */}
      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text variant="headlineSmall" style={styles.modalTitle}>
              {isEditing ? "Edit Post" : "Create New Post"}
            </Text>

            <TextInput
              label="Title *"
              value={title}
              onChangeText={setTitle}
              mode="outlined"
              style={styles.input}
              maxLength={100}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
            />

            <TextInput
              label="Content *"
              value={content}
              onChangeText={setContent}
              mode="outlined"
              multiline
              numberOfLines={6}
              style={styles.input}
              maxLength={500}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
            />

            <TextInput
              label="Tags (comma-separated)"
              value={tags}
              onChangeText={setTags}
              mode="outlined"
              style={styles.input}
              placeholder="e.g., gardening, solar, sustainability"
              maxLength={100}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
            />

            <View style={styles.modalActions}>
              <Button mode="outlined" onPress={() => setModalVisible(false)} style={styles.modalButton} disabled={loading}>
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleSaveFeed}
                style={styles.modalButton}
                loading={loading}
                disabled={loading}
                buttonColor={colors.primary}
              >
                {isEditing ? "Update" : "Publish"}
              </Button>
            </View>
          </ScrollView>
        </Modal>
      </Portal>

      {/* Snackbar */}
      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
        duration={3000}
        style={styles.snackbar}
      >
        {snackbar.message}
      </Snackbar>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    color: colors.primary,
    fontWeight: "700",
    textAlign: "center",
  },
  headerSubtitle: {
    color: colors.textDim,
    marginTop: 4,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  feedCard: {
    marginBottom: 16,
    backgroundColor: colors.surface,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  authorDetails: {
    marginLeft: 12,
    flex: 1,
  },
  authorName: {
    color: colors.text,
    fontWeight: "600",
  },
  timestamp: {
    color: colors.textDim,
    fontSize: 12,
  },
  content: {
    marginBottom: 12,
  },
  feedTitle: {
    color: colors.text,
    fontWeight: "600",
    marginBottom: 8,
  },
  feedContent: {
    color: colors.textSecondary,
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    height: 28,
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    borderColor: colors.primary,
  },
  tagText: {
    fontSize: 11,
    color: colors.primary,
  },
  divider: {
    marginVertical: 12,
    backgroundColor: colors.border,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionButton: {
    flex: 1,
  },
  actionButtonContent: {
    flexDirection: "row-reverse",
  },
  actionButtonLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  fab: {
    position: "absolute",
    right: 16,
  },
  modalContent: {
    backgroundColor: colors.surface,
    margin: 20,
    padding: 20,
    borderRadius: 16,
    maxHeight: "80%",
  },
  modalTitle: {
    color: colors.text,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "600",
  },
  input: {
    marginBottom: 16,
    backgroundColor: colors.surface,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
  },
  snackbar: {
    marginBottom: 16,
    backgroundColor: colors.primary,
  },
})
