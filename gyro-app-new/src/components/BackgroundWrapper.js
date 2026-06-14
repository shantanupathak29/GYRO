import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, SafeAreaView, Animated, Dimensions, Image, ImageBackground } from 'react-native';
import { Colors } from '../utils/theme';

const { width, height } = Dimensions.get('window');

const FloatingBlob = ({ color, size, delay, duration = 20000 }) => {
  const moveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(moveAnim, {
          toValue: 1,
          duration: duration,
          delay: delay,
          useNativeDriver: true,
        }),
        Animated.timing(moveAnim, {
          toValue: 0,
          duration: duration,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateX = moveAnim.interpolate({
    inputRange: [0, 0.33, 0.66, 1],
    outputRange: [0, width * 0.15, -width * 0.1, width * 0.05],
  });

  const translateY = moveAnim.interpolate({
    inputRange: [0, 0.33, 0.66, 1],
    outputRange: [0, height * 0.1, height * 0.2, height * 0.05],
  });

  const scale = moveAnim.interpolate({
    inputRange: [0, 0.33, 0.66, 1],
    outputRange: [1, 1.2, 0.8, 1.1],
  });

  return (
    <Animated.View
      style={[
        styles.blob,
        {
          backgroundColor: color,
          width: size,
          height: size,
          borderRadius: size / 2,
          transform: [{ translateX }, { translateY }, { scale }],
        },
      ]}
    />
  );
};

const BackgroundWrapper = ({ children, isAlert }) => {
  const alertAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isAlert) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(alertAnim, { toValue: 0.8, duration: 800, useNativeDriver: true }),
          Animated.timing(alertAnim, { toValue: 0.3, duration: 800, useNativeDriver: true }),
        ])
      );
      loop.start();
      return () => loop.stop();
    } else {
      alertAnim.setValue(0);
    }
  }, [isAlert, alertAnim]);

  return (
    <View style={styles.container}>
      {/* Base Dull Background Image */}
      <Image
        source={require('../assets/ambient_bg.png')}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />

      {/* Subtle Texture Overlay */}
      <View style={styles.bgOverlay} pointerEvents="none" />

      {/* Alert Overlay */}
      <Animated.View 
        style={[
          StyleSheet.absoluteFillObject, 
          { backgroundColor: '#ff0000', opacity: alertAnim, zIndex: 3 }
        ]} 
        pointerEvents="none" 
      />

      {/* Watermark Layer */}
      <View style={styles.watermarkContainer} pointerEvents="none">
        <Image
          source={{ uri: 'https://lh3.googleusercontent.com/aida/ADBb0ug5rs74-SaAap-kuymK2pLUZxHIjgf4ku4Kn8dBmeezBKP6LGbdgCyWAueVMneYhrBamCKeW_zb9COkOCN4l2oBdlqr6UIz0CdEGNl0HVJDPguSIu99rktdHgvGSdKbyTr8VRUu_cIHny2Wb_slyCUTnuyjBJCXKAp4hLrYZEOqi80ICs4M43AKwu7KrkHRtBRJIofPYgDibOYhKr04gfjV848ddSmg27YKYyRRG2R2FiTI-VGjCJVPpPwMofutRyKkqJh7nMRA4w' }}
          style={styles.watermark}
          resizeMode="contain"
        />
      </View>

      <SafeAreaView style={styles.content}>
        {children}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9ff',
  },
  bgOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    zIndex: 1,
  },
  watermarkContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    opacity: 0.03,
  },
  watermark: {
    width: '60%',
    height: '60%',
  },
  content: {
    flex: 1,
    zIndex: 10,
  },
});


export default BackgroundWrapper;


