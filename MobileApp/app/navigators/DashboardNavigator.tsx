import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import { TextStyle, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Icon } from "../components"
import { translate } from "@/i18n"
import { DemoShowroomScreen, DemoCommunityScreen, EduScreen, FeedPost } from "../screens"
import type { ThemedStyle } from "@/theme"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"
import { useAppTheme } from "@/utils/useAppTheme"
import { Home } from "@/screens/DashboardScreen/Home"
import { DemoDebugStack } from "./stack/DemoDebug"
import { LearnStack } from "./stack/Learn"
import { Icon as MdIcon } from "react-native-paper"
export type DashboardTabParamList = {
  Home: undefined
  Learn: undefined
  DemoCommunity: undefined
  DemoShowroom: { queryIndex?: string; itemIndex?: string }
  DemoDebug: undefined
  DemoPodcastList: undefined
  feed: undefined
}

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type DashboardTabScreenProps<T extends keyof DashboardTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<DashboardTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const Tab = createBottomTabNavigator<DashboardTabParamList>()

/**
 * This is the main navigator for the demo screens with a bottom tab bar.
 * Each tab is a stack navigator with its own set of screens.
 *
 * More info: https://reactnavigation.org/docs/bottom-tab-navigator/
 * @returns {JSX.Element} The rendered `DashboardNavigator`.
 */
export function DashboardNavigator() {
  const { bottom } = useSafeAreaInsets()
  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: themed([$tabBar, { height: bottom + 70 }]),
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: themed($tabBarLabel),
        tabBarItemStyle: themed($tabBarItem),
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused }) => <Icon icon="home" color={focused ? colors.tint : colors.tintInactive} size={35} />,
        }}
      />
      <Tab.Screen
        name="Learn"
        component={LearnStack}
        options={{
          tabBarLabel: "Education",
          tabBarIcon: ({ focused }) => <MdIcon source="library" color={focused ? colors.tint : colors.tintInactive} size={32} />,
        }}
      />
      <Tab.Screen
        name="feed"
        component={FeedPost}
        options={{
          tabBarLabel: "Feed",
          tabBarIcon: ({ focused }) => <MdIcon source="forum" color={focused ? colors.tint : colors.tintInactive} size={32} />,
        }}
      />
      <Tab.Screen
        name="DemoCommunity"
        component={DemoCommunityScreen}
        options={{
          tabBarLabel: translate("DashboardNavigator:communityTab"),
          tabBarIcon: ({ focused }) => <Icon icon="community" color={focused ? colors.tint : colors.tintInactive} size={30} />,
        }}
      />
      {/*
      <Tab.Screen
        name="DemoPodcastList"
        component={DemoPodcastListScreen}
        options={{
          tabBarAccessibilityLabel: translate("DashboardNavigator:podcastListTab"),
          tabBarLabel: translate("DashboardNavigator:podcastListTab"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="podcast" color={focused ? colors.tint : colors.tintInactive} size={30} />
          ),
        }}
      />
      */}
      <Tab.Screen
        name="DemoDebug"
        component={DemoDebugStack}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ focused }) => <Icon icon="settings" color={focused ? colors.tint : colors.tintInactive} size={30} />,
        }}
      />
    </Tab.Navigator>
  )
}

const $tabBar: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
  borderTopColor: colors.transparent,
})

const $tabBarItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingTop: spacing.md,
})

const $tabBarLabel: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
  color: colors.text,
})
