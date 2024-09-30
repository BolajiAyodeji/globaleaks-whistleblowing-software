import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { FileItem, SentTipDetail } from "@app/models/reciever/sendtip-data";
import { ActivatedRoute, Router } from '@angular/router';
import { TipService } from '@app/shared/services/tip-service';
import { Forwarding, RecieverTipData } from '@app/models/reciever/reciever-tip-data';
import { Observable } from 'rxjs';
import { HttpService } from '@app/shared/services/http.service';
import { ReceiverTipService } from '@app/services/helper/receiver-tip.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: "src-sendtip-detail",
  templateUrl: "./sendtip-detail.component.html",
})
export class SendtipDetailComponent implements OnInit {

  detail: Forwarding | null = null;

  files: FileItem[] = [];

  tip_id: string | null;
  tip: RecieverTipData;
  loading = true;

  redactOperationTitle: string;

  constructor(private _location: Location, private tipService: TipService,  private translateService: TranslateService, protected RTipService: ReceiverTipService,  private httpService: HttpService, private activatedRoute: ActivatedRoute){}

  backClicked() {
    this._location.back();
  }

  ngOnInit(): void {
    this.loadDetail();
    this.loadFiles();
  }

  loadDetail() {
    this.tip_id = this.activatedRoute.snapshot.paramMap.get("tip_id");

    this.detail = this.RTipService.forwarding;

    this.redactOperationTitle = this.translateService.instant('Mask') + ' / ' + this.translateService.instant('Redact');
    
    const requestObservable: Observable<any> = this.httpService.receiverTip(this.tip_id);
    this.loading = true;
    this.RTipService.reset();
    
    requestObservable.subscribe(
      {
        next: (response: RecieverTipData) => {
          this.loading = false;
          this.RTipService.initialize(response);
          this.tip = this.RTipService.tip;
          this.activatedRoute.queryParams.subscribe((params: { [x: string]: string; }) => {
            this.tip.tip_id = params["tip_id"];
          });

          this.tipService.preprocessTipAnswers(this.tip, true);
          
        }
      }
    );

  }

  loadFiles() {
    setTimeout(() => {
      this.files = [
        { id: 'uuid-1', name: 'file1.txt', scanStatus: 'Verificato', origin: 'Segnalante', uploadDate: '01-01-2023 12:00', size: '1 KB', infected: false, loading: false },
        { id: 'uuid-2', name: 'file2.txt', scanStatus: 'Verificato', origin: 'Organizzazione Esterna', uploadDate: '02-01-2023 13:00', size: '2 KB', infected: false, loading: false },
        { id: 'uuid-3', name: 'file3.txt', scanStatus: 'Verificato', origin: 'Istruttore', uploadDate: '03-01-2023 14:00', size: '3 KB', infected: false, loading: false },
        { id: 'uuid-4', name: 'file4.txt', scanStatus: 'Verificato', origin: 'Nuovo', uploadDate: '04-01-2023 15:00', size: '4 KB', infected: false, loading: false },
      ];
    }, 500);
  }

  onFileUploaded(newFile: FileItem) {
    this.files.push(newFile);
  }

  onFileVerified(verifiedStatus: string) {
    console.log('File verificato:', verifiedStatus);
  }

  onFileDeleted(deletedFile: FileItem) {
    this.files = this.files.filter(file => file.id !== deletedFile.id);
  }
}
