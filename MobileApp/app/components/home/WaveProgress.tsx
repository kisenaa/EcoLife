import React, { useEffect } from "react"
import Svg, { Path, Circle, G, ClipPath, Defs } from "react-native-svg"
import Animated, { useSharedValue, useAnimatedProps, withTiming, withRepeat, Easing } from "react-native-reanimated"
import { useAppTheme } from "@/utils/useAppTheme"
import { View, StyleSheet } from "react-native"

const AnimatedPath = Animated.createAnimatedComponent(Path)

interface WaveProgressProps {
  size?: number
  progress: number // 0 to 1
  waveColor?: string
  bgColor?: string
  borderColor?: string
  icon?: React.ReactNode
}

export const WaveProgress: React.FC<WaveProgressProps> = ({ size = 180, progress, waveColor, bgColor, borderColor, icon }) => {
  const { theme } = useAppTheme({ useForest: true })
  const radius = size / 2
  const waveHeight = 10
  const waveLength = size / 1.2
  const border = 4

  // Animate the wave's vertical position
  const animatedProgress = useSharedValue(0)
  const phase = useSharedValue(0)

  useEffect(() => {
    animatedProgress.value = withTiming(progress, { duration: 900 })
    // Animate the phase for the wave motion
    phase.value = withRepeat(withTiming(2 * Math.PI, { duration: 2000, easing: Easing.linear }), -1, false)
  }, [progress])

  // Animated wave path
  const animatedProps = useAnimatedProps(() => {
    const cy = size - (size - border * 2) * animatedProgress.value - border
    let path = `M 0 ${cy}`
    for (let x = 0; x <= size; x += 1) {
      const y = cy + Math.sin((x / waveLength) * 2 * Math.PI + phase.value) * waveHeight
      path += ` L ${x} ${y}`
    }
    path += ` L ${size} ${size}`
    path += ` L 0 ${size} Z`
    return { d: path }
  })

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Outer circle */}
        <Circle
          cx={radius}
          cy={radius}
          r={radius - border / 2}
          fill={bgColor || theme.colors.palette.neutral300}
          stroke={borderColor || theme.colors.palette.primary500}
          strokeWidth={border}
        />
        {/* Animated wave */}
        <G clipPath={`url(#clip)`}>
          <AnimatedPath animatedProps={animatedProps} fill={waveColor || theme.colors.palette.accent100} />
        </G>
        <Defs>
          <ClipPath id="clip">
            <Circle cx={radius} cy={radius} r={radius - border / 2} />
          </ClipPath>
        </Defs>
      </Svg>
      {/* Centered icon absolutely over the SVG */}
      {icon && (
        <View style={styles.iconContainer} pointerEvents="none">
          {icon}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  iconContainer: {
    alignItems: "center",
    height: "100%",
    justifyContent: "center",
    left: 0,
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 2,
  },
})
