import { IonContent, IonHeader, IonPage, IonTitle, 
    IonToolbar, IonButton } from '@ionic/react';
import { useParams } from 'react-router';
  
import React from "react";
import { useEffect, useState } from 'react';
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

  
const SphereViewer: React.FC = () => {

    const pSRef = React.useRef<HTMLDivElement>(null) as any;
    const { paramData } = useParams<{ paramData: string }>();
    const [imageBase64, setImageData] = useState("");

    useEffect(() => {        
        if(imageBase64 && pSRef && pSRef.current && pSRef.current.hasOwnProperty('setPanorama'))
            pSRef.current.setPanorama(imageBase64);

            console.log(">>", imageBase64);
    }, [pSRef, imageBase64]); // will only be called when the src prop gets updated

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                <IonTitle>Panorama 360</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <div id="container"></div>
                <ReactPhotoSphereViewer
                    ref={pSRef}
                    src={Capacitor.convertFileSrc(decodeURIComponent(paramData))}
                    height={"90vh"}
                    width={"100%"}
                    littlePlanet={false}
                    container="container"
                ></ReactPhotoSphereViewer>
            </IonContent>
        </IonPage>
    );
};

export default SphereViewer;
  