import React, { useState, useEffect } from "react"
import { View, ViewStyle, Alert, ScrollView, Keyboard } from "react-native"
import {
  TextInput,
  Button,
  Card,
  Avatar,
  Appbar,
  ActivityIndicator,
  Snackbar,
  Divider,
  List,
  Text as PaperText,
  Modal,
  Portal,
  Tooltip,
} from "react-native-paper"
import { useAppTheme } from "@/utils/useAppTheme"
import type { ThemedStyle } from "@/theme"
import { DemoDebugStackScreenProps } from "@/navigators/stack/DemoDebug"
import { getCurrentUser, signOut, updatePassword } from "@/services/supabase/supabaseAuth"
import { fetchUserProfile, updateUserProfile, createUserProfile } from "@/services/supabase/supabaseData"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface ProfileScreenProps extends DemoDebugStackScreenProps<"Profile"> {}

interface UserProfile {
  user_id: string
  username: string
  full_name: string
  email: string
  avatar_url?: string
  created_at?: string
}

export const ProfileScreen: React.FC<ProfileScreenProps> = function ProfileScreen(props) {
  const { navigation } = props
  const { themed, theme } = useAppTheme()
  const insets = useSafeAreaInsets()

  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null)
  const [snackbarVisible, setSnackbarVisible] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")

  // Change Password Modal States
  const [changePasswordVisible, setChangePasswordVisible] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false)
  const [newPasswordVisible, setNewPasswordVisible] = useState(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
  const [passwordChanging, setPasswordChanging] = useState(false)

  const handleChangePassword = async () => {
    // Dismiss keyboard first
    Keyboard.dismiss()

    // Validation
    if (!currentPassword.trim()) {
      showSnackbar("Please enter your current password")
      return
    }

    if (!newPassword.trim()) {
      showSnackbar("Please enter a new password")
      return
    }

    if (newPassword.length < 6) {
      showSnackbar("New password must be at least 6 characters")
      return
    }

    if (newPassword !== confirmNewPassword) {
      showSnackbar("Passwords do not match")
      return
    }

    try {
      setPasswordChanging(true)

      const { error } = await updatePassword(newPassword)

      if (error) throw error

      showSnackbar("Password updated successfully!")
      setChangePasswordVisible(false)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmNewPassword("")
    } catch (error: any) {
      console.error("Error changing password:", error)
      showSnackbar(error.message || "Failed to change password")
    } finally {
      setPasswordChanging(false)
    }
  }

  const resetPasswordModal = () => {
    setCurrentPassword("")
    setNewPassword("")
    setConfirmNewPassword("")
    setCurrentPasswordVisible(false)
    setNewPasswordVisible(false)
    setConfirmPasswordVisible(false)
  }

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const { data: userData } = await getCurrentUser()

      if (!userData?.user) {
        throw new Error("No authenticated user")
      }

      // Try to fetch existing profile
      const { data: profileData, error } = await fetchUserProfile(userData.user.id)

      // Handle case where profile doesn't exist yet (not an error)
      const userProfile: UserProfile = {
        user_id: userData.user.id,
        username: profileData?.username || "",
        full_name: profileData?.full_name || "",
        email: userData.user.email || "",
        avatar_url: profileData?.avatar_url,
        created_at: userData.user.created_at,
      }

      setProfile(userProfile)
      setEditedProfile(userProfile)
    } catch (error: any) {
      console.error("Error loading profile:", error)

      // If it's just a "no rows" error, that's okay - user hasn't created profile yet
      if (error.code === "PGRST116") {
        // Create a basic profile structure for new user
        const { data: userData } = await getCurrentUser()
        if (userData?.user) {
          const userProfile: UserProfile = {
            user_id: userData.user.id,
            username: "",
            full_name: "",
            email: userData.user.email || "",
            avatar_url: undefined,
            created_at: userData.user.created_at,
          }
          setProfile(userProfile)
          setEditedProfile(userProfile)
        }
      } else {
        showSnackbar("Failed to load profile")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!editedProfile || !profile) return

    // Validate required fields
    if (!editedProfile.username.trim()) {
      showSnackbar("Username is required")
      return
    }

    try {
      setSaving(true)

      const updates = {
        username: editedProfile.username.trim(),
        full_name: editedProfile.full_name?.trim() || undefined,
        avatar_url: editedProfile.avatar_url || undefined,
      }

      // Check if profile exists by checking if username was previously set
      if (!profile.username) {
        // Create new profile
        const { error } = await createUserProfile({
          user_id: profile.user_id,
          ...updates,
        })
        if (error) {
          if (error.code === "23505") {
            // Unique constraint violation
            throw new Error("Username already taken")
          }
          throw error
        }
      } else {
        // Update existing profile
        const { error } = await updateUserProfile(profile.user_id, updates)
        if (error) {
          if (error.code === "23505") {
            // Unique constraint violation
            throw new Error("Username already taken")
          }
          throw error
        }
      }

      // Update local state
      const updatedProfile: UserProfile = {
        ...editedProfile,
        username: updates.username,
        full_name: updates.full_name || "", // Convert undefined back to empty string for UI
        avatar_url: updates.avatar_url,
      }
      setProfile(updatedProfile)
      setEditedProfile(updatedProfile)
      setIsEditing(false)
      showSnackbar("Profile updated successfully!")
    } catch (error: any) {
      console.error("Error saving profile:", error)
      showSnackbar(error.message || "Failed to save profile")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditedProfile(profile)
    setIsEditing(false)
  }

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut()
            // Navigation will be handled by auth state change
          } catch (error: any) {
            showSnackbar("Failed to logout")
          }
        },
      },
    ])
  }

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message)
    setSnackbarVisible(true)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <View style={themed($loadingContainer)}>
        <ActivityIndicator size="large" />
        <PaperText style={{ marginTop: 16 }}>Loading profile...</PaperText>
      </View>
    )
  }

  if (!profile) {
    return (
      <View style={themed($loadingContainer)}>
        <PaperText>Failed to load profile</PaperText>
        <Button mode="contained" onPress={loadProfile} style={{ marginTop: 16 }}>
          Retry
        </Button>
      </View>
    )
  }

  return (
    <>
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Tooltip title="Back">
          <Appbar.BackAction onPress={() => navigation.goBack()} />
        </Tooltip>
        <Appbar.Content title="Profile" />
        {isEditing ? (
          <>
            <Tooltip title="Cancel">
              <Appbar.Action icon="close" onPress={handleCancel} disabled={saving} color="red" />
            </Tooltip>
            <Tooltip title="Save">
              <Appbar.Action icon="check" onPress={handleSave} disabled={saving} color="blue" />
            </Tooltip>
          </>
        ) : (
          <Tooltip title="Edit">
            <Appbar.Action icon="pencil" onPress={() => setIsEditing(true)} />
          </Tooltip>
        )}
      </Appbar.Header>

      <ScrollView style={themed($container)}>
        {/* Profile Header Card */}
        <Card style={themed($profileCard)} mode="elevated">
          <Card.Content style={themed($profileHeader)}>
            <Avatar.Text
              size={80}
              label={getInitials(editedProfile?.full_name || editedProfile?.username || "U")}
              style={themed($avatar)}
            />
            <View style={themed($profileInfo)}>
              <PaperText variant="headlineSmall" style={themed($profileName)}>
                {profile.full_name || profile.username || "No Name"}
              </PaperText>
              <PaperText variant="bodyMedium" style={themed($profileEmail)}>
                {profile.email}
              </PaperText>
              <PaperText variant="bodySmall" style={themed($profileDate)}>
                Member since {new Date(profile.created_at || "").toLocaleDateString()}
              </PaperText>
            </View>
          </Card.Content>
        </Card>

        {/* Profile Details Card */}
        <Card style={themed($detailsCard)} mode="elevated">
          <Card.Content>
            <PaperText variant="titleMedium" style={themed($sectionTitle)}>
              Profile Information
            </PaperText>

            <View style={themed($inputContainer)}>
              <TextInput
                label="Username"
                value={editedProfile?.username || ""}
                onChangeText={(text) => setEditedProfile((prev) => (prev ? { ...prev, username: text } : null))}
                mode="outlined"
                disabled={!isEditing}
                style={themed($textInput)}
                left={<TextInput.Icon icon="account" />}
              />

              <TextInput
                label="Full Name"
                value={editedProfile?.full_name || ""}
                onChangeText={(text) => setEditedProfile((prev) => (prev ? { ...prev, full_name: text } : null))}
                mode="outlined"
                disabled={!isEditing}
                style={themed($textInput)}
                left={<TextInput.Icon icon="account-circle" />}
              />

              <TextInput
                label="Email"
                value={editedProfile?.email || ""}
                mode="outlined"
                disabled={true}
                style={themed($textInput)}
                left={<TextInput.Icon icon="email" />}
                right={<TextInput.Icon icon="lock" />}
              />

              <TextInput
                label="User ID"
                value={profile.user_id}
                mode="outlined"
                disabled={true}
                style={themed($textInput)}
                left={<TextInput.Icon icon="identifier" />}
                multiline
                numberOfLines={1}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Actions Card */}
        <Card style={themed($actionsCard)} mode="elevated">
          <Card.Content>
            <PaperText variant="titleMedium" style={themed($sectionTitle)}>
              Account Actions
            </PaperText>

            <List.Item
              title="Change Password"
              description="Update your account password"
              left={(props) => <List.Icon {...props} icon="lock-reset" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {
                resetPasswordModal()
                setChangePasswordVisible(true)
              }}
              style={themed($listItem)}
            />

            <Divider />

            <List.Item
              title="Delete Account"
              description="Permanently delete your account"
              left={(props) => <List.Icon {...props} icon="delete" color={theme.colors.error} />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {
                // TODO: Handle account deletion
                showSnackbar("Account deletion feature coming soon")
              }}
              style={themed($listItem)}
              titleStyle={{ color: theme.colors.error }}
            />
          </Card.Content>
        </Card>

        {/* Logout Button */}
        <Button mode="outlined" onPress={handleLogout} style={themed($logoutButton)} icon="logout" textColor={theme.colors.error}>
          Logout
        </Button>
      </ScrollView>

      {/* Loading Overlay */}
      {saving && (
        <View style={themed($loadingOverlay)}>
          <ActivityIndicator size="large" />
          <PaperText style={{ marginTop: 16, color: "white" }}>Saving...</PaperText>
        </View>
      )}

      {/* Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ marginBottom: insets.bottom }}
      >
        {snackbarMessage}
      </Snackbar>
      {/* Change Password Modal */}
      <Portal>
        <Modal
          visible={changePasswordVisible}
          onDismiss={() => setChangePasswordVisible(false)}
          contentContainerStyle={themed($modalContent)}
        >
          <Card>
            <Card.Title title="Change Password" />
            <Card.Content>
              <TextInput
                label="Current Password"
                defaultValue={currentPassword}
                onChangeText={setCurrentPassword}
                mode="outlined"
                secureTextEntry={!currentPasswordVisible}
                style={themed($modalInput)}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={currentPasswordVisible ? "eye-off" : "eye"}
                    onPress={() => setCurrentPasswordVisible(!currentPasswordVisible)}
                  />
                }
                autoCapitalize="none"
                autoComplete="off"
                textContentType="password"
                autoCorrect={false}
                spellCheck={false}
              />

              <TextInput
                label="New Password"
                defaultValue={newPassword}
                onChangeText={setNewPassword}
                mode="outlined"
                autoComplete="off"
                textContentType="password"
                autoCorrect={false}
                spellCheck={false}
                secureTextEntry={!newPasswordVisible}
                style={themed($modalInput)}
                left={<TextInput.Icon icon="lock-plus" />}
                right={
                  <TextInput.Icon
                    icon={newPasswordVisible ? "eye-off" : "eye"}
                    onPress={() => setNewPasswordVisible(!newPasswordVisible)}
                  />
                }
              />

              <TextInput
                label="Confirm New Password"
                defaultValue={confirmNewPassword}
                onChangeText={setConfirmNewPassword}
                mode="outlined"
                autoComplete="off"
                textContentType="password"
                autoCorrect={false}
                spellCheck={false}
                secureTextEntry={!confirmPasswordVisible}
                style={themed($modalInput)}
                left={<TextInput.Icon icon="lock-check" />}
                right={
                  <TextInput.Icon
                    icon={confirmPasswordVisible ? "eye-off" : "eye"}
                    onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                  />
                }
              />
            </Card.Content>

            <Card.Actions>
              <Button onPress={() => setChangePasswordVisible(false)} disabled={passwordChanging}>
                Cancel
              </Button>
              <Button mode="contained" onPress={handleChangePassword} loading={passwordChanging} disabled={passwordChanging}>
                Update Password
              </Button>
            </Card.Actions>
          </Card>
        </Modal>
      </Portal>
    </>
  )
}

