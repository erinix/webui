//Common Modules
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCommonModule, MatCardModule } from '@angular/material';
import {EntityModule} from '../common/entity/entity.module';
//Component Modules
import { SystemProcessesComponent } from './system-processes.component';
import { routing } from './system-processes.routing';

@NgModule({
  imports: [CommonModule, FormsModule, EntityModule, routing, MatCommonModule, MatCardModule],
  declarations: [
    SystemProcessesComponent
  ],
  providers: []
})
export class SystemProcessesModule {}
