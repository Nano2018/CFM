import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  //afficher l'écran de saisie si la variable vaut 'true'.
  showCaptureScreen : Boolean = false;
  //afficher l'écran de visualisation des contacts si la variable vaut 'true'.
  showVisualisation : Boolean = true;
  //afficher les détails d'un ou plusieurs contacts si la variable vaut 'true'.
  showContactDetails : Boolean = false;
  //permet de recupérer le contact à modifier depuis le composant VisualisationComponent.
  contactToEdit : any;
  //contient la liste des contacts dont nous voulons afficher leurs détails.
  contactsToDisplay : any[];

  //message suite @ la suppression, modification ou ajout d'un contact.
  message : string = '';
  receivedMessage : Boolean = false;
  /**
   * @param nothing
   * @return void
   * activer le composant capture-screen. 
   */
  goToCaptureScreen(){
    if(!this.showCaptureScreen){
      this.showCaptureScreen = true;
      this.showVisualisation = false;
      this.showContactDetails = false;
    }
  }

  /**
  * @param nothing
  * @return void
  * activer le composant visualisation. 
  */
  goToVisualisation(message?:string){
    if(!this.showVisualisation){
      this.showVisualisation = true;
      this.showCaptureScreen = false;
      this.showContactDetails = false;
    }
    if(message != null){
      this.showReceivedMessage(message);
    }
    this.contactToEdit = null;
  }

  /**
   * @param $data: any[]
   * @return void
   * modifier le contact passé en paramètre.
   */
  editContact(data:any){
    this.contactToEdit = data;
    this.goToCaptureScreen();
  
  }
   /**
   * @param $data: any[]
   * @return void
   * activer le composant 'contacts-details' pour afficher le détail des contacts passés en paramètre.
   */
  displayContacts(datas:any[]){
    this.contactsToDisplay = datas;
    this.showCaptureScreen = false;
    this.showVisualisation = false;
    this.showContactDetails = true;
  }

  /**
   * @param $msg
   * @return void
   * afficher le message passé en paramètre pendant une durée de 2,5 secondes.
   */
  showReceivedMessage(msg : string){
    this.message = msg;
    this.receivedMessage = true;
    setTimeout(()=>{                          
      this.message = '';
      this.receivedMessage = false;
 }, 2500);
  }
}

