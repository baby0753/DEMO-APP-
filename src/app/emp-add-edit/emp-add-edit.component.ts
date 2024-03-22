import { Component, Inject, OnInit, TrackByFunction, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

 // Importing the Fruit type from its source file
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from '../core/core.service';
import { EmployeeService } from '../services/employee.service';
import { HttpClient } from '@angular/common/http';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatChipEditedEvent } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';



@Component({
  selector: 'app-emp-add-edit',
  templateUrl: './emp-add-edit.component.html',
  styleUrls: ['./emp-add-edit.component.scss'],
})
export class EmpAddEditComponent implements OnInit {


   fruitName: string = "apple";
   addOnBlur = true;
   readonly separatorKeysCodes = [ENTER, COMMA] as const;
   fruits: {name: string}[] = [];

   announcer = inject(LiveAnnouncer);
 //trackFn: TrackByFunction<string> | undefined;
 // In your component class
trackFn(index: number, fruit: { name: string }): string {
  return fruit.name; // Assuming 'name' is a unique identifier for each fruit
}


   add(event: MatChipInputEvent): void {
     const value = (event.value || '').trim();

     // Add our fruit
     if (value) {
      //  this.fruits.push({name: value});
      // Assuming 'value' is the string you want to use as the name
      this.fruits.push({ name: value }); 
      event.chipInput!.clear();
     }

     // Clear the input value
    //  event.chipInput!.clear();
   }

   remove(fruit: string): void {
    //  const index = this.fruits.indexOf(fruit);
    const index = this.fruits.findIndex(fruit => fruit.name === this.fruitName);
     if (index >= 0) {
       this.fruits.splice(index, 1);
       this.announcer.announce(`Removed ${fruit}`);
     }
   }

   edit(fruit: string, event: MatChipEditedEvent) {
     const value = event.value.trim();

     // Remove fruit if it no longer has a name
     if (!value) {
       this.remove(fruit);
       return;
     }

     // Edit existing fruit
    //  const index = this.fruits.indexOf(fruit);
    const index = this.fruits.findIndex(fruit => fruit.name === this.fruitName);

     if (index >= 0) {
       this.fruits[index].name = value;
     }
   }







  formBuilder: any;
  constructor(private _http: HttpClient,private fb:FormBuilder) {}

  registerForm!: FormGroup;
  selectedFile!: File;

  registeruser: any;
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      file: [null] // Add validators if needed
    });
    this.registerForm = new FormGroup({
      firstname: new FormControl('', [
        Validators.required,
        Validators.minLength(20),
        Validators.pattern('[a-zA-Z].*'),
      ]),
      lastname: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.pattern('[a-zA-Z].*'),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      mobile: new FormControl('', [
        Validators.required,
        Validators.pattern("[0-9]*"),
        Validators.minLength(10),
        Validators.maxLength(10),
      ]),
      gender: new FormControl('',[Validators.required]),
      city: new FormControl('',[Validators.required]),
      state: new FormControl('',[Validators.required]),
      address1: new FormControl('', [Validators.required]),
      address2: new FormControl(''),
      tag: new FormControl(''),
      file: new FormControl('', [Validators.required])
    });

    this.registerForm = this.formBuilder.group({
      addressType: ['home', Validators.required], // Default value is 'home'
      address1: ['', Validators.required],
      address2: [''],
      image: ['', [Validators.required]]
    });

    // Subscribe to changes in addressType control
    this.registerForm.get('addressType')?.valueChanges.subscribe((value) => {
      if (value === 'office') {
        this.registerForm.get('address1')?.clearValidators();
        this.registerForm.get('address2')?.clearValidators();
      } else {
        this.registerForm.get('address1')?.setValidators(Validators.required);
        this.registerForm.get('address2')?.setValidators(Validators.required);
      }

      // Reset validation status
      this.registerForm.get('address1')?.updateValueAndValidity();
      this.registerForm.get('address2')?.updateValueAndValidity();
    });
  }

  isHomeAddressSelected(): boolean {
    return this.registerForm.get('addressType')?.value === 'home';
  }


  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.validateDimensions();
    const fileControl = this.registerForm.get('file');
