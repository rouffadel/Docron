import { DatePipe, PlatformLocation } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { bottom } from '@popperjs/core';
import { UtilitiesService } from 'app/Services/utilities.service';
import * as XLSX from 'xlsx';
import { Chart, DateAdapter } from 'chart.js/auto';
import { result } from 'lodash';
import { MatDatepickerInputEvent } from '@angular/material/datepicker'; 

import autoTable from 'jspdf-autotable'


import {


    NgForm,
    FormArray
} from '@angular/forms';

export class Dept{
  public fromDate:any
  public toDate:any
  public departmentId:number
}



export class SummaryReports{
  public fromDate:Date
  public toDate:Date
  public departmentId:number
}

export class CardReports{
  public fromDate:Date
  public toDate:Date
  public departmentId:number

  constructor() {
    const today = new Date();
    this.fromDate = today;
    this.toDate = today;
  }
}
import jsPDF from 'jspdf';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ReportService } from '../Reports/report.service';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from 'app/Services/loader.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { dateSelectionJoinTransformer } from '@fullcalendar/core';
@Component({
  selector: 'app-admin-reports',
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminReportsComponent implements OnInit {
  hasData: boolean = false;
  dateRangeForm: FormGroup;
  horizontalStepperForm: FormGroup;
  Repdata: boolean=true;

  @ViewChild('myButton', { static: true }) myButton!: ElementRef<HTMLButtonElement>;

  @ViewChild('barChart') barChart: ElementRef;
  @ViewChild('barChart1') barChart1: ElementRef;
  myBarChart: any;
  myBarChart1: any;
  fromDate1: Date;
  toDate1: Date;
  fromDate2: Date;
  toDate2: Date;
  dept=new Dept()
  sumrep=new SummaryReports()
  cardrep=new CardReports()
  totalBilled:number=0
  totalCollected:number=0
  cash:number=0
  card:number=0
  wallet:number=0
  outstanding:number=0
  billedpatients:number=0
  consultation:number=0
  totalEarnings:number=0
  totalNumberOfPatients:number=0
  searchKey
  date
  appFromDate: Date;
  appToDate: Date;
  summaryReports: MatTableDataSource<any>;
  deptReports: any = [];
  displayedColumns3 : string[] = ['SL','Patient ARCID', 'Patient', 'Mobile', 'serviceName', 'Last Visit', 'Visit Count', 'Payment', 'ModeofPayment'];
  columnDefinitions3 = [
    { def: 'SL', visible: true, displayName: 'SL' },
    { def: 'Patient ARCID', visible: true, displayName: 'Patient ARCID' },
    { def: 'Patient', visible: true, displayName: 'Patient Name & Gender' },
    { def: 'Mobile', visible: true, displayName: 'Phone Number' },       
    { def: 'serviceName', visible: true, displayName: 'ServiceName' },
    { def: 'Last Visit', visible: true, displayName: 'Last Visit' },
    { def: 'Visit Count', visible: true, displayName: 'Discount' },
    { def: 'Payment', visible: true, displayName: 'Payment' },
    { def: 'ModeofPayment', visible: true, displayName: 'Mode Of Payment' },
];
  displayedColumns2: string[] = ['date','newreg','billedpatients', 'consultations', 'lab', 'others', 'totalearnings'];
  displayedColumns: string[] = ['department', 'service', 'count', 'totalbill', 'totalcollected'];
  columnDefinitions = [
    { def: 'department', visible: true, displayName: 'Department' },
    { def: 'service', visible: true, displayName: 'Service' },
    { def: 'count', visible: true, displayName: 'Count' },
    { def: 'totalbill', visible: true, displayName: 'Total Bill' },       
    { def: 'totalcollected', visible: true, displayName: 'Total Collected' },
   
];
  @ViewChild(MatSort) sort: MatSort;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('paginator1') paginator1: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild('TABLE') table: ElementRef;
  @ViewChild('TABLE') table1: ElementRef;
  

  date1 = new FormControl(new Date());
  serializedDate = new FormControl(new Date().toISOString());
  date2 = new FormControl(new Date());
  serializedDate1 = new FormControl(new Date().toISOString());
  dataList: any;

  constructor( 
        private datePipe: DatePipe,
        public reportService: ReportService, private _matDialog: MatDialog, 
        private utilitiesService: UtilitiesService,private formBuilder: FormBuilder, public spinner: LoaderService, public datepipe: DatePipe, private _formBuilder: FormBuilder,private snackBar: MatSnackBar,
        private platformlocation: PlatformLocation
    
  ) {
      history.pushState(null, '', location.href);
      this.platformlocation.onPopState(() => {
          history.pushState(null, '', location.href);
      });
  }



  patientsappointments: any = [];
  @ViewChild(MatSort) sort3: MatSort;
  @ViewChild(MatPaginator) paginator3: MatPaginator;
  @ViewChild('TABLE') table3: ElementRef;
  searchKey3: string;
  loginDetails: any;
  roleID: any;
  registrationID: any;
  patientList: any = [];
  patientTotalAmount: number = 0;
  patientHistory: any = [];
  Screen: any = 1;

  patientName: string;
  PatientID: any;
  AppointmentID: any;
  vitalsID: any;
  complaintsXML: any = [];
  items: FormArray;
  medicationitems: FormArray;
  appt: any = {};
  //appFromDate: string;
  // appToDate: string;
  appFromDate3: Date;
  appToDate3: Date;
  toDate
  fromDate
  @ViewChild(MatPaginator) paginator: MatPaginator;

  updateDisplayedColumns3() {
    this.displayedColumns3 = this.columnDefinitions3
      .filter(cd => this.selectedColumns3.includes(cd.def))
      .map(cd => cd.def);
  }
  selectedColumns3: string[] = [ 'SL','Patient ARCID', 'Patient', 'Mobile', 'serviceName', 'Last Visit', 'Visit Count', 'Payment', 'ModeofPayment'];

  updateDisplayedColumns() {
    this.displayedColumns = this.columnDefinitions
      .filter(cd => this.selectedColumns.includes(cd.def))
      .map(cd => cd.def);
  }
  selectedColumns: string[] = [ 'department', 'service', 'count', 'totalbill', 'totalcollected'];


  exportpdf(){
    //debugger
      var prepare=[];
    this.summaryReports.filteredData.forEach(e=>{
      var tempObj =[];
      tempObj.push(e.date);
      tempObj.push(e.newRegistrations);
      tempObj.push(e.billedPatients);
      tempObj.push( e.consultation);
      tempObj.push( e.lab);
      tempObj.push(e.others);
      tempObj.push(e.totEarnings);
      prepare.push(tempObj);
  
    });
    const doc = new jsPDF();
    autoTable(doc,{
        head: [['Date', 'New Registration', 'Billed Patients', 'Consultations', 'Lab', 'Others', 'Total Earnings']],
        body: prepare
    });
    doc.save('SummaryReports' + '.pdf');

  }

 
  

sortData(sort: MatSort) {
        // debugger
  if (sort.active == "SL") {
      if (sort.direction == "asc")
          this.patientHistory.sort((a, b) => (a.appointmentID < b.appointmentID ? -1 : 1));
      else
          this.patientHistory.sort((a, b) => (a.appointmentID > b.appointmentID ? -1 : 1));
  }
  if (sort.active == "patient") {
      if (sort.direction == "asc")
          this.patientHistory.sort((a, b) => (a.patient < b.patient ? -1 : 1));
      else
          this.patientHistory.sort((a, b) => (a.patient > b.patient ? -1 : 1));
  }

  if (sort.active == "mobile") {
      if (sort.direction == "asc")
          this.patientHistory.sort((a, b) => (a.mobile < b.mobile ? -1 : 1));
      else
          this.patientHistory.sort((a, b) => (a.mobile > b.mobile ? -1 : 1));
  }

  if (sort.active == "serviceDate") {
      if (sort.direction == "asc")
          this.patientHistory.sort((a, b) => (a.serviceDate < b.serviceDate ? -1 : 1));
      else
          this.patientHistory.sort((a, b) => (a.serviceDate > b.serviceDate ? -1 : 1));
  }

  if (sort.active == "serviceName") {
    if (sort.direction == "asc")
        this.patientHistory.sort((a, b) => (a.serviceName < b.serviceName ? -1 : 1));
    else
        this.patientHistory.sort((a, b) => (a.serviceName > b.serviceName ? -1 : 1));
}

if (sort.active == "mobile") {
  if (sort.direction == "asc")
      this.patientHistory.sort((a, b) => (a.mobile < b.mobile ? -1 : 1));
  else
      this.patientHistory.sort((a, b) => (a.mobile > b.mobile ? -1 : 1));
}

if (sort.active == "modeofPayment") {
  if (sort.direction == "asc")
      this.patientHistory.sort((a, b) => (a.modeofPayment < b.modeofPayment ? -1 : 1));
  else
      this.patientHistory.sort((a, b) => (a.modeofPayment > b.modeofPayment ? -1 : 1));
}

if (sort.active == "payment") {
  if (sort.direction == "asc")
      this.patientHistory.sort((a, b) => (a.payment < b.payment ? -1 : 1));
  else
      this.patientHistory.sort((a, b) => (a.payment > b.payment ? -1 : 1));
}

  this.patientsappointments = new MatTableDataSource(this.patientHistory);
  this.patientsappointments.paginator = this.paginator;

}



// ExportTOExcel() {
//   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
//   const wb: XLSX.WorkBook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, 'DeptReports');

//   XLSX.writeFile(wb, 'DeptReports.xlsx');
// }



// exportpdf1() {
//   // debugger
//   const prepare = [];
//   this.deptReports.filteredData.forEach(e => {
//       const tempObj = [];
//       tempObj.push(e.department);
//       tempObj.push(e.service);
//       tempObj.push(e.count);
//       tempObj.push(e.totalBilled);
//       tempObj.push(e.totalCollected);
//       prepare.push(tempObj);
//   });

//   const doc = new jsPDF();


//   const tableElement = this.table.nativeElement as HTMLTableElement;

//   // Extract headers from the <thead>
//   const headerRow = tableElement.querySelector('thead tr');
//   const head = [
//     Array.from(headerRow?.querySelectorAll('th') || []).map(th =>
//       th.textContent?.trim() || ''
//     )
//   ];

//   // Extract body rows from <tbody>
//   const rows = Array.from(tableElement.querySelectorAll('tbody tr'));
//   const body = rows.map(row =>
//     Array.from(row.querySelectorAll('td')).map(td =>
//       td.textContent?.trim() || ''
//     )
//   );

//   // Format and add selected dates with left padding
//   // const fromDate = this.formatDate(this.dept.fromDate);
//   // const toDate = this.formatDate(this.dept.toDate);

//   const fromDate = this.formatDate(this.cardrep.fromDate);
//   const toDate = this.formatDate(this.cardrep.toDate);

//   const addHeader = (doc, logo, fromDate, toDate) => {
//       doc.addImage(logo, 'PNG', 10, 10, 50, 20); // Add logo
//       doc.setFontSize(12);
//       const textWidth = doc.getTextWidth(`From Date: ${fromDate.padStart(10)}  To Date: ${toDate.padStart(10)}`);
//       const startX = (doc.internal.pageSize.width - textWidth) / 2; // Align text in the middle
//       doc.text(`From Date: ${fromDate.padStart(10)}  To Date: ${toDate.padStart(10)}`, startX, 40);
//   };

//   // Load logo and generate PDF
//   const logo = new Image();
//   logo.src = 'assets/images/logo/LOGO.png'; // path to your logo file
//   logo.onload = () => {
//       // Add the first page header
//       addHeader(doc, logo, fromDate, toDate);

//       // Add table with margins to avoid overlapping with header and footer
//       autoTable(doc, {
//           head: head,
//           body: body,
//           startY: 50, // Start position below the header
//           margin: { left: 10, right: 10, bottom: 30, top: 50 }, // Margins to avoid overlap
//           didDrawPage: function (data) {
//               if (data.pageNumber > 1) {
//                   addHeader(doc, logo, fromDate, toDate);
//               }

//               // Footer
//               const footerText = `Advance Rheumatology Center\n6-3-652, 1st Floor, Kautilya Building, near Erramanzil bus stop, Somajiguda,\nHyderabad, Telangana 500082, Contact No : 9247435254`;
//               doc.setFontSize(10);
//               doc.text(footerText, 13, doc.internal.pageSize.height - 20);
//           }
//       });

//       // Save PDF
//       doc.save('deptReports.pdf');
//   };
// }


exportpdf1() {
  const doc = new jsPDF();

  const tableElement = this.table.nativeElement as HTMLTableElement;

  // Extract headers from <thead>
  const headerRow = tableElement.querySelector('thead tr');
  const head = [
    Array.from(headerRow?.querySelectorAll('th') || []).map(th =>
      th.textContent?.trim() || ''
    )
  ];

  // Extract body rows from <tbody>
  const rows = Array.from(tableElement.querySelectorAll('tbody tr'));
  const body = rows.map(row =>
    Array.from(row.querySelectorAll('td')).map(td =>
      td.textContent?.trim() || ''
    )
  );

  const fromDate = this.formatDate(this.cardrep.fromDate);
  const toDate = this.formatDate(this.cardrep.toDate);

  const addHeader = (doc, logo, fromDate, toDate) => {
    doc.addImage(logo, 'PNG', 10, 10, 50, 20); // Add logo
    doc.setFontSize(12);
    const text = `From Date: ${fromDate.padStart(10)}  To Date: ${toDate.padStart(10)}`;
    const textWidth = doc.getTextWidth(text);
    const startX = (doc.internal.pageSize.width - textWidth) / 2;
    doc.text(text, startX, 40);
  };

  const logo = new Image();
  logo.src = 'assets/images/logo/LOGO.png';

  logo.onload = () => {
    addHeader(doc, logo, fromDate, toDate);

    // 1. Add Consultation Billing
    let currentY = 50;
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Consultation Billing', 14, currentY);

    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');

    const billingData = [
      ['Total Billed', this.totalBilled],
      ['Total Collected', this.totalCollected],
      ['Cash', this.cash],
      ['Card', this.card],
      ['UPI', this.wallet],
      ['NetBanking', this.outstanding],
      ['Unq. Billed Patients', this.billedpatients],
      ['Total Number of Patients', this.totalNumberOfPatients]
    ];

    billingData.forEach((item, index) => {
      doc.text(`${item[0]} : ${item[1]}`, 14, currentY + 10 + (index * 7));
    });

    currentY = currentY + 10 + (billingData.length * 7) + 5;

    // 2. Add Service Billing label
    doc.setFontSize(13);
    doc.setFont(undefined, 'bold');
    doc.text('Service Billing', 14, currentY);
    currentY += 7;

    // 3. Add the HTML table as PDF table
    autoTable(doc, {
      head: head,
      body: body,
      startY: currentY,
      margin: { left: 10, right: 10, bottom: 30 },
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
      bodyStyles: { fontSize: 11 },
      didDrawPage: function (data) {
        if (data.pageNumber > 1) {
          addHeader(doc, logo, fromDate, toDate);
        }
        const footerText = `Advance Rheumatology Center\n6-3-652, 1st Floor, Kautilya Building, near Erramanzil bus stop, Somajiguda,\nHyderabad, Telangana 500082, Contact No : 9247435254`;
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal'); // <-- Reset font to normal
        doc.text(footerText, 13, doc.internal.pageSize.height - 20);
      }
    });

    doc.save('deptReports.pdf');
  };
}




  
 
  
  




// ExportTOExcel() {
//   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
//   const wb: XLSX.WorkBook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, 'DeptReports');

//   XLSX.writeFile(wb, 'DeptReports.xlsx');
// }


ExportTOExcel() {
  // 1. Create a hidden billing table manually
  const billingTable = document.createElement('table');

  const billingRows = [
    ['Consultation Billing', ''],
    ['Total Billed', this.totalBilled],
    ['Total Collected', this.totalCollected],
    ['Cash', this.cash],
    ['Card', this.card],
    ['UPI', this.wallet],
    ['NetBanking', this.outstanding],
    ['Unq. Billed Patients', this.billedpatients],
    ['Total Number of Patients', this.totalNumberOfPatients]
  ];

  billingRows.forEach(row => {
    const tr = document.createElement('tr');

    const td1 = document.createElement('td');
    td1.innerText = String(row[0]);
    tr.appendChild(td1);

    const td2 = document.createElement('td');
    td2.innerText = row[1] !== undefined ? String(row[1]) : '';
    tr.appendChild(td2);

    billingTable.appendChild(tr);
  });

  const billingSheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(billingTable);

  // 2. Create a separate 'Service Billing' title row manually
  const serviceBillingTable = document.createElement('table');
  const titleRow = document.createElement('tr');
  const titleCell = document.createElement('td');
  titleCell.innerText = 'Service Billing';
  titleRow.appendChild(titleCell);
  serviceBillingTable.appendChild(titleRow);

  const serviceBillingSheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(serviceBillingTable);

  // 3. Convert the existing HTML table to a worksheet
  const originalSheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);

  // 4. Merge everything manually
  const mergedSheet: XLSX.WorkSheet = { ...billingSheet };

  // --- First: billingSheet is already added ---

  // --- Then: Service Billing title ---
  const billingRange = XLSX.utils.decode_range(billingSheet['!ref'] || 'A1');
  const startRowForServiceBilling = billingRange.e.r + 3; // 3 rows gap after billing table

  Object.keys(serviceBillingSheet).forEach(cell => {
    if (cell[0] === '!') return;

    const cellRef = XLSX.utils.decode_cell(cell);
    const newCellRef = XLSX.utils.encode_cell({ r: cellRef.r + startRowForServiceBilling, c: cellRef.c });

    mergedSheet[newCellRef] = serviceBillingSheet[cell];
  });

  // --- Then: original HTML table ---
  const serviceBillingRange = XLSX.utils.decode_range(serviceBillingSheet['!ref'] || 'A1');
  const startRowForOriginalTable = startRowForServiceBilling + serviceBillingRange.e.r + 1; // 2 rows gap after Service Billing title

  Object.keys(originalSheet).forEach(cell => {
    if (cell[0] === '!') return;

    const cellRef = XLSX.utils.decode_cell(cell);
    const newCellRef = XLSX.utils.encode_cell({ r: cellRef.r + startRowForOriginalTable, c: cellRef.c });

    mergedSheet[newCellRef] = originalSheet[cell];
  });

  // Update the overall range
  const finalRow = startRowForOriginalTable + XLSX.utils.decode_range(originalSheet['!ref'] || 'A1').e.r;
  const finalCol = Math.max(
    billingRange.e.c,
    serviceBillingRange.e.c,
    XLSX.utils.decode_range(originalSheet['!ref'] || 'A1').e.c
  );

  mergedSheet['!ref'] = XLSX.utils.encode_range({
    s: { c: 0, r: 0 },
    e: { c: finalCol, r: finalRow }
  });

  // 5. Create workbook and export
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, mergedSheet, 'DeptReports');

  XLSX.writeFile(wb, 'DeptReports.xlsx');
}


ExportTOExcel1() {
  const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table1.nativeElement);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  
  // If the data is an array of objects, convert it to an array of arrays
  const data = this.summaryReports.data.map(item => {
      return [
          this.datePipe.transform(item.date, 'dd/MM/yyyy'),
          item.newRegistrations,
          item.billedPatients,
          item.consultation,
          item.lab,
          item.others,
          item.totEarnings
      ];
  });

  // Add the headers separately
  const headers = ['Date', 'New Registration', 'Billed Patients', 'Consultations', 'Lab', 'Others', 'Total Earnings'];
  const wsSummary: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([headers, ...data]);

  XLSX.utils.book_append_sheet(wb, wsSummary, 'SummaryReports');
  XLSX.writeFile(wb, 'SummaryReports.xlsx');
}



  
  // ngAfterViewInit(): void {
  //   if (this.myBarChart) {
  //     this.myBarChart.destroy(); // Destroy existing chart
  //   }
  
  //   if (!this.barChart || !this.barChart.nativeElement) {
  //     console.error('Cannot access barChart element');
  //     return;
  //   }

  //     const ctx = this.barChart.nativeElement.getContext('2d');
    
  //     const gradient = ctx.createLinearGradient(0, 0, 0, 290);
  //     gradient.addColorStop(0, 'rgba(0, 214, 57, 1)');   // Top color
  //     gradient.addColorStop(1, 'rgba(0, 100, 30, 1)');   // Bottom color
    
  //     this.myBarChart.data.datasets[0].backgroundColor = gradient;
  
    

  //   this.myBarChart = new Chart(this.barChart.nativeElement, {
  //     type: 'bar',
  //     data: {
  //       labels: [this.date],
  //       datasets: [
  //         // {
  //         //   label: 'Billed Patients',
  //         //   data: [0], // Assuming the data for 'Total Amount' is 4000
  //         //   backgroundColor: 'black',
  //         //   borderColor: 'black',
  //         //   borderWidth: 1
  //         // },
  //         {
  //           label: 'Consultation',
  //           data: [this.consultation], // Assuming the data for 'Consultation' is 2500
  //           // backgroundColor: 'rgb(0, 214, 57)',
  //           backgroundColor: '', // this will be set in ngAfterViewInit()
  //           borderColor: 'green',
  //           borderWidth: 1,
  //           barThickness: 200
  //         },
  //         {
  //           label: 'Total Earnings',
  //           data: [this.totalEarnings], // Assuming the data for 'Total Amount' is 4000
  //           backgroundColor: 'rgb(255, 60, 30)',
  //           borderColor: 'red',
  //           borderWidth: 1,
  //           barThickness: 200
  //         },
  //         {
  //           label: 'Lab',
  //           data: [0], // Assuming the data for 'Total Amount' is 4000
  //           backgroundColor: 'orange',
  //           borderColor: 'orange',
  //           borderWidth: 1,
  //           barThickness: 200
  //         },
  //         {
  //           label: 'Others',
  //           data: [0], // Assuming the data for 'Total Amount' is 4000
  //           backgroundColor: 'blue',
  //           borderColor: 'blue',
  //           borderWidth: 1,
  //           barThickness: 200
  //         },
         
          
         
  //       ]
  //     },
  //     options: {
  //       indexAxis: 'x', // Place the labels at the bottom of the x-axis
  //       plugins: {
  //         tooltip: {
  //         },
  //         legend: {
  //             position: bottom,
  //             display: true,
  //             labels: {
  //                 boxWidth: 10
  //             }
  //         }
  //     },
  //       scales: {
  //         y: {
  //           // Assuming the max value is 15000
  //           title: {
  //             display: true,
  //             text: 'Amount'
  //           },
  //           beginAtZero: true,
  //           ticks: {
  //             callback: function(value, index, values) {
  //               return value ;
  //             }
  //           }
  //         }
  //       },
        
  //     }
      
      
  //   });    
  // }


  ngAfterViewInit(): void {
    // debugger
    if (this.myBarChart) {
      this.myBarChart.destroy(); // Destroy existing chart
    }
    if (this.myBarChart1) {
      this.myBarChart1.destroy();
    }
  
    if (!this.barChart || !this.barChart.nativeElement || !this.barChart1 || !this.barChart1.nativeElement) {
      console.error('Cannot access barChart element');
      return;
    }
  
    const ctx = this.barChart.nativeElement.getContext('2d');
    const ctx1 = this.barChart1.nativeElement.getContext('2d');

  
    // Gradients for each bar
    const gradientTotalNumberOfPatients = ctx1.createLinearGradient(0, 0, 0, 290);
    gradientTotalNumberOfPatients.addColorStop(0, 'rgba(224, 120, 78, 1)'); 
    gradientTotalNumberOfPatients.addColorStop(1, 'rgba(111, 78, 55, 1)');       
        

    const gradientConsultation = ctx.createLinearGradient(0, 0, 0, 290);
    gradientConsultation.addColorStop(0, 'rgba(0, 214, 57, 1)');
    gradientConsultation.addColorStop(1, 'rgba(0, 100, 30, 1)');
  
    const gradientEarnings = ctx.createLinearGradient(0, 0, 0, 290);
    gradientEarnings.addColorStop(0, 'rgba(255, 100, 80, 1)');
    gradientEarnings.addColorStop(1, 'rgba(180, 30, 10, 1)');
  
    const gradientLab = ctx.createLinearGradient(0, 0, 0, 290);
    gradientLab.addColorStop(0, 'rgba(255, 190, 60, 1)');
    gradientLab.addColorStop(1, 'rgba(200, 100, 0, 1)');
  
    const gradientOthers = ctx.createLinearGradient(0, 0, 0, 290);
    gradientOthers.addColorStop(0, 'rgba(70, 150, 255, 1)');
    gradientOthers.addColorStop(1, 'rgba(20, 70, 180, 1)');


      // Chart for Consultation, Total Earnings, Lab and Others
    this.myBarChart = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: [this.date],
        datasets: [
          {
            label: 'Consultation',
            data: [this.consultation],
            backgroundColor: gradientConsultation,
            borderColor: 'green',
            borderWidth: 1,
          },
          {
            label: 'Total Earnings',
            data: [this.totalEarnings],
            backgroundColor: gradientEarnings,
            borderColor: 'red',
            borderWidth: 1,
          },
          {
            label: 'Lab',
            data: [0],
            backgroundColor: gradientLab,
            borderColor: 'orange',
            borderWidth: 1,
          },
          {
            label: 'Others',
            data: [0],
            backgroundColor: gradientOthers,
            borderColor: 'blue',
            borderWidth: 1,
          }
        ]
      },
      options: {
        indexAxis: 'x',
        plugins: {
          tooltip: {
            enabled: true
          },
          legend: {
            position: 'bottom',
            display: true,
            labels: {
              boxWidth: 10
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Amount'
            },
            ticks: {
              callback: function (value) {
                return value;
              }
            }
          },
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          }
        },
        datasets: {
          bar: {
            barThickness: undefined,       // Let Chart.js calculate
            maxBarThickness: 60,           // Max width for each bar
            categoryPercentage: 0.6,       // Space each group takes (smaller = more gap between categories)
            barPercentage: 0.7             // Width of each bar in its group (smaller = more gap between bars)
          }
        }
      }
      
    });

     // Chart for Total Number Of Patients
  this.myBarChart1 = new Chart(this.barChart1.nativeElement, {
    type: 'bar',
    data: {
      labels: [this.date],
      datasets: [
        {
          label: 'Total Number of Patients',
          data: [this.totalNumberOfPatients],
          backgroundColor: gradientTotalNumberOfPatients,
          borderColor: 'brown',
          borderWidth: 1,
        }
      ]
    },
    options: {
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 10 } },
        tooltip: { enabled: true }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Number of Patients' }
        },
        x: {
          title: { display: true, text: 'Date' }
        }
      },
      datasets: {
        bar: {
          maxBarThickness: 60,
          categoryPercentage: 0.6,
          barPercentage: 0.7
        }
      }
    }
  });

  }
  

  

  areDatesSelected(): boolean {
    return !!this.fromDate && !!this.toDate;
}

  ngOnInit(): void {
    this.myButton.nativeElement.click();
    this.showGraph()
    this.loginDetails = JSON.parse(localStorage.getItem('loginDetails'));
    if (this.loginDetails) {
        this.roleID = this.loginDetails.roleID;
        this.registrationID = this.loginDetails.registrationID;
    }
    const dateforToday = new Date();
    this.appFromDate = new Date();
    this.appToDate = new Date();
  }

  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
}
applyFilter() {
    this.deptReports.filter = this.searchKey.trim().toLowerCase();
    this.patientsappointments.filter = this.searchKey.trim().toLowerCase();

}

