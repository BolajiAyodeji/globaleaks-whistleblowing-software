import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { NgbDate, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import {TranslateService} from "@ngx-translate/core";
import {IDropdownSettings} from "ng-multiselect-dropdown";
import { ReportEntry, Results, ResultsRow, StatisticalRequestModel, StatisticalResponseModel, Summary } from "@app/analyst/statistical-data";
import { HttpService } from "@app/shared/services/http.service";
import { UtilsService } from "@app/shared/services/utils.service";

@Component({
    selector: "src-reports",
    templateUrl: "./reports.component.html"
})
export class ReportsComponent implements OnInit {
    today = new Date();
    maxDate: NgbDateStruct;
    input_start_date: NgbDateStruct;
    input_end_date: NgbDateStruct;

    reportType: string = '';

    readonly INTERNAL_TIPS_ID: string = 'internal_tip_id';
    readonly INTERNAL_TIPS_STATUS: string = 'internal_tip_status';
    readonly INTERNAL_TIPS_CREATION_DATE: string = 'internal_tip_creation_date';
    readonly INTERNAL_TIPS_UPDATE_DATE: string = 'internal_tip_update_date';
    readonly INTERNAL_TIPS_EXPIRATION_DATE: string = 'internal_tip_expiration_date';
    readonly INTERNAL_TIPS_READ_RECEIPT: string = 'internal_tip_read_receip';
    readonly INTERNAL_TIPS_FILE_COUNT: string = 'internal_tip_file_count';
    readonly INTERNAL_TIPS_COMMENT_COUNT: string = 'internal_tip_comment_count';
    readonly INTERNAL_TIPS_RECEIVER_COUNT: string = 'internal_tip_receiver_count';
    readonly INTERNAL_TIPS_CREATION_DATE_YEARS: string = 'internal_tip_creation_date_years';
    readonly INTERNAL_TIPS_CREATION_DATE_MONTH: string = 'internal_tip_creation_date_month';
    readonly LAST_ACCESS: string = 'last_access';
    
    fixedHeaders: string[] = [
        this.INTERNAL_TIPS_ID, this.INTERNAL_TIPS_STATUS,
        this.INTERNAL_TIPS_CREATION_DATE, this.INTERNAL_TIPS_UPDATE_DATE,
        this.INTERNAL_TIPS_EXPIRATION_DATE, this.INTERNAL_TIPS_READ_RECEIPT,
        this.INTERNAL_TIPS_FILE_COUNT, this.INTERNAL_TIPS_COMMENT_COUNT,
        this.INTERNAL_TIPS_RECEIVER_COUNT
    ];
    excludedHeaders: string[] = [
        this.LAST_ACCESS,
        this.INTERNAL_TIPS_CREATION_DATE_YEARS,
        this.INTERNAL_TIPS_CREATION_DATE_MONTH
    ];
    dinamicHeaders: string[] = [];
    tableHeaders: string[] = [];
    tableRows: ResultsRow[] = [];

    dropdownStatusModel: any[] = [];
    statusDropdownVisible: boolean = false;
    dropdownStatusData: { id: number, label: string | number | null }[] = [];
    
    filteredRows: ResultsRow[] = [];
    dropdownSettings: IDropdownSettings = {
        idField: "id",
        textField: "label",
        itemsShowLimit: 5,
        allowSearchFilter: true,
        selectAllText: this.translateService.instant("Select all"),
        unSelectAllText: this.translateService.instant("Deselect all"),
        searchPlaceholderText: this.translateService.instant("Search")
    };

    creationDatePicker: boolean = false;
    minCreationDate: Date | null;
    maxCreationDate: Date | null;

    updateDatePicker: boolean = false;
    minUpdateDate: Date | null;
    maxUpdateDate: Date | null;

    expirationDatePicker: boolean = false;
    minExpirationDate: Date | null;
    maxExpirationDate: Date | null;

    dateFilters: { [key: string]: boolean } = {
        creation: false,
        update: false,
        expiration: false
    };

    dateModels: { [key: string]: { fromDate: Date | null, toDate: Date | null } | null } = {
        creation: null,
        update: null,
        expiration: null
    };

    isSearchInitiated: boolean = false;

    allResults: Results = [];
    currentPage: number = 1;
    itemsPerPage: number = 20;

    charts: any[] = [];
    summary: Summary = {};
    summaryKeys: { id: string, label: string }[] = [];
    
    constructor(private readonly httpService: HttpService, private readonly translateService: TranslateService, protected utils: UtilsService) {}

    ngOnInit(): void {
        this.maxDate = {
            year: this.today.getFullYear(),
            month: this.today.getMonth() + 1,
            day: this.today.getDate()
        };
        this.clearDateRange();
    }

    clearDateRange(): void {
        const lastWeek = new Date(this.today);
        lastWeek.setDate(this.today.getDate() - 7);
        
        this.input_end_date = {
            year: this.today.getFullYear(),
            month: this.today.getMonth() + 1,
            day: this.today.getDate()
        };
        
        this.input_start_date = {
            year: lastWeek.getFullYear(),
            month: lastWeek.getMonth() + 1,
            day: lastWeek.getDate()
        };

        if(this.charts.length > 0) {
            this.charts = [];
        }
        this.isSearchInitiated = false;
        this.resetFilter();
    }

    onDateChange(): void {
        if (this.input_end_date && this.input_start_date) {
            const start = new Date(this.input_start_date.year, this.input_start_date.month - 1, this.input_start_date.day);
            const end = new Date(this.input_end_date.year, this.input_end_date.month - 1, this.input_end_date.day);

            if (end < start) {
                this.input_end_date = this.input_start_date;
            }
        }
    }

    private fromNgbDateToString(date: NgbDateStruct | null): string {
        if (!date) {
            return '';
        }
        return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
    }

    fromDatetoNgbDate(date: Date | null): NgbDate | null {
        if (!date) {
            return null;
        }
        return new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
    }

    searchReports(form: NgForm): void {
        if (form.valid) {
            this.isSearchInitiated = true;
            
            const dateFrom = this.fromNgbDateToString(this.input_start_date);
            const dateTo = this.fromNgbDateToString(this.input_end_date);

            const bodyReq: StatisticalRequestModel = {
                is_oe: this.reportType === 'tipsOE',
                date_from: dateFrom,
                date_to: dateTo
            };

            this.httpService.getStatisticalData(bodyReq).subscribe({
                next: (res) => {
                    // TODO: to be removed only for testing
                    // console.log("Response:", res);
                    // res = this.mockResponse;
                    // END TODO: to be removed only for testing

                    this.processResponse(res);
                },
                error: (err) => {
                    console.error("Error:", err);
                }
            });
        } else {
            console.log("Form is not valid.");
        }
    }

    private generateSummaryKeys(): void {
        this.summaryKeys = Object.keys(this.summary).map((key) => {
          const entry = this.allResults[0].find((entry: ReportEntry) => entry.id === key);
          const label = entry ? entry.label : key;
          return { id: key, label: label };
        });
    }

    private processResponse(res: StatisticalResponseModel): void {
        if (res?.results?.length > 0) {
            this.allResults = res.results;

            this.populateTableHeaders(this.allResults);
            this.populateTableRows(this.allResults);

            this.summary = res.summary;
            this.generateSummaryKeys();

            this.currentPage = 1;
        } else {
            this.tableHeaders = [];
            this.tableRows = [];
        }
    }

    private populateTableHeaders(results: ReportEntry[][]): void {
        const dynamicHeadersSet = new Set<string>();
      
        results.forEach((reportArray: ReportEntry[]) => {
            reportArray.forEach((entry: ReportEntry) => {
                if (!this.excludedHeaders.includes(entry.id) && !this.fixedHeaders.includes(entry.id)) {
                    dynamicHeadersSet.add(entry.label);
                }
            });
        });

        this.dinamicHeaders = Array.from(dynamicHeadersSet);
      
        this.tableHeaders = [...this.fixedHeaders, ...this.dinamicHeaders];
    }

    private buildTableRow(reportArray: ReportEntry[]): ResultsRow {
        const row: ResultsRow = {};
        let lastAccess = '';
        let updateDate = '';
    
        reportArray.forEach((entry: ReportEntry) => {
            const value = String(entry.value);
            if (entry.id === this.LAST_ACCESS) {
                lastAccess = value;
            } else if (entry.id === this.INTERNAL_TIPS_UPDATE_DATE) {
                updateDate = value;
                row[entry.id] = updateDate;
            } else {
                row[entry.label] = value;
            }
        });
    
        row[this.INTERNAL_TIPS_READ_RECEIPT] = lastAccess >= updateDate ? '✔' : '✘';
    
        this.tableHeaders.forEach(header => {
            if (!(header in row)) {
                row[header] = '-';
            }
        });
    
        return row;
    }

    private populateTableRows(results: ReportEntry[][]): void {
        this.tableRows = results.map(this.buildTableRow.bind(this));
        this.populateDropdownAndDateRanges();
        this.filteredRows = [...this.tableRows];
    }

    private populateDropdownAndDateRanges(): void {
        this.populateStatusDropdown();
        this.calculateDataRange();
    }

    private populateStatusDropdown(): void {
        const statusIndex = this.tableHeaders.indexOf(this.INTERNAL_TIPS_STATUS);
        if (statusIndex !== -1) {
            const statusSet = new Set(this.tableRows.map(row => row[this.INTERNAL_TIPS_STATUS]));
            this.dropdownStatusData = Array.from(statusSet).map((status, index) => ({
                id: index + 1,
                label: status
            }));
        }
    }

    private parseDate(dateString: string): Date | null {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return null;

        date.setHours(0, 0, 0, 0);
        return date;
    }

    private getMinMaxDatesForField(dateField: string): { minDate: Date | null; maxDate: Date | null } {
        let minDate: Date | null = null;
        let maxDate: Date | null = null;
    
        this.tableRows.forEach(row => {
            const dateString = row[dateField];
            const date = typeof dateString === 'string' ? this.parseDate(dateString) : null;
    
            if (date) {
                if (!minDate || date < minDate) {
                    minDate = date;
                }
                if (!maxDate || date > maxDate) {
                    maxDate = date;
                }
            }
        });
    
        return { minDate, maxDate };
    }

    private calculateDataRange(): void {
        const creationDates = this.getMinMaxDatesForField(this.INTERNAL_TIPS_CREATION_DATE);
        const updateDates = this.getMinMaxDatesForField(this.INTERNAL_TIPS_UPDATE_DATE);
        const expirationDates = this.getMinMaxDatesForField(this.INTERNAL_TIPS_EXPIRATION_DATE);
    
        this.minCreationDate = creationDates.minDate;
        this.maxCreationDate = creationDates.maxDate;
    
        this.minUpdateDate = updateDates.minDate;
        this.maxUpdateDate = updateDates.maxDate;
    
        this.minExpirationDate = expirationDates.minDate;
        this.maxExpirationDate = expirationDates.maxDate;
    }

    toggleDatePicker(type: 'creation' | 'update' | 'expiration'): void {
        switch (type) {
            case 'creation':
                this.creationDatePicker = !this.creationDatePicker;
                break;
            case 'update':
                this.updateDatePicker = !this.updateDatePicker;
                break;
            case 'expiration':
                this.expirationDatePicker = !this.expirationDatePicker;
                break;
        }
    }

    onDateFilterChange(dates: { fromDate: string | null, toDate: string | null }, type: 'creation' | 'update' | 'expiration'): void {
        const { fromDate, toDate } = dates;

        if (!fromDate || !toDate) {
            this.dateFilters[type] = false;
            this.dateModels[type] = null;
        } else {
            this.dateFilters[type] = true;
            this.dateModels[type] = { fromDate: new Date(fromDate), toDate: new Date(toDate) };
        }
    
        this.applyFilters();
    }

    toggleStatusDropdown(): void {
        this.statusDropdownVisible = !this.statusDropdownVisible;
    }

    onChangedStaus(selectedStatuses: { id: number; label: string }[], filterType: string): void {
        if (filterType === 'Status') {
            this.dropdownStatusModel = selectedStatuses;
            this.applyFilters();
        }
    }

    private applyDateFilter(filteredRows: ResultsRow[], dateField: string, dateModel: { fromDate: Date | null; toDate: Date | null }): ResultsRow[] {
        if (!dateModel.fromDate || !dateModel.toDate) return filteredRows;
    
        const startDate = dateModel.fromDate;
        const endDate = dateModel.toDate;
    
        return filteredRows.filter(row => {
            const dateString = row[dateField];
            const date = typeof dateString === 'string' ? this.parseDate(dateString) : null;
            return date && date >= startDate && date <= endDate;
        });
    }

    private applyFilters(): void {
        let filtered = [...this.tableRows];
    
        // Filter by status
        if (this.dropdownStatusModel.length > 0) {
            const selectedStatuses = this.dropdownStatusModel.map(status => status.label);
            filtered = filtered.filter(row => selectedStatuses.includes(row[this.INTERNAL_TIPS_STATUS]));
        }
    
        // Filter by date
        const dateFields = ['creation', 'update', 'expiration'] as const;
        dateFields.forEach(type => {
            const dateModel = this.dateModels[type];
            if (this.dateFilters[type] && dateModel) {
                const dateField = `internal_tip_${type}_date`;
                filtered = this.applyDateFilter(filtered, dateField, dateModel);
            }
        });
    
        this.filteredRows = filtered;
        this.currentPage = 1;
    }

    checkFilter(): boolean {
        return this.dropdownStatusModel.length > 0;
    }

    private resetFilter(): void {
        this.dropdownStatusModel = [];
        this.statusDropdownVisible = false;
        this.creationDatePicker = false;
        this.minCreationDate = null;
        this.maxCreationDate = null;
        this.updateDatePicker = false;
        this.minUpdateDate = null;
        this.maxUpdateDate = null;
        this.expirationDatePicker = false;
        this.minExpirationDate = null;
        this.maxExpirationDate = null;
        const dateFields = ['creation', 'update', 'expiration'] as const;
        dateFields.forEach(type => {
            this.dateModels[type] = null;
            this.dateFilters[type] = false;
        });
        this.filteredRows = [...this.tableRows];
    }

    private createChartConfig(columnId: string | null, chartType: string, columnLabel: string): any {
        return {
            type: chartType,
            columnId,
            data: this.getChartData(columnId ?? '', columnLabel),
            options: this.getChartOptions()
        };
    }

    private getChartOptions(): any {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                datalabels: {
                    formatter: (value: number, context: any) => {
                        const total = context.chart.data.datasets[0].data.reduce((acc: number, val: number) => acc + val, 0);
                        const percentage = ((value / total) * 100).toFixed(2);
                        return `${percentage}%`;
                    },
                    color: '#fff',
                    anchor: 'end',
                    align: 'start',
                    font: { weight: 'bold' }
                }
            }
        };
    }

    addChart(): void {
        const initialColumn = this.summaryKeys[0]?.id || null;
        const columnLabel = this.summaryKeys[0]?.label || '';
        this.charts.push(this.createChartConfig(initialColumn, 'pie', columnLabel));
    }

    updateCharts(): void {
        this.charts = this.charts.map(chart => {
            const selectedColumn = this.summaryKeys.find(key => key.id === chart.columnId);
           return this.createChartConfig(selectedColumn?.id ?? '', chart.type, selectedColumn?.label ?? '')
        });
    }

    removeChart(index: number): void {
        if (index >= 0 && index < this.charts.length) {
            this.charts.splice(index, 1);
        }
    }

    private getChartData(columnId: string, columnLabel: string): any {
        if (!columnId || !this.summary[columnId]) {
            console.warn("getChartData() - Column ID non valido o non trovato");
            return this.createEmptyChartData('Nessun dato');
        }
    
        const data = this.summary[columnId];
        if (!data) {
            console.warn(`getChartData() - No data found for column ID: ${columnId}`);
            return this.createEmptyChartData('Nessun dato');
        }
        
        // const labels = Object.keys(data);
        const labels = Object.keys(data).map(key => `${key}: ${data[key]}`);
        const values = Object.values(data);
    
        return {
            labels: labels,
            datasets: [
                {
                    label: columnLabel,
                    data: values,
                    backgroundColor: this.getDefaultBackgroundColors()
                }
            ]
        };
    }
    
    private createEmptyChartData(label: string): any {
        return {
            labels: [],
            datasets: [
                {
                    label: label,
                    data: [],
                    backgroundColor: this.getDefaultBackgroundColors()
                }
            ]
        };
    }
    
    private getDefaultBackgroundColors(): string[] {
        return [
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(255, 205, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)'
        ];
    }

    getDataCsv(): any[] {
        const fields = new Set<string>();
        this.filteredRows.forEach(row => Object.keys(row).forEach(field => fields.add(field)));

        return this.filteredRows.map(row => {
            const dataRow: any = {};
            fields.forEach(field => {
                dataRow[field] = row[field] || '';
            });
            return dataRow;
        });
    }
    
    getDataCsvHeaders(): string[] {
        const headers = new Set<string>();
        this.filteredRows.forEach(row => Object.keys(row).forEach(field => headers.add(field)));
    
        return Array.from(headers);
    }

    exportToCsv(): void {
        this.utils.generateCSV(JSON.stringify(this.getDataCsv()), 'reports',this.getDataCsvHeaders());
    }

    // TODO: to be removed only for testing
    mockResponse = {
        results: [
            [
                {
                    "id": "internal_tip_id",
                    "label": "internal_tip_id",
                    "value": "36a710f1-c4d5-4f6b-8ab5-c2b2ebcce9c2"
                },
                {
                    "id": "internal_tip_creation_date",
                    "label": "internal_tip_creation_date",
                    "value": "2024-10-17T12:44:30.751036Z"
                },
                {
                    "id": "last_access",
                    "label": "last_access",
                    "value": "2024-10-17T12:45:15.727464Z"
                },
                {
                    "id": "internal_tip_update_date",
                    "label": "internal_tip_update_date",
                    "value": "2024-10-17T12:44:30.751045Z"
                },
                {
                    "id": "internal_tip_expiration_date",
                    "label": "internal_tip_expiration_date",
                    "value": "2024-12-30T23:59:59Z"
                },
                {
                    "id": "internal_tip_status",
                    "label": "internal_tip_status",
                    "value": "new"
                },
                {
                    "id": "internal_tip_file_count",
                    "label": "internal_tip_file_count",
                    "value": 0
                },
                {
                    "id": "internal_tip_comment_count",
                    "label": "internal_tip_comment_count",
                    "value": 0
                },
                {
                    "id": "internal_tip_receiver_count",
                    "label": "internal_tip_receiver_count",
                    "value": 1
                },
                {
                    "id": "6f5d4713-9146-4473-9b50-35cf420d5496",
                    "label": "How are you involved in the reported facts?",
                    "value": "I'm a victim"
                },
                {
                    "id": "0f2c5077-90f3-4b0d-8346-21b5c3b8a627",
                    "label": "Do you have evidence to support your report?",
                    "value": "Yes"
                },
                {
                    "id": "8562fe35-2f5b-4329-a356-707331603280",
                    "label": "Have you reported the facts to other organizations and/or individuals?",
                    "value": "No"
                },
                {
                    "id": "8562fe35-ab5b-4329-a356-707331603280",
                    "label": "E' inventata?",
                    "value": "No"
                }
            ],
            [
                {
                    "id": "internal_tip_id",
                    "label": "internal_tip_id",
                    "value": "49deaba0-1e96-4bcc-8708-62abc55fecbd"
                },
                {
                    "id": "internal_tip_creation_date",
                    "label": "internal_tip_creation_date",
                    "value": "2024-10-18T12:46:18.250330Z"
                },
                {
                    "id": "last_access",
                    "label": "last_access",
                    "value": "2024-10-18T12:46:18.250346Z"
                },
                {
                    "id": "internal_tip_update_date",
                    "label": "internal_tip_update_date",
                    "value": "2024-10-19T09:05:22.827534Z"
                },
                {
                    "id": "internal_tip_expiration_date",
                    "label": "internal_tip_expiration_date",
                    "value": "2025-01-15T23:59:59Z"
                },
                {
                    "id": "internal_tip_status",
                    "label": "internal_tip_status",
                    "value": "opened"
                },
                {
                    "id": "internal_tip_file_count",
                    "label": "internal_tip_file_count",
                    "value": 0
                },
                {
                    "id": "internal_tip_comment_count",
                    "label": "internal_tip_comment_count",
                    "value": 0
                },
                {
                    "id": "internal_tip_receiver_count",
                    "label": "internal_tip_receiver_count",
                    "value": 1
                },
                {
                    "id": "6f5d4713-9146-4473-9b50-35cf420d5496",
                    "label": "How are you involved in the reported facts?",
                    "value": "I'm involved in the facts"
                },
                {
                    "id": "0f2c5077-90f3-4b0d-8346-21b5c3b8a627",
                    "label": "Do you have evidence to support your report?",
                    "value": "No"
                },
                {
                    "id": "8562fe35-2f5b-4329-a356-707331603280",
                    "label": "Have you reported the facts to other organizations and/or individuals?",
                    "value": "Yes"
                },
                {
                    "id": "8562fe35-ab5b-4329-a356-707331603280",
                    "label": "E' vera?",
                    "value": "No"
                }
            ],
            [
                {
                    "id": "internal_tip_id",
                    "label": "internal_tip_id",
                    "value": "36a710f1-c4d5-4f6b-8ab5-c2b2ebcce9c2"
                },
                {
                    "id": "internal_tip_creation_date",
                    "label": "internal_tip_creation_date",
                    "value": "2024-10-19T12:44:30.751036Z"
                },
                {
                    "id": "last_access",
                    "label": "last_access",
                    "value": "2024-10-19T12:45:15.727464Z"
                },
                {
                    "id": "internal_tip_update_date",
                    "label": "internal_tip_update_date",
                    "value": "2024-10-19T12:44:30.751045Z"
                },
                {
                    "id": "internal_tip_expiration_date",
                    "label": "internal_tip_expiration_date",
                    "value": "2025-01-15T23:59:59Z"
                },
                {
                    "id": "internal_tip_status",
                    "label": "internal_tip_status",
                    "value": "new"
                },
                {
                    "id": "internal_tip_file_count",
                    "label": "internal_tip_file_count",
                    "value": 0
                },
                {
                    "id": "internal_tip_comment_count",
                    "label": "internal_tip_comment_count",
                    "value": 0
                },
                {
                    "id": "internal_tip_receiver_count",
                    "label": "internal_tip_receiver_count",
                    "value": 1
                },
                {
                    "id": "6f5d4713-9146-4473-9b50-35cf420d5496",
                    "label": "How are you involved in the reported facts?",
                    "value": "I witnessed the facts in person"
                },
                {
                    "id": "0f2c5077-90f3-4b0d-8346-21b5c3b8a627",
                    "label": "Do you have evidence to support your report?",
                    "value": "No"
                },
                {
                    "id": "8562fe35-2f5b-4329-a356-707331603280",
                    "label": "Have you reported the facts to other organizations and/or individuals?",
                    "value": "Yes"
                },
                {
                    "id": "8562fe35-ab5b-4329-a356-707331603280",
                    "label": "E' vera?",
                    "value": "No"
                }
            ],
            [
                {
                    "id": "internal_tip_id",
                    "label": "internal_tip_id",
                    "value": "49deaba0-1e96-4bcc-8708-62abc55fecbd"
                },
                {
                    "id": "internal_tip_creation_date",
                    "label": "internal_tip_creation_date",
                    "value": "2024-10-20T12:46:18.250330Z"
                },
                {
                    "id": "last_access",
                    "label": "last_access",
                    "value": "2024-10-20T12:46:18.250346Z"
                },
                {
                    "id": "internal_tip_update_date",
                    "label": "internal_tip_update_date",
                    "value": "2024-10-21T09:05:22.827534Z"
                },
                {
                    "id": "internal_tip_expiration_date",
                    "label": "internal_tip_expiration_date",
                    "value": "2025-01-15T23:59:59Z"
                },
                {
                    "id": "internal_tip_status",
                    "label": "internal_tip_status",
                    "value": "opened"
                },
                {
                    "id": "internal_tip_file_count",
                    "label": "internal_tip_file_count",
                    "value": 0
                },
                {
                    "id": "internal_tip_comment_count",
                    "label": "internal_tip_comment_count",
                    "value": 0
                },
                {
                    "id": "internal_tip_receiver_count",
                    "label": "internal_tip_receiver_count",
                    "value": 1
                },
                {
                    "id": "6f5d4713-9146-4473-9b50-35cf420d5496",
                    "label": "How are you involved in the reported facts?",
                    "value": "I was personally told by a direct witness"
                },
                {
                    "id": "0f2c5077-90f3-4b0d-8346-21b5c3b8a627",
                    "label": "Do you have evidence to support your report?",
                    "value": "No"
                },
                {
                    "id": "8562fe35-2f5b-4329-a356-707331603280",
                    "label": "Have you reported the facts to other organizations and/or individuals?",
                    "value": "Yes"
                },
                {
                    "id": "8562fe35-ab5b-4329-a356-707331603280",
                    "label": "E' falsa?",
                    "value": "No"
                }
            ],
            [
                {
                    "id": "internal_tip_id",
                    "label": "internal_tip_id",
                    "value": "36a710f1-c4d5-4f6b-8ab5-c2b2ebcce9c2"
                },
                {
                    "id": "internal_tip_creation_date",
                    "label": "internal_tip_creation_date",
                    "value": "2024-10-17T12:44:30.751036Z"
                },
                {
                    "id": "last_access",
                    "label": "last_access",
                    "value": "2024-10-17T12:45:15.727464Z"
                },
                {
                    "id": "internal_tip_update_date",
                    "label": "internal_tip_update_date",
                    "value": "2024-10-17T12:44:30.751045Z"
                },
                {
                    "id": "internal_tip_expiration_date",
                    "label": "internal_tip_expiration_date",
                    "value": "2025-01-15T23:59:59Z"
                },
                {
                    "id": "internal_tip_status",
                    "label": "internal_tip_status",
                    "value": "opened"
                },
                {
                    "id": "internal_tip_file_count",
                    "label": "internal_tip_file_count",
                    "value": 0
                },
                {
                    "id": "internal_tip_comment_count",
                    "label": "internal_tip_comment_count",
                    "value": 0
                },
                {
                    "id": "internal_tip_receiver_count",
                    "label": "internal_tip_receiver_count",
                    "value": 1
                },
                {
                    "id": "6f5d4713-9146-4473-9b50-35cf420d5496",
                    "label": "How are you involved in the reported facts?",
                    "value": "It is a rumor I heard"
                },
                {
                    "id": "0f2c5077-90f3-4b0d-8346-21b5c3b8a627",
                    "label": "Do you have evidence to support your report?",
                    "value": "Yes"
                },
                {
                    "id": "8562fe35-2f5b-4329-a356-707331603280",
                    "label": "Have you reported the facts to other organizations and/or individuals?",
                    "value": "No"
                },
                {
                    "id": "8562fe35-ab5b-4329-a356-707331603280",
                    "label": "E' così così?",
                    "value": "No"
                }
            ]
        ],
        summary: {
            "status": {
                "new": 3,
                "opened": 2
            },
            "internal_tip_creation_date_years": {
                "2025": 1,
                "2024": 2
            },
            "internal_tip_creation_date_month": {
                "10": 1,
                "11": 2,
            },
            "file_count": {
                "0": 5
            },
            "comment_count": {
                "0": 5
            },
            "receiver_count": {
                "1": 5
            },
            "6f5d4713-9146-4473-9b50-35cf420d5496": {
                "I'm a victim": 1,
                "I'm involved in the facts": 1,
                "I witnessed the facts in person": 1,
                "I was personally told by a direct witness": 1,
                "It is a rumor I heard": 1
            },
            "8562fe35-2f5b-4329-a356-707331603280": {
                "Yes": 2,
                "No": 3
            },
            "8562fe35-ab5b-4329-a356-707331603280": {
                "Yes": 3,
                "No": 2
            }
        }
    };
    // END TODO: to be removed only for testing

}