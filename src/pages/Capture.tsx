import { IonContent, IonHeader, IonPage, IonTitle, 
  IonToolbar, IonButton, IonToast } from '@ionic/react';
import { CameraPreview, CameraPreviewOptions } from '@capacitor-community/camera-preview';
import { Filesystem, Directory } from '@capacitor/filesystem';

import React from "react";
import './Home.css';
import { useEffect, useState } from 'react';
import Sphere from './sphere';


const Capture: React.FC = () => {

  const [capturedImage, setImage] = useState('');
  const [savedImagePath, setImagePath] = useState('');
  const [pose, setPose] = useState('');
  const [toastIsOpen, setToastIsOpen] = useState(false);

  useEffect(() => {
    const cameraPreviewOptions: CameraPreviewOptions = {
      parent: 'content',
      toBack: true,
      position: 'rear'
    };

    CameraPreview.start(cameraPreviewOptions);
  }, []);

  const captureImage = async () => {
    const cameraPreviewOptions: CameraPreviewOptions = {
      parent: 'content',
      toBack: true,
      position: 'rear',
    };

    const result = await CameraPreview.capture(cameraPreviewOptions);
    const base64Data = 'data:image/jpeg;base64,' + result.value;

    // Write the file to the data directory
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Documents
    })
    setImagePath(savedFile.uri);
    setImage( base64Data );
  }

  const clientBtn = () => {
    captureImage();
    setToastIsOpen(true);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Panorama 360</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent id="content" className='content-camera-preview' fullscreen>
        <Sphere captureImage={clientBtn}></Sphere>
          <div className="display-cover content-camera-preview">
            <div className='gradient-images content-camera-preview'></div>
            <div className='square content-camera-preview'></div>
            <div className='center content-camera-preview'></div>
          </div>
        <div style={{ position: "absolute", bottom: "0"}}>
          {
            capturedImage !== "" ? <img src={capturedImage} style={{width: "150px"}}></img> : <></>
          }
        </div>
        <IonToast
          isOpen={toastIsOpen}
          message={"Succeeded captured!" + savedImagePath}
          onDidDismiss={() => setToastIsOpen(false)}
          duration={5000}
        ></IonToast>
      </IonContent>
    </IonPage>
  );
};

export default Capture;
