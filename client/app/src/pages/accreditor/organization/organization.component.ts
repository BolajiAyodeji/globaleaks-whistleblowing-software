import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExternalOrganization,EOAdmin, EOPrimaryReceiver, EOUser, EOInfo } from '@app/models/accreditor/organization-data';
import { AccreditorOrgService } from '@app/services/helper/accreditor-org.service';
import { HttpService } from '@app/shared/services/http.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'src-organization',
  templateUrl: './organization.component.html'
})
export class OrganizationComponent implements OnInit{

  org_id: string | null;

  organization: ExternalOrganization;

  org_type: boolean = false;

  organizationInfo: EOInfo = {
    organization_name: '',
    organization_email: '',
    organization_institutional_site: ''
  };

  adminInfo: EOAdmin = {
    name: '',
    email: '',
    surname: '',
    fiscal_code: ''
  };

  receiverInfo: EOPrimaryReceiver = {
    name: '',
    surname: '',
    fiscal_code: '',
    email: ''
  };


  constructor(private activatedRoute: ActivatedRoute, private httpService: HttpService, private orgService : AccreditorOrgService){

  }


  ngOnInit() {
   this.loadOrganizationData();
  }

  loadOrganizationData(){
    this.org_id = this.activatedRoute.snapshot.paramMap.get("org_id");
    
    const requestObservable: Observable<ExternalOrganization> = this.httpService.accreditorAccreditationDetail(this.org_id);


    requestObservable.subscribe(
      {
        next: (response) => {
          this.orgService.reset();

          this.organization = response;
          
          this.organizationInfo.organization_email = response.organization_email
          this.organizationInfo.organization_name = response.organization_name
          this.organizationInfo.organization_institutional_site = response.organization_institutional_site

          this.adminInfo.name = response.admin_name
          this.adminInfo.surname = response.admin_surname
          this.adminInfo.fiscal_code = response.admin_fiscal_code
          this.adminInfo.email = response.admin_email

          this.receiverInfo.name = response.recipient_name
          this.receiverInfo.surname = response.recipient_surname
          this.receiverInfo.fiscal_code = response.recipient_fiscal_code
          this.receiverInfo.email = response.recipient_email

          //todo mockup
          this.org_type = this.organization.type === "AFFILIATED"

          //todo mockup:
          // let users : EOUser[] = [];
          // users.push({
          //   id: "zaoi1",
          //   creation_date: "01-01-2024",
          //   last_login: "01/02/2024 10:00:05",
          //   role: "RECIPIENT",
          //   opened_rtips: 10,
          //   closed_rtips: 1
          // },
          // {
          //   id: "abcde1",
          //   creation_date: "01-02-2024",
          //   last_login: "01/01/2024 10:00:05",
          //   role: "RECIPIENT",
          //   opened_rtips: 5,
          //   closed_rtips: 10
          // })

          // this.organization.users = users;

          this.organization.state = "REQUESTED"
          //fine mockup

        }
      });

  }

  
  convertiInAffiliata(){
    console.log("CONVERTI IN AFFILIATA - TODO!!!")
  }

  invia(){
    if(this.org_type)
      this.organization.type = "AFFILIATED"
  
    console.log("INVIA / INVIA INVITO - TODO!!!")
  }

  rifiuta(){
    console.log("REJECT - TODO!!!")

  }


  isRequested(){
    return this.organization.state === "REQUESTED"
  }

  isInstructorRequest(){
    return this.organization.state === "INSTRUCTOR_REQUEST"
  }

  isAccredited(){
    return this.organization.state === "ACCREDITED"
  }

  isSuspended(){
    return this.organization.state === "SUSPENDED"
  }

  isInvited(){
    return this.organization.state === "INVITED"
  }

}
