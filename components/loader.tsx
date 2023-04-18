import { SafeAreaView, StyleSheet, View, useWindowDimensions, Dimensions } from "react-native";
import Svg, { G, Path } from "react-native-svg";
import React, { useEffect } from "react";
import Animated, { interpolate, useAnimatedProps, useSharedValue, withRepeat, withTiming, Easing} from "react-native-reanimated";

interface Points {
  x: number;
  y: number;
}

interface LoaderProps {
  size: number,
  ratioScale: number,
  rotationDuration: number,
  opacityDuration: number
}

const DEFAULTS_PROPS:LoaderProps = {
  size: 78,
  ratioScale:7,
  rotationDuration: 12000,
  opacityDuration: 300
};

const VBOX: Points = {
  w: 624.0, h: 624.0,
};

const transformMatrixTranslate = (anchorPoint: Points) => {
  return `matrix(1.00,0.00,0.00,1.00,${anchorPoint.x},${anchorPoint.y})`;
};

const styles = StyleSheet.create({
  colours: {
    dash: "#5bd4d0",
    lighten: "#fafafa",
    dark: "#010101",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

const AnimatedGroup = Animated.createAnimatedComponent(G);

const Loader = (props: LoaderProps ) => {
  const dimensions= useWindowDimensions();
  
  const destructProps = { ...DEFAULTS_PROPS, ...props };
  const { size, ratioScale, rotationDuration, opacityDuration } = destructProps
  
  const logoSize = (dimensions.width/ratioScale >= size) ? dimensions.width/ratioScale : size
  
  const displacementOrigin = {
    offset: transformMatrixTranslate({x: VBOX.w/2, y: VBOX.h/2}),
    invert: transformMatrixTranslate({x: -VBOX.w/2, y: -VBOX.h/2})
  };

  const animationRotationProcess = useSharedValue(0);
  const animatedOpacityProcess = useSharedValue(0);

  const animatedOpacity = useAnimatedProps(() => {
    return {
      opacity: interpolate(animatedOpacityProcess.value, [0, 1], [0, 1]),
    };
  });

  const animatedRotation = useAnimatedProps(() => {
    let value = interpolate(animationRotationProcess.value, [0, 1], [0, 2 * Math.PI]);
    return {
      matrix: [-Math.cos(value), -Math.sin(value), Math.sin(value), -Math.cos(value), 0, 0 ],
    };
  });

  useEffect(() => {
    (animationRotationProcess.value = withRepeat(withTiming(1, {duration: rotationDuration, easing: Easing.linear}), -1, false)),
    (animatedOpacityProcess.value = withTiming(1, {duration: opacityDuration, easing: Easing.linear}))
  }, [animationRotationProcess, animatedOpacityProcess]);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Svg width={VBOX.w * (logoSize/VBOX.w)}
             height={VBOX.h * (logoSize/VBOX.h)}
             viewBox={[0, 0, VBOX.w, VBOX.h].join(" ")}
             shape-rendering="geometricPrecision">
          <Path fill={styles.colours.dark}
                d="M312,571c143.3,0,258.9-115.6,258.9-257.8v-1.2c0-143.3-115.6-259-257.7-259h-1.2C168.7,53,51.9,168.7,51.9,312c0,142.1,116.8,259,260.1,259ZM312,0.1C139.8,0.2,0.2,139.7,0.1,312C0.2,484.3,139.8,623.9,312,623.9c172.2-.1,311.8-139.6,311.9-311.9C622.7,139.8,483,0.1,312,0.1Zm0,593.8C156.6,593.9,30.2,467.4,30.2,312v-2.4C31.4,154.2,156.6,29,312,30.2c155.3,0,280.6,125.2,281.8,281.8c0,155.4-126.5,281.9-281.8,281.9Z"/>
          <Path fill={styles.colours.lighten}
                d="M312,30.2C156.7,29,31.4,154.3,30.2,309.6v2.4c0,155.4,126.4,281.8,281.8,281.8s281.8-126.3,281.8-281.8C592.6,155.5,467.3,30.2,312,30.2ZM312,571C168.7,571,51.9,454.2,51.9,312C51.9,168.7,168.7,51.8,312,51.8s258.9,115.6,258.9,257.8v1.2C570.9,454.2,454.1,571,312,571Zm20.5-271l-28.9-28.9-77.1,78.3c-24.1-24.1-24.1-63.8,0-89.1l33.7-33.7-27.7-27.7l112-10.8-12,111.9Zm-42.2,21.7l28.9,28.9l78.3-78.3c24.1,24.1,24.1,63.8,0,89.1l-33.7,33.7l27.7,27.7-112,10.8l10.8-111.9Z"/>
          <AnimatedGroup animatedProps={animatedOpacity}
                         transform={displacementOrigin.offset}>
            <AnimatedGroup animatedProps={animatedRotation}>
              <Path transform={displacementOrigin.invert}
                    fill={styles.colours.dash}
                    d="M136.8,207.8l-24.1-14.5c9.6-16.9,21.7-31.3,36.1-45.8L169.3,168c-13.3,12.1-22.9,25.3-32.5,39.8Zm97.5-83.1v-1.2L223.5,97c-18.1,7.2-35.1,17-50.6,28.9L191,148.8c13.2-9.6,27.7-18.1,43.3-24.1ZM123.5,234.3L97,223.5c-7.2,18.1-12,36.1-15.7,55.4l28.9,3.6c2.5-16.9,7.3-32.6,13.3-48.2ZM401.7,97c-17.8-7.2-36.4-12-55.4-14.4l-3.6,28.9c15.7,2.4,32.5,7.2,48.2,13.2L401.7,97ZM514.9,312.6h28.9c0-19.3-2.4-38.5-7.2-56.6l-27.7,7.2c3.6,15.6,6,32.5,6,49.4Zm-405.8-1.3h-28.9c0,19.3,2.4,38.5,7.2,57.8l27.7-7.2c-3.6-16.8-6-33.6-6-50.6Zm391.4-77l26.5-12c-7.2-18.1-17-35.1-28.9-50.6l-22.9,18.1c9.6,14.4,19.2,28.8,25.3,44.5Zm-22.9-86.7c-14.5-13.2-30.1-25.3-45.8-34.9L416.1,138c14.4,8.4,27.7,19.3,39.7,31.3l21.8-21.7Zm21.7,243.3L527,401.7c7.2-17.8,12.1-36.4,14.5-55.4l-28.9-3.6c-2.5,16.9-7.3,32.6-13.3,48.2ZM389.7,499.3L400.5,527c18.1-7.2,34.9-16.9,50.6-30.1L433,474c-13.2,10.8-27.7,19.2-43.3,25.3Zm-77.1,15.6v28.9c18.1,0,37.3-1.2,56.6-7.2L362,508.9c-15.7,3.6-32.5,6-49.4,6Zm142.1-59l20.5,20.5c14.5-13.2,26.5-28.9,36.1-44.5L486,416.2c-9.6,14.4-19.3,27.7-31.3,39.7ZM123.5,389.7L97,400.5c7.2,18.1,17,35.1,28.9,50.6L148.8,433c-9.6-13.2-19.2-27.6-25.3-43.3ZM262,115.1c16.9-4.8,32.5-6,49.4-6v-28.9c-19.3,0-38.5,2.4-56.6,7.2l7.2,27.7ZM147.6,475.2c13.2,14.4,28.9,26.5,45.8,36.1L207.9,486c-14.5-9.6-27.7-19.3-39.7-31.3l-20.6,20.5ZM223.5,527c16.9,7.2,36.1,12,55.4,15.7l3.6-28.9c-16.9-2.4-32.5-7.2-48.2-13.2L223.5,527Z"/>
            </AnimatedGroup>
          </AnimatedGroup>
        </Svg>
      </View>
    </SafeAreaView>
  );
};

export default Loader;