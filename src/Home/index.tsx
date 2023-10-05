import { View } from 'react-native';
import { styles } from './styles';
import { Camera, CameraType, FaceDetectionResult } from 'expo-camera';//Cameratype nos permite acceder  a la camara frontal
import { useEffect, useState } from 'react';
import * as FaceDetector from 'expo-face-detector';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

export function Home() {
    const [faceDetected, setFaceDetected] = useState(false);
    const [permission, requestPermission] = Camera.useCameraPermissions(); //Pedimos el permiso al usuario para que la app pueda pueda usar la camara

    const faceValues = useSharedValue({
        width: 0,
        height: 0,
        x: 0,
        y: 0
    });

    function handleFacesDetected({ faces }: FaceDetectionResult){

        console.log(faces);
        
        const face = faces[0] as any;

        if(face){
            const { size, origin } = face.bounds;
            faceValues.value = {
                width: size.width,
                height: size.height,
                x: origin.x,
                y: origin.y
            }

            setFaceDetected(true);
        }else{
            setFaceDetected(false);
        }

    }

    const animatedStyle = useAnimatedStyle(() => ({
        position: 'absolute',
        zIndex: 1,
        width: faceValues.value.width,
        height: faceValues.value.height,
        transform: [
            { translateX: faceValues.value.x },
            { translateY: faceValues.value.y },

        ],
        borderColor: 'blue',
        borderWidth: 10

    }));

    useEffect(() => {
        requestPermission();
    }, []);

    if(!permission?.granted){
        return;
    }
//creamos la funcion para detectar el rostro



  return (
    <View style={styles.container}>
        {
        faceDetected && 
        <Animated.View style={animatedStyle}/>
        }
        <Camera style= {styles.camera} 
        type={CameraType.front}
        onFacesDetected={handleFacesDetected}
        faceDetectorSettings={{
            mode: FaceDetector.FaceDetectorMode.fast,
            detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
            runClassifications: FaceDetector.FaceDetectorClassifications.all,
            minDetectionInterval: 100,
            tracking: true,
        }}/>
    </View>
  );
}