showGraph(){

}

syncDateSetTwo(event: MatDatepickerInputEvent<Date>, datepicker: number) {
  if (datepicker === 1) {
    this.dept.fromDate = event.value;
  } else if (datepicker === 2) {
    this.dept.toDate = event.value;
  }
}


getServiceDetailsByDept(){
 // debugger
  // var data = {
  //   fromdate: new Date(this.cardrep.fromDate),
  //   todate: new Date(this.cardrep.toDate),
  //   departmentId: 1
  // };

  var data = {
    fromdate: (() => {
      let d = new Date(this.cardrep.fromDate);
      d.setDate(d.getDate() + 1); // Use 'd' instead of data.fromdate
      d.setHours(0, 0, 0, 0);
      return d;
    })(),
    todate: (() => {
      let d = new Date(this.cardrep.toDate);
      d.setDate(d.getDate() + 1); // Use 'd' instead of data.todate
      d.setHours(0, 0, 0, 0);
      return d;
    })(),
    departmentId: 1
  };
  

     // Ensure the dates are correctly set (timezone adjustment if necessary)
    //  data.fromdate.setHours(0, 0, 0, 0); // Adjust time to midnight to avoid timezone issues
    //  data.todate.setHours(0, 0, 0, 0); // Adjust time to midnight to avoid timezone issues

  // Add one day to the `todate`
  // data.todate.setDate(data.todate.getDate() + 1);
  // data.fromdate.setDate(data.fromdate.getDate() + 1);
this.utilitiesService.getServiceDetailsByDept(data).subscribe(
  (data) => {
    if (data) {
     // debugger
      this.deptReports = new MatTableDataSource(data.result.departmentServiceDetails);
      this.deptReports.sort = this.sort;
      // this.deptReports.paginator = this.paginator;
      this.deptReports.paginator = this.paginator2;
    }
  })

  this.GetPatientData();

}



