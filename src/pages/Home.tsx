import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

import CameraPreview from '../components/CameraPreview';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <CameraPreview />
      </IonContent>
    </IonPage>
  );
};

export default Home;
