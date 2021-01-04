import { Component, Input, OnInit, Output } from '@angular/core';
import { Validators,FormBuilder, FormArray, FormGroup, ValidatorFn } from '@angular/forms';
import { Contact } from '../services/contact';
import { ContactAddress } from '../services/contact-address';
import { DatePipe } from '@angular/common'
import { EventEmitter } from '@angular/core';
import { RestService } from '../services/rest.service';
@Component({
  selector: 'app-capture-screen',
  templateUrl: './capture-screen.component.html',
  styleUrls: ['./capture-screen.component.scss']
})
export class CaptureScreenComponent implements OnInit {
  contact : Contact;

  profileForm : FormGroup;
  //Recevoir le contact à modifier.
  @Input() contactEdit : any;
  //activer le composant 'visualisation'.
  @Output() goToVisualisationEvent = new EventEmitter<string>();

  phoneNumberPattern : string = "^[0-9]{10}$";
  zipCodePattern : string = "^[0-9]{5}$";
  houseNumberPattern : string = "^[0-9]+$";
  //activer ou désactiver le button de suppresion d'un bloc d'adresse.
  showDeleteButton : Boolean = false;
  constructor(private fb : FormBuilder, 
              public pipe : DatePipe,
              private restAPi : RestService) {}

  //initialiser le formulaire.
  //si 'contactEdit' est différent de null on initialise le formulaire avec les valeurs de ce contact.
  ngOnInit(): void {
    let split_date : any;
    let stringBirthdate = '';
    if(this.contactEdit != null){
      split_date =  this.contactEdit.birthdate.split("/");
      stringBirthdate = split_date[1] + '-' + split_date[0] + '-' + split_date[2];
    }
    this.profileForm =  this.fb.group({
      firstName : [this.contactEdit != null ? this.contactEdit.name : '',Validators.required],
      lastName: [this.contactEdit != null ? this.contactEdit.firstName : '',Validators.required],
      birthdate: [this.contactEdit != null ? new Date(stringBirthdate) : '',Validators.required],
      address: this.fb.array([])
    });
    this.initAddresses();
  }

  //recupérer la liste des adresses sous forme d'un tableau de 'FormAray'.
  get address(){
    return this.profileForm.get('address') as FormArray;
  }

  initAddresses(){
    // si 'contactEdit' n'est pas vide, on récupère la liste de ces adresses et on initialise le formulaire.
    if(this.contactEdit != null){
      let addresses = this.contactEdit.address as ContactAddress[];
      for(let i=0; i<addresses.length; i++){
        this.address.push(
          this.fb.group({
            addressType : [addresses[i].addressType,Validators.required],
            routeType : [addresses[i].routeType,Validators.required],
            street: [addresses[i].street,Validators.required],
            houseNumber : [addresses[i].houseNumber,[Validators.required,Validators.pattern(this.houseNumberPattern)]],
            city: [addresses[i].city,Validators.required],
            zipCode: [addresses[i].zipCode,[Validators.required, Validators.pattern(this.zipCodePattern)]],
            phoneNumber : [addresses[i].phoneNumber,[Validators.required, Validators.pattern(this.phoneNumberPattern)]],
            country: [addresses[i].country,Validators.required],
            comment: [addresses[i].comment]
          })
        );
      }
    }else{
      this.addNewAddress();
      this.showDeleteButton = false;
    }
  }

 /**
   * @param ()
   * @return void
   * Ajouter un bloc d'adresse.
   */
  addNewAddress(){
   this.address.push(this.getNewAddressFormGroup());
   this.showDeleteButton = true;
  }

  //supprimer le dernier bloc d'adresse.
  deleteAddress(){
    this.address.controls.pop();
    if(this.address.controls.length == 1){
      this.showDeleteButton = false;
      //forcer la mise à jour du formulaire.
      this.address.controls[0].get("country").setValue(this.address.controls[0].get("country").value);
    }
  }

  getNewAddressFormGroup():FormGroup{
    return this.fb.group({
      addressType : ['',Validators.required],
      routeType : ['',Validators.required],
      street: ['',Validators.required],
      houseNumber : [,Validators.required],
      city: ['',Validators.required],
      zipCode: ['',Validators.required],
      phoneNumber : ['',Validators.required],
      country: ['',Validators.required],
      comment: ['']
    });
  }

  /**
   * @param ()
   * @return void
   * permet d'afficher le contact et permettre de le modifier
   */
  onSubmit() { 
    //calculer l'identifiant du nouveau contact.
    let size = 0;
    if(this.contactEdit!=null){
      size = this.contactEdit.id;
    }else{
      size = this.getContactsSize();
    }
    //calculer l'age du contact.
    let age = new Date().getFullYear() - new Date(this.profileForm.controls.birthdate.value).getFullYear();
    let addresses : ContactAddress[] = [];
    for(let i=0; i<this.address.length; i++){
        addresses.push(new ContactAddress(i,
        this.address.controls[i].get("addressType").value,
        this.address.controls[i].get("routeType").value,
        this.address.controls[i].get("street").value,
        this.address.controls[i].get("houseNumber").value,
        this.address.controls[i].get("zipCode").value,
        this.address.controls[i].get("city").value,
        this.address.controls[i].get("country").value,
        this.address.controls[i].get("comment").value,
        this.address.controls[i].get("phoneNumber").value));
    }

  

    this.contact = new Contact(size,
    this.profileForm.controls.firstName.value,
    this.profileForm.controls.lastName.value,
    this.pipe.transform(this.profileForm.controls.birthdate.value,'dd/MM/yyyy'),
    age,
    addresses);

    if(this.contactEdit == null){
      this.restAPi.addContact(this.contact).subscribe(data => {
        this.goToVisualisationEvent.emit("le contact a bien été ajouté");
      }); 
    }else{
      this.restAPi.updateContact(this.contact).subscribe(data => {
        this.goToVisualisationEvent.emit("le contact a bien été modifié");
      }); 
    }
    console.log("je suis la");
  }


  getContactsSize(){
    var size = 0;
    this.restAPi.getContacts().subscribe(datas => size =  datas.length);
    return size;
  }

  cancelChanges(){
    this.goToVisualisationEvent.emit("Aucun changement n'a été fait !");
  }

  showButtonUpdate(){
    return this.contactEdit != null;
  }
 
}