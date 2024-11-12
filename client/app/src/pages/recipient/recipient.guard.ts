import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, UrlTree } from "@angular/router";
import { PreferenceResolver } from "@app/shared/resolvers/preference.resolver";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class RecipientRoutingGuard {
    constructor(private router: Router, private preference: PreferenceResolver) {}

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const isExternal = this.preference.dataModel.t_external;
    
        if (isExternal) {
            return this.router.parseUrl(`/recipient/tip-eo/${route.params["tip_id"]}`);
        } else {
            return this.router.parseUrl(`/recipient/tip/${route.params["tip_id"]}`);
        }
    }
}