import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { ChangelogComponent } from "./changelog.component";
import { ChangelogRoutingModule } from "./changelog-routing.module";
import { MaterialModule } from "../material/material.module";

@NgModule({
    declarations: [
        ChangelogComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        ChangelogRoutingModule,
        MaterialModule,
    ]
})
export class ChangelogModule {  }