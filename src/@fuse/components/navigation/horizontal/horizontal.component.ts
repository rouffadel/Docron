import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseNavigationItem } from '@fuse/components/navigation/navigation.types';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseUtilsService } from '@fuse/services/utils/utils.service';

@Component({
    selector: 'fuse-horizontal-navigation',
    templateUrl: './horizontal.component.html',
    styleUrls: ['./horizontal.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'fuseHorizontalNavigation',
})
export class FuseHorizontalNavigationComponent
    implements OnChanges, OnInit, OnDestroy
{
    @Input() name: string = this._fuseUtilsService.randomId();
    @Input() navigation: FuseNavigationItem[];
    navItems: any = [];
    roleID: any;
    onRefreshed: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseUtilsService: FuseUtilsService
    ) {
        this.roleID = localStorage.getItem('roleID');
        if (this.roleID == 1) {
            //Admin
            this.navItems.push(
                {
                    id: 'Admindashboard',
                    title: 'Dashboard',
                    type: 'basic',
                    link: '/Admindashboard',
                },
                {
                    id: 'Appointments',
                    title: 'Appointments',
                    type: 'basic',
                    link: '/Appointments',
                },
                {
                    id: 'DoctorsCalender',
                    title: "Doctor" + "'" + "s Calendar",
                    type: 'basic',
                    //link: '/DoctorsCalender'
                    link: '/calendar'
                },
                // {
                //     id: 'Patients',
                //     title: 'Patients',
                //     type: 'basic',
                //     link: '/Patients',
                // },
                {
                    id: 'Employees',
                    title: 'Employees',
                    type: 'basic',
                    link: '/Employess',
                },
                {
                    id: 'MyPatients',
                    title: 'My Patients',
                    type: 'basic',
                    link: '/MyPatients',
                },
                {
                    id: 'Medicine',
                    title: 'Medicine Data Entry',
                    type: 'basic',
                    link: '/Medicine',
                },
                {
                    id: 'Reports',
                    title: 'Reports',
                    type: 'basic',
                    link: '/admin-reports',
                },
                // {
                //     id: 'Services',
                //     title: 'Services',
                //     type: 'basic',
                //     link: '/service',
                // }
            );
        } else if (this.roleID == 2) {
            //Doctor

            this.navItems.push(
                //{
                //    id: 'Admindashboard',
                //    title: 'Dashboard',
                //    type: 'basic',
                //    link: '/Admindashboard',
                //},
                {
                    id: 'Appointments',
                    title: 'Appointments',
                    type: 'basic',
                    link: '/Appointments',
                },
                {
                    id: 'DoctorsCalender',
                    title: "Doctor" + "'" + "s Calendar",
                    type: 'basic',
                    //link: '/DoctorsCalender'
                    link: '/calendar'
                },
                // {
                //     id: 'Patients',
                //     title: 'Patients',
                //     type: 'basic',
                //     link: '/Patients',
                // }
                {
                    id: 'MyPatients',
                    title: 'My Patients',
                    type: 'basic',
                    link: '/MyPatients',
                },

                {
                    id: 'Reports',
                    title: 'Reports',
                    type: 'basic',
                    link: '/admin-reports',
                },

            );
        } else if (this.roleID == 3) {
            //FrontDesk
            this.navItems.push(
                //{ id: 'Admindashboard', title: 'Dashboard', type: 'basic', link: '/Admindashboard' },
                {
                    id: 'Appointments',
                    title: 'Appointments',
                    type: 'basic',
                    link: '/Appointments',
                },
                {
                    id: 'DoctorsCalender',
                    title: "Doctor" + "'" + "s Calendar",
                    type: 'basic',
                    //link: '/DoctorsCalender'
                    link: '/calendar'
                },

                {
                    id: 'Reports',
                    title: 'Reports',
                    type: 'basic',
                    link: '/admin-reports',
                },

                // {
                //     id: 'Patients',
                //     title: 'Patients',
                //     type: 'basic',
                //     link: '/Patients',
                // }
            );
        } else if (this.roleID == 4) {
            //Patient
            this.navItems.push(
                {
                    id: 'Admindashboard',
                    title: 'Dashboard',
                    type: 'basic',
                    link: '/Admindashboard',
                },
                {
                    id: 'Appointments',
                    title: 'Appointments',
                    type: 'basic',
                    link: '/Appointments',
                },
                {
                    id: 'DoctorsCalender',
                    title: "Doctor" + "'" + "s Calendar",
                    type: 'basic',
                    //link: '/DoctorsCalender'
                    link: '/calendar'
                },

                {
                    id: 'Reports',
                    title: 'Reports',
                    type: 'basic',
                    link: '/admin-reports',
                },

                // {
                //     id: 'Patients',
                //     title: 'Patients',
                //     type: 'basic',
                //     link: '/Patients',
                // }
            );
        }
        else if (this.roleID == 5) {
            //Jr Doctor

            this.navItems.push(
                //{
                //    id: 'Admindashboard',
                //    title: 'Dashboard',
                //    type: 'basic',
                //    link: '/Admindashboard',
                //},
                {
                    id: 'Appointments',
                    title: 'Appointments',
                    type: 'basic',
                    link: '/Appointments',
                },
                {
                    id: 'DoctorsCalender',
                    title: "Doctor" + "'" + "s Calendar",
                    type: 'basic',
                    //link: '/DoctorsCalender'
                    link: '/calendar'
                },
                // {
                //     id: 'Patients',
                //     title: 'Patients',
                //     type: 'basic',
                //     link: '/Patients',
                // }
                {
                    id: 'MyPatients',
                    title: 'My Patients',
                    type: 'basic',
                    link: '/MyPatients',
                },
                {
                    id: 'Reports',
                    title: 'Reports',
                    type: 'basic',
                    link: '/admin-reports',
                }
            );
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On changes
     *
     * @param changes
     */
    ngOnChanges(changes: SimpleChanges): void {
        // Navigation
        if ('navigation' in changes) {
            // Mark for check
            //this.navItems = this.navigation;
            this._changeDetectorRef.markForCheck();
        }
    }

    /**
     * On init
     */
    ngOnInit(): void {
        // Make sure the name input is not an empty string
        if (this.name === '') {
            this.name = this._fuseUtilsService.randomId();
        }
        // Register the navigation component
        this._fuseNavigationService.registerComponent(this.name, this);
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Deregister the navigation component from the registry
        this._fuseNavigationService.deregisterComponent(this.name);

        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Refresh the component to apply the changes
     */
    refresh(): void {
        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Execute the observable
        this.onRefreshed.next(true);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
