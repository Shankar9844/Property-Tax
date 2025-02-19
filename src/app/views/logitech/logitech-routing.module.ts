import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SampleComponent } from './sample/sample.component';
import { SimpleComponent } from './simple/simple.component';


const routes: Routes = [
  {
    path: '',
    component:SampleComponent ,
    data: {
      title: 'sample',
    },
  },
  {
    path:'sample',
    component:SampleComponent,
    data:{
        title:'sample'
    }
  },
  {
    path:'simple',
    component:SimpleComponent,
    data:{
        title:'simple'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogitechRoutingModule {}

