import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { LoaderComponent } from '../loader/loader.component';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
    private overlayRef: OverlayRef = null;

    constructor(private overlay: Overlay) { }
    //Call this method to start the Spinner -- Raviteja
    public show(message = '') {
        // Returns an OverlayRef (which is a PortalHost)
        if (!this.overlayRef) {
            this.overlayRef = this.overlay.create();
        }

        // Create ComponentPortal that can be attached to a PortalHost
        const spinnerOverlayPortal = new ComponentPortal(LoaderComponent);
        const component = this.overlayRef.attach(spinnerOverlayPortal); // Attach ComponentPortal to PortalHost
    }

    //Call this method to stop the Spinner -- Raviteja
    public hide() {
        if (!!this.overlayRef) {
            this.overlayRef.detach();
        }
    }
}