getSummaryReports() {
  // debugger
  // var data = {
  //   fromdate: new Date(this.cardrep.fromDate).setHours(0, 0, 0, 0),
  //   todate: new Date(this.cardrep.toDate).setHours(0, 0, 0, 0),
  //   departmentId: 1
  // };

  var data = {
    fromdate: (() => {
      let d = new Date(this.cardrep.fromDate);
      d.setDate(d.getDate() + 1); // Use 'd' instead of data.fromdate
      d.setHours(0, 0, 0, 0);
      return d;
    })(),
    todate: (() => {
      let d = new Date(this.cardrep.toDate);
      d.setDate(d.getDate() + 1); // Use 'd' instead of data.todate
      d.setHours(0, 0, 0, 0);
      return d;
    })(),
    departmentId: 1
  };

    //  // Ensure the dates are correctly set (timezone adjustment if necessary)
    //  data.fromdate.setHours(0, 0, 0, 0); // Adjust time to midnight to avoid timezone issues
    //  data.todate.setHours(0, 0, 0, 0); // Adjust time to midnight to avoid timezone issues

  // Add one day to the `todate`
  // data.todate.setDate(data.todate.getDate() + 1);
  // data.fromdate.setDate(data.fromdate.getDate() + 1);

  this.utilitiesService.getSummaryReports(data).subscribe(
    (data) => {
      if (data) {
        // debugger
        this.consultation = data.result.consultation;
        this.totalEarnings = data.result.totEarnings;
        const resultdate = data.result.date;
        this.date = this.datePipe.transform(resultdate, 'dd/MM/yyyy');
        this.summaryReports = new MatTableDataSource<any>([data.result]);
        this.summaryReports.sort = this.sort;
      //  this.summaryReports.paginator = this.paginator;
        this.ngAfterViewInit();
      }
    }
  );
}

