package ionic.panorama;

import android.os.Bundle;

import com.ahm.capacitor.camera.preview.CameraPreview;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Initializes the Bridge
        this.initialPlugins.add(CameraPreview.class);
    }
}