if (fileControl !== null) {
    fileControl.setValue(file);
} else {
    // Handle the case where fileControl is null
    console.log("file control is null or undefined");
}
  }
  validateDimensions() {
    const imageControl = this.registerForm.get('image');
if (imageControl !== null) {
    imageControl.setErrors({ invalidDimensions: true });
} else {
    // Handle the case where imageControl is null
    console.log("'image' control is null.");
    // You can perform other actions like logging an error, displaying a message, or any other appropriate handling.
}

  }

  registerSubmit() {
    console.log(this.registerForm.value);
    // console.log(this.registerForm.get('firstname'));
    this.registeruser = this.registerForm.value.firstname;
    this._http
      .post<any>('http://localhost:3000/registerForm', this.registerForm.value)
      .subscribe(
        (res) => {
          this.registeruser;
          this.registerForm.reset();
        },
        (err) => {
          alert('something wrong');
        }
      );
      if (!this.registerForm.invalid) {
        const formData = new FormData();
        formData.append('image', this.selectedFile);
  
        // Assuming you have an endpoint to handle file uploads
        this._http.post<any>('http://localhost:3000/registerForm/upload', formData).subscribe(
          (response) => {
            console.log('Image uploaded successfully!', response);
            // Handle success response
          },
          (error) => {
            console.error('Error occurred while uploading image:', error);
            // Handle error
          }
        );
      }
  }

  get FirstName(): FormControl {
    return this.registerForm.get('firstname') as FormControl;
  }
  get LastName(): FormControl {
    return this.registerForm.get('lastname') as FormControl;
  }
  get Email(): FormControl {
    return this.registerForm.get('email') as FormControl;
  }
  get Mobile(): FormControl {
    return this.registerForm.get('mobile') as FormControl;
  }
  get Gender(): FormControl {
    return this.registerForm.get('gender') as FormControl;
  }
  get City(): FormControl {
    return this.registerForm.get('city') as FormControl;
  }
  get State(): FormControl {
    return this.registerForm.get('state') as FormControl;
  }
  get Address1(): FormControl {
    return this.registerForm.get('address1') as FormControl;
  }
  get Address2(): FormControl {
    return this.registerForm.get('address2') as FormControl;
  }
  get Tag(): FormControl {
    return this.registerForm.get('tag') as FormControl;
  }

  //empForm: FormGroup;

  // education: string[] = [
  //   'Maharastra',
  //   'Karnataka',
  //   'Tamil Nadu',
  //   'Kerala',
  //   'Goa',
  // ];

  // constructor(
  //   private _fb: FormBuilder,
  //   private _empService: EmployeeService,
  //   private _dialogRef: MatDialogRef<EmpAddEditComponent>,
  //   @Inject(MAT_DIALOG_DATA) public data: any,
  //   private _coreService: CoreService
  // ) {
  //   this.empForm = this._fb.group({
  //     firstName: new FormControl('', [
  //       Validators.required,
  //       Validators.minLength(20),
  //       Validators.pattern('[a-zA-Z].*'),
  //     ]),
  //     lastName: '',
  //     email: '',
  //     dob: '',
  //     gender: '',
  //     education: '',
  //     company: '',
  //     experience: '',
  //     package: '',
  //   });
  // }

  // ngOnInit(): void {
  //   this.empForm.patchValue(this.data);
  //}

  // onFormSubmit() {
  //   console.log(this.empForm.get('firstName'));
  //   if (this.empForm.valid) {
  //     if (this.data) {
  //       this._empService
  //         .updateEmployee(this.data.id, this.empForm.value)
  //         .subscribe({
  //           next: (val: any) => {
  //             this._coreService.openSnackBar('Employee detail updated!');
  //             this._dialogRef.close(true);
  //           },
  //           error: (err: any) => {
  //             console.error(err);
  //           },
  //         });
  //     } else {
  //       this._empService.addEmployee(this.empForm.value).subscribe({
  //         next: (val: any) => {
  //           this._coreService.openSnackBar('Employee added successfully');
  //           this._dialogRef.close(true);
  //         },
  //         error: (err: any) => {
  //           console.error(err);
  //         },
  //       });
  //     }
  //   }
  // }
}
