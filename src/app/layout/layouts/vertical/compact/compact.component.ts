import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { Navigation } from 'app/core/navigation/navigation.types';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { FuseDrawerComponent } from '@fuse/components/drawer';
import { UtilitiesService } from 'app/Services/utilities.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ToastService } from 'app/Services/toastservice';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { EncryptionService } from 'app/Services/encryption.service';
import { MatStepper } from '@angular/material/stepper';
import { LoaderService } from 'app/Services/loader.service';
import { DataRefreshService } from '../../../../shared/data-refresh.service';
import { SharedService } from 'app/shared/shared.service';

@Component({
    selector     : 'compact-layout',
    templateUrl  : './compact.component.html',
    styleUrls:['./compact.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe],
})
export class CompactLayoutComponent implements OnInit, OnDestroy
{
    discounts: any = [];
    services: any = [];
    isDuePay: boolean = false;
    horizontalStepperForm: FormGroup;
    Mode: any = [];
    ModePrice=false;
    price
    prices: any = [];
    actualPrice: any = 0;
    loginDetails: any;
    registrationID: any;
    roleID
    myControl = new FormControl();
    myControl2
    isScreenSmall: boolean;
    navigation: Navigation;
    selectedPrice: any;
    amounttopaid: boolean;
    genders
    nextDisabled: boolean = true;
    Genderselected: any;
    age:any;
    mobNum: string;
    fName:any;
    slotsArr: any = [];
    doctrids: any;
    selectedDate: any;
    currentTimes: string;
    isNoSlot: boolean = false;
    allAppointments: any = [];
    doctors: any = [];
    yesterday = new Date();
    isPriceTag:boolean=true
    action
    actionName
    appt: any = {};
    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    @ViewChild('editCompanyModal') editCompanyModal: TemplateRef<any>;
    private editCompanyDialogRef: MatDialogRef<TemplateRef<any>>;
    @ViewChild('appointmentDrawer') appointmentDrawer: FuseDrawerComponent;
    @ViewChild('horizontalStepper') stepper!: MatStepper;
    errorMessage: any;
    searchKey1: string;
    searchKey2: string;
    searchKey3: string = ''; // Stores user input
  filteredOptions: Observable<any[]> = of([]); // Default empty observable
  private searchSubject = new BehaviorSubject<string>(''); 
    filterPatientappointments: any = [];
    appointmentID: number;
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _navigationService: NavigationService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
        private utilitiesService: UtilitiesService,
        private _formBuilder: FormBuilder,
        public datepipe: DatePipe,
        private _snackBar: MatSnackBar,
        private toastService: ToastService,
        private dialog: MatDialog,
        private encySer:EncryptionService,
        public spinner: LoaderService,
        private dataRefreshService: DataRefreshService,
        private sharedService: SharedService
    )

    {
        this.loginDetails = JSON.parse(localStorage.getItem('loginDetails'));
        if (this.loginDetails) {
            this.roleID = this.loginDetails.roleID;
            this.registrationID = this.loginDetails.registrationID;
        }
        this.Mode = [];
        this.Mode.push({ ID: 1, label: 'Cash' })
        this.Mode.push({ ID: 2, label: 'Card' })
        this.Mode.push({ ID: 3, label: 'UPI' })
        this.Mode.push({ ID: 4, label: 'NetBanking' })
        this.yesterday.setDate(this.yesterday.getDate() - 0);

        // this.filteredOptions = this.myControl.valueChanges
        // .pipe(
        //     startWith(''),
        //     map(state => state ? this.filterStates(state) : this.filterPatientappointments.slice())
        // );

        // this.filteredOptions = this.searchSubject.pipe(
        //     debounceTime(500), // Wait for user to stop typing for 500ms
        //     distinctUntilChanged(), // Ignore same consecutive values
        //     switchMap(query => query.length > 2 ? this.fetchPatients(query) : of([])) // Call API if input > 2 chars
        //   );


        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            debounceTime(300), // Wait for 300ms after the last keystroke
            distinctUntilChanged(), // Only proceed if the value has changed
            map(state => (state ? this.filterStates(state) : this.filterPatientappointments.slice()))
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number
    {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.appointmentButtonClicked = false;

        this.getDiscounts();
        this.getServices();
        this.getGenders();
        this.getAllDoctors();
        this.getAllAppointmentBills();
        this.getAllAppointments();
       //  this.getAllPatients();
        // Subscribe to navigation data
        this._navigationService.navigation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((navigation: Navigation) => {
                this.navigation = navigation;
            });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });


            this.horizontalStepperForm = this._formBuilder.group({
                step1: this._formBuilder.group({
                    appDate: new FormControl(new Date()),
                    slot: ['', Validators.required],
                    docName: ['', Validators.required],
                    firstName: ['', Validators.required],
                   // lastName: [''],
                    mobNum: ['',  [
                        Validators.required, // Required field
                        Validators.pattern(/^[0-9]{10}$/) // Matches a 10-digit number
                      ]],
                    gender: ['', Validators.required],
                    age: ['', Validators.required],
                    status: [''],

                }),
                step2: this._formBuilder.group({
                    serviceName: ['', Validators.required],
                    price: ['', Validators.required],
                    discount: [''],
                    amountPaid: [''],
                    skipPayment: [''],
                    netPrice: [''],
                    duePayment: [''],
                    modeOfPayment: ['',Validators.required]

                }),
            });

    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void
    {
        // Get the navigation
        const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

        if ( navigation )
        {
            // Toggle the opened status
            navigation.toggle();
        }
    }

    get step1(): any {
        return this.horizontalStepperForm.get('step1');
    }

    get step2(): any {
        return this.horizontalStepperForm.get('step2');
    }

    filteredPat:[]=[]
    onInput(value: string) {
         
        this.filterSites(value);
      }
         
      filterSites(value: string) {
          
        const filterValue = value.toLowerCase();
        this.filteredPat = this.filterPatientappointments.filter(value =>
          value.mobile.toLowerCase().includes(filterValue)
        );
        console.log("First 10 items:", this.filteredPat.slice(0, 10));
          }

    filterStates2(searchValue: string) {
            //debugger  
          if( searchValue.length>=3){

        
            // this.spinner.show();
        this.utilitiesService.getSearchPatients(searchValue).subscribe((resp:any)=>{
              //debugger
            if(resp){
                this.filteredOptions=resp
                this.spinner.hide();
                console.log("Filter PAtirnts",this.filteredOptions)
            }
        })
    }
       }

    filterStates(searchValue: string) {
          
     const searchTokens = searchValue.toLowerCase().split(' ').filter(token => token.trim() !== '');

     return this.filterPatientappointments.filter(item => {
       const fullName = item.patient.toLowerCase();
       const mobileAndName = item.mobile.toLowerCase() + ' (' + fullName + ')';

       // Check if any of the search tokens are found within the mobile number or the mobileAndName string
       return searchTokens.some(token => mobileAndName.includes(token));
   });
   }

    private _filter(value: any): string[] {
         
        //const filterValue = value.toLowerCase();

        //return this.patientsappointments.data.filter(option => option.mobile.toLowerCase().includes(filterValue));
        if (!isNaN(value)) {

            return this.filterPatientappointments.filter(option => option.mobile.includes(value));

        }
        else{
            return this.filterPatientappointments.filter(option => option.patient.includes(value));

        }
    }

    patients:any=[]
    getAllPatients() {
         
        this.utilitiesService.GetAllPatients().subscribe(
            (data) => {
                if (data) {
                 //  this.filterPatientappointments = data;
                    this.patients = data;
                } else {
                }
            },

            () => { }
        );
    }

    displayFn(user): string {
         
        return user && user.mobile ? user.mobile : '';
    }

    patientID: number = 0;
    appointID: number = 0;
    applyFilter(val) {
           
        console.log(val);
        this.fName = val.value.patientName;
        this.mobNum = val.value.mobile;
        this.age = val.value.age;
        this.patientID=val.value.patientID;
        this.Genderselected=val.value.genderID
        val = val.trim(); // Remove whitespace
        val = val.toLowerCase(); // Datasource defaults to lowercase matches
        let details = this.patients.filter(
            (a) => a.mobile.trim() == val.value.mobile.trim() && a.patient.trim().toLowerCase() == val.value.patient.trim().toLowerCase()
        );
        if (details.length > 0) {
            this.action = 'Patient Exists save new appointment';
            this.appointID = 0;
            this.patientID = details[0].patientID;
            this.step1.controls['fName'].setValue(details[0].patient);
            this.step1.controls['mobNum'].setValue(details[0].mobile);
            if (this.actionName == 'Update Existing Appointment') {
                this.step1.controls['mobNum'].disable();
                this.step1.controls['fName'].disable();
            }
            this.step1.controls['age'].setValue(details[0].age);
            this.step1.controls['gender'].setValue(details[0].genderID);
        }
        else {
            this.action = 'New Appointment';
            this.step1.controls['mobNum'].enable();
              this.step1.controls['fName'].enable();


        }
        // this.filteredOptions = this.myControl.valueChanges
        //     .pipe(
        //         startWith(''),
        //         map(state => state ? this.filterStates(state) : this.filterPatientappointments.slice())
        //     );
    }

    showError(msg) {
        this.toastService.show(msg, {
            classname: 'bg-info text-light',
            delay: 4000,
            autohide: true,
            headertext: 'Appointment Details!',
        });
    }



    
    loading:boolean
    appointmentButtonClicked = false;

    addRegisterPatientAppointment(val) {
        // debugger

        if (this.appointmentButtonClicked) return; // Prevent multiple clicks
        this.appointmentButtonClicked = true;
           
        this.loading = true;

            this.appt.AppointmentID = 0;
            this.appt.registrationID = Number(val.step1.docName);  //
           this.appt.PatientID = 0;  //
            this.appt.ServiceID = Number(val.step2.serviceName);
            this.appt.Slot = (val.step1.slot.slot);
            this.appt.StatusID = Number(7);
            this.appt.ServiceDate = this.datepipe.transform(val.step1.appDate, 'd MMM yyyy');
            this.appt.AppointmentBill = ('Test');  //
            this.appt.Payment = (val.step2.amountPaid);
            if (this.isPriceTag == true) //SkipBilling
            {
                this.appt.modeofPaymentID = val.step2.modeOfPayment;    
                if (this.roleID == '1' || this.roleID == '3') {
                    this.appt.DiscountID = Number(val.step2.discount);
                    if (this.appt.DiscountID == 0) {
                      //  this.appt.DiscountID = 6;
    
                    }
                    if (this.appt.DiscountID == 6) {
                        
    
                        if(this.appt.PriceID==2){
                            val.step2.amountPaid=700
                        }
                        if(this.appt.PriceID==7){
                            val.step2.amountPaid=500
                        }
                    }
    
                     //
                }
                else {
                    this.appt.DiscountID = Number(val.step2.discount);
                    var pricList = this.prices.filter(a => a.priceID === this.horizontalStepperForm.value.step2.price);
                    this.appt.DuePayment = "0";
                }
                if (this.roleID == '1' || this.roleID == '3') {
                    var due = Number(this.horizontalStepperForm.value.step2.netPrice) - Number(Number(val.step2.amountPaid) + Number(this.horizontalStepperForm.value.step2.duePayment));
                    if (this.isDuePay == true) {
                        //if (Number(due) == Number(this.horizontalStepperForm.value.step2.duePayment)) {
                        if (due == 0) {
                            this.appt.DuePayment = "0";
                        }
                        // }
                        else {
                            this.appt.DuePayment = this.horizontalStepperForm.value.step2.duePayment;
                        }
                        this.appt.Payment = Number(val.step2.amountPaid) + Number(this.horizontalStepperForm.value.step2.duePayment);
                    }
                    else {
    
                        if (due > 0) {
                            this.appt.DuePayment = due.toString();
                        }
                        else {
                            this.appt.DuePayment = "0";
                        }
                    }
                }
    
            }
            else {
                this.appt.modeofPaymentID = val.step2.modeOfPayment;  
                this.appt.PriceID = 6;
              //  this.appt.Payment = "0"; 
                this.appt.DuePayment = "0";
                this.appt.DiscountID = Number(val.step2.discount);
            }
            this.appt.PriceID = 6;
            this.appt.Price=this.price;
            const selprice=this.allPrices.filter(price=>price.price==this.price)
            this.appt.PriceID=selprice[0].priceID
            this.appt.Action = "New Appointment";
            this.appt.PatientName = (val.step1.firstName);  //
            this.appt.Mobile = (val.step1.mobNum); //
            this.appt.GenderID = Number(val.step1.gender);
            this.appt.Age = Number(val.step1.age);
            this.appt.PatientStatus = 'Booked'
            let arr = [];
            arr.push(this.appt);
            if(this.appt.modeofPaymentID==null){
                this.appt.modeofPaymentID=6
            }

            this.utilitiesService.addRegisterPatientAppointment(this.appt).subscribe((data) => {

                if (data) {
                    // debugger
                    this.appointmentButtonClicked = false;
                    this.appointmentID = parseInt(data.toString());
                    this.resetForm();
                    this.encySer.triggerMethod();
                    this.getAllAppointmentsAfterSave();

                   if (this.action === 'Update Existing Appointment') {
                        this._snackBar.open('Appointment Updated Successfully...!!', 'OK', {
                            horizontalPosition: this.horizontalPosition,
                            verticalPosition: this.verticalPosition,
                            "duration": 2000
                        });
                        
                        // this.actionFormName('New Appointment');

                    } else if (data) {
                        this._snackBar.open('Appointment Added Successfully...!!', 'OK', {
                            horizontalPosition: this.horizontalPosition,
                            verticalPosition: this.verticalPosition,
                            "duration": 2000
                        });

                    }

                    // debugger
                    
                    // this.receiptToken = data;
                    // this.dataRefreshService.triggerRefresh();
                    this.sharedService.triggerAppointmentAction(this.appointmentID);
                   this.appointmentDrawer.close();
                    this.dataRefreshService.triggerRefresh();
                   // this.ngOnInit(); 
                  //  this.appt = {};
                } else {
                    this.appointmentButtonClicked = false;

                    this.showError('Your query is not sent, Please try after some time');
                    console.log('DB Exception');
                }
    
            },
                (error) => {
                    this.errorMessage = error;
                },
                () => { }
            );
            this.loading = false; // Hide loading spinner after 5 seconds
    }

    resetForm(){
        this.stepper.reset();
        this.getDiscounts();
        this.step1.controls['mobNum'].enable();
        this.step1.controls['appDate'].setValue(new Date());
    }


    allPrices=[]
    getAllAppointmentBills() {
         
        this.utilitiesService.getAllAppointmentBills().subscribe(
            (data) => {
                if (data) {
                     ;
                    this.prices = data;
                    this.allPrices=data;
                    console.log('prices', this.prices);
    
                    // Filter prices based on this.price
                    if (this.price) {
                        this.prices = this.prices.filter(price => price === this.price);
                    }
    
                    // this.step2.controls['price'].setValue(2);
                    // this.prices.splice(0, 1);
                } else {
                    // Handle case when data is empty
                }
            },
            () => { }
        );
    }

    selecteddiscount
    selectpayment
    getDiscounts() {
         
        this.utilitiesService.getDiscounts().subscribe(result=>{
                if (result) {
                    this.discounts = result;
                    console.log("resulttest",this.discounts)
                   this.selecteddiscount = this.discounts[0].discountID; 
                   this.selectpayment = this.Mode.length > 0 ? this.Mode[0].ID : null;
                } 
            },err=> {
                console.log(err)
             }
        );
    }

    applyNetPrice(val) {

         
        const Amounttopay = this.horizontalStepperForm
        .get('step2')
        .get('amountPaid');
        const modeOfPaymentControl = this.horizontalStepperForm
        .get('step2')
        .get('modeOfPayment');
        if (val.value==6) {
            // Remove the Validators.required validator
            //  this.step2.controls['amountPaid'].setValue(0);
            this.step2.controls['amountPaid'].setValue(this.selectedPrice);

            modeOfPaymentControl.clearValidators();
            modeOfPaymentControl.updateValueAndValidity(); 
          } else {
            // Add the Validators.required validator back
            modeOfPaymentControl.setValidators([Validators.required]);
            modeOfPaymentControl.updateValueAndValidity(); 

          }


if(val.value==6){
 
this.step2.controls['discount'].setValue(0);
// this.step2.controls['amountPaid'].setValue(0);
 this.selectedPrice = this.step2.controls['amountPaid'].value;

this.amounttopaid=true;
Amounttopay.clearValidators();
Amounttopay.updateValueAndValidity(); 
this.ModePrice=true
}
else{
    if(val.value==7){
        this.step2.controls['amountPaid'].setValue(500);
        this.selectedPrice = this.step2.controls['amountPaid'].value;

    }
    if(val.value==2){
       // this.step2.controls['amountPaid'].setValue(700);
        this.selectedPrice = this.step2.controls['amountPaid'].value;

    }
    this.ModePrice=false  
    this.amounttopaid=false;

    // this.amounttopaid=true;
        Amounttopay.setValidators([Validators.required]);
        Amounttopay.updateValueAndValidity(); 
        }
        
        if (this.roleID == '1') {
            if (val.modeofPaymentID != 5) {
                var pricList = [];
                var discList = [];
                if (this.horizontalStepperForm.value.step2.price != "") {
                    pricList = this.prices.filter(a => a.priceID === this.horizontalStepperForm.value.step2.price);
                    this.step2.controls['netPrice'].setValue(pricList[0].price);
                }
                if (this.horizontalStepperForm.value.step2.discount != "") {
                    discList = this.discounts.filter(a => a.discountID === this.horizontalStepperForm.value.step2.discount);
                }
                
                if (this.horizontalStepperForm.value.step2.price != "" && this.horizontalStepperForm.value.step2.discount != "") {
                    //   
                    if (discList.length > 0 && pricList.length > 0) {
                        var disco = ((pricList[0].price * discList[0].discount) / 100);
                        this.step2.controls['netPrice'].setValue(pricList[0].price - disco);
                    }
                }
            }

        }
        else {
            if (this.horizontalStepperForm.value.step2.price != "") {
                pricList = this.prices.filter(a => a.priceID === this.horizontalStepperForm.value.step2.price);
                //this.step2.controls['netPrice'].setValue(pricList[0].price);
                this.actualPrice = pricList[0].price;
            }

        }
    var prices  = this.horizontalStepperForm
    .get('step2')
    .get('price').value;
    var disc  = this.horizontalStepperForm
    .get('step2')
    .get('discount').value;
    if (disc == 0) { // Handle the discount of zero
        var amtpaid = 0;
        if (prices == 2) {
          amtpaid = 700;
        } else if (prices == 7) {
          amtpaid = 500;
        }
        this.step2.controls['amountPaid'].setValue(amtpaid);
      }
if(disc==1){
    var amtpaid=0;
    if(prices==2){

        amtpaid= (10 / 100) * 700
        amtpaid=  700- amtpaid ;

            }
    else if(prices==7){

         amtpaid= (10 / 100) * 500
         amtpaid=  500- amtpaid ;

            }

            this.step2.controls['amountPaid'].setValue(amtpaid);

}
if(disc==2){
    var amtpaid=0;
    if(prices==2){

         amtpaid= (20 / 100) * 700;
         amtpaid=  700- amtpaid ;
            }
    else if(prices==7){

         amtpaid= (20 / 100) * 500
         amtpaid=  500- amtpaid ;

        
            }
            this.step2.controls['amountPaid'].setValue(amtpaid);

}
if(disc==3){
    var amtpaid=0;
    if(prices==2){

         amtpaid= (25 / 100) * 700
         amtpaid=  700- amtpaid ;

            }
    else if(prices==7){

         amtpaid= (25 / 100) * 500
         amtpaid=  500- amtpaid ;

            }
            this.step2.controls['amountPaid'].setValue(amtpaid);

}
if(disc==4){
    var amtpaid=0;
    if(prices==2){

         amtpaid= (30 / 100) * 700
         amtpaid=  700- amtpaid ;

            }
    else if(prices==7){

         amtpaid= (30 / 100) * 500
         amtpaid=  500- amtpaid ;

            }
            this.step2.controls['amountPaid'].setValue(amtpaid);

}
if(disc==5){
    var amtpaid=0;
    if(prices==2){

         amtpaid= (40 / 100) * 700
         amtpaid=  700- amtpaid ;

            }
    else if(prices==7){

         amtpaid= (40 / 100) * 500
         amtpaid=  500- amtpaid ;

            }
            this.step2.controls['amountPaid'].setValue(amtpaid);

        }

        // Number(this.horizontalStepperForm.value.step2.price);
    }

    applyNetPrice1() {
         
        const totalamount = this.step2.controls['price'].value;
        const discount = this.step2.controls['discount'].value;
        
        if (discount !== null) {
          const selectedDis = this.discounts.filter(item => item.discountID === discount);
          const discountamount = (totalamount * selectedDis[0].discount) / 100;
          const amountPaid = totalamount - discountamount;
          this.step2.controls['amountPaid'].setValue(amountPaid.toString());
        } else {
          // Set amountPaid to totalamount if discount is null
          this.step2.controls['amountPaid'].setValue(totalamount.toString());
        }
        
        // const modeOfPaymentControl = this.horizontalStepperForm
        // .get('step2')
        // .get('modeOfPayment');
        // if (val.value<=0) {
        //     // Remove the Validators.required validator

        //     modeOfPaymentControl.clearValidators();
        //     modeOfPaymentControl.updateValueAndValidity();
        //   } else {
        //     // Add the Validators.required validator back
        //     modeOfPaymentControl.setValidators([Validators.required]);
        //     modeOfPaymentControl.updateValueAndValidity();

        //   }
        }

        getServices() {
             
            this.utilitiesService.getServices().subscribe(
                (data) => {
                    if (data) {
                        ;
                        this.services = data;
                    } else {
                    }
                },
    
                () => { }
            );
        }

        EnableModeprice(value){
             
            this.ModePrice=false
            this.utilitiesService.getServicebyid(value.value).subscribe(
                (data) => {
                  if (data) {
                    console.log("GetById",data)
                    this.step2.controls['price'].setValue(data.price);
                    this.price=data.price
                    this.applyNetPrice1()
                //   this.regDetails1 = new MatTableDataSource(data);
                //   this.regDetails1.sort = this.sort;
                //   this.regDetails1.paginator = this.Assdocpag;

                  }
                }
            )
        }

        getTimeChange(val) {

            if (val == "No Slots Available") {
                this.isNoSlot = true;
            }
            else {
                this.isNoSlot = false;
            }
        }

        getGenders() {
            this.utilitiesService.getAllGenders().subscribe(
                (data) => {
                    if (data) {
                        this.genders = data;
                    } else {
                    }
                },
    
                () => { }
            );
        }

        onDateChanged(event: any) {
            const selectedDate = event.value; // The selected date
        console.log('Selected Date:', selectedDate);
        this.selectedDate = selectedDate; // Store the selected date
        this.getSlotsWithDocID(this.doctrids); 
        }

        getAllDoctors() {
             
            this.utilitiesService.getAllDoctors().subscribe(
                (data) => {
                    if (data) {
                        // console.log(data)
                        data = data .sort((a,b) => {
                            if((a.doctor).toLowerCase() < (b.doctor).toLowerCase()){
                                return -1;
                            }
                        })
                        this.doctors = data;
                    } else {
                    }
                },
    
                () => { }
            );
        }
        


        getSlotsWithDocID(val) {
             
            this.doctrids=val;
            this.selectedDate = this.step1.get('appDate').value
            var d = new Date(this.selectedDate);
            var n = d.getDay();
           
            const hours = d.getHours().toString().padStart(2, '0');
            const minutes = d.getMinutes().toString().padStart(2, '0');
            const seconds = d.getSeconds().toString().padStart(2, '0');
        
            // Create a formatted time string
            this.currentTimes = `${hours}:${minutes}:${seconds}`;
            let arr = [];
            arr.push({
                DoctorID: val
            })
            var url = 'PatientsAppointments/DoctorsAvailabilitySlots/';
            this.utilitiesService.addUpdateVitals(arr, url).subscribe(
                (data) => {
                    if (data) {
                     
                        this.slotsArr = data;
                        
                        console.log("multiple time",this.slotsArr)
                        if (this.slotsArr.length == 0) {
                            //this.slotsArr[0].slot="No Slot";
                            this.slotsArr.push({ day: 7, rowid: 0, doctorid: 0, slot: 'No Slots Available' });
                            this.step1.controls['slot'].setValue(this.slotsArr[0]);
                            this.isNoSlot = true;
                            //  this.horizontalStepperForm.setErrors({
                            //                 invalid: true,
                            //              });
                        }
                        else {
                            let selDate = this.datepipe.transform(this.selectedDate, 'dd MMM yyyy');
                            let docAppointmentsOnSelectedDate = this.allAppointments.filter(a => a.doctorID == val && this.datepipe.transform(a.serviceDate, 'dd MMM yyyy') == selDate)
                            let dayOfWeekNumber = d.getDay();
                            // for (var i = 0; i < this.slotsArr.length; i++) {
                            for (var i = this.slotsArr.length; i >= 0; --i) {
    
                                if (dayOfWeekNumber == 0) {
                                    dayOfWeekNumber = 7;
                                }
                                if (i == 0) {
                                    if (dayOfWeekNumber != this.slotsArr[0].day) {
                                        this.slotsArr.splice(0, 1);
    
                                    }
                                }
                                else {
                                    if (dayOfWeekNumber != this.slotsArr[i - 1].day) {
                                        this.slotsArr.splice(i, 1);
    
                                    }
                                    else {
                                        if (docAppointmentsOnSelectedDate.some(e => e.slotTime === this.slotsArr[i].slot)) {
                                            this.slotsArr.splice(i, 1);
                                        }
                                    }
                                }
                            }
                            
    
    
                           
                            var d2 = new Date(this.selectedDate);
                            var n1 = d2.getDate();
                           var n2 = d2.getFullYear();
                           var n3 = d2.getMonth();
                            var d1 = new Date();
                            var n12 = d1.getDate();
                            var n22 = d1.getFullYear();
                            var n33 = d1.getMonth();
                             
                            if(n1==n12 && n2==n22 && n3==n33){
    
                                var slotsArr12=[];
                                slotsArr12=this.slotsArr;
                                this.slotsArr=[];
                                for (var j = 0; j < slotsArr12.length;  j++) {
        
                                    const timeString = slotsArr12[j].slot;
                                    const timeParts = timeString.match(/(\d+):(\d+)([APap][Mm])/); // Use a regular expression to extract time components
                                    
                                    if (timeParts) {
                                      let hours = parseInt(timeParts[1], 10);
                                      const minutes = parseInt(timeParts[2], 10);
                                      const ampm = timeParts[3].toLowerCase();
                                    
                                      if (ampm === "pm" && hours !== 12) {
                                        hours += 12; // Convert to 24-hour format if it's PM
                                      } else if (ampm === "am" && hours === 12) {
                                        hours = 0; // Midnight (12:00 AM) is 0 in 24-hour format
                                      }
                                    
                                      // Create a Date object with the extracted hours and minutes
                                      const dates3 = new Date();
                                      dates3.setHours(hours);
                                      dates3.setMinutes(minutes);
                                        if(dates3>d1){
                                    this.slotsArr.push(slotsArr12[j])
                                        }
        
                                     
                                      console.log(dates3);
                                    } 
                                    
                                    
                                    
                                }
                            }
    
    
    
                        }
                        if (this.slotsArr.length === 0) {
                            this.slotsArr.push({ day: 7, rowid: 0, doctorid: 0, slot: 'No Slots Available' });
                            this.step1.controls['slot'].setValue(this.slotsArr[0]);
                            this.isNoSlot = true;
                        } else {
                            this.isNoSlot = false;
                        }
                    }
                    else {
    
    
                    }
                },
    
                () => { }
            );
           
        }

        openCompanyDetailsDialog(): void {
             
            const dialogConfig = new MatDialogConfig();
            dialogConfig.restoreFocus = false;
            dialogConfig.autoFocus = false;
            dialogConfig.role = 'dialog';
            dialogConfig.disableClose = true;
                 
            this.editCompanyDialogRef = this.dialog.open(this.editCompanyModal, dialogConfig);
    
            this.editCompanyDialogRef.afterClosed().subscribe(result => {
                console.log('The dialog was closed...');
            });
        }

        onSearchClear() {
           this.searchKey3 = '';
        }

        date
        todayDataSourcePrintBookings=[];
        receiptToken
        getAllAppointments() {
               
            // let todayDate1 = this.datepipe.transform(this.date, 'dd MMM yyyy');
            this.utilitiesService.getAllAppointments().subscribe(
                (data) => {
                    if (data) {
                        this.todayDataSourcePrintBookings = data;
                        this.receiptToken= this.todayDataSourcePrintBookings[0].receiptToken;
                      
                        this.filterPatientappointments = data.filter(
                            (thing, i, arr) => arr.findIndex(t => t.mobile === thing.mobile && t.patient === thing.patient) === i
                          );
                       
                    }
                })
            }

        getAllAppointmentsAfterSave() {
             
            let todayDate1 = this.datepipe.transform(this.date, 'dd MMM yyyy');
            this.utilitiesService.getAllAppointments().subscribe(
                (data) => {
                    if (data) {
                        this.todayDataSourcePrintBookings = data;
                        this.receiptToken= this.todayDataSourcePrintBookings[0].receiptToken;
                        this.openCompanyDetailsDialog();

                        this.filterPatientappointments = data.filter(
                            (thing, i, arr) => arr.findIndex(t => t.mobile === thing.mobile && t.patient === thing.patient) === i
                          );
                       
                    }
                })
            }

            navigate(){
                 
                this.encySer.triggerMethod();   
            }

    

            closeCompanyDetailsDialog() {
                this.editCompanyDialogRef.close();
            }


            print1(cmpName) {
                 
                let printContents, popupWin;
                printContents = document.getElementById(cmpName).innerHTML;
                popupWin = window.open('', '_blank', 'top=10,left=100,height=900,width=1000');
                popupWin.document.write(`
                    <html>
                        <head>
                            <style>
                                body {
                                    width: 100%;
                                }
            
                                /**
                                 * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
                                 */
                                @media screen {
                                    @font-face {
                                        font-family: 'Source Sans Pro';
                                        font-style: normal;
                                        font-weight: 400;
                                        src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
                                    }
            
                                    @font-face {
                                        font-family: 'Source Sans Pro';
                                        font-style: normal;
                                        font-weight: 700;
                                        src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
                                    }
                                }
            
                                /**
                                 * Avoid browser level font resizing.
                                 * 1. Windows Mobile
                                 * 2. iOS / OSX
                                 */
                                body,
                                table,
                                td,
                                a {
                                    -ms-text-size-adjust: 100%; /* 1 */
                                    -webkit-text-size-adjust: 100%; /* 2 */
                                }
            
                                /**
                                 * Remove extra space added to tables and cells in Outlook.
                                 */
                                table,
                                td {
                                    mso-table-rspace: 0pt;
                                    mso-table-lspace: 0pt;
                                }
            
                                /**
                                 * Better fluid images in Internet Explorer.
                                 */
                                img {
                                    -ms-interpolation-mode: bicubic;
                                }
            
                                /**
                                 * Remove blue links for iOS devices.
                                 */
                                a[x-apple-data-detectors] {
                                    font-family: inherit !important;
                                    font-size: inherit !important;
                                    font-weight: inherit !important;
                                    line-height: inherit !important;
                                    color: inherit !important;
                                    text-decoration: none !important;
                                }
            
                                /**
                                 * Fix centering issues in Android 4.4.
                                 */
                                div[style*="margin: 16px 0;"] {
                                    margin: 0 !important;
                                }
            
                                body {
                                    width: 100% !important;
                                    height: 100% !important;
                                    padding: 0 !important;
                                    margin: 0 !important;
                                }
            
                                /**
                                 * Collapse table borders to avoid space between cells.
                                 */
                                table {
                                    border-collapse: collapse !important;
                                }
            
                                a {
                                    color: #1a82e2;
                                }
            
                                img {
                                    height: auto;
                                    line-height: 100%;
                                    text-decoration: none;
                                    border: 0;
                                    outline: none;
                                }
            
                                .heading_1 {
                                    background-color: #fff;
                                    padding: 36px 24px 0;
                                    font-family: sans-serif;
                                    font-size: 21px;
                                    font-weight: bold;
                                    letter-spacing: 0.2px;
                                    border-bottom: 3px solid #d4dadf;
        
                                }
            
                                .tocken_no {
                                    font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                                    font-size: 16px;
                                    font-weight: bold;
                                }
            
                                // .td_style {
                                //     padding: 24px;
                                //     font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                                //     width: 50%;
                                //     padding-bottom: 0px;
                                //     padding-top: 10px;
                                // }
        
        
                                         .td_style {
                                            padding: 24px;
                                            font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                                            width: 50%;
                                            padding-bottom: 0px;
                                            padding-top: 10px;
                                        }
        
                                        .td_style span {
                                            display: inline-block;
                                            vertical-align: middle;
                                        }
        
        
        
            
                                .td_table {
                                    text-align: left;
                                    background-color: #d2c7ba;
                                    width: 100%;
                                    padding: 12px;
                                    font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                                    font-size: 16px;
                                    line-height: 24px;
                                }
            
                                .td_table1 {
                                    text-align: left;
                                    width: 100%;
                                    max-width:100%
                                    padding: 12px;
                                    font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                                    font-size: 16px;
                                    line-height: 24px;
                                }
            
                                .td_table2 {
                                    text-align: left;
                                    width: 50%;
                                    padding: 12px;
                                    font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                                    font-size: 16px;
                                    line-height: 24px;
                                    border-top: 2px dashed #d2c7ba;
                                    border-bottom: 2px dashed #d2c7ba;
                                }
            
                                .td_table3 {
                                    text-align: left;
                                    width: 50%;
                                    padding: 12px;
                                    font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                                    font-size: 16px;
                                    line-height: 24px;
                                    border-top: 2px dashed #d2c7ba;
                                    border-bottom: 2px dashed #d2c7ba;
                                }
            
                                .Payment_row {
                                    text-align: left;
                                    background-color: #ffffff;
                                    padding: 24px;
                                    font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                                    font-size: 16px;
                                    line-height: 24px;
                                }
            
                                .payment_Receipt {
                                    text-align: left;
                                    background-color: #ffffff;
                                    padding: 36px 24px 0;
                                    width: 35%;
                                    border-bottom: 3px solid #d4dadf;
        
                                }
            
                                .Token_No {
                                    width: 100%;
                                    max-width: 100%;
                                    margin-top: 200px;
                                    background-color: #fff;
                                }
            
                                .Payment_method_bgmcolr {
                                    width: 100%;
                                    background-color: #fff;
                                }
            
                                .Adress_row {
                                    position: fixed;
                                    bottom: 0;
                                    left: 0;
                                    width: 100%;
                                    text-align: left;
                                    padding-bottom: 36px;
                                    padding-left: 36px;
                                    border-top: 3px solid #d4dadf;
                                    font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                                    font-size: 16px;
                                    line-height: 24px;
                                }
                            </style>
                        </head>
                        <body onload="window.print();window.close()">
                            ${printContents}
                           
                        </body>
                    </html>
                `);
                popupWin.document.close();
            }
            

}