// Styled components
const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  padding: spacing.md,
  paddingBottom: spacing.xxl,
  marginBottom: spacing.xl,
})

const $loadingContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
})

const $profileCard: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})

const $profileHeader: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
})

const $avatar: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginRight: spacing.md,
})

const $profileInfo: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $profileName: ThemedStyle<ViewStyle> = ({ colors }) => ({
  color: colors.text,
  fontWeight: "bold",
})

const $profileEmail: ThemedStyle<ViewStyle> = ({ colors }) => ({
  color: colors.textDim,
  marginTop: 4,
})

const $profileDate: ThemedStyle<ViewStyle> = ({ colors }) => ({
  color: colors.textDim,
  marginTop: 2,
})

const $detailsCard: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})

const $actionsCard: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})

const $sectionTitle: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  marginBottom: spacing.md,
  color: colors.text,
  fontWeight: "600",
})

const $inputContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.sm,
})

const $textInput: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.xs,
})

const $listItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.xs,
})

const $logoutButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  margin: spacing.md,
  marginTop: spacing.xl,
})

const $loadingOverlay: ThemedStyle<ViewStyle> = () => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.7)",
  justifyContent: "center",
  alignItems: "center",
})

const $modalContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  margin: spacing.lg,
})

const $modalInput: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})
