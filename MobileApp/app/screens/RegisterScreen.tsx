import { observer } from "mobx-react-lite"
import { ComponentType, FC, useMemo, useRef, useState } from "react"
import { View, TextInput, ImageStyle, TextStyle, ViewStyle, ScrollView, Alert } from "react-native"
import { Button, Screen, Text, TextField, AutoImage, PressableIcon, TextFieldAccessoryProps } from "../components"
import { AppStackScreenProps } from "../navigators"
import type { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import { signUpWithEmail } from "@/services/supabase"

const appLogo = require("../../assets/images/logo.png")

interface RegisterScreenProps extends AppStackScreenProps<"Register"> {}

export const RegisterScreen: FC<RegisterScreenProps> = observer(function RegisterScreen(_props) {
  const { navigation } = _props
  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  const emailInput = useRef<TextInput>(null)
  const passwordInput = useRef<TextInput>(null)
  const passwordConfirmInput = useRef<TextInput>(null)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [isPasswordHidden, setIsPasswordHidden] = useState(true)
  const [isConfirmPasswordHidden, setIsConfirmPasswordHidden] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  function goLogin() {
    navigation.navigate("Login")
  }

  async function register() {
    setError("")
    if (!email || !password || !passwordConfirmation) {
      setError("Please fill all fields.")
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.")
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    if (password !== passwordConfirmation) {
      setError("Passwords do not match.")
      return
    }
    setIsLoading(true)
    try {
      const { data, error: supaError } = await signUpWithEmail(email, password)
      if (supaError) {
        setError(supaError.message)
        setIsLoading(false)
        return
      }
      Alert.alert("Registration Successful", "Please check your email to verify your account.")
      navigation.navigate("Login")
    } catch {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const PasswordRightAccessory: ComponentType<TextFieldAccessoryProps> = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <PressableIcon
            icon={isPasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral800}
            containerStyle={props.style}
            size={20}
            onPress={() => setIsPasswordHidden(!isPasswordHidden)}
          />
        )
      },
    [isPasswordHidden, colors.palette.neutral800],
  )

  const ConfirmPasswordRightAccessory: ComponentType<TextFieldAccessoryProps> = useMemo(
    () =>
      function ConfirmPasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <PressableIcon
            icon={isConfirmPasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral800}
            containerStyle={props.style}
            size={20}
            onPress={() => setIsConfirmPasswordHidden(!isConfirmPasswordHidden)}
          />
        )
      },
    [isConfirmPasswordHidden, colors.palette.neutral800],
  )

  return (
    <Screen preset="scroll" contentContainerStyle={themed($screenContentContainer)}>
      <AutoImage source={appLogo} style={themed($logo)} resizeMode="contain" accessibilityLabel="EcoLife logo" />
      <Text preset="heading" style={themed($logIn)} text="Register" accessibilityRole="header" />
      <Text preset="subheading" style={themed($enterDetails)} text="Create your account" />
      <TextField
        value={email}
        onChangeText={setEmail}
        label="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        labelTx="loginScreen:emailFieldLabel"
        placeholderTx="loginScreen:emailFieldPlaceholder"
        returnKeyType="next"
        onSubmitEditing={() => passwordInput.current?.focus()}
        blurOnSubmit={false}
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        accessibilityLabel="Email input"
        containerStyle={themed($textField)}
      />
      <TextField
        ref={passwordInput}
        value={password}
        onChangeText={setPassword}
        label="Password"
        secureTextEntry={isPasswordHidden}
        returnKeyType="next"
        onSubmitEditing={() => passwordConfirmInput.current?.focus()}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="password"
        textContentType="newPassword"
        accessibilityLabel="Password input"
        labelTx="loginScreen:passwordFieldLabel"
        placeholderTx="loginScreen:passwordFieldPlaceholder"
        containerStyle={themed($textField)}
        RightAccessory={PasswordRightAccessory}
      />
      <TextField
        ref={passwordConfirmInput}
        value={passwordConfirmation}
        onChangeText={setPasswordConfirmation}
        secureTextEntry={isConfirmPasswordHidden}
        returnKeyType="done"
        onSubmitEditing={register}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="password"
        textContentType="newPassword"
        accessibilityLabel="Confirm password input"
        containerStyle={themed($textField)}
        label="Confirm Password"
        placeholder="Re-enter your password"
        RightAccessory={ConfirmPasswordRightAccessory}
      />
      {error ? (
        <Text
          text={error}
          style={{ color: colors.error, marginBottom: 8, textAlign: "center" }}
          accessibilityLiveRegion="polite"
        />
      ) : null}
      <Button
        text={isLoading ? "Registering..." : "Register"}
        onPress={register}
        style={themed($tapButton)}
        disabled={isLoading}
        accessibilityLabel="Register button"
        preset="reversed"
      />
      <View style={themed($footer)}>
        <Text text="Already have an account?" />
        <Text text="Log In" onPress={goLogin} style={themed($loginLink)} accessibilityRole="link" />
      </View>
    </Screen>
  )
})

// --- STYLES (Copied from LoginScreen.tsx for consistency) ---

const $screenContentContainer: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  flex: 1,
  justifyContent: "center",
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
  backgroundColor: colors.background,
})

const $logo: ThemedStyle<ImageStyle> = ({ spacing }) => ({
  height: 100,
  width: "60%",
  alignSelf: "center",
  marginBottom: spacing.xxl,
})

const $logIn: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
  textAlign: "center",
})

const $enterDetails: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.xxl,
  textAlign: "center",
})

const $textField: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg, // Added slightly more margin between fields
})

const $tapButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.lg,
})

const $footer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  marginTop: spacing.xl,
})

const $loginLink: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.text,
  fontWeight: "bold",
  marginLeft: spacing.xs,
})
