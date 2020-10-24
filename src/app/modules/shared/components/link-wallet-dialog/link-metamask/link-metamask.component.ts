import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-link-metamask',
  templateUrl: './link-metamask.component.html',
  styleUrls: ['./link-metamask.component.scss']
})
export class LinkMetamaskComponent implements OnInit {
  @Input() public isMetaMaskInstalled: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
