import { ViewEncapsulation, Component, ViewChild, OnInit, TemplateRef, OnDestroy, OnChanges, SimpleChanges, Input, Renderer2 } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PatientsService } from '../patients/patients.service';
import { MedicineService } from '../medicine/medicine.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, PlatformLocation } from '@angular/common';
import { AfterViewInit, ElementRef } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { environment } from 'environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import { MatTabGroup } from '@angular/material/tabs';

import autoTable from 'jspdf-autotable'

import { GcPdfViewer } from '@grapecity/gcpdfviewer';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    NgForm,
    Validators, FormArray
} from '@angular/forms';


import { GeneralService } from '../../../Services/general.service';
import { UtilitiesService } from 'app/Services/utilities.service';
import { ToastService } from 'app/Services/toastservice';
import { LoaderService } from '../../../Services/loader.service';

import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
//import { FuseConfirmationDialogComponent } from '@fuse/services/confirmation/dialog/dialog.component'
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { DateAdapter } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { MatDrawer } from '@angular/material/sidenav';
import { result } from 'lodash';
import { FuseDrawerComponent } from '@fuse/components/drawer';
import { EncryptionService } from 'app/Services/encryption.service';
declare const PDFObject: any;
// import { debug } from 'console';
import { DataRefreshService } from '../../../shared/data-refresh.service';
import { SharedService } from 'app/shared/shared.service';


@Component({
    selector: 'app-appointments',
    templateUrl: './appointments.component.html',
    styleUrls: ['./appointments.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe],
})
export class AppointmentsComponent implements OnInit,OnDestroy,OnChanges{

    @ViewChild('vitalsDrawer') vitalsDrawer: MatDrawer;
    selectedPanel: string = 'Vitals';
    selectpayment: number = 1;
    @ViewChild('drawer') drawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;

    
    displayedColumns1 = ['slno', 'name', 'actions'];
    showTable = false;
    fileSelected = false;

    searchmedicine: any=[];
    patientHistorys: any = [];
    ModePrice=false;
    myControl = new FormControl();
    options: string[] = ['One', 'Two', 'Three'];
    filteredOptions: Observable<string[]>;
    tabWay = "vert";
    pdfSrc = "https://research.google.com/pubs/archive/44678.pdf";

    private API_URL: any = environment.API_URL;
    selectable = true;
    removable = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    fruitCtrl = new FormControl();
    filteredFruits: Observable<string[]>;
    fruits: any = [];
    allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
    frequencyList: any = [];
    @Input() tooltip: string;
    medicine: any = [];
    frequencyListMedication: any = [];
    dose: any = [];
    when: any = [];
    duration: any = [];
    @ViewChild('TABLE') table: ElementRef;
  @ViewChild('TABLE') table1: ElementRef;


    @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
    @ViewChild("myNameElem") myNameElem: ElementRef;
    @ViewChild('appointmentDrawer') appointmentDrawer: FuseDrawerComponent;

    @ViewChild('editCompanyModal') editCompanyModal: TemplateRef<any>;
    @ViewChild('presecptionModal') presecptionModal: TemplateRef<any>;
    private editCompanyDialogRef: MatDialogRef<TemplateRef<any>>;
    private presecptionModalDialogRef: MatDialogRef<TemplateRef<any>>;


    @ViewChild('horizontalStepper') horizontalStepper: MatStepper;

    


    durationInSeconds = 5;
    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'top';


    actionName: string = 'New Appointment'
    appointmentButton: string = 'Create Appointment';
    btnText: string;
    errorMessage: any;
    appt: any = {};
    appointmentModel: any = {};
    horizontalStepperForm: FormGroup;
    vitalsForm: FormGroup;
    date: any;
    doctors: any = [];
    action: string = 'Save';
    appointmentId: any;
    services: any = [];
    status: any = [];
    slots: any = [];
    discounts: any = [];
    prices: any = [];
    genders: any = [];
    upcomingBookings: any = [];
    historiesBooked: any = [];

    todayBookings: any = [];
    mobNum: string;
    todayDataSourceBookings3:any = [];
    todayDataSourceBookings: any = [];
    todayDataSourceBookings1: any = [];
    todayDataSourcePrintBookings: any = [];
    upcomingDataSourceBookings: any = [];

filename:any=[];

    patientsappointments: any = [];
    todaysbooked: any = [];
    filterPatientappointments: any = [];
    searchKey1: string;
    searchKey2: string;
    searchKey3: string;
    allAppointments: any;
    patientID: number = 0;
    appointID: number = 0;
    mobNoAlreadyExists: boolean = false;
    patients: any = [];
    selection: any = [];
    panelOpenState = false;
    flag: string;
    complaintsList: any = [];
    complaints: any = [];
    patientName: string;
    visitReasonList: any = [];
    visitReason: any = [];

    docs: any = [];
    docsList: any = [];
    slotsArr: any = [];
    vitalsList: any = [];
    vitals: any = [];
    PatientID: any;
    AppointmentID: any;
    vitalsID: any;
    complaintsXML: any = [];
    items: FormArray;
    medicationitems: FormArray;
    ImageData: any;
    image: any;
    loginDetails: any;
    roleID: any;
    registrationID: any;

    advice: any;
    nextvisit: any;


    docsXml: any = [];
    medicineXml: any = [];
    selectedDate: any;

    attachementsArr: FormArray;
    form: any;
    fileName: any;
    patientHistory: any = [];
    patientsappointment1 :any = [];

    patientsappointment = new MatTableDataSource(this.todayDataSourceBookings);
    patientHistoryList: any = [];
    filteredAppointments: any = [];
    isChecked: boolean = false;
    isPriceTag: boolean = true;
    isDuePay: boolean = false;
    isNoSlot: boolean = false;
    nextDisabled: boolean = true;
    Screen: any = 1;
    detailData: any = [];
    apptList: any = {};
    complaintsXMLList: any = [];
    medicineList: any = [];
    medicinePrescepList: any = [];
    afterSaveVitalId: any = 0;
    actualPrice: any = 0;
    // rowClickedData:any=[];
    Mode: any = [];
    BloodGroup:any=[];
    receiptToken: any = 0;
    showHideDiv = false;
    filterValues = {};
    filterSelectObj = [];
    labreportfiles = [];
    dataSource = new MatTableDataSource();
    fileUrl: string;
    yesterday = new Date();
    formfields: boolean=true;
    formfields1: boolean;
    url: string | ArrayBuffer;
    pdfSrcc: Uint8Array;
    urls: SafeResourceUrl;
    isLoading: boolean;
    pdfData: string;
    filename1: string;
    medicinePrescepList1: any=[];
    Genderselected: any;
    filedisble: boolean;
    amounttopaid: boolean;
    amoutpaids: number;
    currentTimes: string;
    doctrids: any;
    upcomings: boolean=true;
    Histories: boolean=true;
    Todays: boolean=true;
    hidePaginator: boolean;
    previousdata: boolean=true;
    selectedPrice: any;
    selectedfiles: File[];
    defaultDiscount: any;
    selecteddiscount: any;
    private subscription: Subscription;
    serviceName: any;
    appointmentDate: any;
    modeofPayment: any;
    payment: any;
    gender: any;
    patientEmail: any;
    patientPhoneNumber: any;
    doctor: any;
    amountInWords: string;
    discount: any;
    fee: any;
    appointmentDateWithTime: string;

    // now: Date = new Date();
    // private timer: any;
    // currentDate: string = '';
    // currentTime: string = '';


    // updateDateTime(): void {
    // const now = new Date();
    // const format: Intl.DateTimeFormatOptions = {
    //     year: 'numeric',
    //     month: 'long',  // Full month name
    //     day: 'numeric'
    //   };

    // this.currentDate = now.toLocaleDateString('en-US', format); // e.g., "4/16/2025"
    // // currentTime: string = this.now.toLocaleTimeString(); // e.g., "10:23:45 AM"
    // this.currentTime = now.toLocaleTimeString([], {
    //     hour: 'numeric',
    //     minute: '2-digit',
    //     hour12: true
    //   }).replace(' ', '');
    // }

    formatCustomDate(input: string): string {
        const date = new Date(input);

        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const month = months[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();

        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');

        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours === 0 ? 12 : hours;

        return `${month} ${day}, ${year}, ${hours}:${minutes}${ampm}`;
    }


    History: any;
    Today: any;
    Upcoming: any;
    historyByDoctorID: any;
    AllAppointments: any[];
    allHistory: any;
    statusCompleted: any;
    doctorQualification: any;
    doctorDesignation: any;
    queuedAppointmentID: number;
    receiptNumber: any;


    constructor(private sanitizer: DomSanitizer,
        private encySer:EncryptionService,
        public patientsService: PatientsService,
        public medicineService: MedicineService,
        private _formBuilder: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private utilitiesService: UtilitiesService,
        public datepipe: DatePipe,
        private toastService: ToastService,
        private _snackBar: MatSnackBar,
        private generalService: GeneralService,
        private http: HttpClient,
        public spinner: LoaderService,
        private _liveAnnouncer: LiveAnnouncer,
        private _router: Router,
        private dialog: MatDialog,
        private dateAdapter: DateAdapter<Date>,
        private platformlocation: PlatformLocation,
        private formBuilder: FormBuilder,
        private renderer: Renderer2,
        private dataRefreshService: DataRefreshService,
        private sharedService: SharedService
      
    ) {

        history.pushState(null, '', location.href);
        this.platformlocation.onPopState(() => {
            history.pushState(null, '', location.href);
        });

        
        this.yesterday.setDate(this.yesterday.getDate() - 0);

        // Object to create Filter for
        this.filterSelectObj = [
            // {
            //   name: 'ID',
            //   columnProp: 'patientARCID',
            //   options: []
            // }, 
            // {
            //     name: 'Patient NAME',
            //     columnProp: 'patient',
            //     options: []
            // },
            //{
            //   name: 'USERNAME',
            //   columnProp: 'username',
            //   options: []
            // }, {
            //   name: 'EMAIL',
            //   columnProp: 'email',
            //   options: []
            // }, 
            {
                name: 'STATUS',
                columnProp: 'status',
                options: []
            }
        ]

        this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
        // this.date = new FormControl(new Date());
        this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
            
            startWith(null),
            map((fruit: string | null) => (fruit ? this._filter(fruit) : this.complaints.slice())),
        );

        this.loginDetails = JSON.parse(localStorage.getItem('loginDetails'));
        if (this.loginDetails) {
            this.roleID = this.loginDetails.roleID;
            this.registrationID = this.loginDetails.registrationID;
        }

        this.myControl = new FormControl();
        this.filteredOptions = this.myControl.valueChanges
            .pipe(
                startWith(''),
                map(state => state ? this.filterStates(state) : this.filterPatientappointments.slice())
            );


   
        }
        // previous
    // filterStates(name: string) {
    //      

    //     return this.filterPatientappointments.filter(state =>
    //         state.mobile.toLowerCase().indexOf(name.toLowerCase()) === 0);
    // }

    // filterStates(name: string) {
    //     const filteredAppointments = this.filterPatientappointments.filter(state =>
    //       state.mobile.toLowerCase().includes(name.toLowerCase())
    //     );
    //     return filteredAppointments;
    //   }

    // filterStates(name: string) {
    //     const searchTokens = name.toLowerCase().split(' ').filter(token => token.trim() !== '');
      
    //     const filteredAppointments = this.filterPatientappointments.filter(state => {
    //       const mobileAndPatient = state.mobile.toLowerCase() + ' (' + state.patient.toLowerCase() + ')';
          
    //       // Check if all search tokens are found within the combined model string
    //       return searchTokens.every(token => mobileAndPatient.includes(token));
    //     });
      
    //     return filteredAppointments;
    //   }
      
    filterStates(searchValue: string) {
         
    const searchTokens = searchValue.toLowerCase().split(' ').filter(token => token.trim() !== '');

    return this.filterPatientappointments.filter(item => {
        const fullName = item.patient.toLowerCase();
        const mobileAndName = item.mobile.toLowerCase() + ' (' + fullName + ')';

        // Check if any of the search tokens are found within the mobile number or the mobileAndName string
        return searchTokens.some(token => mobileAndName.includes(token));
    });
}

    
      
      


handleFileUpload(event: Event) {
     
    // Handle file upload logic here
    // After file upload, set showTable to true
    this.showTable = true;
  }  
   

   

    displayedColumns: string[] = [
        'SL',
        'Patient',
        'Service',
        'LastVisit',
        'Doctor',
        'Time',
        'WaitingTime',
        'Status',       
        'VisitCount',
        'ReceiptToken',
        'Billing',
        'Actions',
        'Vitals',
        'View',
        'History',
        'filename',
        'actions',
        'BookingTime'
    ];
   
    displayedColumnsHistory: string[] = [
        'SL',
        'Patient',
        'VisitCount',
        'appointmentDate',
        'View'
    ];
    columnDefinitionshistory = [
        { def: 'SL', visible: true, displayName: 'ID' },
        { def: 'Patient', visible: true, displayName: '	Patient Details' },
        { def: 'VisitCount', visible: true, displayName: ' Visit Count' },
        { def: 'appointmentDate', visible: true, displayName: '	Date' },
        { def: 'View', visible: true, displayName: 'View' },
    ];
    displayedColumnsHistory1: string[] = [
        'sno',
        'serviceDate',
        'Amount',
        'View',
        'ViewPrescription',
    ];
  
    displayedColumnsUpcoming: string[] = [
        'SL',
        'Patient',
        'Service',
        'Doctor',
        'Time',
        'WaitingTime',
        'VisitCount',
        'Billing',
        'Actions'
    ];
    columnDefinitionsupcoming = [
        { def: 'SL', visible: true, displayName: 'ID' },
        { def: 'Patient', visible: true, displayName: '	Patient Details' },
        { def: 'Service', visible: true, displayName: ' Service Name' },
        { def: 'Doctor', visible: true, displayName: 'Doctor' },
        { def: 'Time', visible: true, displayName: 'Slot Time' },
        { def: 'WaitingTime', visible: true, displayName: 'Waiting Time' },
        { def: 'VisitCount', visible: true, displayName: 'Visit Count#' },
        { def: 'Billing', visible: true, displayName: '	Billing' },
        { def: 'Actions', visible: true, displayName: 'Actions' },
    
    ];

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    // @ViewChild(MatPaginator) HistoryPaginator: MatPaginator;
    //@ViewChild('MatPaginator1') upcomingPaginator: MatPaginator;
    @ViewChild('HistoryPaginator') HistoryPaginator: MatPaginator;
    @ViewChild('HistoryPaginator1') HistoryPaginator1: MatPaginator;

    @ViewChild('HistoryPaginator12') HistoryPaginator12: MatPaginator;

    // @ViewChild('paginator', {static: true}) paginator: MatPaginator;
    @ViewChild('upcomingPaginator') upcomingPaginator: MatPaginator;
    @ViewChild('appointmentForm') myForm: NgForm;
    searchKey: string;


    add(event: MatChipInputEvent): void {
         

        const value = (event.value || '').trim();

        // Add our fruit
        if (value) {
            if (!this.fruits.some(e => e.toLowerCase() === value.toLowerCase())) {
                this.fruits.push(value);
                this.addComplaints(value);
            }
        }

        // Clear the input value
        event.chipInput!.clear();

        this.fruitCtrl.setValue(null);
    }
    addComplaints(val) {
         
        let arr = [];
        arr.push({ flag: Number(1), ComplaintName: val })
        var url = 'PatientsAppointments/ComplaintsCrud/';
        this.utilitiesService.CRUD(arr, url).subscribe(
            (data) => {
                if (data) {

                    this.complaints = data;
                    this.complaintsList = data;
                    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
                        startWith(null),
                        map((fruit: string | null) => (fruit ? this._filter(fruit) : this.complaints.slice())),
                    );
                } else {
                }
            },

            () => { }
        );
    }

    truncateComposition(composition: string): string {
        const maxLength = 62;
        const maxWords = 9;
      
        // Check by character length first
        if (composition.length > maxLength) {
          return composition.slice(0, maxLength) + ' .......';
        }
      
        // Check by word count
        const words = composition.split(' ');
        if (words.length > maxWords) {
          return words.slice(0, maxWords).join(' ') + ' .......';
        }
      
        return composition;
      }
      
      
    updateDisplayedColumns() {
        //   debugger
        this.displayedColumns = this.columnDefinitions
          .filter(cd => this.selectedColumns.includes(cd.def))
          .map(cd => cd.def);
      }
    //   selectedColumns: string[] = [ 
    //      'SL', 'Patient', 'Service','Doctor', 'Time','LastVisit', 'WaitingTime', 'BookingTime', 'Status', 'VisitCount', 'ReceiptToken','Billing','DuePayment',
    //    'Vitals','History','Actions'
    // ];

      selectedColumns: string[] = [ 
          'SL', 'Patient', 'Service','Doctor','LastVisit', 'WaitingTime', 'BookingTime', 'Status', 'VisitCount', 'ReceiptToken','Billing','DuePayment',
       'Vitals','History','Actions'
    ];

    columnDefinitions = [
        { def: 'Vitals', visible: true, displayName: 'Vitals' },
        { def: 'View', visible: true, displayName: 'View' },
        { def: 'SL', visible: true, displayName: 'Patient ID' },
        { def: 'Patient', visible: true, displayName: '	Patient Details' },
        { def: 'ReceiptToken', visible: true, displayName: 'Token' },
        { def: 'Service', visible: true, displayName: ' Service Name' },
        { def: 'Doctor', visible: true, displayName: '	Doctor' },
        { def: 'Time', visible: true, displayName: 'Slot Time' },
        { def: 'WaitingTime', visible: true, displayName: 'Waiting Time' },
        { def: 'BookingTime', visible: true, displayName: 'Booking Time' },
        { def: 'LastVisit', visible: true, displayName: 'Last Visit' },
        { def: 'VisitCount', visible: true, displayName: 'Visit Count#' },
        { def: 'Billing', visible: true, displayName: '	Billing' },
        { def: 'DuePayment', visible: true, displayName: 'Due Payment' },
        { def: 'Status', visible: true, displayName: '	 Status' },
        { def: 'History', visible: true, displayName: 'History' },
        { def: 'Actions', visible: true, displayName: 'Actions' },
    ];

    updateDisplayedColumns6() {
        this.displayedColumns = this.columnDefinitions6
          .filter(cd => this.selectedColumns6.includes(cd.def))
          .map(cd => cd.def);
      }

      updateDisplayedColumns2() {
          
        this.displayedColumns = this.columnDefinitions2
          .filter(cd => this.selectedColumns2.includes(cd.def))
          .map(cd => cd.def);
          console.log("Displayed Coluns2",this.displayedColumns)
      }

    //   selectedColumns2: string[]  = [
    //     'SL', 'Patient','ReceiptToken',
    //      'Service','Doctor', 'Time','LastVisit', 'WaitingTime', 'BookingTime', 'Vitals', 'VisitCount',
    //     'Status','Actions'
    //   ];

      selectedColumns2: string[]  = [
        'SL', 'Patient','ReceiptToken',
         'Service','Doctor', 'LastVisit', 'WaitingTime', 'BookingTime', 'Vitals', 'VisitCount',
        'Status','Actions'
      ];

      columnDefinitions2 = [
        { def: 'SL', visible: true, displayName: 'Patient ID' },
        { def: 'Patient', visible: true, displayName: '	Patient Details' },
        { def: 'ReceiptToken', visible: true, displayName: 'Token' },
        { def: 'Service', visible: true, displayName: ' Service Name' },
        { def: 'Doctor', visible: true, displayName: '	Doctor' },
        { def: 'Time', visible: true, displayName: 'Slot Time' },
        { def: 'WaitingTime', visible: true, displayName: 'Waiting Time' },
        { def: 'BookingTime', visible: true, displayName: 'Booking Time' },
        { def: 'LastVisit', visible: true, displayName: 'Last Visit' },
        { def: 'Vitals', visible: true, displayName: 'Vitals' },
        { def: 'VisitCount', visible: true, displayName: 'Visit Count#' },
        { def: 'Status', visible: true, displayName: '	 Status' },
        { def: 'Actions', visible: true, displayName: 'Actions' }, 
    ];


      updateDisplayedColumns5() {
         
        this.displayedColumns = this.columnDefinitions5
          .filter(cd => this.selectedColumns5.includes(cd.def))
          .map(cd => cd.def);
      }

    //   selectedColumns5: string[]  = [
    //     //'View',
    //     'SL', 'Patient','ReceiptToken', 'Service','LastVisit', 'Time', 'WaitingTime', 'BookingTime', 'VisitCount', 'Vitals',  'Status', 
    //      'Actions'
    //  ];

    selectedColumns5: string[]  = [
        //'View',
        'SL', 'Patient','ReceiptToken', 'Service','LastVisit', 'WaitingTime', 'BookingTime', 'VisitCount', 'Vitals',  'Status', 
         'Actions'
     ];

     columnDefinitions5 = [
        { def: 'Vitals', visible: true, displayName: 'Vitals' },
    
        { def: 'SL', visible: true, displayName: 'Patient ID' },
        { def: 'Patient', visible: true, displayName: '	Patient Details' },
        { def: 'ReceiptToken', visible: true, displayName: 'Token' },
        { def: 'Service', visible: true, displayName: ' Service Name' },
        { def: 'Time', visible: true, displayName: 'Slot Time' },
        { def: 'WaitingTime', visible: true, displayName: 'Waiting Time' },
        { def: 'BookingTime', visible: true, displayName: 'Booking Time' },
        { def: 'LastVisit', visible: true, displayName: 'Last Visit' },
        { def: 'VisitCount', visible: true, displayName: 'Visit Count#' },
        { def: 'Status', visible: true, displayName: '	 Status' },
        { def: 'Actions', visible: true, displayName: 'Actions' },
    ];


      updateDisplayedColumns7() {
         
        this.displayedColumns = this.columnDefinitions7
          .filter(cd => this.selectedColumns7.includes(cd.def))
          .map(cd => cd.def);
      }

    //   selectedColumns7: string[] = [
    //     'SL', 'Patient','ReceiptToken', 'Service', 'Time','LastVisit', 'WaitingTime', 'BookingTime', 'VisitCount',  'Status','Actions'
    //  ];

    selectedColumns7: string[] = [
        'SL', 'Patient','ReceiptToken', 'Service', 'LastVisit', 'WaitingTime', 'BookingTime', 'VisitCount',  'Status','Actions'
     ];

     columnDefinitions7 = [
        { def: 'SL', visible: true, displayName: 'Patient ID' },
        { def: 'Patient', visible: true, displayName: '	Patient Details' },
        { def: 'ReceiptToken', visible: true, displayName: 'Token' },
        { def: 'Service', visible: true, displayName: ' Service Name' },
        { def: 'Time', visible: true, displayName: 'Slot Time' },
        { def: 'WaitingTime', visible: true, displayName: 'Waiting Time' },
        { def: 'BookingTime', visible: true, displayName: 'Booking Time' },
        { def: 'LastVisit', visible: true, displayName: 'Last Visit' },
        { def: 'Status', visible: true, displayName: '	 Status' },
        { def: 'VisitCount', visible: true, displayName: 'Visit Count#' },
    ];

    selectedColumns6: string[] = [ 
         'SL', 'Patient', 'Service','Doctor', 'Time','LastVisit', 'WaitingTime', 'Status', 'VisitCount', 
       'Vitals','View','History'
    ];

    columnDefinitions6 = [
        { def: 'Vitals', visible: true, displayName: 'Vitals' },
        { def: 'View', visible: true, displayName: 'View' },
        { def: 'SL', visible: true, displayName: 'Patient ID' },
        { def: 'Patient', visible: true, displayName: '	Patient Details' },
        { def: 'Service', visible: true, displayName: ' Service Name' },
        { def: 'Time', visible: true, displayName: 'Time' },
        { def: 'LastVisit', visible: true, displayName: 'Last Visit' },
      //  { def: 'Doctor', visible: true, displayName: '	Doctor' },
        { def: 'WaitingTime', visible: true, displayName: 'Waiting Time' },
        { def: 'Status', visible: true, displayName: '	 Status' },
        { def: 'VisitCount', visible: true, displayName: 'Visit Count#' },
        { def: 'History', visible: true, displayName: 'History' },
    ];
    updateDisplayedColumnsupcoming() {
        // debugger
        this.displayedColumnsUpcoming = this.columnDefinitionsupcoming
          .filter(cd => this.selectedColumnsupcoming.includes(cd.def))
          .map(cd => cd.def);
      }
   
      selectedColumnsupcoming: string[] = [ 
        'SL',
        'Patient',
        'Service',
        'Doctor',
        'Time',
        'WaitingTime',
        'VisitCount',
        'Billing',
        'Actions'
    ];
    updateDisplayedColumnshistory() {
         
        this.displayedColumnsHistory = this.columnDefinitionshistory
          .filter(cd => this.selectedColumnshistory.includes(cd.def))
          .map(cd => cd.def);
      }
      selectedColumnshistory: string[] = [ 
        'SL',
        'Patient',
        'VisitCount',
        'appointmentDate',
        'View'
    ];

    
    selectmed(){
         
        this.medicinePrescepList=this.searchmedicine;
        // this.searchKey=""
        // this.applyFilters("")
    }
    applyFilters(event:any) { 
         
        event.target.value;
       var data = this.search(event.target.value);
        this.medicinePrescepList=data
        // this.medicinePrescepList = this.search(this.searchKey);
        }

        filterByService
        // filterDataByService(val){
        //  
        // this.todaysbooked
        // console.log("Filter Service",this.todaysbooked.filteredData)
        // const filteredData = this.todaysbooked.filteredData.filter(appointment => appointment.serviceName === val.value);
        // // Update the MatTableDataSource with the filtered data
        // this.todaysbooked = new MatTableDataSource(filteredData);
        // this.todaysbooked.paginator = this.paginator;

        // }



        filterDataByService(val) {
            // If val is null/undefined, reset to original data
            if (!val || !val.value) {
              this.todaysbooked.filter = ''; // Clear any existing filter
              return;
            }
          
            // Apply the filter directly to MatTableDataSource
            this.todaysbooked.filter = val.value.trim().toLowerCase();
          
            // Ensure the filterPredicate is set correctly (if not set globally)
            this.todaysbooked.filterPredicate = (data: any, filter: string) => {
              return data.serviceName.toLowerCase().includes(filter);
            };
          
            // Reset paginator to first page
            if (this.todaysbooked.paginator) {
              this.todaysbooked.paginator.firstPage();
            }
          }
        
        

        search(value: string) { 
             
           if(value==""){
            return  this.medicinePrescepList=this.searchmedicine;
           }
else{
    let filter = value.toLowerCase();

         
          return this.medicinePrescepList.filter(option => (option.medicineName).toLowerCase().startsWith(filter));
}
      
        }

        
    // applyFilters() {
      
    //     this.medicinePrescepList.filter = this.searchKey.trim().toLowerCase();
    // }

    remove(fruit: string): void {
         
        const index = this.fruits.indexOf(fruit);

        if (index >= 0) {
            this.fruits.splice(index, 1);
        }
    }

    isAdmin:boolean=false;
    isDoctor:boolean=false;
    isFrontDesk:boolean=false;
    isjrDoctor:boolean=false;

    selected(event: MatAutocompleteSelectedEvent): void {
 
        this.fruits.push(event.option.viewValue);
        this.fruitInput.nativeElement.value = '';
        this.fruitCtrl.setValue(null);
    }

    // private _filter(value: string): string[] {
    //   
    //     const filterValue = value.toLowerCase();
    //     return this.complaints.filter(fruit => fruit.complaintName.toLowerCase().includes(filterValue));
    // }
   // sorted : []

   ngAfterViewInit() {
     
    this.todayBookings.sort = this.sort;
}
panels=[]
testIDD


doctordetails
    ngOnInit(): void {

        this.subscription = this.sharedService.appointmentTrigger$.subscribe(id => {
            this.queuedAppointmentID = id;
          });

        // this.updateDateTime();
        // this.timer = setInterval(() => {
        //     this.updateDateTime();
        // }, 1000);
        
        // debugger
        //this.selecteddiscount=35
         
        // this.subscription = this.encySer.invokeComponentMethod$.subscribe(() => {
        //     this.getAllAppointments();
        //   });
        this.panels = [
            {
                id         : 'Vitals',
                icon       : 'heroicons_outline:user-circle',
                title      : 'Vitals',
                // description: 'Manage your public profile and private information'
            },
            {
                id         : 'Observations',
                icon       : 'heroicons_outline:credit-card',
                title      : 'Observations',
                // description: 'Manage your subscription plan, payment method and billing information'
            },
               {
              id         : 'LabReports',
              icon       : 'heroicons_outline:credit-card',
              title      : 'Lab Reports',
              // description: 'Manage your subscription plan, payment method and billing information'
          },
    
            {
              id         : 'Medication',
              icon       : 'heroicons_outline:credit-card',
              title      : 'Medication',
              // description: 'Manage your subscription plan, payment method and billing information'
          },
          {
              id         : 'Advice',
              icon       : 'heroicons_outline:credit-card',
              title      : 'Advice',
              // description: 'Manage your subscription plan, payment method and billing information'
          },
    
            {
              id         : 'Nextvisit',
              icon       : 'heroicons_outline:credit-card',
              title      : 'Next Visit',
              // description: 'Manage your subscription plan, payment method and billing information'
          },
        ];

        this.filedisble=true;
       
        // const viewer = new GcPdfViewer("#viewer", {
        //     workerSrc: "//node_modules/@grapecity/gcpdfviewer/gcpdfviewer.worker.js",
        //     restoreViewStateOnLoad: false
        //   });
        //   viewer.addDefaultPanels();
        //   viewer.open("https://www.grapecity.com/documents-api-pdf/docs/offlinehelp.pdf");
        //  this.formfields=true;
       // this.sorted = doctors.sort((a, b) => a.labCode> b.labCode? 1 : -1);
         ;
        this.doctordetails = JSON.parse(localStorage.getItem('loginDetails'));
        this.doctorid = this.doctordetails.registrationID
        console.log("D Details",this.doctorid)
        this.doctors.sort();
        this.addStaticData();
        this.getDocs();
        this.getComplaints();
        this.getVisitReason();
        this.vitalsCrud();
        this.gethistory();
        this.getAllAppointmentsnew();

        // debugger

        this.dataRefreshService.refreshNeeded.subscribe(() => {
            // debugger
            this.getAllAppointmentsnew(); 
        });

        // this.subscription = this.sharedService.appointmentTrigger$.subscribe(id => {
        //     this.openReceipt(id);
        //   });

       this.getAllAppointmentsHistory();
        
        this.getdoctordetails()
        this.getAllDoctors();
        this.getServices();
        //  this.getStatuses();
        this.getSlots();
        this.getGenders();
        this.getAllAppointmentBills();
        this.getDiscounts();
        this.getAllPatients();
        this.GetMedicineData();
        
        this.btnText = 'Register';
        this.detailData = [];
        // this.isChecked=false;

        // Horizontal stepper form
        if (this.roleID == '1') {
            this.horizontalStepperForm = this._formBuilder.group({
                step1: this._formBuilder.group({
                    appDate: new FormControl(new Date()),
                    slot: ['', Validators.required],
                    docName: ['', Validators.required],
                    firstName: ['', Validators.required],
                   // lastName: [''],
                    mobNum: ['', [
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
                    amountPaid: ['700', Validators.required],
                    skipPayment: [''],
                    netPrice: [''],
                    duePayment: [''],
                    modeOfPayment: ['',Validators.required]

                }),
            });
        }
        else {
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
                    amountPaid: ['700'],
                    skipPayment: [''],
                    netPrice: [''],
                    duePayment: [''],
                    modeOfPayment: ['',Validators.required]

                }),
            });

            this.step2.controls['discount'].setValue(35);
        }

      
        
        this.vitalsForm = this._formBuilder.group({
            weight: [''],
            bloodGroup: [''],
            temp: [''],
            serumCreatinine: [''],
            bloodPressure: [''],
            pulse: [''],
            SpO2: [''],
            BMI: [''],

            visitReason: [''],
            advice: [''],
            nextVisit: [''],
            frequency: [''],
            pickADate: null,

            items: this._formBuilder.array([this.createItem()]),
            medicationitems: this._formBuilder.array([this.createMedicationItem()]),
        });

        if (this.roleID == '1') {
            // debugger
            this.isAdmin=true;
            this.displayedColumns = [
               // 'View',
                'SL', 'Patient', 'ReceiptToken', 'Service', 'Doctor ID','Doctor', 'WaitingTime', 'BookingTime', 'LastVisit', 'VisitCount','Billing','DuePayment','Status','Actions',
                  //'History'
            ];
           
        }
        else if (this.roleID == '2') {
            // debugger
            this.isDoctor=true
            this.displayedColumns = [
                 'SL', 'Patient','ReceiptToken', 
                'Service','Doctor', 'WaitingTime', 'BookingTime', 'LastVisit', 'Vitals', 'VisitCount',
                 //'View',
                 'Status','Actions'
            ];
            this.displayedColumnsUpcoming = [
                'SL',
                'Patient',
                'Service',
                //'Doctor',
                'Time',
                'WaitingTime',
                'VisitCount',
                'Billing',
                'Vitals',
            ];
            this.columnDefinitionsupcoming = [
                { def: 'SL', visible: true, displayName: 'ID' },
                { def: 'Patient', visible: true, displayName: '	Patient Details' },
                { def: 'Service', visible: true, displayName: ' Service Name' },
                // { def: 'Doctor', visible: true, displayName: 'Doctor' },
                { def: 'Time', visible: true, displayName: 'Slot Time' },
                { def: 'WaitingTime', visible: true, displayName: 'Waiting Time' },
                { def: 'VisitCount', visible: true, displayName: 'Visit Count#' },
                { def: 'Billing', visible: true, displayName: '	Billing' },
                { def: 'Vitals', visible: true, displayName: 'Vitals' },
            ];
            this.selectedColumnsupcoming = [ 
                'SL',
                'Patient',
                'Service',
                // 'Doctor',
                'Time',
                'WaitingTime',
                'VisitCount',
                'Billing',
                'Vitals'
            ];
            // debugger
        }
        else if (this.roleID == '3') {
            this.isFrontDesk=true
            this.displayedColumns = [
               'SL', 'Patient','ReceiptToken', 'Service', 'WaitingTime', 'BookingTime', 'LastVisit', 'VisitCount','Status','Actions'

            ];
        }
        else if (this.roleID == '5') {
            this.isjrDoctor=true
            this.displayedColumns = [
                 //'View',
                 'SL', 'Patient','ReceiptToken', 'Service', 'WaitingTime', 'BookingTime', 'LastVisit', 'VisitCount','Vitals',  'Status', 
                  'Actions'
            ];
        }

        // this.filteredOptions = this.myControl.valueChanges.pipe(
        //     startWith(''),
        //     map(value => this._filter(value)),
        //   );


        this.amoutpaids=700;


        
