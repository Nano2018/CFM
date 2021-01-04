import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { Observable } from 'rxjs';
import { RestService } from '../services/rest.service';



@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.scss']
})
export class ContactDetailsComponent implements OnInit {
  //Récupérer la liste des contacts à afficher.
  @Input() contacts : any[];
  //envoyer le contact à modifier ou composant 'app-component'.
  @Output() updateContactEvent = new EventEmitter();
  //
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @Output() sendMessage = new EventEmitter();
  @Output() nothingToDisplay = new EventEmitter();
  dataSource: MatTableDataSource<any> ;
  obs: Observable<any>;
  constructor(private restApi : RestService) { }

  ngOnInit(): void {
    this.dataSource =  new MatTableDataSource<any>(this.contacts);
    this.dataSource.paginator = this.paginator;
    this.obs = this.dataSource.connect();
  }

  getSize(){
    return this.contacts.length;
  }

  updateContact(id : number){
    this.updateContactEvent.emit(this.contacts[this.getSelectedContact(id)]);
  }


  deleteContact(id: number){
    let id_bis = this.getSelectedContact(id);
    console.log("identifiant : ",id_bis);
    console.log("element : ",this.contacts[id_bis]);
    /*
    if(confirm("Êtes-vous sûr de vouloir supprimer ce contact? ")) {
      this.restApi.deleteContact(id).subscribe(node => console.log(node));
      this.contacts.splice(id_bis,1);
      if(this.contacts.length == 0){
        this.nothingToDisplay.emit("le contact a bien été supprimé");
      }else{
        this.init();
        this.sendMessage.emit("le contact a bien été supprimé");
      }
    }
    */
  }

  getSelectedContact(id : number){
    for(let i=0; i<this.contacts.length; i++){
      if(this.contacts[i].id == id){
        return i;
      }
    }
  }
}
