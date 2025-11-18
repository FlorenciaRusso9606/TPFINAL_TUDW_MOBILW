import { useState, useEffect } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native";
import { Card, Text, IconButton } from "react-native-paper";
import { Media } from "../../../types/post";
import { Video , Audio, ResizeMode} from "expo-av";
import ModalBase from "../common/Modal";
import { useThemeContext } from "../../../context/ThemeContext";

export default function PostMedia({ medias }: { medias: Media[] }) {
  const [open, setOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const {theme} = useThemeContext();

  function AudioPlayer({ uri }: { uri: string }) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync({ uri });
      if (mounted) setSound(sound);
    };

    loadSound();

    return () => {
      mounted = false;
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [uri]);

  const handleOpen =  (media: Media) => {
    if (media.type !== "AUDIO") {
       setSelectedMedia(media);
      setOpen(true);
    }
  };

  const handleClose = () => {
    setSelectedMedia(null);
    setOpen(false);
  };
  const getNumColumns = () => {
    if (medias.length === 1) return 1;
    if (medias.length === 2 || medias.length === 4) return 2;
    if (medias.length === 3) return 3;
    return 2;
  };
  return (
    <>
      <View style={[
          styles.grid,
          { backgroundColor: theme.colors.background },
        ]}
      >
        {medias.map((media, i) => {
          const url = media.url;
          const isAudio = media.type === "AUDIO";
          const isVideo = media.type === "VIDEO";

          return (
            <TouchableOpacity
              key={i}
             onPress={() => handleOpen(media)}
              activeOpacity={isAudio ? 1 : 0.8}
              style={[
                styles.mediaContainer,
                {
                  height: isAudio ? 100 : 200,
                  width: `${100 / getNumColumns()}%`,
                },
              ]}
            >
               <Card  style={styles.card}>
                      {isVideo ? (
                  <Video
                    source={{ uri: media.url }}
                    resizeMode={ResizeMode.COVER}
                    style={styles.media}
                    useNativeControls
                  />
                ) : isAudio ? (
                  
                   <AudioPlayer uri={media.url} />
                    
                ) : (
                  <Image
                    source={{ uri: media.url }}
                    style={styles.media}
                    resizeMode="cover"
                  />
                )}
              </Card>
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedMedia && (
        <ModalBase
          open={open}
          onClose={handleClose}
          title={
            selectedMedia.type === "VIDEO"
              ? "Reproduciendo video"
              : "Vista previa"
          }
          cancelText="Cerrar"
        >
          <View style={styles.card}>
              {selectedMedia &&
              (selectedMedia.type === "VIDEO" ? (
                <Video
                  source={{ uri: selectedMedia.url }}
                  resizeMode={ResizeMode.CONTAIN}
                  style={styles.modalMedia}
                  useNativeControls
                  shouldPlay
                />
              ) : (
                <Image
                  source={{ uri: selectedMedia.url }}
                  style={styles.modalMedia}
                  resizeMode="contain"
                />
              ))}
          </View>
        </ModalBase>
      )}
    </>
  );
}
}
const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 8,
  },
  mediaContainer: {
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 8,
  },
  card: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  media: {
    width: "100%",
    height: "100%",
  },
  audioContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#222",
  },
  modalMedia: {
    width: "100%",
    height: 300,
    borderRadius: 10,
  }
})