toLocalDateOnly(dateStr: string): string {
  const parts = dateStr.split('-'); // assuming yyyy-MM-dd
  const localDate = new Date(
    parseInt(parts[0], 10),
    parseInt(parts[1], 10) - 1,
    parseInt(parts[2], 10)
  );
  const year = localDate.getFullYear();
  const month = ('0' + (localDate.getMonth() + 1)).slice(-2);
  const day = ('0' + localDate.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}

getCardReports() {
  // debugger
  // var data = {
  //   fromdate: new Date(this.cardrep.fromDate),
  //   todate: new Date(this.cardrep.toDate),
  //   departmentId: 1
  // };

  var data = {
    fromdate: (() => {
      let d = new Date(this.cardrep.fromDate);
      d.setDate(d.getDate() + 1); // Use 'd' instead of data.fromdate
      d.setHours(0, 0, 0, 0);
      return d;
    })(),
    todate: (() => {
      let d = new Date(this.cardrep.toDate);
      d.setDate(d.getDate() + 1); // Use 'd' instead of data.todate
      d.setHours(0, 0, 0, 0);
      return d;
    })(),
    departmentId: 1
  };
  
  // this.formatDate(data.fromdate);
   // Ensure the dates are correctly set (timezone adjustment if necessary)
    // data.fromdate.setHours(0, 0, 0, 0); // Adjust time to midnight to avoid timezone issues
    // data.todate.setHours(0, 0, 0, 0); // Adjust time to midnight to avoid timezone issues

  // Add one day to the `todate`
  // data.todate.setDate(data.todate.getDate() + 1);
  // data.fromdate.setDate(data.fromdate.getDate() + 1);

  this.utilitiesService.getCardReports(data).subscribe(
    (data) => {
      if (data) {
        console.log("")
        this.totalBilled = data.result.totBilled;
        this.totalCollected = data.result.totCollected;
        this.cash = data.result.cash;
        this.card = data.result.card;
        this.wallet=data.result.upi;
        this.outstanding=data.result.netbanking;
        this.billedpatients = data.result.unqBilledPatients;
      }
    }
  );

  this.getSummaryReports();
  this.getServiceDetailsByDept();


}


onDateChange(data) {
  //debugger;
  //var s=data
  // this.appFromDate= this.datepipe.transform(data.value, 'dd/MM/yyyy');
  //this.datepipe.transform(from, 'd MMM yyyy');
}

// GetPatientData() {
//   //debugger
//   //this.appt.FromDate=from;
//   // this.appt.ToDate=to;
//   if (this.patientList.length > 0) {
//       this.hasData = true;
//     } else {
//       this.hasData = false;
//     }

//   this.appt.FromDate = this.cardrep.fromDate, 'd MMM yyyy';
//   this.appt.ToDate = this.cardrep.toDate, 'd MMM yyyy';
  

//   // let arr = [];
//   // arr.push({ fromDate: from })
//   // arr.push({ toDate: to })

//   //debugger;
//   this.reportService.getReportPatientList(this.appt).subscribe(
//       (data) => {
//           //debugger;
//           if (data) {
//               if (this.roleID == 2) {
//                   this.patientsappointments = data;
//                   this.patientsappointments = this.patientsappointments.filter((a) => a.doctorID == this.registrationID);
//               }
//               else {
//                   this.patientsappointments = data;
//               }
//               this.patientList = data;
//               if(this.patientsappointments.length>0){
//                   this.Repdata=true
//               }
//               else{
//                   this.Repdata=false
//               }

//               this.patientsappointments = new MatTableDataSource(this.patientsappointments);                   
//               this.patientsappointments.sort = this.sort;
//               // this.patientsappointments.paginator = this.paginator;
//               this.patientsappointments.paginator = this.paginator1;
//               this.totalPrice();
//           }
//       },

//       () => {

//       }

//   );

// }



// formatDate(date: Date): string {
//   const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
//   return date.toLocaleDateString('en-US', options);
// }



GetPatientData() {
  // debugger;
  // Assuming this.cardrep.fromDate and this.cardrep.toDate are valid date strings
  let fromDate = new Date(this.cardrep.fromDate);
  let toDate = new Date(this.cardrep.toDate);

  // Ensure the dates are correctly set (timezone adjustment if necessary)
  fromDate.setHours(0, 0, 0, 0); // Adjust time to midnight to avoid timezone issues
  toDate.setHours(0, 0, 0, 0); // Adjust time to midnight to avoid timezone issues

  // Log the dates to ensure they are correct
  console.log("Adjusted FromDate:", fromDate);
  console.log("Adjusted ToDate:", toDate);

  // Format dates as 'd MMM yyyy'
  this.appt.FromDate = this.formatDate(fromDate);
  this.appt.ToDate = this.formatDate(toDate);

  if (this.patientList.length > 0) {
    this.hasData = true;
  } else {
    this.hasData = false;
  }

  // Debug log to see the payload
  console.log("Payload:", this.appt);

  this.reportService.getReportPatientList(this.appt).subscribe(
    (data) => {
      // debugger;
      if (data) {
        if (this.roleID == 2) {
          this.patientsappointments = data;
          this.patientHistory = data;
          this.patientsappointments = this.patientsappointments.filter((a) => a.doctorID == this.registrationID);
          this.patientHistory = this.patientHistory.filter((a) => a.doctorID == this.registrationID);

        } else {
          this.patientsappointments = data;
          this.patientHistory = data;
        }
        this.patientList = data;
        if (this.patientsappointments.length > 0) {
          this.Repdata = true;
        } else {
          this.Repdata = false;
        }
        // debugger

        this.patientsappointments = new MatTableDataSource(this.patientsappointments);
        this.patientsappointments.sort = this.sort;
        this.patientsappointments.paginator = this.paginator1;
        this.totalPrice();
        this.totalNumberOfPatients = this.patientsappointments.data.length;
        this.ngAfterViewInit();

       
      }
    },
    (error) => {
      // Handle error
      console.error("Error:", error);
    }
  );
}






formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options); // Using 'en-GB' for 'd MMM yyyy' format
}


