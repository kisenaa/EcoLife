import { observer } from "mobx-react-lite"
import { FC, useRef, useState } from "react"
import { Image, ImageStyle, TextInput, TextStyle, View, ViewStyle } from "react-native"
import { Button, Screen, Text, TextField } from "../components"
import { AppStackScreenProps } from "../navigators"
import type { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import { signInWithEmail } from "@/services/supabase"
import { useStores } from "../models"

const appLogo = require("../../assets/images/logo.png")

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  const { navigation } = _props
  const { authenticationStore } = useStores()
  const authPasswordInput = useRef<TextInput>(null)
  const [authEmail, setAuthEmail] = useState("")
  const [authPassword, setAuthPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { themed } = useAppTheme()

  async function login() {
    setIsLoading(true)
    setError("")
    const { data, error: supaError } = await signInWithEmail(authEmail, authPassword)
    setIsLoading(false)
    if (supaError) {
      setError(supaError.message)
      return
    }
    authenticationStore.setAuthToken(data?.session?.access_token)
    navigation.reset({
      index: 0,
      routes: [{ name: "Dashboard" }],
    })
  }

  return (
    <Screen preset="scroll" contentContainerStyle={themed($screenContentContainer)}>
      <Image source={appLogo} style={themed($logo)} resizeMode="contain" />
      <Text preset="heading" style={themed($logIn)} text="Log In" />
      <Text preset="subheading" style={themed($enterDetails)} text="Enter your email and password" />
      <TextField
        value={authEmail}
        onChangeText={setAuthEmail}
        label="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        returnKeyType="next"
        onSubmitEditing={() => authPasswordInput.current?.focus()}
        blurOnSubmit={false}
        style={themed($textField)}
      />
      <TextField
        ref={authPasswordInput}
        value={authPassword}
        onChangeText={setAuthPassword}
        label="Password"
        secureTextEntry
        returnKeyType="done"
        onSubmitEditing={login}
        style={themed($textField)}
      />
      {error ? <Text text={error} style={{ color: 'red', marginBottom: 8 }} /> : null}
      <Button
        text={isLoading ? "Logging in..." : "Log In"}
        onPress={login}
        style={themed($tapButton)}
        disabled={isLoading}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
        <Text text="Forgot Username?" style={themed($forgotLink)} />
        <Text text="Forgot Password?" style={themed($forgotLink)} />
      </View>
      <View style={themed($footer)}>
        <Text text="Don't have an account?" />
        <Text text="Register" onPress={() => navigation.navigate("Register") } style={themed($loginLink)} />
      </View>
    </Screen>
  )
})

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
  marginBottom: spacing.xs,
})

const $forgotLink: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  textAlign: "right",
  color: colors.textDim,
  marginBottom: spacing.lg,
  paddingHorizontal: spacing.xs,
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