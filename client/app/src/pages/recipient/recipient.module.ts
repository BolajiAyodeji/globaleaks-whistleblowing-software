import {NgModule} from "@angular/core";

import {CommonModule} from "@angular/common";
import {HomeComponent} from "@app/pages/recipient/home/home.component";
import {SidebarComponent} from "@app/pages/recipient/sidebar/sidebar.component";
import {RouterModule} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {SharedModule} from "@app/shared.module";
import {TipsComponent} from "@app/pages/recipient/tips/tips.component";
import {TipComponent} from "@app/pages/recipient/tip/tip.component";
import {SendtipComponent} from "@app/pages/recipient/sendtip/sendtip.component";
import {SettingsComponent} from "@app/pages/recipient/settings/settings.component";
import {FormsModule} from "@angular/forms";
import {NgbDatepickerModule, NgbDropdownModule, NgbModule, NgbNavModule} from "@ng-bootstrap/ng-bootstrap";
import {
  WhistleBlowerIdentityReceiverComponent
} from "@app/pages/recipient/whistleblower-identity-reciever/whistle-blower-identity-receiver.component";
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";
import { SendtipDetailComponent } from "@app/pages/recipient/sendtip-detail/sendtip-detail.component";
import { TipOeComponent } from "./tip-oe/tip-oe.component";
import { AccreditationRequestComponent } from "@app/pages/recipient/accreditation-request/accreditation-request.component";

@NgModule({
  declarations: [
    HomeComponent,
    SidebarComponent,
    TipsComponent,
    TipComponent,
    TipOeComponent,
    SendtipComponent,
    SendtipDetailComponent,
    SettingsComponent,
    WhistleBlowerIdentityReceiverComponent,
    AccreditationRequestComponent,
  ],
  imports: [
    CommonModule, RouterModule, TranslateModule, SharedModule, FormsModule,
    NgbModule, NgbNavModule,
    NgbDatepickerModule, NgbDropdownModule, NgMultiSelectDropDownModule.forRoot()

  ],
  exports: [SidebarComponent]
})
export class RecipientModule {
}