totalPrice() {
  let total = Number(0);
  for (let data of this.patientList) {
      total =total+ Number(data.payment);
  }      
  this.patientTotalAmount=Number(total);  
}

// onSearchClear3() {
//   this.searchKey3 = "";
//   this.applyFilter3();
// }
// applyFilter3() {
//   this.patientsappointments.filter = this.searchKey3.trim().toLowerCase();
  
// }

// exportpdf3(){
//   //debugger
//     var prepare=[];
//   this.patientsappointments.filteredData.forEach(e=>{
//     var tempObj =[];
//     tempObj.push(e.appointmentID);
//     tempObj.push(e.patientARCID);
//     tempObj.push(e.patient);
//     tempObj.push(e.gender);
//     tempObj.push( e.age);
//     tempObj.push( e.mobile);
//     tempObj.push( e.serviceName);
//     tempObj.push(e.serviceDate);
//     tempObj.push(e.discount);
//     tempObj.push(e.payment);
//     tempObj.push(e.modeofPayment);
//     prepare.push(tempObj);
//   });

//   const doc = new jsPDF();
//   autoTable(doc,{
//       head: [[' SL','Patient ARCID','Name','Gender','Age','Mobile',' Service Name','Last Visit','Discount','Payment','Modeof Payment']],
//       body: prepare,
//   });
//   doc.save('Reports' + '.pdf');

