// shared.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SharedService {
  private appointmentTriggerSource = new Subject<number>(); // or string, depending on your ID type
  appointmentTrigger$ = this.appointmentTriggerSource.asObservable();

  triggerAppointmentAction(appointmentID: number) {
   // debugger
    this.appointmentTriggerSource.next(appointmentID);
  }
}
