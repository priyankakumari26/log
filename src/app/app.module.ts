import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
//import {Ng2PaginationModule} from 'ng2-pagination'; //importing ng2-pagination
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { DashboardService } from './services/dashboard.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { OrderModule  } from 'ngx-order-pipe';
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent ],
  imports: [
    BrowserModule, NgxPaginationModule, FormsModule,OrderModule 
  ],
  providers: [DashboardService],
  bootstrap: [AppComponent]
})
export class AppModule { }