//   // const doc = new jsPDF("p", "pt", "a4");
//   // const source = document.getElementById("table1");
//   // // doc.text("Test", 40, 20);
//   // doc.setFontSize(20)
//   // doc.html(source, {
//   //   callback: function(pdf) {
//   //     doc.output("dataurlnewwindow"); // preview pdf file when exported
//   //   }
//   // });
// }


// exportpdf3() {
//     const prepare = [];
//     this.patientsappointments.filteredData.forEach(e => {
//         const tempObj = [];
//         tempObj.push(e.appointmentID);
//         tempObj.push(e.patientARCID);
//         tempObj.push(e.patient);
//         tempObj.push(e.gender);
//         tempObj.push(e.age);
//         tempObj.push(e.mobile);
//         tempObj.push(e.serviceName);
//         tempObj.push(e.serviceDate);
//         tempObj.push(e.discount);
//         tempObj.push(e.payment);
//         tempObj.push(e.modeofPayment);
//         prepare.push(tempObj);
//     });

//     const doc = new jsPDF();
    
//     // Add logo
//     const logo = new Image();
//     logo.src = 'assets/images/logo/LOGO.png'; // path to your logo file
//     logo.onload = () => {
//         doc.addImage(logo, 'PNG', 10, 10, 50, 20); // adjust the positioning and size as needed
        
