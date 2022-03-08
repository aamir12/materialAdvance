import { NgModule } from '@angular/core';


import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';

const components = [MatToolbarModule,MatButtonModule,MatCardModule,MatInputModule,MatIconModule,MatPaginatorModule, MatProgressBarModule, MatSortModule, MatTableModule];

@NgModule({
  declarations: [],
  imports: [
    components
  ],
  exports:[
   components
  ]
})
export class MaterialModule { }
