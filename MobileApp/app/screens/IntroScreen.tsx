import { observer } from "mobx-react-lite"
import { FC } from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { Button, Text, Screen } from "@/components"
import { isRTL } from "@/i18n"
import { AppStackScreenProps } from "../navigators"
import { $styles, spacing, type ThemedStyle } from "@/theme"
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"
import { useAppTheme } from "@/utils/useAppTheme"

const welcomeLogo = require("../../assets/images/logo.png")

interface IntroScreenProps extends AppStackScreenProps<"Intro"> {}

export const IntroScreen: FC<IntroScreenProps> = observer(function IntroScreen(_props) {
  const { themed, theme } = useAppTheme()

  const { navigation } = _props
  function goLogin() {
    navigation.navigate("Login")
  }

  function goRegister() {
    navigation.navigate("Register")
  }

  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])

  return (
    <Screen preset="fixed" contentContainerStyle={[$styles.flex1, { justifyContent: "center" }]}>
      {/* Background arch */}
      <View
        style={{
          position: "absolute",
          left: "-45%",
          right: "-45%",
          top: "55%",
          height: "65%",
          backgroundColor: "#C8E6C9", // light green
          borderTopLeftRadius: 400, // wider arch
          borderTopRightRadius: 400, // wider arch
          zIndex: 0,
        }}
      />
      {/* Content */}
      <View style={themed([$topContainer, { alignItems: "center", justifyContent: "center", flex: 1, zIndex: 1 }])}>
        <Image style={themed([$welcomeLogo, { marginTop: 0 }])} source={welcomeLogo} resizeMode="contain" />
        <Text
          text="Level up your home life with EcoLife"
          preset="subheading"
          style={themed([$welcomeHeading, { alignItems: "center" }])}
        />
      </View>
      <View style={themed([$bottomContainer, $bottomContainerInsets, { alignItems: "center", zIndex: 1 }])}>
        <Button testID="login-button" text="Login" preset="reversed" onPress={goLogin} style={{ width: "100%" }} />
        <Button
          testID="register-button"
          text="Register"
          preset="reversed"
          onPress={goRegister}
          style={{ width: "100%", marginTop: spacing.xl }}
        />
      </View>
    </Screen>
  )
})

const $topContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexShrink: 1,
  flexGrow: 1,
  flexBasis: "57%",
  justifyContent: "center",
  paddingHorizontal: spacing.lg,
})

const $bottomContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexShrink: 1,
  flexGrow: 0,
  flexBasis: "43%",
  backgroundColor: "transparent", // changed from light green to transparent
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  paddingHorizontal: spacing.lg,
  justifyContent: "center",
})

const $welcomeLogo: ThemedStyle<ImageStyle> = ({ spacing }) => ({
  height: 88,
  width: "100%",
  marginBottom: spacing.xxs,
})

const $welcomeHeading: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginTop: spacing.md,
  marginBottom: spacing.md,
})
