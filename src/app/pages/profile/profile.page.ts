import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { switchMap } from 'rxjs/operators';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profileForm: FormGroup;
  birthday = null;
  avatar = null;

  constructor(private modalCtrl: ModalController, private fb: FormBuilder,
    private apiService: ApiService, private toastCtrl: ToastController) { }

  ngOnInit() {
    this.profileForm = this.fb.group({
      username: [{ value: '', disabled: true }],
      email: [''],
      bio: [''],
      dateOfBirth: this.fb.group({
        day: [''],
        month: [''],
        year: ['']
      })
    });
    this.loadUser();
  }

  loadUser() {
    this.apiService.getMyProfile().subscribe((res: any) => {
      console.log(res);
      this.profileForm.patchValue(res);

      if (res.avatar_url) {
        this.avatar = res.avatar_url;
      }

      if (res.dateOfBirth && res.dateOfBirth.year != '') {
        this.birthday = `${res.dateOfBirth.year}-${res.dateOfBirth.month}-${res.dateOfBirth.day}`;
      }
    })
  }

  updateUser() {
    console.log(this.birthday);
    if (this.birthday) {
      const splitted = this.birthday.split('-');

      this.profileForm.patchValue({
        dateOfBirth: {
          day: splitted[2],
          month: splitted[1],
          year: splitted[0]
        }
      })
    }
    console.log(this.profileForm.value);
    this.apiService.updateProfile(this.profileForm.value).subscribe(async res => {
      console.log('updated users: ', res);
      this.profileForm.patchValue(res);
      const toast = await this.toastCtrl.create({
        message: 'Profile saved.',
        duration: 2000
      });
      toast.present();
    });
  }

  deleteAccount() {
    this.apiService.deleteAccount().pipe(
      switchMap(async res => {
        console.log('after delete: ', res);
        
        await this.modalCtrl.dismiss();
        this.apiService.logout();
      })
    ).subscribe();
  }

  close() {
    this.modalCtrl.dismiss();
  }

  async updateAvatar() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos
    });

    console.log(image);

    this.apiService.uploadAvatar(image).then(res => {
      this.avatar = null;
      this.loadUser();
    });
  }
}