//         // Format dates to "25 May 2024"
//         const formatDate = (date) => {
//             const d = new Date(date);
//             const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//             return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
//         };

//         const formattedFromDate = formatDate(this.appFromDate);
//         const formattedToDate = formatDate(this.appToDate);
        
//         // Add date range in a single line with padding left 10px and space between dates
//         doc.setFontSize(12);
//         const textWidth = doc.getTextWidth(`From Date: ${formattedFromDate}  to  ${formattedToDate}`);
//         const startX = (doc.internal.pageSize.width - textWidth) / 2; // Align text in the middle
//         doc.text(`From Date: ${formattedFromDate}  to  ${formattedToDate}`, 120, 40);

//         // Add table with reduced distance between dates and table data
//         autoTable(doc, {
//             head: [[' SL', 'Patient ARCID', 'Name', 'Gender', 'Age', 'Mobile', 'Service Name', 'Last Visit', 'Discount', 'Payment', 'Mode of Payment']],
//             body: prepare,
//             startY: 50, // adjust the start position to reduce distance
//             margin: { left: 10, right: 10 } // setting left and right margins to 10
//         });
//         const footerText = `Advance Rheumatology Center\n6-3-652, 1st Floor, Kautilya Building, near Erramanzil bus stop, Somajiguda,\nHyderabad, Telangana 500082, Contact No : 9247435254`;
//         doc.setFontSize(10);
//         doc.text(footerText, 13, doc.internal.pageSize.height - 20);

