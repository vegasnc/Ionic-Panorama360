import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  IonList, 
  IonThumbnail, 
  IonLabel, 
  IonIcon, 
  IonItem, 
  IonFab,
  IonFabButton } from '@ionic/react';
import { Filesystem, Directory, FileInfo } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { add } from 'ionicons/icons';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import React from "react";
import './Home.css';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

const Home: React.FC = () => {

  const [imageFiles, setImageFiles] = useState<FileInfo[]>();
  // const ionRouter = useIonRouter();
  const history = useHistory();

  useEffect(() => {
    fetchFileList();
  })

  const fetchFileList = async () => {
    try {
      const directory = 'Panorama'; // Replace with the actual directory path
      const fileList = await Filesystem.readdir({
        path: directory,
        directory: Directory.ExternalStorage
      });

      const fileCnt = fileList.files.length;
      if( fileCnt > 0 ) {
        setImageFiles(fileList.files);
      }

      // Process the file list as needed
    } catch (error) {
      console.error('Error reading directory:', error);
    }
  }

  const getImageDataFromURI = async (fileURI: string) => {
    const readFile = await Filesystem.readFile({
      path: fileURI
    });

    console.log(readFile);

    return `data:image/jpeg;base64,${readFile.data}` as string;
  }

  const clickItem = (imageFileURI: string) => {
    history.push(`/viewer/${encodeURIComponent(imageFileURI)}`);
  }

  const goToCapture = () => {
    history.push('/capture');
  }
  

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Panorama 360</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent id="content" fullscreen>
        <IonList lines='full'>
          {
            imageFiles?.map((imageFile, index) => 
              <IonItem key={index} onClick={() => clickItem(imageFile.uri)}>
                <IonThumbnail slot="start">
                  <img alt="thumbnail" src={Capacitor.convertFileSrc(imageFile.uri)}></img>
                </IonThumbnail>
                <IonLabel>
                  { imageFile.name }
                </IonLabel>
              </IonItem>
            )
          }
        </IonList>
        <IonFab slot='fixed' vertical='bottom' horizontal='end'>
          <IonFabButton 
            size='small'
            onClick={() => goToCapture()}>
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Home;
