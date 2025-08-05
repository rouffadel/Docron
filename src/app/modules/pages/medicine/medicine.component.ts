import { ViewEncapsulation, Component, ViewChild, OnInit,ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MedicineService } from './medicine.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { T } from '@angular/cdk/keycodes';
import { UtilitiesService } from 'app/Services/utilities.service';
import { LoaderService } from '../../../Services/loader.service';
import * as XLSX from 'xlsx';
import { DatePipe, PlatformLocation } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';


import {
    
    FormControl,
    
    NgForm,
     FormArray
} from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
@Component({
    selector: 'app-medicine',
    templateUrl: './medicine.component.html',
    styleUrls: ['./medicine.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe],
    
    //encapsulation: ViewEncapsulation.None
})
export class MedicineComponent implements OnInit {
    Updatebtn: boolean;
    submitbtn:any;
    composition1:any;
    medicine1:any;
    horizontalStepperForm: FormGroup;
    public form: FormGroup;
    medlist: boolean=true;
    patientsappointments: any;
    constructor(public medicineService: MedicineService, 
        private _matDialog: MatDialog,
        private _snackBar: MatSnackBar,
         private utilitiesService: UtilitiesService,  public spinner: LoaderService ,  public datepipe: DatePipe,
         private _formBuilder: FormBuilder,
         private platformlocation: PlatformLocation

        ) {
            history.pushState(null, '', location.href);
            this.platformlocation.onPopState(() => {
                history.pushState(null, '', location.href);
            });
            this.form = _formBuilder.group({              
                medicineName         : ['', Validators.required],
                composition       : [''] 
            });
          }

    medicineList:any = [];
    displayedColumns: string[] = ['MedicineId', 'MedicineName', 'Composition', 'Actions'];
    columnDefinitions = [
        { def: 'MedicineId', visible: true, displayName: 'Medicine ID' },
        { def: 'MedicineName', visible: true, displayName: 'Medicine Name' },
        { def: 'Composition', visible: true, displayName: 'Composition' },
        { def: 'Actions', visible: true, displayName: 'Actions' },
    ];
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('MedicinePaginator') MedicinePaginator: MatPaginator;
    @ViewChild('TABLE') table: ElementRef;
    searchKey: string;
    loginDetails: any;
    roleID: any;
    registrationID:any;
    patientHistory: any = [];
    patientHistoryList: any = [];
   
    Screen: any = 1;
   
    patientName: string;
    PatientID: any;
    AppointmentID: any;
    vitalsID: any;
    complaintsXML: any = [];
    items: FormArray;
    medicationitems: FormArray;
    appt: any = {};
    appFromDate: string;
    appToDate: string;
    actionName: string = 'Medicine'
    flag: string;
    msg: any;

    updateDisplayedColumns() {
        this.displayedColumns = this.columnDefinitions
          .filter(cd => this.selectedColumns.includes(cd.def))
          .map(cd => cd.def);
      }
      selectedColumns: string[] = ['MedicineId', 'MedicineName', 'Composition', 'Actions'];
      

    // isColumnVisible(column: string): boolean {
    //     return this.columnDefinitions.find(cd => cd.def === column)?.visible ?? false;
    // }

    ExportTOExcel()
        {
            
        const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

       //let bur=XLSX.write(wb,{cellStyles:})
    
        
        /* save to file */
        XLSX.writeFile(wb, 'SheetJS.xlsx');
        
        }

        @ViewChild('myField') myField: ElementRef;
        setFocus() {
            //debugger
            
            if (this.myField && this.myField.nativeElement) {
                setTimeout(() => {
                    this.myField.nativeElement.focus();

                  }, 100);
            //   this.myField.nativeElement.focus();
            }
        }
       
        
//    exportpdf(){
//             //debugger
//               var prepare=[];
//             this.medicineList.filteredData.forEach(e=>{
//               var tempObj =[];
//               tempObj.push(e.medicineId);
//               tempObj.push(e.medicineName);
//               tempObj.push( e.composition);
//               tempObj.push( e.mobile);
//               tempObj.push(e.visitCount);
//               prepare.push(tempObj);
        
//             });
//             const doc = new jsPDF();
//             autoTable(doc,{
//                 head: [['MedicineId','MedicineName ',' Composition']],
//                 body: prepare
//             });
//             doc.save('Medicine' + '.pdf');
          
//             // const doc = new jsPDF("p", "pt", "a4");
//             // const source = document.getElementById("table1");
//             // // doc.text("Test", 40, 20);
//             // doc.setFontSize(20)
//             // doc.html(source, {
//             //   callback: function(pdf) {
//             //     doc.output("dataurlnewwindow"); // preview pdf file when exported
//             //   }
//             // });
//         }

// exportpdf() {
//     const prepare = [];
//     this.medicineList.filteredData.forEach(e => {
//         const tempObj = [];
//         tempObj.push(e.medicineId);
//         tempObj.push(e.medicineName);
//         tempObj.push(e.composition);
//         prepare.push(tempObj);
//     });

//     const doc = new jsPDF();

//     // Add logo
//     const logo = new Image();
//     logo.src = 'assets/images/logo/LOGO.png'; // path to your logo file
//     logo.onload = () => {
//         doc.addImage(logo, 'PNG', 10, 10, 50, 20); // adjust the positioning and size as needed
        
//         // Add title
//         doc.setFontSize(12);

//         // Add current date
//         const currentDate = new Date();
//         const formattedDate = `${currentDate.getDate()} ${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`;
//         doc.text(`Date: ${formattedDate}`, 160, 40);

//         // Add table
//         autoTable(doc, {
//             head: [['MedicineId', 'MedicineName', 'Composition']],
//             body: prepare,
//             startY: 50 // adjust the start position as needed
//         });
//         const footerText = `Advance Rheumatology Center\n6-3-652, 1st Floor, Kautilya Building, near Erramanzil bus stop, Somajiguda,\nHyderabad, Telangana 500082, Contact No : 9247435254`;
//         doc.setFontSize(10);
//         doc.text(footerText, 13, doc.internal.pageSize.height - 20);

//         // Save PDF
//         doc.save('Medicine.pdf');
//     };
// }

exportpdf() {
    const prepare = [];
    this.medicineList.filteredData.forEach(e => {
        const tempObj = [];
        tempObj.push(e.medicineId);
        tempObj.push(e.medicineName);
        tempObj.push(e.composition);
        prepare.push(tempObj);
    });

    const doc = new jsPDF();

    // Format current date
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()} ${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`;

    const addHeader = (doc, logo, formattedDate) => {
        // Add logo
        doc.addImage(logo, 'PNG', 10, 10, 50, 20);

        // Add date
        doc.setFontSize(12);
        doc.text(`Date: ${formattedDate}`, 160, 40);
    };

    // Load logo and generate PDF
    const logo = new Image();
    logo.src = 'assets/images/logo/LOGO.png'; // path to your logo file
    logo.onload = () => {
        // Add the first page header
        addHeader(doc, logo, formattedDate);

        // Add table with margins to avoid overlapping with header and footer
        autoTable(doc, {
            head: [['MedicineId', 'MedicineName', 'Composition']],
            body: prepare,
            startY: 50, // Start position below the header
            margin: { left: 10, right: 10, bottom: 30, top: 50 }, // Margins to avoid overlap
            didDrawPage: function (data) {
                if (data.pageNumber > 1) {
                    addHeader(doc, logo, formattedDate);
                }

                // Footer
                const footerText = `Advance Rheumatology Center\n6-3-652, 1st Floor, Kautilya Building, near Erramanzil bus stop, Somajiguda,\nHyderabad, Telangana 500082, Contact No : 9247435254`;
                doc.setFontSize(10);
                doc.text(footerText, 13, doc.internal.pageSize.height - 20);
            }
        });

        // Save PDF
        doc.save('Medicine.pdf');
    };
}

  

    ngOnInit(): void {
        //debugger;
        this.loginDetails = JSON.parse(localStorage.getItem('loginDetails'));
        if (this.loginDetails) {
            this.roleID = this.loginDetails.roleID;
            this.registrationID=this.loginDetails.registrationID;
        } 
        this.GetMedicineData();    
       
    }
   

    // GetMedicineData(){       

    //     //debugger;
    //     this.medicineService.GetMedicineList().subscribe(
    //         (data) => {
    //             //debugger;
    //             if (data) {
    //                 if(this.roleID == 2)
    //                 {
    //                     // console.log(data);
    //                 data = data .sort((a,b) => {
    //                     if((a.medicineName).toLowerCase() < (b.medicineName).toLowerCase()){
    //                         return -1;
    //                     }
    //                 })
    //                 this.medicineList = data;
    //                 this.medicineList = this.medicineList.filter((a) => a.medic == this.registrationID);
    //                 }
    //                 else
    //                 data = data .sort((a,b) => {
    //                     if((a.medicineName).toLowerCase() < (b.medicineName).toLowerCase()){
    //                         return -1;
    //                     }
    //                 })
    //                 this.medicineList = data;
    //             }
    //             if(this.medicineList.length>0){
    //                 this.medlist=true
    //             }
    //             else{
    //                 this.medlist=false
    //             }
               
    //             // this.patientsappointments = this.patientsappointments.filter(
    //             //     (thing, i, arr) => arr.findIndex(t => t.mobile === thing.mobile && t.patient === thing.patient )  === i
    //             // );            
    //             this.medicineList = new MatTableDataSource(this.medicineList);
    //            //this.sort.sort()
    //             this.medicineList.sort = this.sort;
              

    //             this.medicineList.paginator = this.paginator;
    //         },

    //         () => {

    //         }

    //     );

    // }
    GetMedicineData() {
        // debugger;
        this.medicineService.GetMedicineList().subscribe(
            (data) => {
                //debugger;
                if (data) {
                    if (this.roleID == 2) {
                        this.medicineList = data.filter((a) => a.medic == this.registrationID);
                    } else {
                        this.medicineList = data;
                    }
                }
                if (this.medicineList.length > 0) {
                    this.medlist = true;
                } else {
                    this.medlist = false;
                }
    
                this.medicineList = new MatTableDataSource(this.medicineList);
                this.medicineList.sort = this.sort;
                // this.medicineList.paginator = this.paginator; 
                this.medicineList.paginator = this.MedicinePaginator;
            },
            () => {}
        );
    }
    
    medicineId:any
    updateSelect(val) {
        //debugger
       this.flag='2'
      this.medicineId=val.medicineId
       this.medicine1=val.medicineName
       this.composition1=val.composition
       this.Updatebtn = true; // Show Update button
    this.submitbtn = false;
       
    }

    addUpdateMedicineDetails(val) {
        //debugger;
        this.msg = this.actionName + ' data added successfully ..!!';

        if (this.flag == '1') {
            this.msg = this.actionName + ' data added successfully ..!!';
        }
        else if (this.flag == '2') {
            //this.msg = 'Doctor with same mobile no alreay Exists ..!!';
            this.msg = this.actionName + ' data updated Successfully ..!!';
        }
        let arr = [];
        arr.push({ 
                MedicineId:            val.medicineId,
                MedicineName           :val.medicineName           
                ,Composition          :val.composition 
                ,Action:'Insert',  
        })
        //var url = 'PatientsAppointments/RegisterationCRUD/';
        this.medicineService.addUpdateMedicineDetails(arr).subscribe(
            (data) => {
                if (data == '1') {
                    ;
                    this.GetMedicineData();
                    this.form.reset();
                    this._snackBar.open(this.msg, 'ok', {
                        "duration": 2000
                    });
                }               
                else {
                    this._snackBar.open('Something went wrong please try again alter ..!!', 'ok', {
                        "duration": 2000
                    });
                }
            },

            () => { }
        );
    }
    UpdateMedicineDetails(val) {
        //debugger;
        this.msg = this.actionName + ' data added successfully ..!!';

        if (this.flag == '1') {
            this.msg = this.actionName + ' data added successfully ..!!';
        }
        else if (this.flag == '2') {
            //this.msg = 'Doctor with same mobile no alreay Exists ..!!';
            this.msg = this.actionName + ' data updated Successfully ..!!';
        }
        let arr = [];
        arr.push({ 
                MedicineId:            this.medicineId,
                MedicineName           :val.medicineName           
                ,Composition          :val.composition 
                ,Action:'Update',  
        })
        //var url = 'PatientsAppointments/RegisterationCRUD/';
        this.medicineService.addUpdateMedicineDetails(arr).subscribe(
            (data) => {
                if (data == '1') {
                    ;
                    this.GetMedicineData();
                    this.form.reset();
                    this.Updatebtn = false;
                    this._snackBar.open(this.msg, 'ok', {
                        "duration": 2000
                    });
                }               
                else {
                    this._snackBar.open('Something went wrong please try again alter ..!!', 'ok', {
                        "duration": 2000
                    });
                }
            },

            () => { }
        );
    }

    deleteDoc(element) {
        //debugger;
        this.msg = this.actionName + ' data Deleted successfully ..!!';
    
        if (this.flag == '1') {
            this.msg = this.actionName + ' data Deleted successfully ..!!';
        } else if (this.flag == '2') {
            this.msg = this.actionName + ' data Deleted Successfully ..!!';
        } else if (this.flag == '3') {
            this.msg = this.actionName + ' data Deleted Successfully ..!!';
        }
    
        let arr = [];
        arr.push({
            MedicineId: element.medicineId,
            MedicineName: element.medicineName,
            Composition: element.composition,
            Action: 'Delete',
        });
    
        this.medicineService.addUpdateMedicineDetails(arr).subscribe(
            (data) => {
                if (data == '1') {
                    this.GetMedicineData();
                    this.form.reset();
                    this.Updatebtn = false;
                    this._snackBar.open(this.msg, 'ok', {
                        duration: 2000
                    });
                } else {
                    this._snackBar.open('Something went wrong please try again alter ..!!', 'ok', {
                        duration: 2000
                    });
                }
            },
            () => {}
        );
    }
    

    // GetAllAppointments() {

    //     this.reportService.getReportPatientList().subscribe(
    //         (data) => {
    //             //debugger;
    //             if (data) {
    //                 if(this.roleID == 2)
    //                 this.patientsappointments = data.filter((a) => a.doctorID == this.registrationID);
    //                 else
    //                 this.patientsappointments = data;
    //             }

    //             // this.patientsappointments = this.patientsappointments.filter(
    //             //     (thing, i, arr) => arr.findIndex(t => t.mobile === thing.mobile && t.patient === thing.patient && t.serviceDate === thing.serviceDate)  === i
    //             // );    
    //             this.patientsappointments = this.patientsappointments.filter(
    //                 (thing, i, arr) => arr.findIndex(t => t.mobile === thing.mobile && t.patient === thing.patient )  === i
    //             );            
    //             this.patientsappointments = new MatTableDataSource(this.patientsappointments);
    //            //this.sort.sort()
    //             this.patientsappointments.sort = this.sort;
    //            // this.sort.active='appointmentID';
    //           //  this.sort.direction = 'desc';

                 


    //             // const sortState: MatSort = {active: 'appointmentID', direction: 'desc'};
    //             // this.sort.active = sortState.active;
    //             // this.sort.direction = sortState.direction;
    //             // this.sort.sortChange.emit(sortState);

    //             this.patientsappointments.paginator = this.paginator;
    //         },

    //         () => {

    //         }

    //     );
    // }
    onSearchClear() {
        this.searchKey = "";
        this.applyFilter();
    }
    applyFilter() {
        this.medicineList.filter = this.searchKey.trim().toLowerCase();
    }

  
  
    appoinmentLink() {
        //this._router.navigate(['/Appointments']);
        this.Screen = 1;
    }



}
