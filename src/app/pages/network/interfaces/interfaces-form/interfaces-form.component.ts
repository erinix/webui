import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';

import { NetworkService, RestService } from '../../../../services';
import {
  FieldConfig
} from '../../../common/entity/entity-form/models/field-config.interface';
import { 
  regexValidator 
} from '../../../common/entity/entity-form/validators/regex-validation';


@Component({
  selector : 'app-interfaces-form',
  template : `<entity-form [conf]="this"></entity-form>`
})
export class InterfacesFormComponent {

  protected resource_name: string = 'network/interface/';
  protected route_success: string[] = [ 'network', 'interfaces' ];
  protected isEntity: boolean = true;
  
  public fieldConfig: FieldConfig[] = [
    {
      type : 'input',
      name : 'int_interface',
      placeholder : 'NIC',
      tooltip : 'The FreeBSD device name of the interface; a read-only\
 field when editing an interface.',
    },
    {
      type : 'input',
      name : 'int_name',
      placeholder : 'Interface Name',
      tooltip : 'Description of interface.',
    },
    {
      type : 'checkbox',
      name : 'int_dhcp',
      placeholder : 'DHCP',
      tooltip : 'Requires static IPv4 or IPv6 configuration if\
 unchecked; only one interface can be configured for <b>DHCP</b>'
    },
    {
      type : 'input',
      name : 'int_ipv4address',
      placeholder : 'IPv4 Address',
      tooltip : 'Enter a static IP address if <b>DHCP</b> is unchecked.',
      validation : [ regexValidator(/^(25[0-5]|2[0-4][0-9]|1?[0-9]{1,2})(.(25[0-5]|2[0-4][0-9]|1?[0-9]{1,2})){3}$/) ],
      relation : [
        {action : "DISABLE", when : [ {name : "int_dhcp", value : true} ]}
      ]
    },
    {
      type : 'select',
      name : 'int_v4netmaskbit',
      placeholder : 'IPv4 Netmask',
      tooltip : 'Enter a netmask if <b>DHCP</b> is unchecked.',
      options : [],
      relation : [
        {action : "DISABLE", when : [ {name : "int_dhcp", value : true} ]}
      ]
    },
    {
      type : 'checkbox',
      name : 'int_ipv6auto',
      placeholder : 'Auto configure IPv6',
      tooltip : 'When enabled, automatically configurate IPv6 address via rtsol(8).'
    },
    {
      type : 'input',
      name : 'int_ipv6address',
      placeholder : 'IPv6 Address',
      tooltip : 'Enter a static IP address if <b>DHCP</b> is unchecked.',
      validation : [ regexValidator(/^([0-9a-f]|:){1,4}(:([0-9a-f]{0,4})*){1,7}$/i) ],
      relation : [
        {action : "DISABLE", when : [ {name : "int_ipv6auto", value : true} ]}
      ]
    },
    {
      type : 'select',
      name : 'int_v6netmaskbit',
      placeholder : 'IPv6 Prefix Length',
      options : [],
      relation : [
        {action : "DISABLE", when : [ {name : "int_ipv6auto", value : true} ]}
      ]
    },
    {
      type : 'input',
      name : 'int_options',
      placeholder : 'Options',
      tooltip : 'Additional parameters from ifconfig(8). Seperate\
 multiple paramerters with a space.',
    },
  ];

  private int_v4netmaskbit: any;
  private int_v6netmaskbit: any;
  private int_interface: any;
  private entityForm: any;

  constructor(protected router: Router, protected route: ActivatedRoute,
              protected rest: RestService,
              protected networkService: NetworkService) {}

  preInit(entityForm: any) {
    this.int_interface = _.find(this.fieldConfig, {'name' : 'int_interface'});
    this.route.params.subscribe(params => {
      if(!params['pk']) {
        this.int_interface.type = 'select';
        this.int_interface.options = [];
      }
    });
  }

  afterInit(entityForm: any) {
    this.int_v4netmaskbit =
        _.find(this.fieldConfig, {'name' : 'int_v4netmaskbit'});
    this.int_v4netmaskbit.options = this.networkService.getV4Netmasks();

    this.int_v6netmaskbit =
        _.find(this.fieldConfig, {'name' : 'int_v6netmaskbit'});
    this.int_v6netmaskbit.options = this.networkService.getV6PrefixLength();

    if (!entityForm.isNew) {
      entityForm.setDisabled('int_interface', true);
    }
    else {
      this.networkService.getInterfaceNicChoices().subscribe((res) => {
        res.forEach((item) => {
          this.int_interface.options.push({label : item[1], value : item[0]});
        });
      });
    }
  }
}
