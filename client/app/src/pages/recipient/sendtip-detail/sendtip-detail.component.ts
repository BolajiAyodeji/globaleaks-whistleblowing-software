import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { FileItem } from "@app/models/reciever/sendtip-data";
import { ActivatedRoute } from '@angular/router';
import { TipService } from '@app/shared/services/tip-service';
import { Forwarding, Questionnaire, RecieverTipData } from '@app/models/reciever/reciever-tip-data';
import { HttpService } from '@app/shared/services/http.service';
import { ReceiverTipService } from '@app/services/helper/receiver-tip.service';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from '@app/shared/services/utils.service';
import { Observable } from 'rxjs';
@Component({
  selector: "src-sendtip-detail",
  templateUrl: "./sendtip-detail.component.html",
})
export class SendtipDetailComponent implements OnInit {

  detail: Forwarding;
  organizations: Forwarding[] = []

  files: FileItem[] = [];

  tip_id: string | null;
  tip: RecieverTipData;


  loading = true;


  constructor(private _location: Location, private tipService: TipService, protected utils: UtilsService, private translateService: TranslateService, protected RTipService: ReceiverTipService,  private httpService: HttpService, private activatedRoute: ActivatedRoute){}

  backClicked() {
    this._location.back();
  }

  ngOnInit(): void {
    this.tip_id = this.activatedRoute.snapshot.paramMap.get("tip_id");

    this.tip = this.RTipService.tip;

    this.detail = this.RTipService.forwarding;
  }

  loadDetail() {
    
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

        }
      }
    );

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

  listenToFields(){
    this.loadDetail();
  }
}