//         // Save PDF
//         doc.save('Reports.pdf');
//     };
// }


exportpdf3() {
  // debugger
  const prepare = [];
  // this.patientsappointments.filteredData.forEach(e => {
  //     const tempObj = [];
  //     tempObj.push(e.appointmentID);
  //     tempObj.push(e.patientARCID);
  //     tempObj.push(e.patient);
  //     tempObj.push(e.gender);
  //     tempObj.push(e.age);
  //     tempObj.push(e.mobile);
  //     tempObj.push(e.serviceName);
  //     tempObj.push(e.serviceDate);
  //     tempObj.push(e.discount);
  //     tempObj.push(e.payment);
  //     tempObj.push(e.modeofPayment);
  //     prepare.push(tempObj);
  // });

  const doc = new jsPDF();
  
  // Get the table element by its class name
  const table = document.querySelector('.example-container1 table') as HTMLTableElement;

 // Extract dynamic headers from <thead>
 const headerRow = table.querySelector('thead tr');
 const head = [
   Array.from(headerRow?.querySelectorAll('th') || []).map(th =>
     th.textContent?.trim() || ''
   )
 ];


 // Extract body from <tbody>
 const rows = Array.from(table.querySelectorAll('tbody tr'));
 const body = rows.map(row =>
   Array.from(row.querySelectorAll('td')).map(td =>
     td.textContent?.trim() || ''
   )
 );


  // Add logo
  const logo = new Image();
  logo.src = 'assets/images/logo/LOGO.png'; // path to your logo file
  logo.onload = () => {
      // Format dates to "25 May 2024"
      const formatDate = (date) => {
          const d = new Date(date);
          const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
          return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      };

      
      // const formattedFromDate = formatDate(this.appFromDate);
      // const formattedToDate = formatDate(this.appToDate);

      const formattedFromDate = formatDate(this.cardrep.fromDate);
      const formattedToDate = formatDate(this.cardrep.toDate);

      const addHeader = (doc, logo, formattedFromDate, formattedToDate) => {
          // Add logo
          doc.addImage(logo, 'PNG', 10, 10, 50, 20);

          // Add date range
          doc.setFontSize(12);
          const textWidth = doc.getTextWidth(`From Date: ${formattedFromDate}  to  ${formattedToDate}`);
          const startX = (doc.internal.pageSize.width - textWidth) / 2; // Align text in the middle
          doc.text(`From Date: ${formattedFromDate}  to  ${formattedToDate}`, startX, 40);
      };

      // Add the first page header
      addHeader(doc, logo, formattedFromDate, formattedToDate);

      // Add table with reduced distance between dates and table data
      autoTable(doc, {
          head: head,
          body: body,
          startY: 50, // Adjust the start position to leave space for the header
          margin: { left: 10, right: 10, bottom: 30, top: 50 }, // Setting left, right margins to 10, bottom margin to 30, and top margin to 50 to avoid overlap
          didDrawPage: function (data) {
              if (data.pageNumber > 1) {
                  addHeader(doc, logo, formattedFromDate, formattedToDate);
              }

              // Footer
              const footerText = `Advance Rheumatology Center\n6-3-652, 1st Floor, Kautilya Building, near Erramanzil bus stop, Somajiguda,\nHyderabad, Telangana 500082, Contact No : 9247435254`;
              doc.setFontSize(10);
              doc.text(footerText, 13, doc.internal.pageSize.height - 20);
          }
      });

      // Save PDF
      doc.save('Reports.pdf');
  };
}



ExportTOExcel3() {
  // Get the table element by its class name
  const table = document.querySelector('.example-container1 table');

  // Convert the table to a worksheet
  const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);

  // Create a new workbook and append the worksheet
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  // Save the workbook as an Excel file
  XLSX.writeFile(wb, 'SheetJS.xlsx');
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

}