//   const storedCount = localStorage.getItem('printCount');
//   this.printCount = storedCount ? parseInt(storedCount, 10) : 1;
}

 
    
    applysearch(){
         
        this.mobNum=this.searchKey3;
        this.fName=this.searchKey3;
        
    }
    today: Date = new Date();
    onDateChange(event: MatDatepickerInputEvent<Date>) {
        if (event.value < this.today) {
          this.selectedDate.setValue(null);
        }
    }


    ngOnDestroy(): void {
         
        localStorage.removeItem('accessToken');
        this.subscription.unsubscribe();
        // clearInterval(this.timer); // Prevent memory leaks


       // localStorage.removeItem('loginDetails');
    }
      

    clearSearch() {
        this.searchKey = '';
        this.doFilter1(this.searchKey, 1)
        this.doFilter(this.searchKey1, 2)
       this.doFilter(this.searchKey2, 3)
    }

    
    filterChange(filter, event) {
         
       
        var sd=event.value.trim().toLocaleLowerCase()
        
        this.todayBookings.filter = event.value.trim().toLocaleLowerCase()
        this.todaysbooked.filter = event.value.trim().toLocaleLowerCase()
        this.upcomingBookings.filter =  '';
        this.patientsappointments.filter = '';
        this.searchKey1 = '';
        this.searchKey2 = '';
        // this.filterValues[filter.columnProp] = event.value.toLowerCase()
        // this.todayBookings.filter = JSON.stringify(this.filterValues)
    }


    getFilterObject(fullObj, key) {
         
        const uniqChk = [];
        fullObj.filter((obj) => {
            if (!uniqChk.includes(obj[key])) {
                uniqChk.push(obj[key]);
            }
            return obj;
        });
        return uniqChk;
    }

    createFilter() {
         
        let filterFunction = function (data: any, filter: string): boolean {
            let searchTerms = JSON.parse(filter);
            let isFilterSet = false;
            for (const col in searchTerms) {
                if (searchTerms[col].toString() !== '') {
                    isFilterSet = true;
                } else {
                    delete searchTerms[col];
                }
            }

            console.log(searchTerms);

            let nameSearch = () => {
                let found = false;
                if (isFilterSet) {
                    for (const col in searchTerms) {
                        searchTerms[col].trim().toLowerCase().split(' ').forEach(word => {
                            if (data[col].toString().toLowerCase().indexOf(word) != -1 && isFilterSet) {
                                found = true
                            }
                        });
                    }
                    return found
                } else {
                    return true;
                }
            }
            return nameSearch()
        }
        return filterFunction
    }
    


    addStaticData() {
         

        this.frequencyList = [];
        this.frequencyList.push({ ID: 1, frequency: 'Days' })
        this.frequencyList.push({ ID: 2, frequency: 'Month' })


        this.frequencyListMedication = [];
        this.frequencyListMedication.push({ ID: 1, label: 'Daily' })
        this.frequencyListMedication.push({ ID: 2, label: 'Weekly' })
        this.frequencyListMedication.push({ ID: 1, label: 'Monthly' })
        this.frequencyListMedication.push({ ID: 2, label: '2 days' })
        this.frequencyListMedication.push({ ID: 2, label: '3 days' })
        this.frequencyListMedication.push({ ID: 2, label: '4 days' })

        // this.medicine.push({ ID: 1, label: 'AV UTI Suspension' })
        // this.medicine.push({ ID: 2, label: 'Cartiva Forte Tablet' })
        // this.medicine.push({ ID: 1, label: 'Rtist 300MG Tablet' })
        // this.medicine.push({ ID: 2, label: 'Nise Suspension' })


        this.dose = [];
        this.dose.push({ ID: 2, label: '1-1-1' })
        this.dose.push({ ID: 2, label: '1-0-1' })
        this.dose.push({ ID: 2, label: '1-0-0' })
        this.dose.push({ ID: 2, label: '0-0-1' })
        this.dose.push({ ID: 2, label: '1/2-0-0 ' })
        this.dose.push({ ID: 2, label: '0-1/2-0' })
        this.dose.push({ ID: 2, label: '0-0-1/2' })
        this.dose.push({ ID: 2, label: '1/2-1/2-1/2' })

        this.when = [];
        this.when.push({ ID: 2, label: 'After Food' })
        this.when.push({ ID: 2, label: 'Before Food' })
        // this.when.push({ ID: 2, label: 'Night' })

        this.duration = [];
        this.duration.push({ ID: 2, label: '4 Days' })
        this.duration.push({ ID: 2, label: '10 Days' })
        this.duration.push({ ID: 2, label: '1 Week' })
        this.duration.push({ ID: 2, label: '2 Weeks' })
        this.duration.push({ ID: 2, label: '1 Month' })
        this.duration.push({ ID: 2, label: '2 Months' })
        this.duration.push({ ID: 2, label: '3 Months' })

        this.Mode = [];
        this.Mode.push({ ID: 1, label: 'Cash' })
        this.Mode.push({ ID: 2, label: 'Card' })
        this.Mode.push({ ID: 3, label: 'UPI' })
        this.Mode.push({ ID: 4, label: 'NetBanking' })

        this.BloodGroup =[];
        this.BloodGroup.push({ ID: 'A+', label: 'A+' })
        this.BloodGroup.push({ ID: 'A-', label: 'A-' })
        this.BloodGroup.push({ ID: 'B+', label: 'B+' })
        this.BloodGroup.push({ ID: 'B-', label: 'B-' })
        this.BloodGroup.push({ ID: 'O+', label: 'O+' })
        this.BloodGroup.push({ ID: 'O-', label: 'O-' })
        this.BloodGroup.push({ ID: 'AB+', label: 'AB+' })
        this.BloodGroup.push({ ID: 'AB-', label: 'AB-' })

    }

    onRowClicked(row) {
        // debugger
         
        // this.rowClickedData=row;
        this.Screen = 2;
        this.detailData = row;
        this.viewHistory(row);
        this.fruits = [];
        this.vitalsForm.reset();
        if (row.vitalsID) {
            this.setValues(row);

        }
        else {
            
            this.patientName = row.patient + " " + "(" + row.gender + ", Age " + row.age + ")"
            // this.vitalsForm.reset();
            // this.fruits = [];
            this.flag = '1'
            this.PatientID = row.patientID;
            this.AppointmentID = row.appointmentID;
            this.vitalsID = 0;
            this.items = this.vitalsForm.get('items') as FormArray;
            this.medicationitems = this.vitalsForm.get('medicationitems') as FormArray;
            // const arr = <FormArray>this.vitalsForm.controls.items;
            // arr.controls = [];
            // this.addItem();

            // console.log('Row clicked: ', row);
        }
    }

    goBack() {
        //this._router.navigate(['/Appointments']); 

        this.Screen = 1;

    }
    
    
    openReceipt(id){
     
        // debugger

        if (this.roleID == '2') 
        {
           this.AllAppointments = this.allAppointments;
        }

        else {

       // Combine all appointment arrays into one
       this.AllAppointments = [
           ...this.allAppointments.todaysAppointments,
           ...this.allAppointments.upcommingAppointments,
           ...this.allHistory
           ];
       }


 // Find the appointment (returns first match)
 const filteredBookingReceipt = this.AllAppointments.find(
   (appointment) => appointment.appointmentID === id
 );


 this.utilitiesService.getUserByRegistrationId(filteredBookingReceipt.doctorID).subscribe(
   (response: any) => {
    // debugger

       this.doctorQualification = response.qualification;
       this.doctorDesignation = response.institution;

   },
   (error) => {
       console.error("❌ Error fetching details", error);
   }
);
      
    //    debugger
         console.log(filteredBookingReceipt);

       this.appointmentDateWithTime = this.formatCustomDate(filteredBookingReceipt.createdDate);
       this.receiptNumber = filteredBookingReceipt.receiptNo;
       this.receiptToken=filteredBookingReceipt.receiptToken;
       this.appointmentDate=filteredBookingReceipt.appointmentDate;
       this.patientID=filteredBookingReceipt.patientARCID;
       this.patientName=filteredBookingReceipt.patientName;
       this.serviceName=filteredBookingReceipt.serviceName;
       this.modeofPayment = filteredBookingReceipt.modeofPayment;
       this.fee = filteredBookingReceipt.price;
       this.payment = filteredBookingReceipt.payment;
       this.discount = filteredBookingReceipt.discount;
       this.gender = filteredBookingReceipt.gender;
       this.age = filteredBookingReceipt.age;
       this.patientPhoneNumber = filteredBookingReceipt.mobile;
       this.doctor = filteredBookingReceipt.doctor;
       this.amountInWords = this.numberToWordsWithDecimal(parseFloat(filteredBookingReceipt.payment));
       this.openCompanyDetailsDialog();

   // this.todayDataSourcePrintBookings=[];
   //     this.date = new Date();
   //     this.date.setHours(0, 0, 0, 0);
   //     let todayDate1 = this.datepipe.transform(this.date, 'dd MMM yyyy');

   //     this.todayDataSourcePrintBookings.push(row);
   //     this.todayDataSourcePrintBookings.forEach(function(e){
   //         if (typeof e === "object" ){
   //           e["patient"] = row.patientName
   //         }
   //       });
       //this.todayDataSourcePrintBookings[0].patient=row.patientName
       
       // this.receiptToken= this.todayDataSourcePrintBookings[0].receiptToken;
       // this.todayDataSourcePrintBookings[0].modeofPaymentID=row.modeofPaymentID
       // this.todayDataSourcePrintBookings[0].serviceName=row.serviceName
       // this.todayDataSourcePrintBookings[0].receiptToken=row.receiptToken
       // this.todayDataSourcePrintBookings[0].appointmentDate=row.appointmentdate
       // this.todayDataSourcePrintBookings[0].patient=row.patientName
       // this.todayDataSourcePrintBookings[0].payment=row.payment
      
     
      // this.todayDataSourcePrintBookings = this.patientHistory.filter((a) => a.receiptToken == row.receiptToken && a.serviceDate == row.appointmentdate);
       // if(this.todayDataSourcePrintBookings.length>0)
       // {
       // if (this.todayDataSourcePrintBookings[0].modeofPaymentID != 5 && (this.todayDataSourcePrintBookings[0].duePayment == null ||
       //     this.todayDataSourcePrintBookings[0].duePayment == '0.00')) {

       //     this.openCompanyDetailsDialog();
       //  }
       // }
   
   }


    onRowClicked1(row){
     
        //  debugger

         const AppointmentID = row.appointmentID;

         if (this.roleID == '2') 
         {
            this.AllAppointments = this.allAppointments;
         }

         else {

        // Combine all appointment arrays into one
        this.AllAppointments = [
            ...this.allAppointments.todaysAppointments,
            ...this.allAppointments.upcommingAppointments,
            ...this.allHistory
            ];
        }


  // Find the appointment (returns first match)
  const filteredBookingReceipt = this.AllAppointments.find(
    (appointment) => appointment.appointmentID === AppointmentID
  );


  this.utilitiesService.getUserByRegistrationId(filteredBookingReceipt.doctorID).subscribe(
    (response: any) => {

        this.doctorQualification = response.qualification;
        this.doctorDesignation = response.institution;

    },
    (error) => {
        console.error("❌ Error fetching details", error);
    }
);
       
        // debugger
          console.log(filteredBookingReceipt);

        this.appointmentDateWithTime = this.formatCustomDate(filteredBookingReceipt.createdDate);
        this.receiptNumber = filteredBookingReceipt.receiptNo;
        this.receiptToken=filteredBookingReceipt.receiptToken;
        this.appointmentDate=filteredBookingReceipt.appointmentDate;
        this.patientID=filteredBookingReceipt.patientARCID;
        this.patientName=filteredBookingReceipt.patientName;
        this.serviceName=filteredBookingReceipt.serviceName;
        this.modeofPayment = filteredBookingReceipt.modeofPayment;
        this.fee = filteredBookingReceipt.price;
        this.payment = filteredBookingReceipt.payment;
        this.discount = filteredBookingReceipt.discount;
        this.gender = filteredBookingReceipt.gender;
        this.age = filteredBookingReceipt.age;
        this.patientPhoneNumber = filteredBookingReceipt.mobile;
        this.doctor = filteredBookingReceipt.doctor;
        this.amountInWords = this.numberToWordsWithDecimal(parseFloat(filteredBookingReceipt.payment));
        this.openCompanyDetailsDialog();

    // this.todayDataSourcePrintBookings=[];
    //     this.date = new Date();
    //     this.date.setHours(0, 0, 0, 0);
    //     let todayDate1 = this.datepipe.transform(this.date, 'dd MMM yyyy');

    //     this.todayDataSourcePrintBookings.push(row);
    //     this.todayDataSourcePrintBookings.forEach(function(e){
    //         if (typeof e === "object" ){
    //           e["patient"] = row.patientName
    //         }
    //       });
        //this.todayDataSourcePrintBookings[0].patient=row.patientName
        
        // this.receiptToken= this.todayDataSourcePrintBookings[0].receiptToken;
        // this.todayDataSourcePrintBookings[0].modeofPaymentID=row.modeofPaymentID
        // this.todayDataSourcePrintBookings[0].serviceName=row.serviceName
        // this.todayDataSourcePrintBookings[0].receiptToken=row.receiptToken
        // this.todayDataSourcePrintBookings[0].appointmentDate=row.appointmentdate
        // this.todayDataSourcePrintBookings[0].patient=row.patientName
        // this.todayDataSourcePrintBookings[0].payment=row.payment
       
      
       // this.todayDataSourcePrintBookings = this.patientHistory.filter((a) => a.receiptToken == row.receiptToken && a.serviceDate == row.appointmentdate);
        // if(this.todayDataSourcePrintBookings.length>0)
        // {
        // if (this.todayDataSourcePrintBookings[0].modeofPaymentID != 5 && (this.todayDataSourcePrintBookings[0].duePayment == null ||
        //     this.todayDataSourcePrintBookings[0].duePayment == '0.00')) {

        //     this.openCompanyDetailsDialog();
        //  }
        // }
    
    }

    // this.todayBookings.filterPredicate = this.createFilter();

    // this.filterSelectObj.filter((o) => {
    //     o.options = this.getFilterObject(this.todayDataSourceBookings, o.columnProp);
    // });
    //}

    onRowPrintPresecptionClicked(row) {
        // debugger
         
        if (row.vitalsID) {
            
            this.detailData = row;
            this.setValues(row);
            this.ViewPrescption();
        }
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
    filterAppointemnts(event) {
         
        //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
        let filtered: any[] = [];
        let query = event.query;

        for (let i = 0; i < this.allAppointments.length; i++) {
            let country = this.allAppointments[i];
            if (country.mobile.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(country);
            }
        }

        this.filteredAppointments = filtered;
    }

gethistory(){
    this.utilitiesService.getAllAppointments1().subscribe(
        (data) => {
            if (data) {
                // debugger

                if (this.roleID != 2) {
                   this.patientsappointments = data;

                    if(this.patientsappointments.length>0){
                        this.Histories=true
                    }
                    else{
                        this.Histories=false
                    }
                    this.patientsappointments = new MatTableDataSource(this.patientsappointments);

                    this.patientsappointments.paginator = this.HistoryPaginator;
        
        
                 //   this.spinner.hide();
                   
                }
                else {
                    // this.registrationID=this.loginDetails.registrationID;
                    this.gethistory1();
                  
                    //this.patientsappointments = data.filter((a) => a.doctorID == this.registrationID);
                }

            }
       
          
        },

        () => {
            this.spinner.hide();
        }
    );
}
// exportpdf(){
//      
//       var prepare=[];
//     this.patientsappointments.filteredData.forEach(e=>{
//       var tempObj =[];
//       tempObj.push(e.appointmentID);
//       tempObj.push(e.patient);
//       tempObj.push( e.gender);
//       tempObj.push( e.mobile);
//       tempObj.push(e.visitCount);
//       prepare.push(tempObj);

//     });
//     const doc = new jsPDF();
//     autoTable(doc,{
//         head: [['AppointmentID','Patient Name ',' Gender','Phone Number','Visit Count']],
//         body: prepare
//     });
//     doc.save('Reports' + '.pdf');
  
//     // const doc = new jsPDF("p", "pt", "a4");
//     // const source = document.getElementById("table1");
//     // // doc.text("Test", 40, 20);
//     // doc.setFontSize(20)
//     // doc.html(source, {
//     //   callback: function(pdf) {
//     //     doc.output("dataurlnewwindow"); // preview pdf file when exported
//     //   }
//     // });
// }

exportpdf() {
    const prepare = [];
    // this.patientsappointments.filteredData.forEach(e => {
    //     const tempObj = [];
    //     tempObj.push(e.appointmentID);
    //     tempObj.push(e.patient);
    //     tempObj.push(e.gender);
    //     tempObj.push(e.mobile);
    //     tempObj.push(e.visitCount);
    //     tempObj.push(e.serviceDate); // Add the date column here
    //     prepare.push(tempObj);
    // });
    this.historiesBooked.filteredData.forEach(e => {
        const tempObj = [];
        tempObj.push(e.appointmentID);
        tempObj.push(e.patient);
        tempObj.push(e.gender);
        tempObj.push(e.mobile);
        tempObj.push(e.visitCount);
        tempObj.push(e.serviceDate); // Add the date column here
        prepare.push(tempObj);
    });

    const doc = new jsPDF();

    // Add logo
    const logo = new Image();
    logo.src = 'assets/images/logo/LOGO.png'; // path to your logo file
    logo.onload = () => {
        doc.addImage(logo, 'PNG', 10, 10, 50, 20); // adjust the positioning and size as needed
        
        // Add title
        doc.setFontSize(12);

        // Add current date
        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate()} ${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`;
        doc.text(`Date: ${formattedDate}`, 160, 40);

        // Add table
        autoTable(doc, {
            head: [['AppointmentID', 'Patient Name', 'Gender', 'Phone Number', 'Visit Count', 'Date']], // Include 'Date' in the head
            body: prepare,
            startY: 50 // adjust the start position as needed
        });
        const footerText = `Advance Rheumatology Center\n6-3-652, 1st Floor, Kautilya Building, near Erramanzil bus stop, Somajiguda,\nHyderabad, Telangana 500082, Contact No : 9247435254`;
        doc.setFontSize(10);
        doc.text(footerText, 13, doc.internal.pageSize.height - 20);

        // Save PDF
        doc.save('History.pdf');
    };
}



ExportTOExcel() {
     
    // Get the table element by its class name
    const table = document.querySelector('.example-container table');
  
    // Convert the table to a worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
  
    // Create a new workbook and append the worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
    // Save the workbook as an Excel file
    XLSX.writeFile(wb, 'SheetJS.xlsx');
  }


gethistory1(){
    this.utilitiesService.getAllAppointments2(this.registrationID).subscribe(
        (data) => {
            if (data) {
               
               
                    // this.registrationID=this.loginDetails.registrationID;
                    this.patientsappointments = data;
                    if(this.patientsappointments.length>0){
                        this.Histories=true
                    }
                    else{
                        this.Histories=false
                    }
                    //this.patientsappointments = data.filter((a) => a.doctorID == this.registrationID);
                

            }
       
            this.patientsappointments = new MatTableDataSource(this.patientsappointments);

            this.patientsappointments.paginator = this.HistoryPaginator;


            this.spinner.hide();
        },

        () => {
            this.spinner.hide();
        }
    );
}
admincomplete
adminpending
doctorcomplete
doctorpending
doctorid

getdoctordetails(){
    //  debugger
    this.utilitiesService.getAllAppointments2(this.doctorid).subscribe(
        (data) => {
            if (data) {
                // debugger
                this.doctorcomplete = data[0].completed
                this.doctorpending = data[0].pending
                console.log("doctorids",this.doctorcomplete)
            }
            })
        }

    // getAllAppointments() {
    //         //debugger
    //     this.spinner.show();
    //     if (this.roleID != 2){
    //     this.utilitiesService.getAllAppointments().subscribe(
    //         (data) => {
    //             if (data) {
    //                 this.spinner.hide();
    //                 console.log("Appointments",data)

    //                 this.allAppointments = data;

    //                 this.todaysbooked= data.todaysAppointments

    //                 this.upcomingBookings = data.upcommingAppointments

    //                 this.adminpending = data.pendingCount

    //                 this.admincomplete = data.completedCount


    //               //  this.todayBookings = new MatTableDataSource(data)
    //                 this.doctorid = this.allAppointments.historyAppointments[0].doctorID
    //                 console.log("doctoridNew",this.doctorid)
    //               //  this.admincomplete = this.allAppointments[0].completed
    //               //  this.adminpending = this.allAppointments[0].pending
    //                 console.log("appoint",this.allAppointments)
    //               //  this.date = new Date();
    //              //   this.date.setHours(0, 0, 0, 0);
    //              //   let todayDate = this.datepipe.transform(this.date, 'dd MMM yyyy');
    //             //    console.log("Today Date",todayDate)
    //              //   const dateforToday = new Date();
                
    //              //       console.log("Data",data)
    //                   //  this.todayDataSourceBookings=data

    //                 //   this.todayDataSourceBookings = data.filter(
    //                 //     (a) => a.serviceDate == todayDate 
    //                 // );
                    
    //                  //   this.todayDataSourceBookings = data.filter((a) => a.serviceDate == todayDate);
                       
    //               //   console.log("todayDataSourceBookings",this.todayDataSourceBookings)

    //                     for(var i=0;i<this.todayDataSourceBookings.length;i++){
    //                         if(this.todayDataSourceBookings[i].waitingTime>0){
    //                             const t12: any=  this.todayDataSourceBookings[i].waitingTime.split('.');
    //                             this.todayDataSourceBookings[i].waitingTime= t12[0]+":"+t12[1]
    //                         }
                         
    //                     }
    //                     console.log("Today Appointments",this.todayDataSourceBookings)
    //                     this.selection = new Set < this.todayDataSourceBookings > (true);
    //                     //Future Bookings
    //                 //    this.upcomingBookings = data.filter((a) => new Date(a.serviceDate) > new Date(dateforToday));
                 
                   
    //                 this.filterPatientappointments = data.filter(
    //                     (thing, i, arr) => arr.findIndex(t => t.mobile === thing.mobile && t.patient === thing.patient) === i
    //                   );

    //                 // this.filterPatientappointments = data.filter(
    //                 //     (thing, i, arr) => arr.findIndex(t => t.mobile === thing.mobile && t.patient === thing.patient) === i
    //                 // );
    //             }
    //           // this.todayDataSourceBookings.sort((a, b) => (a.status < b.status ? -1 : 1));
    //             if(this.upcomingBookings.length>0){
    //                 this.upcomings=true
    //             }
    //             else{
    //                 this.upcomings=false
    //             }
    //             if(this.todayDataSourceBookings.length>0){
    //                 this.Todays=true
    //             }
    //             else{
    //                 this.Todays=false
    //             }

                
                
    //            this.todayBookings = new MatTableDataSource(this.todayDataSourceBookings);
    //           //  this.upcomingBookings = new MatTableDataSource(this.upcomingBookings);
    //             // this.todaysbooked = new MatTableDataSource(this.todayDataSourceBookings);
    //             this.todaysbooked.paginator = this.paginator;
    //           //  this.spinner.hide();
                
    //            // this.patientsappointments = new MatTableDataSource(this.patientsappointments);


    //             this.todayBookings.paginator = this.paginator;
    //             this.upcomingBookings.paginator = this.upcomingPaginator;

               
    //            // this.patientsappointments.paginator = this.HistoryPaginator;

    //             if (this.receiptToken > 0) {
    //                 this.date = new Date();
    //                 this.date.setHours(0, 0, 0, 0);
    //                 let todayDate1 = this.datepipe.transform(this.date, 'dd MMM yyyy');
    //                 this.todayDataSourcePrintBookings = data.filter((a) => a.receiptToken == this.receiptToken && a.serviceDate == todayDate1);
    //                 if(this.todayDataSourcePrintBookings.length>0)
    //                 {
    //                 if (this.todayDataSourcePrintBookings[0].modeofPaymentID != 5 && (this.todayDataSourcePrintBookings[0].duePayment == null ||
    //                     this.todayDataSourcePrintBookings[0].duePayment == '0.00')) {
    //                     //(element.modeofPaymentID != 5) && (element.duePayment == null || element.duePayment == '0.00')"

    //                     this.openCompanyDetailsDialog();
    //                 }
    //             }
    //                 //this.printSingle();
    //             }

    //             this.todayBookings.filterPredicate = this.createFilter();

    //             this.filterSelectObj.filter((o) => {
    //                 o.options = this.getFilterObject(this.todayDataSourceBookings, o.columnProp);
    //             });

    //           //  this.spinner.hide();
    //         },

    //         () => {
    //            // this.spinner.hide();
    //         }
    //     );
    // }
    // else{
    //     this.utilitiesService.getAllDoctorAppointments().subscribe(
    //         (data) => {
    //             if (data) {
    //                 this.spinner.hide();
    //                 console.log("Appointments",data)

    //                 this.allAppointments = data;
    //               //  this.todayBookings = new MatTableDataSource(data)
    //                 this.doctorid = this.allAppointments[0].doctorID
    //                 console.log("doctoridNew",this.doctorid)
    //                 this.admincomplete = this.allAppointments[0].completed
    //                 this.adminpending = this.allAppointments[0].pending
    //                 console.log("appoint",this.allAppointments)
    //                 this.date = new Date();
    //                 this.date.setHours(0, 0, 0, 0);
    //                 let todayDate = this.datepipe.transform(this.date, 'dd MMM yyyy');
    //                 console.log("Today Date",todayDate)
    //                 const dateforToday = new Date();
      
    //                     // this.registrationID=this.loginDetails.registrationID;
    //                 this.todayDataSourceBookings = data.filter((a) => a.serviceDate == todayDate && a.doctorID == this.registrationID);
    //                     console.log("todayDataSourceBookings",this.todayDataSourceBookings)

    //                     this.selection = new Set < this.todayDataSourceBookings > (true);

    //                     this.upcomingBookings = data.filter((a) => new Date(a.serviceDate) > new Date(dateforToday) && a.doctorID == this.registrationID);
                      
                    
    //                 this.filterPatientappointments = data.filter(
    //                     (thing, i, arr) => arr.findIndex(t => t.mobile === thing.mobile && t.patient === thing.patient) === i
    //                   );

    //                 // this.filterPatientappointments = data.filter(
    //                 //     (thing, i, arr) => arr.findIndex(t => t.mobile === thing.mobile && t.patient === thing.patient) === i
    //                 // );
    //             }
    //           // this.todayDataSourceBookings.sort((a, b) => (a.status < b.status ? -1 : 1));
    //             if(this.upcomingBookings.length>0){
    //                 this.upcomings=true
    //             }
    //             else{
    //                 this.upcomings=false
    //             }
    //             if(this.todayDataSourceBookings.length>0){
    //                 this.Todays=true
    //             }
    //             else{
    //                 this.Todays=false
    //             }

                
                
    //            this.todayBookings = new MatTableDataSource(this.todayDataSourceBookings);
    //             this.upcomingBookings = new MatTableDataSource(this.upcomingBookings);
    //             this.todaysbooked = new MatTableDataSource(this.todayDataSourceBookings);
    //             this.todaysbooked.paginator = this.paginator;
    //           //  this.spinner.hide();
                
    //            // this.patientsappointments = new MatTableDataSource(this.patientsappointments);


    //             this.todayBookings.paginator = this.paginator;
    //             this.upcomingBookings.paginator = this.upcomingPaginator;

               
    //            // this.patientsappointments.paginator = this.HistoryPaginator;

    //             if (this.receiptToken > 0) {
    //                 this.date = new Date();
    //                 this.date.setHours(0, 0, 0, 0);
    //                 let todayDate1 = this.datepipe.transform(this.date, 'dd MMM yyyy');
    //                 this.todayDataSourcePrintBookings = data.filter((a) => a.receiptToken == this.receiptToken && a.serviceDate == todayDate1);
    //                 if(this.todayDataSourcePrintBookings.length>0)
    //                 {
    //                 if (this.todayDataSourcePrintBookings[0].modeofPaymentID != 5 && (this.todayDataSourcePrintBookings[0].duePayment == null ||
    //                     this.todayDataSourcePrintBookings[0].duePayment == '0.00')) {
    //                     //(element.modeofPaymentID != 5) && (element.duePayment == null || element.duePayment == '0.00')"

    //                     this.openCompanyDetailsDialog();
    //                 }
    //             }
    //                 //this.printSingle();
    //             }

    //             this.todayBookings.filterPredicate = this.createFilter();

    //             this.filterSelectObj.filter((o) => {
    //                 o.options = this.getFilterObject(this.todayDataSourceBookings, o.columnProp);
    //             });

    //           //  this.spinner.hide();
    //         },

    //         () => {
    //            // this.spinner.hide();
    //         }
    //     );  
    // }
    // }


    // getAllAppointments() {
    //     this.spinner.show();
    
    //     const fetchAppointments = this.roleID != 2 
    //         ? this.utilitiesService.getAllAppointments() 
    //         : this.utilitiesService.getAllDoctorAppointments();
        
    //     fetchAppointments.subscribe(
    //         (data: any) => {
    //             this.allAppointments = data;
    //             this.todaysbooked = data.todaysAppointments;
    //             this.upcomingBookings = data.upcommingAppointments;
    //             this.adminpending = data.pendingCount;
    //             this.admincomplete = data.completedCount;
                
    //             if (data.historyAppointments.length > 0) {
    //                 this.doctorid = data.historyAppointments[0].doctorID;
    //             }
    
    //             this.spinner.hide();
    //         },
    //         (error) => {
    //             this.spinner.hide();
    //             console.error("Error fetching appointments", error);
    //         }
    //     );
    // }
    
    // getAllAppointments() {
    //     const requestStart = performance.now(); // Log start time
    //     console.log("⏳ Starting API call at:", requestStart);
        
    //     this.spinner.show();
    
    //     const fetchAppointments = this.roleID != 2 
    //         ? this.utilitiesService.getAllAppointments() 
    //         : this.utilitiesService.getAllDoctorAppointments();
        
    //     fetchAppointments.subscribe(
    //         (data: any) => {
    //             const responseReceived = performance.now();
    //             console.log(`✅ API responded in: ${responseReceived - requestStart}ms`);
                
    //             const startTime = performance.now(); // Measure UI update time
    
    //             this.allAppointments = data;
    //             this.todaysbooked = data.todaysAppointments;
    //             this.upcomingBookings = data.upcommingAppointments;
    //             this.adminpending = data.pendingCount;
    //             this.admincomplete = data.completedCount;
    
    //             if (data.historyAppointments.length > 0) {
    //                 this.doctorid = data.historyAppointments[0].doctorID;
    //             }
    
    //             const endTime = performance.now();
    //             console.log(`⚡ UI update time: ${endTime - startTime}ms`);
                
    //             this.spinner.hide();
    //         },
    //         (error) => {
    //             this.spinner.hide();
    //             console.error("❌ Error fetching appointments", error);
    //         }
    //     );
    // }
    


    getAllAppointmentsnew() {
        // debugger

        const requestStart = performance.now(); // Log start time
        console.log("⏳ Starting API call at:", requestStart);
    
        this.spinner.show();
    
        if (this.roleID != 2) {
            //  debugger
            // Fetch all appointments for non-doctor roles
            this.utilitiesService.getAllAppointments().subscribe(
                (data: any) => {
                    // debugger
                    const responseReceived = performance.now();
                    console.log(`✅ API responded in: ${responseReceived - requestStart}ms`);
    
                    const startTime = performance.now(); // Measure UI update time
    
                    this.allAppointments = data;


                    if(data.upcommingAppointments.length>0){
                        this.upcomings=true
                    }
                    else{
                        this.upcomings=false
                    }
                    if(data.todaysAppointments.length>0){
                        this.Todays=true
                    }
                    else{
                        this.Todays=false
                    }
                    
                    const statusOrder = ["In Progress", "Booked", "Completed"];

                    data.todaysAppointments.sort((a, b) => {
                      return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
                    });

                  //  this.todaysbooked = data.todaysAppointments;
                    this.todaysbooked = new MatTableDataSource(data.todaysAppointments);
                    this.todaysbooked.paginator = this.paginator;

                    // this.upcomingBookings = data.upcommingAppointments;

                    this.upcomingBookings = new MatTableDataSource(data.upcommingAppointments);
                    this.upcomingBookings.paginator = this.paginator;


                    this.Today = data.todaysAppointments;
                    this.Upcoming = data.upcommingAppointments;
                    //this.History = data.historyAppointments;
                    
                    this.todayBookings = new MatTableDataSource(data.todaysAppointments);
                    this.todayBookings.paginator = this.paginator
                    console.log("Today Bookings", this.todayBookings );

                    // this.historiesBooked =  new MatTableDataSource(data.historyAppointments);
                    // this.historiesBooked.paginator = this.HistoryPaginator;


                    this.adminpending = data.pendingCount;
                    this.admincomplete = data.completedCount;

                    
                    // if(this.todaysbooked.length>0){
                    //     this.Todays=true
                    // }
                    // else{
                    //     this.Todays=false
                    // }
                    
    
                    // if (data.historyAppointments.length > 0) {
                    //     this.doctorid = data.historyAppointments[0].doctorID;
                    // }
    
                    const endTime = performance.now();
                    console.log(`⚡ UI update time: ${endTime - startTime}ms`);
    
                    this.spinner.hide();

                 
                        // debugger
                        if (this.queuedAppointmentID != null) {
                          this.openReceipt(this.queuedAppointmentID);
                          this.queuedAppointmentID = null; // Reset after use
                        }
                      
                
                },
                (error) => {
                    this.spinner.hide();
                    console.error("❌ Error fetching appointments", error);
                }
            );
        
        }
        else{
            this.utilitiesService.getAllDoctorAppointments().subscribe(
                (data) => {
                    if (data) {
                        // debugger
                        this.spinner.hide();
                        console.log("Appointments",data)
    
                        this.allAppointments = data;
                      //  this.todayBookings = new MatTableDataSource(data)
                        this.doctorid = this.allAppointments[0].doctorID
                        console.log("doctoridNew",this.doctorid)
                        this.admincomplete = this.allAppointments[0].completed
                        this.adminpending = this.allAppointments[0].pending
                        console.log("appoint",this.allAppointments)
                        this.date = new Date();
                        this.date.setHours(0, 0, 0, 0);
                        let todayDate = this.datepipe.transform(this.date, 'dd MMM yyyy');
                        console.log("Today Date",todayDate)
                        const dateforToday = new Date();
          
                            // this.registrationID=this.loginDetails.registrationID;
                        this.todayDataSourceBookings = data.filter((a) => a.serviceDate == todayDate && a.doctorID == this.registrationID);
                            console.log("todayDataSourceBookings",this.todayDataSourceBookings)
    
                            this.selection = new Set < this.todayDataSourceBookings > (true);
    
                            this.upcomingBookings = data.filter((a) => new Date(a.serviceDate) > new Date(dateforToday) && a.doctorID == this.registrationID);
                          
                            this.historiesBooked = data.filter((a) => new Date(a.serviceDate) < new Date(dateforToday) && a.doctorID == this.registrationID);

                        
                        this.filterPatientappointments = data.filter(
                            (thing, i, arr) => arr.findIndex(t => t.mobile === thing.mobile && t.patient === thing.patient) === i
                          );
    
                        // this.filterPatientappointments = data.filter(
                        //     (thing, i, arr) => arr.findIndex(t => t.mobile === thing.mobile && t.patient === thing.patient) === i
                        // );
                    }
                  // this.todayDataSourceBookings.sort((a, b) => (a.status < b.status ? -1 : 1));
                    if(this.upcomingBookings.length>0){
                        this.upcomings=true
                    }
                    else{
                        this.upcomings=false
                    }
                    if(this.todayDataSourceBookings.length>0){
                        this.Todays=true
                    }
                    else{
                        this.Todays=false
                    }

                    this.Today = this.todayDataSourceBookings;
                    this.Upcoming = this.upcomingBookings;
                    this.History = this.historiesBooked;
    
                    
                    
                   this.todayBookings = new MatTableDataSource(this.todayDataSourceBookings);
                    this.upcomingBookings = new MatTableDataSource(this.upcomingBookings);
                    console.log("Today Bookings", this.todayBookings );
                    const statusOrder = ["In Progress", "Booked", "Completed"];

                    this.todayDataSourceBookings.sort((a, b) => {
                      return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
                    });


                    this.todaysbooked = new MatTableDataSource(this.todayDataSourceBookings);
                   // this.todaysbooked.paginator = this.paginator;

                    this.historiesBooked =  new MatTableDataSource(this.historiesBooked);
                    this.historiesBooked.paginator = this.HistoryPaginator;
                  //  this.spinner.hide();
                    
                   // this.patientsappointments = new MatTableDataSource(this.patientsappointments);
    
    
                    this.todayBookings.paginator = this.paginator;
                    this.upcomingBookings.paginator = this.upcomingPaginator;
    
                   
                   // this.patientsappointments.paginator = this.HistoryPaginator;
    
                    if (this.receiptToken > 0) {
                        this.date = new Date();
                        this.date.setHours(0, 0, 0, 0);
                        let todayDate1 = this.datepipe.transform(this.date, 'dd MMM yyyy');
                        this.todayDataSourcePrintBookings = data.filter((a) => a.receiptToken == this.receiptToken && a.serviceDate == todayDate1);
                        if(this.todayDataSourcePrintBookings.length>0)
                        {
                        if (this.todayDataSourcePrintBookings[0].modeofPaymentID != 5 && (this.todayDataSourcePrintBookings[0].duePayment == null ||
                            this.todayDataSourcePrintBookings[0].duePayment == '0.00')) {
                            //(element.modeofPaymentID != 5) && (element.duePayment == null || element.duePayment == '0.00')"
    
                            // this.openCompanyDetailsDialog();
                        }
                    }
                        //this.printSingle();
                    }
    
                    this.todayBookings.filterPredicate = this.createFilter();
    
                    this.filterSelectObj.filter((o) => {
                        o.options = this.getFilterObject(this.todayDataSourceBookings, o.columnProp);
                    });
    
                  //  this.spinner.hide();

                },
    
                () => {
                   // this.spinner.hide();
                }
            );  
    
        }

        // setTimeout(() => {      
        //     if (this.queuedAppointmentID != null) {
        //       this.openReceipt(this.queuedAppointmentID);
        //       this.queuedAppointmentID = null; // Reset after use
        //     }
        //   }, 500);
    }
     



    getAllAppointmentsHistory() {
        // debugger

        if (this.roleID != 2) {
            // debugger
           // Fetch all appointments for non-doctor roles
           this.utilitiesService.getAllAppointmentsHistory().subscribe(
               (data: any) => {
                // debugger
                   this.History = data.historyAppointments;

                   this.allHistory = data.historyAppointments;

                   this.historiesBooked =  new MatTableDataSource(data.historyAppointments);
                   this.historiesBooked.paginator = this.HistoryPaginator;
   
                   if (data.historyAppointments.length > 0) {
                       this.doctorid = data.historyAppointments[0].doctorID;
                   }
   
                   this.spinner.hide();
               },
               (error) => {
                   this.spinner.hide();
                   console.error("❌ Error fetching appointments", error);
               }
           );
       }

    }



    // getAllAppointmentsHistory() {
    //     this.spinner.show();
    
    //     if (this.roleID != 2) {
    //         // 📦 Logic for non-doctor roles (Admin/Receptionist/Other)
    //         this.utilitiesService.getAllAppointmentsHistory().subscribe(
    //             (data: any) => {
    //                 console.log('admin appointment history:', data.historyAppointments);
    //                 this.History = data.historyAppointments;

    //                 this.historiesBooked =  new MatTableDataSource(data.historyAppointments);
    //                 this.historiesBooked.paginator = this.HistoryPaginator;

    //                 this.spinner.hide();
    
    //                 // TODO: Add logic here
    //             },
    //             (error) => {
    //                 console.error("❌ Error fetching non-doctor history appointments", error);
    //                 this.spinner.hide();
    //             }
    //         );
    //     } 
    //     else{
    //         this.utilitiesService.getAllDoctorAppointments().subscribe(
    //             (data) => {
    //                 if (data) {
    //                     // debugger
    //                     this.spinner.hide();
    //                     console.log("Appointments",data)
    
    //                     this.allAppointments = data;
    //                   //  this.todayBookings = new MatTableDataSource(data)
    //                     this.doctorid = this.allAppointments[0].doctorID
    //                     console.log("doctoridNew",this.doctorid)
    //                     this.admincomplete = this.allAppointments[0].completed
    //                     this.adminpending = this.allAppointments[0].pending
    //                     console.log("appoint",this.allAppointments)
    //                     this.date = new Date();
    //                     this.date.setHours(0, 0, 0, 0);
    //                     let todayDate = this.datepipe.transform(this.date, 'dd MMM yyyy');
    //                     console.log("Today Date",todayDate)
    //                     const dateforToday = new Date();
          
    //                         // this.registrationID=this.loginDetails.registrationID;
    //                     this.todayDataSourceBookings = data.filter((a) => a.serviceDate == todayDate && a.doctorID == this.registrationID);
    //                         console.log("todayDataSourceBookings",this.todayDataSourceBookings)
    
    //                         this.selection = new Set < this.todayDataSourceBookings > (true);
    
    //                         this.upcomingBookings = data.filter((a) => new Date(a.serviceDate) > new Date(dateforToday) && a.doctorID == this.registrationID);
                          
    //                         this.historiesBooked = data.filter((a) => new Date(a.serviceDate) < new Date(dateforToday) && a.doctorID == this.registrationID);

                        
    //                     this.filterPatientappointments = data.filter(
    //                         (thing, i, arr) => arr.findIndex(t => t.mobile === thing.mobile && t.patient === thing.patient) === i
    //                       );
    
    //                     // this.filterPatientappointments = data.filter(
    //                     //     (thing, i, arr) => arr.findIndex(t => t.mobile === thing.mobile && t.patient === thing.patient) === i
    //                     // );
    //                 }
    //               // this.todayDataSourceBookings.sort((a, b) => (a.status < b.status ? -1 : 1));
    //                 if(this.upcomingBookings.length>0){
    //                     this.upcomings=true
    //                 }
    //                 else{
    //                     this.upcomings=false
    //                 }
    //                 if(this.todayDataSourceBookings.length>0){
    //                     this.Todays=true
    //                 }
    //                 else{
    //                     this.Todays=false
    //                 }

    //                 this.Today = this.todayDataSourceBookings;
    //                 this.Upcoming = this.upcomingBookings;
    //                 this.History = this.historiesBooked;
    
                    
                    
    //                this.todayBookings = new MatTableDataSource(this.todayDataSourceBookings);
    //                 this.upcomingBookings = new MatTableDataSource(this.upcomingBookings);
    //                 console.log("Today Bookings", this.todayBookings );
    //                 const statusOrder = ["In Progress", "Booked", "Completed"];

    //                 this.todayDataSourceBookings.sort((a, b) => {
    //                   return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
    //                 });


    //                 this.todaysbooked = new MatTableDataSource(this.todayDataSourceBookings);
    //                // this.todaysbooked.paginator = this.paginator;

    //                 this.historiesBooked =  new MatTableDataSource(this.historiesBooked);
    //                 this.historiesBooked.paginator = this.HistoryPaginator;
    //               //  this.spinner.hide();
                    
    //                // this.patientsappointments = new MatTableDataSource(this.patientsappointments);
    
    
    //                 this.todayBookings.paginator = this.paginator;
    //                 this.upcomingBookings.paginator = this.upcomingPaginator;
    
                   
    //                // this.patientsappointments.paginator = this.HistoryPaginator;
    
    //                 if (this.receiptToken > 0) {
    //                     this.date = new Date();
    //                     this.date.setHours(0, 0, 0, 0);
    //                     let todayDate1 = this.datepipe.transform(this.date, 'dd MMM yyyy');
    //                     this.todayDataSourcePrintBookings = data.filter((a) => a.receiptToken == this.receiptToken && a.serviceDate == todayDate1);
    //                     if(this.todayDataSourcePrintBookings.length>0)
    //                     {
    //                     if (this.todayDataSourcePrintBookings[0].modeofPaymentID != 5 && (this.todayDataSourcePrintBookings[0].duePayment == null ||
    //                         this.todayDataSourcePrintBookings[0].duePayment == '0.00')) {
    //                         //(element.modeofPaymentID != 5) && (element.duePayment == null || element.duePayment == '0.00')"
    
    //                         this.openCompanyDetailsDialog();
    //                     }
    //                 }
    //                     //this.printSingle();
    //                 }
    
    //                 this.todayBookings.filterPredicate = this.createFilter();
    
    //                 this.filterSelectObj.filter((o) => {
    //                     o.options = this.getFilterObject(this.todayDataSourceBookings, o.columnProp);
    //                 });
    
    //               //  this.spinner.hide();
    //             },
    
    //             () => {
    //                // this.spinner.hide();
    //             }
    //         );  
    //     }
    // }
    
    


    filterService
    // Reset table filters
    resetFilters() {
         
        // this.filterService=""
        // this.todaysbooked = new MatTableDataSource(this.todayDataSourceBookings);
        // this.todaysbooked.paginator = this.paginator;
        // this.filterValues = {}
        // this.filterSelectObj.forEach((value, key) => {
        //     value.modelValue = undefined;
        // })
        // this.todaysbooked.filter = "";
        // this.searchKey='';

        // this.todaysbooked.filter = this.searchKey.trim().toLocaleLowerCase()
           
        
         this.filterService=""
         this.searchKey='';

         this.getAllAppointmentsnew()


    }
    resetFilters1() {
         
        this.filterValues = {}
        this.filterSelectObj.forEach((value, key) => {
            value.modelValue = undefined;
        })
        this.upcomingBookings.filter = "";
        this.searchKey1='';

        this.upcomingBookings.filter = this.searchKey1.trim().toLocaleLowerCase()

    }

    // sortData(sort: MatSort) {
         

    //     if (sort.active == "patientARCID") {
    //         if (sort.direction == "asc")
    //             this.todayDataSourceBookings.sort((a, b) => (a.patientARCID < b.patientARCID ? -1 : 1));
    //         else
    //             this.todayDataSourceBookings.sort((a, b) => (a.patientARCID > b.patientARCID ? -1 : 1));
    //     }
    //     if (sort.active == "status") {
    //         if (sort.direction == "asc")
    //             this.todayDataSourceBookings.sort((a, b) => (a.status < b.status ? -1 : 1));
    //         else
    //             this.todayDataSourceBookings.sort((a, b) => (a.status > b.status ? -1 : 1));
    //     }
    //     if (sort.active == "visitCount") {
    //         if (sort.direction == "asc")
    //             this.todayDataSourceBookings.sort((a, b) => (a.visitCount < b.visitCount ? -1 : 1));
    //         else
    //             this.todayDataSourceBookings.sort((a, b) => (a.visitCount > b.visitCount ? -1 : 1));
    //     }



    //     this.todayBookings = new MatTableDataSource(this.todayDataSourceBookings);
    //     this.todayBookings.paginator = this.paginator;

    // }

    sortData(sort: MatSort) {
        
        // debugger
        if (sort.active == "SL") {
            if (sort.direction == "asc")
                this.Today.sort((a, b) => (a.patientARCID < b.patientARCID ? -1 : 1));
            else
                this.Today.sort((a, b) => (a.patientARCID > b.patientARCID ? -1 : 1));
        }
        if (sort.active == "Patient") {
            if (sort.direction == "asc")
                this.Today.sort((a, b) => (a.patient < b.patient ? -1 : 1));
            else
                this.Today.sort((a, b) => (a.patient > b.patient ? -1 : 1));
        }
        if (sort.active == "Service") {
            if (sort.direction == "asc")
                this.Today.sort((a, b) => (a.serviceName < b.serviceName ? -1 : 1));
            else
                this.Today.sort((a, b) => (a.serviceName > b.serviceName ? -1 : 1));
        }
        if (sort.active == "LastVisit") {
            if (sort.direction == "asc")
                this.Today.sort((a, b) => (a.lastVisitDate < b.lastVisitDate ? -1 : 1));
            else
                this.Today.sort((a, b) => (a.lastVisitDate > b.lastVisitDate ? -1 : 1));
        }
        if (sort.active == "Doctor") {
            if (sort.direction == "asc")
                this.Today.sort((a, b) => (a.doctor < b.doctor ? -1 : 1));
            else
                this.Today.sort((a, b) => (a.doctor > b.doctor ? -1 : 1));
        }
        if (sort.active == "Time") {
            if (sort.direction == "asc")
                this.Today.sort((a, b) => (a.slotTime < b.slotTime ? -1 : 1));
            else
                this.Today.sort((a, b) => (a.slotTime > b.slotTime ? -1 : 1));
        }
        if (sort.active == "WaitingTime") {
            if (sort.direction == "asc")
                this.Today.sort((a, b) => (a.waitingTime < b.waitingTime ? -1 : 1));
            else
                this.Today.sort((a, b) => (a.waitingTime > b.waitingTime ? -1 : 1));
        }
        if (sort.active == "Status") {
            if (sort.direction == "asc")
                this.Today.sort((a, b) => (a.status < b.status ? -1 : 1));
            else
                this.Today.sort((a, b) => (a.status > b.status ? -1 : 1));
        }
        if (sort.active == "VisitCount") {
            if (sort.direction == "asc")
                this.Today.sort((a, b) => (a.visitCount < b.visitCount ? -1 : 1));
            else
                this.Today.sort((a, b) => (a.visitCount > b.visitCount ? -1 : 1));
        }
        if (sort.active == "ReceiptToken") {
            if (sort.direction == "asc")
                this.Today.sort((a, b) => (a.receiptToken < b.receiptToken ? -1 : 1));
            else
                this.Today.sort((a, b) => (a.receiptToken > b.receiptToken ? -1 : 1));
        }
        if (sort.active == "Billing") {
            if (sort.direction == "asc")
                this.Today.sort((a, b) => (a.payment > b.payment ? -1 : 1));
            else
                this.Today.sort((a, b) => (a.payment < b.payment ? -1 : 1));
        }
        if (sort.active == "DuePayment") {
            if (sort.direction == "asc")
                this.Today.sort((a, b) => (a.duePayment < b.duePayment ? -1 : 1));
            else
                this.Today.sort((a, b) => (a.duePayment > b.duePayment ? -1 : 1));
        }



        this.todaysbooked = new MatTableDataSource(this.Today);
        this.todaysbooked.paginator = this.paginator;

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
    getAllPatients() {
         
        this.patientsService.GetAllPatients().subscribe(
            (data) => {
                if (data) {
                    ;
                    this.patients = data;
                } else {
                }
            },

            () => { }
        );
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

    getStatuses() {
         
        this.utilitiesService.getStatuses().subscribe(
            (data) => {
                if (data) {
                    this.status = data;
                } else {
                }
            },

            () => { }
        );
    }
    getSlots() {
         
        this.utilitiesService.getSlots().subscribe(
            (data) => {
                if (data) {
                    this.slots = data;
                } else {
                }
            },

            () => { }
        );
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
    // getAllAppointmentBills() {
    //     this.utilitiesService.getAllAppointmentBills().subscribe(
    //         (data) => {
    //             if (data) {
    //                  
    //                 this.prices = data;
    //                 console.log('prices',this.prices)

    //        // this.step2.controls['price'].setValue(2);
    //                 // this.prices.splice(0, 1);
    //             } else {
    //             }
    //         },

    //         () => { }
    //     );
    // }
    // getDiscounts() {
    //     this.utilitiesService.getDiscounts().subscribe(
    //         (data) => {
    //             if (data) {
    //                 this.discounts = data;
    //             console.log("Discounts",this.discounts)
    //                 // this.discounts.splice(0, 1);
    //             } else {
    //             }
    //         },

    //         () => { }
    //     );
    // }

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

    onSearchClear() {
         

       this.searchKey3 = '';
    //this.applyFilter();
    }

    onAppointmentClear() {
         

        this.step1.reset();
        this.step2.reset();
        this.onSearchClear();
        // this.applyFilter();
    }

    onCheckboxChange(val) {
           // 
        if (val.checked == true) {
            this.isPriceTag = false;
        }
        else {
            this.isPriceTag = true;
        }
    }

    actionFormName(val) {
       
        this.isDuePay = false;
        this.slotsArr = [];
        this.step1.reset();
       this.step2.reset();
       this.getDiscounts()
       this.addStaticData();
        this.onSearchClear();
        this.actionName = val;
        this.action = val;
        this.isPriceTag = true;
        this.horizontalStepper.selectedIndex = 0;
        this.step1.controls['mobNum'].enable();
        this.step1.controls['appDate'].setValue(new Date());
        // this.step2.controls['amountPaid'].setValue(700);
         this.selectedPrice = this.step2.controls['amountPaid'].value;

        this.appointmentButton = 'Create Appointment';
        // this.form.controls['gender'].setValue(1);
        // this.horizontalStepperForm = this._formBuilder.group({
        //     step1: this._formBuilder.group({
        //         appDate: new FormControl(new Date()),
        //  this.step2.controls['netPrice'].disable();
        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value)),
        );
       // this.step2.controls['price'].setValue(2);
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

        price

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




// 0==6
// 10==1
// 20==2
// 25==3
// 30==4
// 40==5

// 500==7
// 700==2
// 0==6

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
    displayFn(user): string {
         
        return user && user.mobile ? user.mobile : '';
    }
    fName:any;
    age:any;
    applyFilter(val) {
         
        console.log(val);
        this.fName = val.value.patientName;
        this.mobNum = val.value.mobile;
        this.age = val.value.age;
        this.patientID=val.value.patientID;
        this.Genderselected=val.value.genderID
        val = val.trim(); // Remove whitespace
        val = val.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = val;
        // this.patientsappointments.filter = this.searchKey.trim().toLowerCase();
        let details = this.patients.filter(
            (a) => a.mobile.trim() == val.value.mobile.trim() && a.patient.trim().toLowerCase() == val.value.patient.trim().toLowerCase()
        );
        if (details.length > 0) {
            this.action = 'Patient Exists save new appointment';
            this.appointID = 0;
            this.patientID = details[0].patientID;
            this.step1.controls['fName'].setValue(details[0].patient);
           // this.step1.controls['lastName'].setValue(details[0].patient);
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
        this.filteredOptions = this.myControl.valueChanges
            .pipe(
                startWith(''),
                map(state => state ? this.filterStates(state) : this.filterPatientappointments.slice())
            );
    }
    public doFilter = (value, state) => {
         
        if (state == 1) {
            this.todayBookings.filter = value.trim().toLocaleLowerCase();
            this.upcomingBookings.filter = '';
            this.patientsappointments.filter = '';
            this.historiesBooked.filter = '';
            this.searchKey1 = '';
            this.searchKey2 = '';
        } else if (state == 2) {
            this.upcomingBookings.filter = value.trim().toLocaleLowerCase();
            this.todayBookings.filter = '';
            this.patientsappointments.filter = '';
            this.historiesBooked.filter = '';
            this.searchKey = '';
            this.searchKey2 = '';
        } else if (state == 3) {
            this.patientsappointments.filter = value.trim().toLocaleLowerCase();
            this.historiesBooked.filter = value.trim().toLocaleLowerCase();
            this.todayBookings.filter = '';
            this.upcomingBookings.filter = '';
            this.searchKey1 = '';
            this.searchKey = '';
        }
    };
    public doFilter1 = (value, state) => {
        //  debugger
        var sd=value.trim().toLocaleLowerCase()
        
            this.todaysbooked.filter = value.trim().toLocaleLowerCase()
            this.upcomingBookings.filter =  '';
            this.patientsappointments.filter = '';
            this.searchKey1 = '';
            this.searchKey2 = '';
      
    };
    addUpdateAppointments(val) {
         
        ;
        let arr = [];
        arr.push({
            AppointmentDate: val.step1.appDate,
            AppointmentTime: val.step1.appTime,
            Doctor: val.step1.docName,
            FirstName: val.step1.firstName,
          //  LastName: val.step1.lastName,
            Mobile: val.step1.mobNum,
            gender: val.step1.gender,
            Age: val.step1.age,
            Status: 7,
            ServiceName: val.step2.serviceName,
            Qty: val.step2.qty,
            Price: val.step2.serviceName,
            Discount: val.step2.disc,
            Tax: val.step2.tax,
            Action: this.action,
        });
        var UploadFile = new FormData();
        UploadFile.append('UserId', JSON.stringify(arr));
        this.patientsService.PostData(UploadFile).then(
            (data: any) => {
                ;
                if (data == 'SUCCESS') {
                } else {
                }
            },
            (err) => { }
        );
    }
    get step1(): any {
        return this.horizontalStepperForm.get('step1');
    }

    get step2(): any {
        return this.horizontalStepperForm.get('step2');
    }
    onView(val) {
                                      
        // debugger
        
        this.utilitiesService.getUserByRegistrationId(val.doctorID).subscribe(
                (response: any) => {
    
                    // const number = this.printCount;
                    this.appointmentDateWithTime = this.formatCustomDate(val.createdDate);
                    this.receiptNumber = val.receiptNo;
                    this.doctorQualification = response.qualification;
                    this.doctorDesignation = response.institution;
                    this.receiptToken=val.receiptToken;
                    this.appointmentDate=val.appointmentDate;
                    this.patientID=val.patientARCID;
                    this.patientName=val.patientName;
                    this.serviceName=val.serviceName;
                    this.modeofPayment = val.modeofPayment;
                    this.fee = val.price;
                    this.payment = val.payment;
                    this.discount = val.discount;
                    this.gender = val.gender;
                    this.age = val.age;
                    this.patientPhoneNumber = val.mobile;
                    this.doctor = val.doctor;
                    this.amountInWords = this.numberToWordsWithDecimal(parseFloat(val.payment));
                    this.editCompanyDialogRef = this.dialog.open(this.editCompanyModal);
    
                },
                (error) => {
                    console.error("❌ Error fetching details", error);
                }
            );
    
        // const number = this.printCount;

        // doctorDetails
        // this.receiptToken=val.receiptToken;
        // this.appointmentDate=val.appointmentDate;
        // this.patientID=val.patientARCID;
        // this.patientName=val.patientName;
        // this.serviceName=val.serviceName;
        // this.modeofPayment = val.modeofPayment;
        // this.fee = val.price;
        // this.payment = val.payment;
        // this.discount = val.discount;
        // this.gender = val.gender;
        // this.age = val.age;
        // this.patientPhoneNumber = val.mobile;
        // this.doctor = val.doctor;
        // this.amountInWords = this.numberToWordsWithDecimal(parseFloat(val.payment));
        // this.editCompanyDialogRef = this.dialog.open(this.editCompanyModal);

        // this.ngOnInit();
        
    }

    currentStatus: any;
    updateSelect(val) {
        //  debugger
         this.currentStatus = val.status;
        this.horizontalStepper.selectedIndex = 0;
        
        if (val.duePayment != null && val.duePayment != '0.00') {
            this.updateSelectDuePay(val)
        }
        else {
            // 
            this.isDuePay = false;
            // this.spinner.show();
            this.action = 'Update Existing Appointment';
            this.actionName = 'Update Appointment';
            this.appointmentButton = 'Update Appointment';
            this.appointID = val.appointmentID;
            this.patientID = val.patientID;
            this.appointmentId = val.appointmentID;

            const a = this.step1.controls['appDate'].setValue(new Date(val.appointmentDate));

            this.getSlotsWithDocIDEdit(val.doctorID, val.slotTime);

            this.step1.controls['docName'].setValue(val.doctorID);
            this.step1.controls['firstName'].setValue(val.patientName);
           // this.step1.controls['lastName'].setValue(val.patientLastName);
            this.step1.controls['mobNum'].setValue(val.mobile);
            this.step1.controls['age'].setValue(val.age);
            // this.step1.controls['status'].setValue(val.statusID);
            this.step1.controls['gender'].setValue(val.genderID);
            this.step2.controls['serviceName'].setValue(val.serviceID);
            this.step2.controls['price'].setValue(val.price);
            this.step2.controls['discount'].setValue(val.discountID);
            this.step2.controls['amountPaid'].setValue(val.payment);
            this.step2.controls['modeOfPayment'].setValue(val.modeofPaymentID);
            this.step1.controls['mobNum'].disable();
            
            // this.step2.controls['netPrice'].disable();
            this.nextDisabled = false;
            if (this.roleID == '1') {
                this.applyNetPrice(val);
            }

        //    this.spinner.hide();
        }
    }
    

    updateSelectDuePay(val) {
         
        // 
        this.isDuePay = true;
        this.isPriceTag = true;
        this.spinner.show();
        this.action = 'Update Existing Appointment';
        this.actionName = 'Update Appointment';
        this.appointmentButton = 'Update Appointment';
        this.appointID = val.appointmentID;
        this.patientID = val.patientID;
        this.appointmentId = val.appointmentID;

        this.step1.controls['appDate'].setValue(new Date(val.appointmentDate));

        this.getSlotsWithDocIDEdit(val.doctorID, val.slotTime);

        
        this.step1.controls['docName'].setValue(val.doctorID);
        this.step1.controls['firstName'].setValue(val.patient);
       // this.step1.controls['lastName'].setValue(val.patient);
        this.step1.controls['mobNum'].setValue(val.mobile);
        this.step1.controls['age'].setValue(val.age);
        // this.step1.controls['status'].setValue(val.statusID);
        this.step1.controls['gender'].setValue(val.genderID);
        this.step2.controls['serviceName'].setValue(val.serviceID);
        this.step2.controls['price'].setValue(val.priceID);
        this.step2.controls['discount'].setValue(val.discountID);
        this.step2.controls['amountPaid'].setValue(val.payment);
        this.step1.controls['mobNum'].disable();
        // this.step2.controls['netPrice'].disable();
        this.step2.controls['modeOfPayment'].setValue(val.modeofPaymentID);
        this.step2.controls['duePayment'].setValue(val.duePayment);
        this.nextDisabled = false;
        if (this.roleID == '1') {
            this.applyNetPrice(val);
        }
      //  this.spinner.hide();

    }

    // next(val)
    // {
    //     
    //     var slot =val.step1.slot;
    //     if(slot == 0)
    //     {
    //         alert("text");
    //     }
    // }

    Download(val){
         

    }
    loading: boolean = false;

    
    addRegisterPatientAppointment(val) {
        // debugger
         
        this.loading = true;


          
            this.appt.AppointmentID = Number(this.appointID);
            this.appt.registrationID = Number(val.step1.docName);  //
            this.appt.PatientID = Number(this.patientID);  //
            this.appt.ServiceID = Number(val.step2.serviceName);
            //this.appt.SlotID = Number(val.step1.slot.slotID);
            this.appt.Slot = (val.step1.slot.slot);
            //this.appt.StatusID = Number(val.step1.status);
            this.appt.StatusID = Number(7);
            this.appt.ServiceDate = this.datepipe.transform(val.step1.appDate, 'd MMM yyyy');
            this.appt.priceID = this.AppointmentID;
            this.appt.AppointmentBill = ('Test');  //
            this.appt.Payment = (val.step2.amountPaid);
            //var disco= ((val.step2.price * discList[0].discount)/100);
            // this.step2.controls['netPrice'].setValue(pricList[0].price - disco);
            if (this.isPriceTag == true) //SkipBilling
            {
                this.appt.modeofPaymentID = val.step2.modeOfPayment;
                //this.appt.PriceID = Number(val.step2.price);
    
                if (this.roleID == '1' || this.roleID == '3') {
                    this.appt.DiscountID = Number(val.step2.discount);
                    if (this.appt.DiscountID == 0) {
                     //   this.appt.DiscountID = 6;
    
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
    
                    // this.actualPrice = pricList[0].price;
                   // this.appt.Payment = this.actualPrice;  //
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
                this.appt.modeofPaymentID = 5;
                this.appt.PriceID = 6;
              //  this.appt.Payment = "0"; 
                this.appt.DuePayment = "0";
                this.appt.DiscountID = Number(val.step2.discount);
            }
            this.appt.Price=this.price;
            const selprice=this.allPrices.filter(price=>price.price==this.price)
            this.appt.PriceID=selprice[0].priceID
            this.appt.Action = this.action;
            this.appt.PatientName = (val.step1.firstName);  //
           // this.appt.PatientLastName = (val.step1.lastName);  //
            this.appt.Mobile = (val.step1.mobNum); //
            this.appt.GenderID = Number(val.step1.gender);
            this.appt.Age = Number(val.step1.age);
            // this.appt.PatientStatus = 'Booked' 
            this.appt.PatientStatus = this.currentStatus;
            let arr = [];
            arr.push(this.appt);
            this.receiptToken = 0;
            if(this.appt.modeofPaymentID==null){
                this.appt.modeofPaymentID=6
            }

         
            this.utilitiesService.addRegisterPatientAppointment(this.appt).subscribe((data) => {

                if (data) {

                   if (this.action === 'Update Existing Appointment') {
                        this._snackBar.open('Appointment Updated Successfully...!!', 'OK', {
                            horizontalPosition: this.horizontalPosition,
                            verticalPosition: this.verticalPosition,
                            "duration": 2000
                        });
                        
                        this.actionFormName('New Appointment');

                    } else if (data) {
                        this._snackBar.open('Appointment Added Successfully...!!', 'OK', {
                            horizontalPosition: this.horizontalPosition,
                            verticalPosition: this.verticalPosition,
                            "duration": 2000
                        });

                        this.actionFormName('New Appointment');
                    }
                    
                    this.receiptToken = data;
                    
                    this.ngOnInit(); 
                    this.appt = {};
                } else {
                    this.showError('Your query is not sent, Please try after some time');
                    console.log('DB Exception');
                }
    
        //         if (data) {
                    
        //             if (data) {
                        
        //                 this._snackBar.open('Appointment Added Successfully...!!', 'OK', {
        //                     horizontalPosition: this.horizontalPosition,
        //                     verticalPosition: this.verticalPosition,
        //                     "duration": 2000
        //                 });
        //                 this.receiptToken = data;
        //                 this.actionFormName('New Appointment')
        // // window.location.reload();
    
    
        //                 this.ngOnInit(
                           
        //                 );
        //                 this.appt = {};
        //                 // const dialogRef = this.dialog.open({
        //                 //     width: '600px',
        //                 //   });
        //             } else {
        //                 this.showError(
        //                     'Your query is not sent, Please try after some time'
        //                 );
        //                 console.log('DB Exception');
        //             }
        //         }
            },
                (error) => {
                    this.errorMessage = error;
                },
                () => { }
            );
            this.loading = false; // Hide loading spinner after 5 seconds
   

     
    }
    
   

    //Receipt Print
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

        // let printContents = document.getElementById("component1").innerHTML;
        //     let originalContents = document.body.innerHTML;

        //     document.body.innerHTML = printContents;

        //     window.print();
        //    // window.close();

        //     document.body.innerHTML = originalContents;

    }

    //Receipt Print preception
    ViewPrescption(): void {
        
        const dialogConfig = new MatDialogConfig();
        dialogConfig.restoreFocus = false;
        dialogConfig.autoFocus = false;
        dialogConfig.role = 'dialog';
        dialogConfig.disableClose = true;

        this.presecptionModalDialogRef = this.dialog.open(this.presecptionModal, dialogConfig);

        this.presecptionModalDialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed...');
        });

    }

    closeCompanyDetailsDialog() {
        this.editCompanyDialogRef.close();
        this.appointmentDrawer.close();
        //this.editCompanyDialogRef.close('Pizza!');
    }
    closePrecesptionDialog() {
        this.presecptionModalDialogRef.close();
        //this.editCompanyDialogRef.close('Pizza!');
    }
    print(cmpName) {
        // debugger

        // let printContents = document.getElementById(cmpName).innerHTML;
        // let originalContents = document.body.innerHTML;

        // document.body.innerHTML = printContents;

        // window.print();
        // window.close();

        // document.body.innerHTML = originalContents;

        // window.print();
        this.print1(cmpName);


        // var printContent = document.getElementById(cmpName);
        // var WinPrint = window.open('', '', 'width=1000,height=750');
        // WinPrint.document.write(printContent.innerHTML);
        // WinPrint.document.close();
        // WinPrint.focus();
        // WinPrint.print();
        // WinPrint.close();
        //this.ngOnInit();
        //this.editCompanyDialogRef.close();
        //return false;
    }

    printSingle() {
        //this.showHideDiv= false;
        // this.print1();
    }

    // print1(cmpName) {

    //     let printContents, popupWin;
    //     printContents = document.getElementById(cmpName).innerHTML;
    //     popupWin = window.open('', '_blank', 'top=10,left=100,height=900,width=1000');
    //     //popupWin.document.open();
    //     popupWin.document.write(`
    //   <html>
    //     <head>
    //       <style>
    //       body{  width: 99%;}
    //       /**
    //        * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
    //        */
    //        @media screen {
    //            @font-face {
    //                font-family: 'Source Sans Pro';
    //                font-style: normal;
    //                font-weight: 400;
    //                src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
    //            }
   
    //            @font-face {
    //                font-family: 'Source Sans Pro';
    //                font-style: normal;
    //                font-weight: 700;
    //                src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
    //            }
    //        }
   
    //        /**
    //        * Avoid browser level font resizing.
    //        * 1. Windows Mobile
    //        * 2. iOS / OSX
    //        */
    //        body,
    //        table,
    //        td,
    //        a {
    //            -ms-text-size-adjust: 100%; /* 1 */
    //            -webkit-text-size-adjust: 100%; /* 2 */
    //        }
   
    //        /**
    //        * Remove extra space added to tables and cells in Outlook.
    //        */
    //        table,
    //        td {
    //            mso-table-rspace: 0pt;
    //            mso-table-lspace: 0pt;
    //        }
   
    //        /**
    //        * Better fluid images in Internet Explorer.
    //        */
    //        img {
    //            -ms-interpolation-mode: bicubic;
    //        }
   
    //        /**
    //        * Remove blue links for iOS devices.
    //        */
    //        a[x-apple-data-detectors] {
    //            font-family: inherit !important;
    //            font-size: inherit !important;
    //            font-weight: inherit !important;
    //            line-height: inherit !important;
    //            color: inherit !important;
    //            text-decoration: none !important;
    //        }
   
    //        /**
    //        * Fix centering issues in Android 4.4.
    //        */
    //        div[style*="margin: 16px 0;"] {
    //            margin: 0 !important;
    //        }
   
    //        body {
    //            width: 100% !important;
    //            height: 100% !important;
    //            padding: 0 !important;
    //            margin: 0 !important;
    //        }
   
    //        /**
    //        * Collapse table borders to avoid space between cells.
    //        */
    //        table {
    //            border-collapse: collapse !important;
    //        }
   
    //        a {
    //            color: #1a82e2;
    //        }
   
    //        img {
    //            height: auto;
    //            line-height: 100%;
    //            text-decoration: none;
    //            border: 0;
    //            outline: none;
    //        }
   
    //        .heading_1 {
    //            background-color: #fff;
    //            padding: 36px 24px 0;
    //            border-top: 3px solid #d4dadf;
    //            font-family: sans-serif;
    //            font-size: 21px;
    //            font-weight: bold;
    //            letter-spacing: 0.2px;
    //        }
   
    //        .tocken_no{
    //            font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
    //    font-size: 16px;
    //    font-weight: bold;
    //        }
    //         .td_style{
    //            padding: 24px; 
    //            font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; 
    //            width: 50%;padding-bottom: 0px;
    //            padding-top: 10px;
    //        }
           
    //        .td_table{
    //            text-align: left;
    //            background-color:#D2C7BA;
    //             width:100%;
    //            padding: 12px;
    //            font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; 
    //            font-size: 16px; line-height: 24px;
    //        }
    //        .td_table1{
    //          text-align: left;
    //           width:100%;
    //            padding: 12px;
    //            font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; 
    //            font-size: 16px; line-height: 24px;
    //        }
    //        .td_table2{
    //            text-align: left; 
    //            width:50%;
    //            padding: 12px; 
    //            font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; 
    //            font-size: 16px; line-height: 24px; 
    //            border-top: 2px dashed #D2C7BA; 
    //            border-bottom: 2px dashed #D2C7BA;
    //        }
    //        .td_table3{
    //            text-align: left; 
    //            width:50%;
    //            padding: 12px; 
    //            font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; 
    //            font-size: 16px; line-height: 24px; 
    //            border-top: 2px dashed #D2C7BA; 
    //            border-bottom: 2px dashed #D2C7BA;
    //        }
    //        .Payment_row{
    //            text-align: left;
    //            background-color:#ffffff;
    //            padding: 24px; 
    //            font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; 
    //            font-size: 16px; line-height: 24px;
               
    //        }
    //        .payment_Receipt{
    //            text-align: left;
    //            background-color: #ffffff;
    //            padding: 36px 24px 0; 
    //            border-top: 3px solid #d4dadf;width:30%;
    //        }
    //        .Token_No{
    //        width: 100%; 
    //        max-width: 600px;
    //        border-top:1px solid #c1c1c1;
    //        background-color: #fff;
   
    //            }
    //            .Payment_method_bgmcolr{
    //                width: 600px;
    //                background-color: #fff;
    //            }
               
    //         //    .Adress_row{
    //         //        text-align: left;
    //         //       padding-bottom: 36px; 
    //         //        padding-left: 36px; 
    //         //        font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; 
    //         //        font-size: 16px; line-height: 24px;
    //         //    }

    //            .Adress_row {
    //                 position: absolute;
    //                 bottom: 0;
    //                 left: 0;
    //                 text-align: left;
    //                 padding-bottom: 36px;
    //                 padding-left: 36px;
    //                 font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
    //                 font-size: 16px;
    //                 line-height: 24px;
    //             }

   
    //       </style>
    //     </head>
    // <body onload="window.print();window.close()">${printContents}</body>
    //   </html>`
    //     );
    //     popupWin.document.close();

    // }

//      print1(cmpName) {
//         let printContents, popupWin;
//         printContents = document.getElementById(cmpName).innerHTML;
//         popupWin = window.open('', '_blank', 'top=10,left=100,height=900,width=1000');
//         popupWin.document.write(`
//             <html>
//                 <head>
//                     <style>
//                         body {
//                             width: 100%;
//                         }
    
//                         /**
//                          * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
//                          */
//                         @media screen {
//                             @font-face {
//                                 font-family: 'Source Sans Pro';
//                                 font-style: normal;
//                                 font-weight: 400;
//                                 src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
//                             }
    
//                             @font-face {
//                                 font-family: 'Source Sans Pro';
//                                 font-style: normal;
//                                 font-weight: 700;
//                                 src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
//                             }
//                         }
    
//                         /**
//                          * Avoid browser level font resizing.
//                          * 1. Windows Mobile
//                          * 2. iOS / OSX
//                          */
//                         body,
//                         table,
//                         td,
//                         a {
//                             -ms-text-size-adjust: 100%; /* 1 */
//                             -webkit-text-size-adjust: 100%; /* 2 */
//                         }
    
//                         /**
//                          * Remove extra space added to tables and cells in Outlook.
//                          */
//                         table,
//                         td {
//                             mso-table-rspace: 0pt;
//                             mso-table-lspace: 0pt;
//                         }
    
//                         /**
//                          * Better fluid images in Internet Explorer.
//                          */
//                         img {
//                             -ms-interpolation-mode: bicubic;
//                         }
    
//                         /**
//                          * Remove blue links for iOS devices.
//                          */
//                         a[x-apple-data-detectors] {
//                             font-family: inherit !important;
//                             font-size: inherit !important;
//                             font-weight: inherit !important;
//                             line-height: inherit !important;
//                             color: inherit !important;
//                             text-decoration: none !important;
//                         }
    
//                         /**
//                          * Fix centering issues in Android 4.4.
//                          */
//                         div[style*="margin: 16px 0;"] {
//                             margin: 0 !important;
//                         }
    
//                         body {
//                             width: 100% !important;
//                             height: 100% !important;
//                             padding: 0 !important;
//                             margin: 0 !important;
//                         }
    
//                         /**
//                          * Collapse table borders to avoid space between cells.
//                          */
//                         table {
//                             border-collapse: collapse !important;
//                         }
    
//                         a {
//                             color: #1a82e2;
//                         }
    
//                         img {
//                             height: auto;
//                             line-height: 100%;
//                             text-decoration: none;
//                             border: 0;
//                             outline: none;
//                         }
    
//                         .heading_1 {
//                             background-color: #fff;
//                             padding: 36px 24px 0;
//                             font-family: sans-serif;
//                             font-size: 20px;
//                             font-weight: bold;
//                             letter-spacing: 0.2px;
//                             border-bottom: 3px solid #d4dadf;

//                         }
    
//                         .tocken_no {
//                             font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
//                             font-size: 16px;
//                             font-weight: bold;
//                         }
    
//                         // .td_style {
//                         //     padding: 24px;
//                         //     font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
//                         //     width: 50%;
//                         //     padding-bottom: 0px;
//                         //     padding-top: 10px;
//                         // }


//                                  .td_style {
//                                     padding: 24px;
//                                     font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
//                                     width: 50%;
//                                     padding-bottom: 0px;
//                                     padding-top: 10px;
//                                 }

//                                 .td_style span {
//                                     display: inline-block;
//                                     vertical-align: middle;
//                                 }



    
//                         .td_table {
//                             text-align: left;
//                             background-color: #d2c7ba;
//                             width: 100%;
//                             padding: 12px;
//                             font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
//                             font-size: 16px;
//                             line-height: 24px;
//                             border-top: 2px dashed #d2c7ba;

//                         }
    
//                         .td_table1 {
//                             text-align: left;
//                             width: 100%;
//                             max-width:100%
//                             padding: 12px;
//                             font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
//                             font-size: 16px;
//                             line-height: 24px;
//                         }
    
//                         .td_table2 {
//                             text-align: left;
//                             width: 50%;
//                             padding: 12px;
//                             font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
//                             font-size: 16px;
//                             line-height: 24px;
//                             // border-top: 2px dashed #d2c7ba;
//                             border-bottom: 2px dashed #d2c7ba;
//                         }
    
//                         .td_table3 {
//                             text-align: left;
//                             width: 50%;
//                             padding: 12px;
//                             font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
//                             font-size: 16px;
//                             line-height: 24px;
//                             border-top: 2px dashed #d2c7ba;
//                             border-bottom: 2px dashed #d2c7ba;
//                         }
    
//                         .Payment_row {
//                             text-align: left;
//                             background-color: #ffffff;
//                             padding: 24px;
//                             font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
//                             font-size: 16px;
//                             line-height: 24px;
//                         }
    
//                         .payment_Receipt {
//                             text-align: left;
//                             background-color: #ffffff;
//                             padding: 36px 24px 0;
//                             width: 35%;
//                             border-bottom: 3px solid #d4dadf;

//                         }
    
//                         .Token_No {
//                             width: 100%;
//                             max-width: 100%;
//                             margin-top: 20px;
//                             background-color: #fff;
//                         }
    
//                         .Payment_method_bgmcolr {
//                             width: 100%;
//                             background-color: #fff;
//                         }
    
//                         .Adress_row {
//     width: 100% !important; /* Ensure full width */
//     margin-top: 30px !important;  /* Space above */
//     padding-left: 36px !important;
//     padding-right: 36px !important;
//     border-top: 3px solid #d4dadf !important;
//     font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
//     font-size: 16px;
//     line-height: 24px;
//     background-color: #fff !important;
//     box-sizing: border-box !important; /* Prevent padding from affecting width */
//     padding-bottom: 36px !important; /* Add some padding to the bottom if needed */
//     text-align: right !important;  /* Align text to the right */
// }

//                     </style>
//                 </head>
//                 <body onload="window.print();window.close()">
//                     ${printContents}
                   
//                 </body>
//             </html>
//         `);
//         popupWin.document.close();
//     }
    


// print1(cmpName: string): void {
//     const printContents = document.getElementById(cmpName)?.innerHTML;
  
//     if (!printContents) {
//       console.error('Component not found:', cmpName);
//       return;
//     }
  
//     const popupWin = window.open('', '_blank', 'top=10,left=100,height=900,width=1000');
//     if (!popupWin) {
//       console.error('Popup window failed to open.');
//       return;
//     }
  
//     popupWin.document.write(`
//       <html>
//         <head>
//           <style>
//             body {
//               font-family: 'Arial', sans-serif;
//               margin: 0;
//               padding: 0;
//               background-color: #fff;
//               color: #000;
//             }
  
//             .receipt-container {
//               width: 750px;
//               margin: auto;
//               padding: 20px;
//               border: 1px solid #ddd;
//               box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
//             }
  
//             .header {
//               display: flex;
//               justify-content: space-between;
//               align-items: flex-start;
//               border-bottom: 2px solid #e65c3b;
//               padding-bottom: 10px;
//             }
  
//             .logo {
//               display: flex;
//               flex-direction: column;
//               justify-content: center;
//             }
  
//             .logo img {
//               width: 50px;
//               margin-bottom: 5px;
//             }
  
//             .title {
//               font-size: 22px;
//               font-weight: bold;
//               color: #333;
//             }
  
//             .clinic-info {
//               text-align: right;
//               font-size: 14px;
//             }
  
//             .section {
//               margin-top: 20px;
//             }
  
//             .section-title {
//               font-weight: bold;
//               text-transform: uppercase;
//               margin-bottom: 10px;
//               font-size: 14px;
//               color: #888;
//             }
  
//             .info-row {
//               display: flex;
//               justify-content: space-between;
//               font-size: 16px;
//               margin-bottom: 5px;
//             }
  
//             .table {
//               width: 100%;
//               border-collapse: collapse;
//               margin-top: 15px;
//             }
  
//             .table th,
//             .table td {
//               border-bottom: 1px dashed #ccc;
//               padding: 10px;
//               text-align: left;
//               font-size: 15px;
//             }
  
//             .table th {
//               background-color: #f5f5f5;
//             }
  
//             .paid-stamp {
//               float: right;
//               margin-top: 20px;
//               width: 120px;
//             }
  
//             .footer {
//               text-align: center;
//               font-size: 12px;
//               color: #777;
//               margin-top: 30px;
//             }
  
//             .contact {
//               font-size: 14px;
//               margin-top: 10px;
//             }
//           </style>
//         </head>
//         <body onload="window.print(); window.close();">
//           <div class="receipt-container">
//             ${printContents}
//           </div>
//         </body>
//       </html>
//     `);
  
//     popupWin.document.close();
//   }

// printCount: number = 1;

print1(cmpName: string): void {
    // debugger

    this.closeCompanyDetailsDialog();

    const printContents = document.getElementById(cmpName)?.innerHTML;
  
    if (!printContents) {
      console.error('Component not found:', cmpName);
      return;
    }
  
    const popupWin = window.open('', '_blank', 'top=10,left=100,height=900,width=1000');
    if (!popupWin) {
      console.error('Popup window failed to open.');
      return;
    }
  
    popupWin.document.write(`
      <html>
        <head>
          <style>
          body {
              font-family: 'Arial', sans-serif;
              margin: 0;
              padding: 0;
              background-color: #fff;
              color: black;
            }
            .receipt-fieldset {
              padding: 20px;
              font-family: 'Segoe UI', sans-serif;
              background: white;
              border: none;
            }
  
            .receipt-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              border-bottom: 2px solid #ff6f3b;
            }
  
            .logo-container {
                width: 40%;
            }
  
            .clinic-logo {
                width: 100%;
                max-height: 115px;
                object-fit: contain;
            }
  
            .doctor-info {
              width: 75%;
              text-align: right;
              font-size: 13px;
              color: #333;
            }
  
            .doctor-name {
              font-weight: bold;
              margin-bottom: 0;
              font-size: 120%;
            }
  
            .designation {
              margin: 2px 0;
            }
  
            .address {
              line-height: 1.3;
              font-size: medium;
              font-weight:500;
              color: black;
            }
  
            .close-icon {
              position: absolute;
              right: 15px;
              top: 15px;
              cursor: pointer;
              color: #999;
            }
  
            .receipt-metadata {
              display: flex;
              justify-content: space-between;
              font-weight: 400;
              font-size: 16px;
            }

            .receiptToken-metadata {
              text-align: right; 
              margin-right: 25px; 
              color: black;
            }
  
            .patient-details {
              font-size: 16px;
              font-weight:400;
              color: black;
            }
  
            .patient-name {
              font-weight:bold;
              font-size:medium;
            }

            .patient-info {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                width: 100%;
                margin-top: 5%;
            }

  
            .receipt-table {
              border-collapse: collapse;
              width: 100%;
              margin-top: 10px;
              margin-bottom: 20px;
              font-size: medium;
            }
  
            .receipt-table th {
              border: none;
              padding: 4px 4px;
              text-align: left;
              font-weight: 400;
            }

            .receipt-table td {
                 border: none;
                 padding: 4px 4px;
                 text-align: left;
                 font-weight: bold;
                 color: black;
            }
  
            .receipt-table th {
              background-color: #f3f3f3;
            }
  
            .payment-info {
              font-size: medium;
              color: black;
            }
  
            .footer-contact {
              font-size: medium;
              color: black;
            }

            .stamp {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            width: 100%;
            }
  
            .paid-stamp {
                text-align: right;
                margin-top: -7%;
                margin-right: 5%;
            }
  
            .paid-stamp img {
              width: 100px;
              height: auto;
            }
  
            .footer-note {
                margin-top: 6px;
                font-size: 12px;
                color: black;
                text-align: center;
                border-top: 2px solid #777;
            }
              @media print {
                .hide-on-print {
                display: none !important;
                    }
                }

            .pay_recp {
                text-align: center;
                color: black;
            }

              .date_time {
               text-align: center;
               font-size: small;
            } 

          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="receipt-fieldset">
            ${printContents}
          </div>
        </body>
      </html>
    `);
  
    popupWin.document.close();
      // Increment print count
        // this.printCount++;
        // localStorage.setItem('printCount', this.printCount.toString());
        // console.log(`Receipt has been printed ${this.printCount} times.`);

  }
  
  

  
    
    
    toggle() {
        this.showHideDiv = !this.showHideDiv;
    }

    printPresecption(cmpName) {
        let printContents, popupWin;
        printContents = document.getElementById(cmpName).innerHTML;
        popupWin = window.open('', '_blank', 'top=10,left=100,height=900,width=1000');
        popupWin.document.write(`
        <html>
          <head>
            <style>
            body{  width: 99%;}
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
                 border-top: 3px solid #d4dadf;
                 font-family: sans-serif;
                 font-size: 21px;
                 font-weight: bold;
                 letter-spacing: 0.2px;
             }
     
             .tocken_no{
                 font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
         font-size: 16px;
         font-weight: bold;
             }
              .td_style{
                 padding: 20px; 
                 font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; 
                 width: 50%;padding-bottom: 0px;
                 padding-top: 10px;
             }
             
             .td_table{
                 text-align: left;
                 background-color:#D2C7BA;
                  width:100%;
                 padding: 12px;
                 font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; 
                 font-size: 16px; line-height: 24px;
             }
             .td_table1{
               text-align: left;
                width:100%;
                 padding: 12px;
                 font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; 
                 font-size: 16px; line-height: 24px;
             }
             .td_table2{
                 text-align: left; 
                 width:50%;
                 padding: 10px; 
                 font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; 
                 font-size: 16px; line-height: 24px; 
                 border-top: 2px dashed #D2C7BA; 
                 border-bottom: 2px dashed #D2C7BA;
             }
             .td_table3{
                 text-align: left; 
                 width:50%;
                 padding: 12px; 
                 font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; 
                 font-size: 16px; line-height: 24px; 
                 border-top: 2px dashed #D2C7BA; 
                 border-bottom: 2px dashed #D2C7BA;
             }
             .Payment_row{
                 text-align: left;
                 background-color:#ffffff;
                 padding: 24px; 
                 font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; 
                 font-size: 16px; line-height: 24px;
                 
             }
             .payment_Receipt{
                 text-align: left;
                 background-color: #ffffff;
                 padding: 36px 24px 0; 
                 border-top: 3px solid #d4dadf;width:30%;
             }
             .Token_No{
             width: 100%; 
             max-width: 100%;
             border-top:1px solid #c1c1c1;
             background-color: #fff;
     
                 }
                 .Payment_method_bgmcolr{
                     width: 600px;
                     background-color: #fff;
                 }
                 
                //  .Adress_row{
                //      text-align: left;
                //     padding-bottom: 36px; 
                //      padding-left: 36px; 
                //      font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; 
                //      font-size: 16px; line-height: 24px;
                //  }

                 .Adress_row {
                            position: fixed;
                            bottom: 0;
                            left: 0;
                            width: 100%;
                            text-align: left;
                            padding-bottom: 36px;
                            padding-left: 36px;
                            font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                            font-size: 16px;
                            line-height: 24px;
                        }
     
            </style>
          </head>
      <body onload="window.print();window.close()">${printContents}</body>
        </html>`
        );
        popupWin.document.close();

    }


    searchPatient(val) {
         
        if (this.actionName == 'New Appointment') {
            this.applyFilter(val);
        }
        else if (this.actionName == 'Update Appointment') {
            let details = this.patients.filter(
                (a) => a.mobile == val && a.appointmentID != val.appointmentID
            );
            if (details.length > 0) {
                this.mobNoAlreadyExists = true;
                this.step1.controls['mobNum'].setValue();
            }
        }
    }

    // deleteAppointment(val) {

    //     this.spinner.show();
    //     this.appt.AppointmentID = Number(val.appointmentID);
    //     this.utilitiesService.deleteAppointment(this.appt).subscribe((data) => {
    //         if (data) {
    //             var c = data;
    //             this._snackBar.open('Appointment Deleted Successfully...!!', '', {
    //                 "duration": 2000
    //             });
    //             this.spinner.hide();
    //             this.getAllAppointments();

    //         }
    //     },
    //         (error) => {
    //             this.spinner.hide();
    //             this.errorMessage = error;
    //         },

    //         () => { this.spinner.hide(); }
    //     );
    // }

    deleteAppointment(val) {
        // Show confirmation dialog
        if (confirm('Are you sure you want to delete this appointment?')) {
            this.spinner.show();
            this.appt.AppointmentID = Number(val.appointmentID);
            this.utilitiesService.deleteAppointment(this.appt).subscribe((data) => {
                if (data) {
                    var c = data;
                    this._snackBar.open('Appointment Deleted Successfully...!!', '', {
                        duration: 2000
                    });
                    this.spinner.hide();
                    this.getAllAppointmentsnew();
                }
            },
            (error) => {
                this.spinner.hide();
                this.errorMessage = error;
            },
            () => { 
                this.spinner.hide(); 
            });
        }
    }
    

    showError(msg) {
        this.toastService.show(msg, {
            classname: 'bg-info text-light',
            delay: 4000,
            autohide: true,
            headertext: 'Appointment Details!',
        });
    }


    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

   

    //==================Code related to Vitals======================//

    createItem(): FormGroup {
        return this._formBuilder.group({
            Image: ['', Validators.required],
            fileName: ['', Validators.required],
            docType: ['', Validators.required],
        });
    }

    createItem1(): FormGroup {
        return this._formBuilder.group({
            Image: ['', Validators.required],
            fileName: ['', Validators.required],
            docType: ['', Validators.required],
        });
    }
    createMedicationItem(): FormGroup {

        return this._formBuilder.group({
            medicine: ['',],
            medicine1 :['',],
            dose: ['', ],
            when: ['', ],
            frequencyListMedication:['', ],
            duration: ['', ],
            notes:['', ],
        });
       
    }
    createMedicationItem1(): FormGroup {

        return this._formBuilder.group({
            medicine: [''],
            medicine1: [''],
            dose: [''],
            when: [''],
            frequencyListMedication: [''],
            duration: [''],
            notes: ['']
        });
    }

    addItem(): void {
        
        this.items = this.vitalsForm.get('items') as FormArray;
        this.items.push(this.createItem1());
    }
ngOnChanges(changes: SimpleChanges): void {

    
}
change(){

}   
    addMedicationItem(): void {
         
        this.formfields=true;
       
         this.medicationitems = this.vitalsForm.get('medicationitems') as FormArray;
         this.medicationitems.push(this.createMedicationItem());
         this.applyFilters("");
         this.change();
        // medicationitems1.push(
        //     this._formBuilder.group({
        //         medicine:new FormControl(),
        //         dose: new FormControl(),
        //         when: new FormControl(),
        //         frequencyListMedication: new FormControl(),
        //         duration: new FormControl(),
        //         notes: new FormControl(''),
        //     })
        // );

    }


    get employees(): FormArray {
        
        return this.vitalsForm.get('items') as FormArray;
    }

    DeleteItem(idx: number) {
         
        if (idx !>= 0) {
            this.items.removeAt(idx);
        }
    }
  
    confirmDelete(idx: number) {
        const confirmDeletion = confirm("Are you sure you want to delete this medication item?");
        if (confirmDeletion) {
            this.DeleteMedicationItem(idx);
        }
    }
    
    DeleteMedicationItem(idx: number) {
        if (idx != 0) {
            this.medicationitems.removeAt(idx);
        }
    }
    
    // DeleteMedicationItem(idx: number) {
    //      
    //     if (idx != 0) {
    //         this.medicationitems.removeAt(idx);
    //     }
    // }
    closePresceptionDetailsDialog(){
       for(var i=0;i<=this.medicationitems.length;i++){
        this.medicationitems.removeAt(i);

       }
    //    this.medicationitems = this.vitalsForm.get('medicationitems') as FormArray;
    //    this.medicationitems.push(this.createMedicationItem());

       // this.medicationitems= this._formBuilder.array([this.createMedicationItem()]);
       
    }
    validatepri1(e: any) {
        let input;
        input = String.fromCharCode(e.which);
        return !!/[0-9]/.test(input);
    }

    rowData(val) {

        this.patientName = val.patient + " " + "(" + val.gender + ", Age " + val.age + ")"
        this.vitalsForm.reset();
        this.fruits = [];
        this.flag = '1'
        this.PatientID = val.patientID;
        this.AppointmentID = val.appointmentID;
        this.vitalsID = 0;
        
        this.items = this.vitalsForm.get('items') as FormArray;
        this.medicationitems = this.vitalsForm.get('medicationitems') as FormArray;
        const arr = <FormArray>this.vitalsForm.controls.items;
        arr.controls = [];
        const arr1 = <FormArray>this.vitalsForm.controls.medicationitems;
        arr1.controls = [];
       // this.addItem();
        this.addMedicationItem();
    }
    vitalsCrud() {
        this.flag = '4'
        let arr = [];
        arr.push({ flag: Number(this.flag) })
        var url = 'PatientsAppointments/VitalsCRUD/';
        this.utilitiesService.CRUD(arr, url).subscribe(
            (data) => {
                if (data) {

                    this.vitalsList = data;
                    this.vitals = data;
                } else {
                }
            },

            () => { }
        );
    }
    getDocs() {
        this.flag = '4'
        let arr = [];
        arr.push({ flag: Number(this.flag) })
        var url = 'PatientsAppointments/DocsCrud/';
        this.utilitiesService.CRUD(arr, url).subscribe(
            (data) => {
                if (data) {

                    this.docs = data;
                    this.docsList = data;

                } else {
                }
            },

            () => { }
        );
    }

    //     changeDetected(val)
    //     {
    // 
    //         var s=0;
    //         // if(val ==0)
    //         // {
    //         //     // this.horizontalStepperForm.setErrors({
    //         //     //     invalid: true,
    //         //     //   });
    //         // }
    //     }

    getTimeChange(val) {

        if (val == "No Slots Available") {
            this.isNoSlot = true;
        }
        else {
            this.isNoSlot = false;
        }
    }
    // onDateChanged(event: any) {
    //     // Handle the date change event here
    //     const selectedDate = event.value; // The selected date
    //     console.log('Selected Date:', selectedDate);
    //     this.getSlotsWithDocID(this.doctrids)
    //     // Add your logic here to respond to the date change
    //     // For example, you can update other properties or perform actions.
    //   }
      onDateChanged(event: any) {
        const selectedDate = event.value; // The selected date
    console.log('Selected Date:', selectedDate);
    this.selectedDate = selectedDate; // Store the selected date
    this.getSlotsWithDocID(this.doctrids); 
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
// getSlotsWithDocID(val) {
//      ;
//     this.doctrids = val;
//     const selectedDate = this.selectedDate;
//     this.doctrids = val;
//     this.selectedDate = this.step1.get('appDate').value;
//     var d = new Date(this.selectedDate);
//     var n = d.getDay();

//     const hours = d.getHours().toString().padStart(2, '0');
//     const minutes = d.getMinutes().toString().padStart(2, '0');
//     const seconds = d.getSeconds().toString().padStart(2, '0');

//     // Create a formatted time string
//     this.currentTimes = `${hours}:${minutes}:${seconds}`;

//     let arr = [];
//     arr.push({
//         DoctorID: val
//     });

//     var url = 'PatientsAppointments/DoctorsAvailabilitySlots/';

//     this.utilitiesService.addUpdateVitals(arr, url).subscribe(
//         (data) => {
//             if (data) {
//                  ;
//                 this.slotsArr = data;
//                 if (this.slotsArr.length === 0) {
//                     this.slotsArr.push({ day: 7, rowid: 0, doctorid: 0, slot: 'No Slots Available' });
//                     this.step1.controls['slot'].setValue(this.slotsArr[0]);
//                     this.isNoSlot = true;
//                 } else {
//                     let selDate = this.datepipe.transform(this.selectedDate, 'dd MMM yyyy');
//                     let docAppointmentsOnSelectedDate = this.allAppointments.filter(a => a.doctorID == val && this.datepipe.transform(a.serviceDate, 'dd MMM yyyy') == selDate);
//                     let dayOfWeekNumber = d.getDay();

//                     // Filter out slots that are already booked
//                     for (let i = this.slotsArr.length - 1; i >= 0; i--) {
//                         if (dayOfWeekNumber === 0) {
//                             dayOfWeekNumber = 7;
//                         }
//                         if (i === 0) {
//                             if (dayOfWeekNumber !== this.slotsArr[0].day) {
//                                 this.slotsArr.splice(0, 1);
//                             }
//                         } else {
//                             if (dayOfWeekNumber !== this.slotsArr[i - 1].day) {
//                                 this.slotsArr.splice(i, 1);
//                             } else {
//                                 if (docAppointmentsOnSelectedDate.some(e => e.slotTime === this.slotsArr[i].slot)) {
//                                     this.slotsArr.splice(i, 1);
//                                 }
//                             }
//                         }
//                     }

//                     // Check if there are available slots after filtering
                
//                     if (this.slotsArr.length === 0) {
//                         this.slotsArr.push({ day: 7, rowid: 0, doctorid: 0, slot: 'No Slots Available' });
//                         this.step1.controls['slot'].setValue(this.slotsArr[0]);
//                         this.isNoSlot = true;
//                     } else {
//                         this.isNoSlot = false;
//                     }
//                 }
//             } else {
//                 // Handle the case where data is not available
//             }
//         },
//         (error) => {
//             // Handle the error case
//         }
//     );
// }


    getSlotsWithDocIDEdit(val, slotTime) {

        this.selectedDate = this.step1.get('appDate').value
        var d = new Date(this.selectedDate);
        var n = d.getDay();
        let arr = [];
        arr.push({
            DoctorID: val
        })
        var url = 'PatientsAppointments/DoctorsAvailabilitySlots/';
        this.utilitiesService.addUpdateVitals(arr, url).subscribe(
            (data) => {
                if (data) {
 
                    this.slotsArr = data;
                    if (this.slotsArr.length == 0) {
                        //this.slotsArr[0].slot="No Slot";
                        this.slotsArr.push({ day: 7, rowid: 0, doctorid: 0, slot: 'No Slots Available' });
                        this.step1.controls['slot'].setValue(this.slotsArr[0]);
                        //  this.horizontalStepperForm.setErrors({
                        //                 invalid: true,
                        //              });
                        this.isNoSlot = true;
                    }
                    else {
                        let selDate = this.datepipe.transform(this.selectedDate, 'dd MMM yyyy');
                        //let docAppointmentsOnSelectedDate = this.allAppointments.filter(a => a.doctorID == val && this.datepipe.transform(a.serviceDate, 'dd MMM yyyy') == selDate)
                        //  for (var i = 0; i < this.slotsArr.length; i++) {
                        //      if (docAppointmentsOnSelectedDate.some(e => e.slotTime === this.slotsArr[i].slot)) {
                        //          this.slotsArr.splice(i, 1);
                        //      }
                        //  }
                        let sl = this.slotsArr.filter(a => a.slot == slotTime)
                        this.step1.controls['slot'].setValue(sl[0]);

                    }
                }
                else {


                }
            },

            () => { }
        );
    }

   
    

//    bindMobileNo(){
        

//         // this.horizontalStepperForm.step1.mobNum.setValue(this.searchKey3)
//         this.step1.controls['mobNum'].setValue(this.searchKey3);
//         // this.horizontalStepperForm.controls.step1['mobNum'].setValue(this.searchKey3);
//         //this.horizontalStepperForm.value.step1.mobNum=this.searchKey3
//     }

    getComplaints() {
        this.flag = '4'
        let arr = [];
        arr.push({ flag: Number(this.flag) })
        var url = 'PatientsAppointments/ComplaintsCrud/';
        this.utilitiesService.CRUD(arr, url).subscribe(
            (data) => {
                if (data) {

                    this.complaints = data;
                    this.complaintsList = data;
                } else {
                }
            },

            () => { }
        );
    }
    getVisitReason() {
        this.flag = '4'
        let arr = [];
        arr.push({ flag: Number(this.flag) })
        var url = 'PatientsAppointments/VisitReason_Crud/';
        this.utilitiesService.CRUD(arr, url).subscribe(
            (data) => {
                if (data) {

                    this.visitReason = data;
                    this.visitReasonList = data;
                } else {
                }
            },

            () => { }
        );
    }
    // addUpdateVitals(val) {

    //     let itemArr = [];
    //     for (var i = 0; i < val.items.length; i++) {
    //         if (val.items[i].docType != null) {
    //             itemArr.push({
    //                 AppointmentID: this.AppointmentID,
    //                  //DocumentTypeID: val.items[i].docType.documentTypeID,

    //                  DocumentTypeID: val.items[i].docType,


    //                 //  , DocTypeNAme: val.items[i].Image
    //                  DocTypeNAme: "VitalsDocs\\" + val.items[i].fileName.split("\\").pop()
    //             });
    //         }
    //         else {
    //             itemArr.push({
    //                 AppointmentID: this.AppointmentID,
    //                 // DocumentTypeID: undefined,
    //                 DocumentTypeID:  val.items[i].docType,
    //                 //  , DocTypeNAme: val.items[i].Image
    //                  DocTypeNAme: "VitalsDocs\\"
    //             });
    //         }
    //     }
    //     let medicationArr = [];
        
    //     for (var i = 0; i < val.medicationitems.length; i++) {

    //         medicationArr.push({
    //             vitalsID: this.AppointmentID
    //             , medicine: val.medicationitems[i].medicine
    //             , dose: val.medicationitems[i].dose
    //             , when: val.medicationitems[i].when
    //             , frequencyListMedication: val.medicationitems[i].frequencyListMedication
    //             , duration: val.medicationitems[i].duration
    //             , notes: val.medicationitems[i].notes,

               

                
    //         });
    //     }

    //     let compArr = [];
    //     for (var i = 0; i < this.fruits.length; i++) {
    //         compArr.push({ ComplaintName: this.fruits[i] })
    //     }
    //     var DoctorCompleted = 0;
    //     var Status = '';
    //     if (this.roleID == 2) {
    //         DoctorCompleted = 1;
    //         Status = 'Completed';
    //     }
    //     else if (this.roleID == 5) {
    //         Status = 'Arrived';
    //     }
    //     let arr = [];
    //     arr.push({
    //         flag: Number(this.flag)
    //         , VitalsID: Number(this.vitalsID)
    //         , BMI: val.BMI
    //         , SpO2: val.SpO2
    //         , BloodGroup: val.bloodGroup
    //         , BP: val.bloodPressure
    //         , Pulse: val.pulse
    //         , Serum_Creatinine: val.serumCreatinine
    //         , Temperature_F: val.temp
    //         , VisitReasonID: Number(val.visitReason)
    //         , DoctorCompleted: Number(DoctorCompleted)
    //         , Weight: val.weight
    //         , comp: compArr
    //         , medicine: medicationArr
    //         , PatientID: Number(this.PatientID)
    //         , AppointmentID: Number(this.AppointmentID)
    //         , vitalDocs: itemArr
    //         , advice: val.advice
    //         , nextVisit: val.nextVisit
    //         , frequency: val.frequency
    //         , pickADate: val.pickADate
    //         , status: Status
    //     })
    //     var url = 'PatientsAppointments/VitalsCRUD/';
    //     this.utilitiesService.addUpdateVitals(arr, url).subscribe(
    //         //this.utilitiesService.CRUD(arr, url).subscribe(
    //         (data) => {
    //             if (data == '1') {

    //                // 
    //                // this.Screen = 1;
    //                 // this.detailData.vitalId = this.afterSaveVitalId;
    //                 // this.onRowClicked(this.detailData)
    //                 this.fruits = [];
    //                 this._snackBar.open('Submitted Successfully...!!', 'ok', {
    //                     horizontalPosition: this.horizontalPosition,
    //                     verticalPosition: this.verticalPosition,
    //                     "duration": 2000,
    //                 });
    //                // this.getAllAppointmentsAfterSAve();
    //                 this.Screen = 1;
    //                 this.ngOnInit();
                  
    //             }
    //             else {

    //             }
    //         },

    //         () => { }
    //     );
    // }
    
    uploadFileNull:boolean=false
    addUpdateVitals(val) {
         
        this.loading=true
        setTimeout(() => {
        this.uploadFileNull=false
        let itemArr = [];
        for (var i = 0; i < val.items.length; i++) {
        //    if (val.items[i].docType != null ) {
           if (val.items[i].fileName != null && val.items[i].fileName != "") {
                itemArr.push({
                    AppointmentID: this.AppointmentID,
                     //DocumentTypeID: val.items[i].docType.documentTypeID,

                     DocumentTypeID: val.items[i].docType,


                    //  , DocTypeNAme: val.items[i].Image
                     DocTypeNAme: "VitalsDocs\\" + val.items[i].fileName.split("\\").pop()
                });
            }
            // else if(val.items[i].docType == null && val.items[i].fileName == null ) {
            //     this.uploadFileNull=true
               
            // }
            else if((val.items[i].docType == null || val.items[i].docType == "") && 
        (val.items[i].fileName == null || val.items[i].fileName == "")) {
    this.uploadFileNull = false;
    let itemArr = [];
}
            else if(val.items[i].docType == null && val.items[i].fileName != null ) {
                itemArr.push({
                    AppointmentID: this.AppointmentID,
                     //DocumentTypeID: val.items[i].docType.documentTypeID,

                     DocumentTypeID: "",


                    //  , DocTypeNAme: val.items[i].Image
                     DocTypeNAme: "VitalsDocs\\" + val.items[i].fileName.split("\\").pop()
                });
            }
        }
        let medicationArr = [];
        
        for (var i = 0; i < val.medicationitems.length; i++) {

            medicationArr.push({
                vitalsID: this.AppointmentID
                , medicine: val.medicationitems[i].medicine
                , dose: val.medicationitems[i].dose
                , when: val.medicationitems[i].when
                , frequencyListMedication: val.medicationitems[i].frequencyListMedication
                , duration: val.medicationitems[i].duration
                , notes: val.medicationitems[i].notes,

               

                
            });
        }

        let compArr = [];
        for (var i = 0; i < this.fruits.length; i++) {
            compArr.push({ ComplaintName: this.fruits[i] })
        }
        var DoctorCompleted = 0;
        var Status = '';
        if (this.roleID == 2) {
            DoctorCompleted = 1;
            Status = 'Completed';
        }
        else if (this.roleID == 5) {
            Status = 'In Progress';
        }
        let arr = [];
        arr.push({
            flag: Number(this.flag)
            , VitalsID: Number(this.vitalsID)
            , BMI: val.BMI
            , SpO2: val.SpO2
            , BloodGroup: val.bloodGroup
            , BP: val.bloodPressure
            , Pulse: val.pulse
            , Serum_Creatinine: val.serumCreatinine
            , Temperature_F: val.temp
            , VisitReasonID: Number(val.visitReason)
            , DoctorCompleted: Number(DoctorCompleted)
            , Weight: val.weight
            , comp: compArr
            , medicine: medicationArr
            , PatientID: Number(this.PatientID)
            , AppointmentID: Number(this.AppointmentID)
            , vitalDocs: itemArr
            , advice: val.advice
            , nextVisit: val.nextVisit
            , frequency: val.frequency
            , pickADate: val.pickADate
            , status: Status
        })
        var url = 'PatientsAppointments/VitalsCRUD/';
        if(!this.uploadFileNull){
        this.utilitiesService.addUpdateVitals(arr, url).subscribe(
            //this.utilitiesService.CRUD(arr, url).subscribe(
            (data) => {
                if (data == '1') {

                   // 
                   // this.Screen = 1;
                    // this.detailData.vitalId = this.afterSaveVitalId;
                    // this.onRowClicked(this.detailData)
                    this.fruits = [];
                    this._snackBar.open('Submitted Successfully...!!', 'ok', {
                        horizontalPosition: this.horizontalPosition,
                        verticalPosition: this.verticalPosition,
                        "duration": 2000,
                    });
                    this.vitalsDrawer.close();
                   // this.getAllAppointmentsAfterSAve();
                   this.loading=false
                    this.Screen = 1;
                    this.ngOnInit();
                  
                }
                else {

                }
            },

            () => { }
        );
        }
        this.loading = false;
    }, 1000);

    }

    setValues(val) {
         
        
                this.patientName = val.patient + " " + "(" + val.gender + ", Age " + val.age + ")"
                this.flag = '2';
                this.vitalsID = val.vitalsID;
                this.PatientID = val.patientID;
                this.AppointmentID = val.appointmentID;
                this.advice = val.advice;
                this.nextvisit = val.nextVisit;
        
                this.GetComplaintsXML();
                this.GetDocumentsXML();
                this.GetMedicineXML();
                this.vitals = this.vitalsList.filter(a => a.vitalsID === this.vitalsID);
                if (this.vitals.length > 0) {
                    
                    this.vitalsForm.controls['weight'].setValue(this.vitals[0].weight)
                    this.vitalsForm.controls['bloodGroup'].setValue(this.vitals[0].bloodGroup)
                    this.vitalsForm.controls['temp'].setValue(this.vitals[0].temperature_F)
                    this.vitalsForm.controls['serumCreatinine'].setValue(this.vitals[0].serum_Creatinine)
                    this.vitalsForm.controls['bloodPressure'].setValue(this.vitals[0].bp)
                    this.vitalsForm.controls['pulse'].setValue(this.vitals[0].pulse)
                    this.vitalsForm.controls['SpO2'].setValue(this.vitals[0].spO2)
                    this.vitalsForm.controls['BMI'].setValue(this.vitals[0].bmi)
                    this.vitalsForm.controls['visitReason'].setValue(this.vitals[0].visitReasonID)
                    this.vitalsForm.controls['advice'].setValue(this.vitals[0].advice)
                    this.vitalsForm.controls['nextVisit'].setValue(this.vitals[0].nextVisit)
                    this.vitalsForm.controls['pickADate'].setValue(this.vitals[0].pickADate)
                    this.vitalsForm.controls['frequency'].setValue(this.vitals[0].frequency)
                  
        
                }
            }

    getAllAppointmentsAfterSAve() {
         
        // this.spinner.show();
        // this.utilitiesService.getAllAppointments().subscribe(
        //     (data) => {
        //         if (data) {
        //             this.allAppointments = data;
        //             if (this.detailData)
        //                 this.afterSaveVitalId = this.allAppointments.filter((a) => a.appointmentID == this.detailData.appointmentID).vitalsID;
        //             this.date = new Date();
        //             this.date.setHours(0, 0, 0, 0);
        //             let todayDate = this.datepipe.transform(this.date, 'dd MMM yyyy');
        //             const dateforToday = new Date();

        //             if (this.roleID != 2) {
        //                 //Today Bookings
        //                 this.todayBookings = data.filter((a) => a.serviceDate == todayDate);
        //                 this.selection = new Set < this.todayBookings > (true);
        //                 //Future Bookings
        //                 this.upcomingBookings = data.filter((a) => new Date(a.serviceDate) > new Date(dateforToday));
        //                 //All Bookings
        //                 // this.patientsappointments = data.filter((a) => new Date(a.serviceDate) < new Date(dateforToday));
        //                 this.patientsappointments = data;

                       
                        
        //                 // this.filterPatientappointments =data.filter((v, i, a) => a.indexOf(v) === i); 
        //             }
        //             else {
        //                 // this.registrationID=this.loginDetails.registrationID;

        //                 this.todayBookings = data.filter((a) => a.serviceDate == todayDate && a.doctorID == this.registrationID);
        //                 this.selection = new Set < this.todayBookings > (true);
        //                 //Future Bookings
        //                 this.upcomingBookings = data.filter((a) => new Date(a.serviceDate) > new Date(dateforToday) && a.doctorID == this.registrationID);
        //                 //All Bookings
        //                 this.patientsappointments = data.filter((a) => a.doctorID == this.registrationID);
                      
        //             }

        //             // //Today Bookings
        //             // this.todayBookings = data.filter((a) => a.serviceDate == todayDate);
        //             // this.selection = new Set < this.todayBookings > (true);
        //             // //Future Bookings
        //             // this.upcomingBookings = data.filter((a) => new Date(a.serviceDate) > new Date(dateforToday));
        //             // //All Bookings
        //             // // this.patientsappointments = data.filter((a) => new Date(a.serviceDate) < new Date(dateforToday));
        //             // this.patientsappointments = data;
        //             // // this.filterPatientappointments =data.filter((v, i, a) => a.indexOf(v) === i); 

        //             this.filterPatientappointments = data.filter(
        //                 (thing, i, arr) => arr.findIndex(t => t.mobile === thing.mobile && t.patient === thing.patient) === i
        //               );

        //             // this.filterPatientappointments = data.filter(
        //             //     (thing, i, arr) => arr.findIndex(t => t.mobile === thing.mobile && t.patient === thing.patient) === i
        //             // );
        //         }

        //         this.todayBookings = new MatTableDataSource(this.todayBookings);
        //         this.upcomingBookings = new MatTableDataSource(this.upcomingBookings);
        //         this.patientsappointments = new MatTableDataSource(this.patientsappointments);
               
        //         this.detailData.vitalID = this.afterSaveVitalId;
        //         if (this.roleID == 2) {
        //             this.onRowClickedAfterSAve(this.detailData);
        //         }
        //         this.todayBookings.filterPredicate = this.createFilter();

        //         this.filterSelectObj.filter((o) => {
        //             o.options = this.getFilterObject(this.todayDataSourceBookings, o.columnProp);
        //         });

        //         this.spinner.hide();
        //     },

        //     () => {
        //         this.spinner.hide();
        //     }
        // );
    }
    onRowClickedAfterSAve(row) {

        // this.rowClickedData=row;
        this.Screen = 2;
        this.detailData = row;
        this.viewHistory(row);
        this.fruits = [];
        // this.vitalsForm.reset();
        if (row.vitalsID) {
            this.setValues(row);

        }
        else {
            this.patientName = row.patient + " " + "(" + row.gender + ", Age " + row.age + ")"
            // this.vitalsForm.reset();
            // this.fruits = [];
            
            this.flag = '1'
            this.PatientID = row.patientID;
            this.AppointmentID = row.appointmentID;
            this.vitalsID = 0;
            this.items = this.vitalsForm.get('items') as FormArray;
            this.medicationitems = this.vitalsForm.get('medicationitems') as FormArray;
            // const arr = <FormArray>this.vitalsForm.controls.items;
            // arr.controls = [];
            // this.addItem();

            // console.log('Row clicked: ', row);
        }
    }
    GetComplaintsXML() {

        this.spinner.show();
        this.appt.VitalsID = Number(this.vitalsID);
        this.utilitiesService.GetComplaintsXML(this.appt).subscribe(
            (data) => {

                if (data) {
                    this.fruits = [];
                    this.complaintsXML = data;
                    for (var i = 0; i < this.complaintsXML.length; i++) {
                        this.fruits.push(data[i].complaintName)
                    }

                } else {
                    this.spinner.hide();
                }
            },
            () => {
                 this.spinner.hide(); 
                }
        );
    }

    GetDocumentsXML() {

        this.appt.VitalsID = Number(this.vitalsID);
        this.utilitiesService.GetDocumentsXML(this.appt).subscribe(
            (data) => {

                if (data) {

                    this.docsXml = data;
                    this.items = this.vitalsForm.get('items') as FormArray;
                    console.log('document', this.items)
                    const arr = <FormArray>this.vitalsForm.controls.items;
                    arr.controls = [];
                    for (var i = 0; i < this.docsXml.length; i++) {
                        let uom = this.docs.filter(a => a.documentTypeID == this.docsXml[i].documentTypeID);
                        this.items.push(this._formBuilder.group({
                            Image: [this.docsXml[i].docTypeNAme],
                            fileName: [this.docsXml[i].docTypeNAme],
                            // docType: [this.docsXml[i].documentTypeID],
                            docType: [this.docsXml[i].docTypeNAme],  // Ensure docTypeNAme is used here

                           // docType: [uom[0]],
                        }));
                       
                    }
                    this.spinner.hide();
                } else {
                    this.spinner.hide();
                }
            },
            () => { this.spinner.hide(); }
        );
    }

    
    GetMedicineXML() {

        this.appt.VitalsID = Number(this.vitalsID);
        this.utilitiesService.GetMedicineXML(this.appt).subscribe(
            (data) => {

                if (data) {
                    
                    this.medicineXml = data;
                    this.medicationitems = this.vitalsForm.get('medicationitems') as FormArray;
                    const arr = <FormArray>this.vitalsForm.controls.medicationitems;
                    arr.controls = [];
                    for (var i = 0; i < this.medicineXml.length; i++) {
                        this.medicationitems.push(this._formBuilder.group({
                            medicine: [this.medicineXml[i].medicine],
                            dose: [this.medicineXml[i].dose],
                            when: [this.medicineXml[i].when],
                            frequencyListMedication: [this.medicineXml[i].frequencyListMedication],
                            duration: [this.medicineXml[i].duration],
                            notes: [this.medicineXml[i].notes]
                        }));
                    
                 }
                    this.spinner.hide();
                } else {
                    this.spinner.hide();
                }
            },
            () => { this.spinner.hide(); }
        );
    }

    // @ViewChild('fileInput') fileInput: ElementRef;
    // openFileInput() {
    //     this.fileInput.nativeElement.click();
    //   }
    // handleFileInput(event: Event) {
    //     const files = (event.target as HTMLInputElement).files;
    //     this.uploadFiles(files);
    //   }
    // onDragOver(event: Event) {
    //      
    //     event.preventDefault();
    //   }
    
    //   onDrop(event: Event) {
    //      
    //     event.preventDefault();
    //     const files = (event as DragEvent).dataTransfer.files;
    //     this.uploadFiles(files);
    //   }
    //   uploadFiles(files: FileList) {
    //     if (files.length === 0) {
    //       return; // No files to handle
    //     }
      
    //     // Assuming you want to process all files using FileReader and populate the dataSource
    //     const fileArray = Array.from(files); // Convert FileList to an array
      
    //     const promises = fileArray.map((file) => {
    //       return new Promise<void>((resolve, reject) => { // Explicitly specify 'void' type
    //         const reader = new FileReader();
      
    //         reader.onload = (event) => {
    //           // Handle the file content here, e.g., you can display the file name in the console
    //           console.log(`Uploaded file: ${file.name}`);
      
    //           // Resolve the promise when the file is processed
    //           resolve();
    //         };
      
    //         reader.readAsDataURL(file);
    //       });
    //     });
      
    //     // Wait for all promises to complete before updating the dataSource
    //     Promise.all(promises)
    //       .then(() => {
    //         // All files have been processed
    //         this.selectedfiles=fileArray
    //         this.dataSource = new MatTableDataSource(fileArray);
    //         // item.patchValue({
    //         //     fileName: files[0].name,
    //         // })
    //         // You can also add any additional logic, like enabling submit or updating the filenames.
    //        // this.submitenable = true;
    //       })
    //       .catch((error) => {
    //         console.error('Error processing files:', error);
    //       });
    //   }

    detectFiles1(event) {
         
                //this.urls = [];
                let files = event.target.files;
                
                var reader = new FileReader();
        
                reader.readAsDataURL(event.target.files[0]); // read file as data url
          
                reader.onload = (event) => { // called once readAsDataURL is completed
              
                }
        
                if (files) {
                    for (let file of files) {
                        let reader = new FileReader();
                        reader.onload = (e: any) => {
        
                        }
                        reader.readAsDataURL(file);
                    }
                    this.fileChange(event);
                }
                
                this.items = this.vitalsForm.get('items') as FormArray;
                this.items.push(this.createItem2(files[0].name));
                this.fileSelected = true;
              
            }
            detectFiles2(files1) {
         
                //this.urls = [];
                let files = files1;
                
                var reader = new FileReader();
        
                reader.readAsDataURL(files1[0]); // read file as data url
          
                // reader.onload = (files1) => { // called once readAsDataURL is completed
              
                // }
        
                if (files) {
                    for (let file of files) {
                        let reader = new FileReader();
                        reader.onload = (e: any) => {
        
                        }
                        reader.readAsDataURL(file);
                    }
                    this.fileChange1(files1);
                }
                
                this.items = this.vitalsForm.get('items') as FormArray;
                this.items.push(this.createItem2(files[0].name));
              
            }
            createItem2(fileName): FormGroup {
                return this._formBuilder.group({
                    Image: [fileName],
                    fileName: [fileName, Validators.required],
                    docType: [''],
                });
            }
            @ViewChild('fileInput') fileInput: ElementRef;
        
            openFileInput() {
                this.fileInput.nativeElement.click();
              }
              onDragOver(event: DragEvent): void {
                event.preventDefault();
                event.stopPropagation();
              }
            
              onDragLeave(event: DragEvent): void {
                event.preventDefault();
                event.stopPropagation();
              }
            
              onDrop(event: DragEvent): void {
                event.preventDefault();
                event.stopPropagation();
               
                const files = (event as DragEvent).dataTransfer.files;
                this.detectFiles2(files)
              }
              uploadFiles(files: FileList) {
                if (files.length === 0) {
                  return; // No files to handle
                }
              
                // Assuming you want to process all files using FileReader and populate the dataSource
                const fileArray = Array.from(files); // Convert FileList to an array
              
                const promises = fileArray.map((file) => {
                  return new Promise<void>((resolve, reject) => { // Explicitly specify 'void' type
                    const reader = new FileReader();
              
                    reader.onload = (event) => {
                      // Handle the file content here, e.g., you can display the file name in the console
                      console.log(`Uploaded file: ${file.name}`);
              
                      // Resolve the promise when the file is processed
                      resolve();
                    };
              
                    reader.readAsDataURL(file);
                  });
                });
              
                // Wait for all promises to complete before updating the dataSource
                Promise.all(promises)
                  .then(() => {
                    // All files have been processed
                    this.selectedfiles=fileArray
                    this.dataSource = new MatTableDataSource(fileArray);
                    // item.patchValue({
                    //     fileName: files[0].name,
                    // })
                    // You can also add any additional logic, like enabling submit or updating the filenames.
                   // this.submitenable = true;
                  })
                  .catch((error) => {
                    console.error('Error processing files:', error);
                  });
              }
              fileChange1(event) {
        
        
                let fileList = event;
        
                let fileToUpload = <File>fileList[0];
                const formData = new FormData();
               
                formData.append('file', fileToUpload, fileToUpload.name);
                this.http.post(this.API_URL + 'PatientsAppointments/upload', formData, { reportProgress: true })
                    .subscribe(data => {
        
                        this.fileName = fileList[0].name;
        
        
                    });
            }

    detectFiles(event, item) {

        //this.urls = [];
        let files = event.target.files;
        
        var reader = new FileReader();

        reader.readAsDataURL(event.target.files[0]); // read file as data url
  
        reader.onload = (event) => { // called once readAsDataURL is completed
      
        }

        if (files) {
            for (let file of files) {
                let reader = new FileReader();
                reader.onload = (e: any) => {

                }
                reader.readAsDataURL(file);
            }
            this.fileChange(event);
        }

        if (files.length >= 1) {
            item.patchValue({
                fileName: files[0].name,
            })
        }

      
    }

    //This is for Uploading Multiple Image
    fileChange(event) {


        let fileList = event.target.files;

        let fileToUpload = <File>fileList[0];
        const formData = new FormData();
       
        formData.append('file', fileToUpload, fileToUpload.name);
        this.http.post(this.API_URL + 'PatientsAppointments/upload', formData, { reportProgress: true })
            .subscribe(data => {

                this.fileName = fileList[0].name;


            });
    }


    public uploadFile = (files) => {

        if (files.length === 0) {
            return;
        }
        this.API_URL + 'PatientsAppointments/upload'
        let fileToUpload = <File>files[0];
        const formData = new FormData();
        formData.append('file', fileToUpload, fileToUpload.name);
        this.http.post(this.API_URL, formData, { reportProgress: true, observe: 'events' })
            .subscribe(event => {

            });
    }


    viewHistory(val) {
        // debugger
        this.statusCompleted=val.doctorCompleted;
        this.previousdata=true;
        let arr = [];
        arr.push({ PatientID: Number(val.patientID) })
        var url = 'PatientsAppointments/PatientHistory/';
        
        this.utilitiesService.CRUD(arr, url).subscribe(
          
            (data) => {
                 
                if (data) {

                    // debugger
                    const dateforToday = new Date();
                    this.patientHistory = data;
                    

                    this.patientHistory = this.patientHistory.filter((a) => new Date(a.serviceDate) <= new Date(dateforToday));
                    
                    if(this.patientHistory.length>0){
                        this.previousdata=true;
                    }
                    else{
                        this.previousdata=false;
                    }
                    // this.patientHistoryList = data;
                    // this.patientHistory.splice(0, 1); -- If you need to splice today data in Previous Visit tab 
                    // this.patientHistoryList.splice(0, 1);
                    for (var i = 0; i < this.patientHistory.length; i++) {
                        if (this.patientHistory[i].vitalsID > 0) {
                            this.GetComplaintsListXML(this.patientHistory[i].vitalsID, this.patientHistory[i]);
                            this.GetMedicineListXML(this.patientHistory[i].vitalsID, this.patientHistory[i]);
                            this.GetDocumentListXML1(this.patientHistory[i].vitalsID, this.patientHistory[i],i);

                        }

                    }
                     
                    this.patientsappointment1 =data;

                    this.patientsappointment1 = new MatTableDataSource(this.patientsappointment1);
                    this.patientsappointment1.paginator = this.HistoryPaginator1;


                } else {
                }
            },

            () => { }
        );
    }
    GetComplaintsListXML(val, history) {

        // this.spinner.show();
        this.apptList.VitalsID = val;
        this.utilitiesService.GetComplaintsXML(this.apptList).subscribe(
            (data) => {

                if (data) {
                    // this.fruitsDAta = [];
                    var s = " ";
                    this.complaintsXMLList = data;
                    if (this.complaintsXMLList.length > 0) {
                        for (var i = 0; i < this.complaintsXMLList.length; i++) {
                            if (this.complaintsXMLList.length==1)
                               s= data[i].complaintName;
                            else if( i==(this.complaintsXMLList.length-1)){
                                s = s  + data[i].complaintName;
                            }
                            else{
                                s = s  + data[i].complaintName + ',';

                            }
                               
                        }
                        history.complaintName = s;
                    }

                } else {
                    // this.spinner.hide();
                }
            },
            () => { //this.spinner.hide();
            }
        );
    }
    GetMedicineListXML(val, history) {

        this.apptList.VitalsID = val;
        this.utilitiesService.GetMedicineXML(this.apptList).subscribe(
            (data) => {

                if (data) {

                    this.medicineXml = data;
                    //this.medicationitems = this.vitalsForm.get('medicationitems') as FormArray;
                    // const arr = <FormArray>this.vitalsForm.controls.medicationitems;
                    //  arr.controls = [];
                    this.medicineList = [];
                    for (var i = 0; i < this.medicineXml.length; i++) {
                        this.medicineList.push(this.medicineXml[i]);
                        // this.medicationitems.push(this._formBuilder.group({
                        //     medicine: [this.medicineXml[i].medicine],
                        //     dose: [this.medicineXml[i].dose],
                        //     when: [this.medicineXml[i].when],
                        //     frequencyListMedication: [this.medicineXml[i].frequencyListMedication],
                        //     duration: [this.medicineXml[i].duration],
                        //     notes: [this.medicineXml[i].notes]
                        // }));
                    }
                    history.medicineList = this.medicineList;
                    this.spinner.hide();
                   this.createMedicationItem();
                } else {
                    this.spinner.hide();
                }
            },
            () => { this.spinner.hide(); }
        );
    }
    Viewfile(event,item){
         
       
        this.fileUrl = item.controls.fileName.value; 

        let a =String.raw`\b1\c1\d1`; //Output a ="\b1\c1\d1"

let b = a.split("\\");
      let c=  this.fileUrl.split("\\");

      if(c[0]=="VitalsDocs"){
        this.fileUrl=c[1];
      }
        
        //"wwwroot/SiteDocument/SiteDemo1/FileDocument.doc" static file path
        this.utilitiesService.DocumentsDownload(this.fileUrl).subscribe(async (event) => {
             
            let data = event as HttpResponse < Blob > ;
            const downloadedFile = new Blob([data.body as BlobPart], {
                type: data.body?.type
            });
            console.log("ddd", downloadedFile)
            if (downloadedFile.type != "") {
                const url = window.URL.createObjectURL(downloadedFile);
        let tab = window.open();
        tab.location.href = url;
            }
        });
       
        // this.utilitiesService.DocumentsDownload1(this.filename1).subscribe( (event) => {
        //      
        //     let data = event as HttpResponse < Blob > ;
        // const blob = new Blob([data.body as BlobPart]);

       
        // const url = window.URL.createObjectURL(blob);
        // let tab = window.open();
        // tab.location.href = url;
        // });
    }
    DownloadDocument(fileDownloadPath) {
        this.fileUrl = fileDownloadPath; //"wwwroot/SiteDocument/SiteDemo1/FileDocument.doc" static file path
        this.utilitiesService.DocumentsDownload(this.fileUrl).subscribe(async (event) => {
             
            let data = event as HttpResponse < Blob > ;
            const downloadedFile = new Blob([data.body as BlobPart], {
                type: data.body?.type
            });
            console.log("ddd", downloadedFile)
            if (downloadedFile.type != "") {
                const a = document.createElement('a');
                a.setAttribute('style', 'display:none;');
                document.body.appendChild(a);
                a.download = this.fileUrl;
                a.href = URL.createObjectURL(downloadedFile);
                a.target = '_blank';
                a.click();
                document.body.removeChild(a);
            }
        });
    }
    GetDocumentListXML1(val, history,k) {
        
        this.apptList.VitalsID = val;
        this.utilitiesService.GetDocumentsXML(this.apptList).subscribe(
            (data) => {
                
                if (data) {

                    this.docsXml = data;
                    this.docsList = [];
                    this.labreportfiles = [];
                     
                    for (var i = 0; i < this.docsXml.length; i++) {
                        this.docsList.push(this.docsXml[i]);
                        (this.docsList[i].docTypeNAme)=   (this.docsList[i].docTypeNAme.slice(11))
                       // this.labreportfiles.push(this.docsList[i].docTypeNAme.slice(11))
                        // var sf=this.docsList[i].docTypeNAme.slice(11)
                        this.labreportfiles.push(this.docsList[i])
                    }
                    this.patientHistory[k].documents=this.labreportfiles;
                    // var splitted = this.docsList[0].docTypeNAme.slice(11);
                    this.fileUrl=this.docsList[0].docTypeNAme.slice(11);
                    // this.filename=this.docsList[0].value.docTypeNAme;

                    history.documents = this.docsList;
                    this.spinner.hide();
                } else {
                    this.spinner.hide();
                }
            },
            () => { this.spinner.hide(); }
        );
    }
    GetDocumentListXML(val, history) {
        
                this.apptList.VitalsID = val;
                this.utilitiesService.GetDocumentsXML(this.apptList).subscribe(
                    (data) => {
                        
                        if (data) {
        
                            this.docsXml = data;
                            this.docsList = [];
                            this.labreportfiles = [];
                             
                            for (var i = 0; i < this.docsXml.length; i++) {
                                this.docsList.push(this.docsXml[i]);
                                this.labreportfiles.push(this.docsList[i].docTypeNAme.slice(11))
                               
                            }
                            // var splitted = this.docsList[0].docTypeNAme.slice(11);
                            this.fileUrl=this.docsList[0].docTypeNAme.slice(11);
                            // this.filename=this.docsList[0].value.docTypeNAme;

                            history.documents = this.docsList;
                            this.spinner.hide();
                        } else {
                            this.spinner.hide();
                        }
                    },
                    () => { this.spinner.hide(); }
                );
            }
    appoinmentLink() {
        this.gethistory()
        //this._router.navigate(['/Appointments']);
        this.Screen = 1;
       // this.ngOnInit();
    }

    GetMedicineData() {
 
        
        this.medicineService.GetMedicineList().subscribe(
            (data) => {
                
                if (data) {
                    if (this.roleID == 2) {
                        data = data .sort((a,b) => {
                        if((a.medicineName).toLowerCase() < (b.medicineName).toLowerCase()){
                            return -1;
                            }
                        })
                        this.medicinePrescepList = data;
                        // this.medicinePrescepList = this.medicinePrescepList.filter((a) => a.medic == this.registrationID);
                    }
                    else
                    data = data .sort((a,b) => {
                        if((a.medicineName).toLowerCase() < (b.medicineName).toLowerCase()){
                            return -1;
                        }
                    })
                        this.medicinePrescepList = data;
                }

             
              this.searchmedicine= this.medicinePrescepList; 
              this.medicinePrescepList1= this.medicinePrescepList; 


            },

            () => {

            }

        );

    }

    // goToPanel(panelId: string): void {
    //     this.selectedPanel = panelId;
    // }
    goToPanel(panelId: string): void {
        this.selectedPanel = panelId;
        if (panelId === 'Medication') {
            setTimeout(() => {
                const dropdown = document.querySelector('#medicineSelect');
                if (dropdown) {
                    this.renderer.selectRootElement(dropdown).click();
                }
            });
        }
    }
    
    
    

    // //Receipt Print
    // openPresecptionDialog(): void {
    //     
    //     const dialogConfig = new MatDialogConfig();
    //     dialogConfig.restoreFocus = false;
    //     dialogConfig.autoFocus = false;
    //     dialogConfig.role = 'dialog';
    //     dialogConfig.disableClose=true;

    //     this.presecptionModalDialogRef = this.dialog.open(this.presecptionModal, dialogConfig);

    //     this.presecptionModalDialogRef.afterClosed().subscribe(result => {
    //         console.log('The dialog was closed...');
    //     });



    // }

        /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
   trackByFn(index: number, item: any): any
   {
       return item.id || index;
   }



   numberToWordsWithDecimal(amount: number): string {
    if (isNaN(amount)) return "Invalid number";
  
    const belowTwenty = [
      "", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
      "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen",
      "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
    ];
  
    const tens = [
      "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
    ];
  
    const thousands = ["", "Thousand", "Million", "Billion"];
  
    const helper = (n: number): string => {
      if (n === 0) return "";
      else if (n < 20) return belowTwenty[n] + " ";
      else if (n < 100) return tens[Math.floor(n / 10)] + " " + helper(n % 10);
      else return belowTwenty[Math.floor(n / 100)] + " Hundred " + helper(n % 100);
    };
  
    const convertIntegerPart = (num: number): string => {
      if (num === 0) return "Zero";
  
      let res = "";
      let i = 0;
  
      while (num > 0) {
        if (num % 1000 !== 0) {
          res = helper(num % 1000) + thousands[i] + " " + res;
        }
        num = Math.floor(num / 1000);
        i++;
      }
  
      return res.trim();
    };
  
    const convertDecimalPart = (decimalStr: string): string => {
      return decimalStr
        .split("")
        .map((digit) => belowTwenty[parseInt(digit)])
        .filter(word => word !== "")
        .join(" ");
    };
  
    const [integerPartStr, decimalPartStr] = amount.toFixed(2).split(".");
    const integerPart = parseInt(integerPartStr);
    const decimalWords = convertDecimalPart(decimalPartStr);
  
    let result = convertIntegerPart(integerPart);
  
    if (decimalWords) {
      result += " Point " + decimalWords;
    }
  
    return result.trim();
  }
  

}

