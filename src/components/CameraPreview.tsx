import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { useEffect, useRef } from 'react';

const CameraPreview: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
  
    useEffect(() => {
      const startCamera = async () => {
        try {
            if( Capacitor.isNativePlatform() ) {
                const hasPermission = await checkCameraPermissions();
                if (hasPermission) {
                  const cameraPreview = await Camera.getPhoto({
                    quality: 100,
                    resultType: CameraResultType.Uri,
                    source: CameraSource.Camera,
                  });
                  if (videoRef.current) {
                    videoRef.current.srcObject = null;
                    videoRef.current.src = cameraPreview?.webPath ?? '';
                    videoRef.current.play();
                  }
                } else {
                  console.log('Camera permission not granted.');
                }
            } else {
                console.log('Camera preview is not available in the browser.');
            }
        } catch (error) {
            console.log('Camera error:', error);
        }
      };
  
      startCamera();
    }, []);

    const checkCameraPermissions = async (): Promise<boolean> => {
        const permissionResult = await Camera.checkPermissions();
        return permissionResult.camera && permissionResult.camera !== 'denied';
    };
  
    return <div>
        <video ref={videoRef} autoPlay></video>
        <h1>This is test</h1>
    </div>;
};

export default CameraPreview;
  
  