import { observer } from "mobx-react-lite"
import { FC, useEffect, useRef, useState } from "react"
// eslint-disable-next-line no-restricted-imports
// MODIFIED: Added Image and View, removed PressableIcon from original code
import { Image, ImageStyle, TextInput, TextStyle, View, ViewStyle } from "react-native"
import { Button, Screen, Text, TextField } from "../components" // MODIFIED: Removed unused imports
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import type { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"

// ADDED: A placeholder for your app's logo.
// Make sure you have a logo at this path in your project.
const appLogo = require("../../assets/images/logo.png")

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  const { navigation } = _props
  const authPasswordInput = useRef<TextInput>(null)

  const [authPassword, setAuthPassword] = useState("")
  // REMOVED: isAuthPasswordHidden state is no longer needed
  const [isSubmitted, setIsSubmitted] = useState(false)
  const {
    authenticationStore: { authEmail, setAuthEmail, setAuthToken, validationError },
  } = useStores()

  const { themed } = useAppTheme()

  useEffect(() => {
    // We'll keep the pre-filled credentials for easy testing
    setAuthEmail("user@ecolife.app")
    setAuthPassword("EcoLifeIsAwesome")

    return () => {
      setAuthPassword("")
      setAuthEmail("")
    }
  }, [setAuthEmail])

  const error = isSubmitted ? validationError : ""

  function login() {
    setIsSubmitted(true)
    if (validationError) return

    setIsSubmitted(false)
    setAuthPassword("")
    setAuthEmail("")
    setAuthToken(String(Date.now()))
  }
  // ADDED: Placeholder functions for the new links
  function forgotUsername() {
    console.log("Forgot Username pressed")
  }

  function forgotPassword() {
    console.log("Forgot Password pressed")
  }

  function register() {
    navigation.navigate("Register")
  }

  // REMOVED: The PasswordRightAccessory component is no longer needed.

  // MODIFIED: The entire return block is restructured to match your design.
  return (
    <Screen
      preset="auto"
      contentContainerStyle={themed($screenContentContainer)}
      safeAreaEdges={["top", "bottom"]}
    >
      <Image style={themed($logo)} source={appLogo} resizeMode="contain" />

      <Text testID="login-heading" tx="loginScreen:logIn" preset="heading" style={themed($logIn)} />
      <Text
        tx="loginScreen:enterDetails"
        preset="subheading"
        style={themed($enterDetails)}
      />

      {/* --- Username Field --- */}
      <View>
        <TextField
          value={authEmail}
          onChangeText={setAuthEmail}
          containerStyle={themed($textField)}
          autoCapitalize="none"
          autoComplete="username" // Changed from "email"
          autoCorrect={false}
          keyboardType="email-address"
          // REMOVED: labelTx
          placeholderTx="loginScreen:usernameFieldPlaceholder" // MODIFIED: Using username placeholder
          helper={error}
          status={error ? "error" : undefined}
          onSubmitEditing={() => authPasswordInput.current?.focus()}
        />
        <Text
          tx="loginScreen:forgotUsername"
          style={themed($forgotLink)}
          onPress={forgotUsername}
        />
      </View>

      {/* --- Password Field --- */}
      <View>
        <TextField
          ref={authPasswordInput}
          value={authPassword}
          onChangeText={setAuthPassword}
          containerStyle={themed($textField)}
          autoCapitalize="none"
          autoComplete="password"
          autoCorrect={false}
          secureTextEntry // MODIFIED: Always true now
          // REMOVED: labelTx
          placeholderTx="loginScreen:passwordFieldPlaceholder"
          onSubmitEditing={login}
          // REMOVED: RightAccessory
        />
        <Text
          tx="loginScreen:forgotPassword"
          style={themed($forgotLink)}
          onPress={forgotPassword}
        />
      </View>

      <Button
        testID="login-button"
        tx="loginScreen:tapToLogIn"
        style={themed($tapButton)}
        preset="reversed"
        onPress={login}
      />

      {/* --- Footer --- */}
      <View style={themed($footer)}>
        <Text tx="loginScreen:dontHaveAccount" size="md" />
        <Text
          tx="loginScreen:register"
          size="md"
          weight="bold"
          style={themed($registerLink)}
          onPress={register}
        />
      </View>
    </Screen>
  )
})

// --- STYLES ---

// MODIFIED: Main container to center content vertically
const $screenContentContainer: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  flex: 1,
  justifyContent: "center",
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
  backgroundColor: colors.background, // Match screen background
})

// ADDED: Style for the logo
const $logo: ThemedStyle<ImageStyle> = ({ spacing }) => ({
  height: 100,
  width: "60%",
  alignSelf: "center",
  marginBottom: spacing.xxl,
})

// MODIFIED: Centered text styles
const $logIn: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
  textAlign: "center",
})

const $enterDetails: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.xxl, // Increased margin to add more space
  textAlign: "center",
})

// MODIFIED: TextField has less bottom margin now because of the "Forgot" link
const $textField: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.xs,
})

// ADDED: Style for the "Forgot..." links
const $forgotLink: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  textAlign: "right",
  color: colors.textDim,
  marginBottom: spacing.lg,
  paddingHorizontal: spacing.xs,
})

// MODIFIED: Button has more top margin
const $tapButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.lg,
})

// ADDED: Styles for the footer section
const $footer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  marginTop: spacing.xl,
})

const $registerLink: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.text, // Using default text color for bold "Register"
  fontWeight: "bold",
  marginLeft: spacing.xs,
})