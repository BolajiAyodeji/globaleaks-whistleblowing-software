import {ChangeDetectionStrategy, Component} from "@angular/core";
import {Router} from "@angular/router";
import {AuthenticationService} from "@app/services/helper/authentication.service";
import {NodeResolver} from "@app/shared/resolvers/node.resolver";
import { PreferenceResolver } from "@app/shared/resolvers/preference.resolver";

@Component({
  selector: "src-admin-sidebar",
  templateUrl: "./sidebar.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {

  constructor(private router: Router, protected nodeResolver: NodeResolver, protected authenticationService: AuthenticationService) {
  }

  // TODO only for testing TO REMOVE
  ngOnInit(): void {
    if(this.authenticationService.session.user_name === "adminOE") {
      console.log("adminOE");
      
      this.authenticationService.session.t_type = 1;
    } else {
      console.log("admin");
      this.authenticationService.session.t_type = 0;
    }
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, {
      paths: "subset",
      queryParams: "subset",
      fragment: "ignored",
      matrixParams: "ignored"
    });
  }
}