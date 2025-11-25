import React, { useState, useRef, useEffect } from 'react';
import { View, Button, Image, Modal, StyleSheet, Dimensions, PanResponder, Animated, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

const WINDOW_WIDTH = Dimensions.get('window').width;
const CROP_SIZE = 300; // tamaño del viewport cuadrado en px (ajustable)

export default function ProfilePhotoPicker({ onComplete, renderTrigger }: { onComplete: (uri: string) => void; renderTrigger?: (open: () => void) => React.ReactNode }) {
  const [picked, setPicked] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [imgMeta, setImgMeta] = useState<{ width: number; height: number } | null>(null);

  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const scale = useRef(new Animated.Value(1)).current;
  const lastScale = useRef(1);
  const lastPan = useRef({ x: 0, y: 0 });

  useEffect(() => {
    return () => {};
  }, [pan]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({ x: lastPan.current.x, y: lastPan.current.y });
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.numberActiveTouches === 1) {
          pan.x.setValue(gestureState.dx);
          pan.y.setValue(gestureState.dy);
        } else if (gestureState.numberActiveTouches >= 2) {
          const touches = evt.nativeEvent.touches;
          if (touches.length >= 2) {
            const t1 = touches[0];
            const t2 = touches[1];
            const dist = Math.hypot(t2.pageX - t1.pageX, t2.pageY - t1.pageY);
            if (!(pan as any).initialDist) (pan as any).initialDist = dist / lastScale.current;
            const newScale = dist / (pan as any).initialDist;
            scale.setValue(newScale);
          }
        }
      },
      onPanResponderRelease: () => {
        try {
          const current = (pan as any).__getValue ? (pan as any).__getValue() : { x: 0, y: 0 };
          lastPan.current = { x: current.x, y: current.y };
        } catch {
          lastPan.current = { x: lastPan.current.x, y: lastPan.current.y };
        }
        pan.flattenOffset();
        try {
          const s = (scale as any).__getValue ? (scale as any).__getValue() : lastScale.current;
          lastScale.current = s || lastScale.current;
          scale.setValue(lastScale.current);
        } catch {
          scale.setValue(lastScale.current);
        }
        (pan as any).initialDist = undefined;
      },
      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return Alert.alert('Permisos', 'Se necesitan permisos para acceder a las imágenes.');

    console.log('ProfilePhotoPicker: pickImage start');
    Alert.alert('Seleccionar imagen', 'Abriendo selector de imágenes...');

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: false,
      allowsEditing: false,
    });

    if (!res.canceled && res.assets && res.assets.length > 0) {
      const asset = res.assets[0];
      const uri = asset.uri;
      setPicked(uri);
      if (uri) {
        Image.getSize(
          uri,
          (width, height) => setImgMeta({ width, height }),
          () => setImgMeta(null)
        );
      } else {
        setImgMeta(null);
      }
      setModalVisible(true);
      pan.setValue({ x: 0, y: 0 });
      scale.setValue(1);
      lastPan.current = { x: 0, y: 0 };
      lastScale.current = 1;
    }
  };

  const handleSave = async () => {
    if (!picked || !imgMeta) {
      setModalVisible(false);
      return;
    }

    console.log('ProfilePhotoPicker: handleSave start');
    Alert.alert('Recortando', 'Procesando imagen...');

    const viewportSize = CROP_SIZE;
    const imgW = imgMeta.width;
    const imgH = imgMeta.height;
    const imgAspect = imgW / imgH;
    const viewportAspect = 1;

    let displayedWidth = 0;
    let displayedHeight = 0;
    if (imgAspect > viewportAspect) {
      displayedHeight = viewportSize;
      displayedWidth = imgW * (viewportSize / imgH);
    } else {
      displayedWidth = viewportSize;
      displayedHeight = imgH * (viewportSize / imgW);
    }

    const panVal = (pan as any).__getValue ? (pan as any).__getValue() : { x: 0, y: 0 };
    const transX = panVal.x || 0;
    const transY = panVal.y || 0;
    const curScale = (scale as any).__getValue ? (scale as any).__getValue() : lastScale.current || 1;

    const finalDisplayedWidth = displayedWidth * curScale;
    const finalDisplayedHeight = displayedHeight * curScale;

    const imgLeftInitial = (viewportSize - displayedWidth) / 2;
    const imgTopInitial = (viewportSize - displayedHeight) / 2;

    const imgLeft = imgLeftInitial + transX - (finalDisplayedWidth - displayedWidth) / 2;
    const imgTop = imgTopInitial + transY - (finalDisplayedHeight - displayedHeight) / 2;

    const cropX_displayed = Math.max(0, -imgLeft);
    const cropY_displayed = Math.max(0, -imgTop);
    const cropW_displayed = Math.min(finalDisplayedWidth - cropX_displayed, viewportSize);
    const cropH_displayed = Math.min(finalDisplayedHeight - cropY_displayed, viewportSize);

    const ratioX = imgW / finalDisplayedWidth;
    const ratioY = imgH / finalDisplayedHeight;

    const cropX_original = Math.round(cropX_displayed * ratioX);
    const cropY_original = Math.round(cropY_displayed * ratioY);
    const cropW_original = Math.round(cropW_displayed * ratioX);
    const cropH_original = Math.round(cropH_displayed * ratioY);

    const cropRect = {
      originX: Math.max(0, cropX_original),
      originY: Math.max(0, cropY_original),
      width: Math.max(1, Math.min(imgW - cropX_original, cropW_original)),
      height: Math.max(1, Math.min(imgH - cropY_original, cropH_original)),
    };

    try {
      const result = await ImageManipulator.manipulateAsync(picked, [{ crop: cropRect }], { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG });
      setModalVisible(false);
      setPicked(null);
      setImgMeta(null);
      console.log('ProfilePhotoPicker: crop result', result.uri);
      Alert.alert('Listo', 'Imagen recortada');
      onComplete(result.uri);
    } catch (e) {
      console.error('Crop error', e);
      Alert.alert('Error', 'Error recortando la imagen');
    }
  };

  return (
    <View>
      {renderTrigger ? (
        renderTrigger(pickImage)
      ) : (
        <Button title="Seleccionar foto" onPress={pickImage} />
      )}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={{ marginBottom: 8 }}>Mueve y haz zoom para recortar</Text>
          <View style={styles.cropContainer}>
            <View style={styles.viewport}>
              {picked && (
                <Animated.View
                  style={{
                    transform: [{ translateX: pan.x }, { translateY: pan.y }, { scale: scale }],
                  }}
                  {...panResponder.panHandlers}
                >
                  <Image
                    source={{ uri: picked }}
                    style={{
                      width: (() => {
                        if (!imgMeta) return CROP_SIZE;
                        const a = imgMeta.width / imgMeta.height;
                        return a > 1 ? imgMeta.width * (CROP_SIZE / imgMeta.height) : CROP_SIZE;
                      })(),
                      height: (() => {
                        if (!imgMeta) return CROP_SIZE;
                        const a = imgMeta.width / imgMeta.height;
                        return a > 1 ? CROP_SIZE : imgMeta.height * (CROP_SIZE / imgMeta.width);
                      })(),
                      resizeMode: 'cover',
                    }}
                  />
                </Animated.View>
              )}
              <View pointerEvents="none" style={styles.viewportBorder} />
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Button title="Cancelar" onPress={() => setModalVisible(false)} />
            <Button title="Guardar" onPress={handleSave} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  cropContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  viewport: {
    width: CROP_SIZE,
    height: CROP_SIZE,
    overflow: 'hidden',
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewportBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: CROP_SIZE,
    height: CROP_SIZE,
    borderWidth: 2,
    borderColor: '#fff',
  },
});
