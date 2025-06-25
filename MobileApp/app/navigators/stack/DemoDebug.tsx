import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { CompositeScreenProps } from "@react-navigation/native"
import { DemoDebugScreen } from "@/screens"
import { DashboardTabScreenProps } from "../DashboardNavigator"
import { DashboardTabParamList } from "../DashboardNavigator"
import { ProfileScreen } from "@/screens/DashboardScreen/ProfileScreen"

export type DemoDebugStackParamList = {
  DemoDebugMain: undefined
  Profile: undefined
}

export type DemoDebugStackScreenProps<T extends keyof DemoDebugStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<DemoDebugStackParamList, T>,
  DashboardTabScreenProps<keyof DashboardTabParamList>
>

const Stack = createNativeStackNavigator<DemoDebugStackParamList>()

export function DemoDebugStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="DemoDebugMain"
    >
      <Stack.Screen name="DemoDebugMain" component={DemoDebugScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  )
}
