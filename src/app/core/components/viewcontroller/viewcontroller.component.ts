import { Component,ComponentRef, OnInit, ViewChild } from '@angular/core';
import { CoreServiceInjector } from 'app/core/services/coreserviceinjector';
import { Display } from 'app/core/components/display/display.component';
import { CoreService, CoreEvent } from 'app/core/services/core.service';
import { ViewController } from 'app/core/classes/viewcontroller';
import { Subject } from 'rxjs/Subject';

export const ViewControllerMetadata = {
  template: `<display  #display></display>`,
}

export interface ViewConfig {
  componentName: any,
  componentData: any;
  controller?: Subject<any>;
}

@Component({
  selector: 'viewcontroller',
  template:ViewControllerMetadata.template,
  styleUrls: ['./viewcontroller.component.css']
})
export class ViewControllerComponent extends ViewController implements OnInit {

  readonly componentName = ViewControllerComponent;
  @ViewChild('display') display;
  //public displayList: ComponentRef[] = [];
  protected core: CoreService;
  public controlEvents: Subject<CoreEvent> = new Subject();

  constructor() {
    super();
    this.core = CoreServiceInjector.get(CoreService);
  }

  
  public create(component:any, container?:string){
    if(!container){ container = 'display'}
    let instance= this[container].create(component);
    return instance;
  }

  public addChild(instance, container?: string){
    if(!container){ container = 'display'}
    this[container].addChild(instance);
  }
  

  ngOnInit(){
  }
}
