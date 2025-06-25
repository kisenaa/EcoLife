import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { CompositeScreenProps } from "@react-navigation/native"
import { EduScreen, VideoPlayerScreen, QuizScreen } from "@/screens"
import { DashboardTabScreenProps } from "../DashboardNavigator"
import { DashboardTabParamList } from "../DashboardNavigator"

export type LearnStackParamList = {
  LearnMain: undefined
  VideoPlayer: {
    videoId: string
    title: string
    description?: string
    duration?: string
    category?: string
  }
  Quiz: {
    category?: string
    title?: string
  }
}

export type LearnStackScreenProps<T extends keyof LearnStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<LearnStackParamList, T>,
  DashboardTabScreenProps<keyof DashboardTabParamList>
>

const Stack = createNativeStackNavigator<LearnStackParamList>()

export function LearnStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="LearnMain"
    >
      <Stack.Screen name="LearnMain" component={EduScreen} />
      <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
      <Stack.Screen name="Quiz" component={QuizScreen} />
    </Stack.Navigator>
  )
}
