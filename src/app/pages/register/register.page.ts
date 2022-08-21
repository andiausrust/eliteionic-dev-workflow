import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  credentials: FormGroup;

  constructor(private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private apiService: ApiService,
    private modalCtrl: ModalController,
    private router: Router,
    private alertCtrl: AlertController) { }

  ngOnInit() {
    this.credentials = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async signUp() {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    this.apiService.signUp(this.credentials.value).subscribe(
      async (res) => {
        await loading.dismiss();
        await this.modalCtrl.dismiss();
        this.router.navigateByUrl('/inside', { replaceUrl: true });
      }, async (err) => {
        await loading.dismiss();

        const alert = await this.alertCtrl.create({
          header: 'Registration failed',
          message: err.error.msg,
          buttons: ['OK'],
        });
 
        await alert.present();
      }
    )
  }

  close() {
    this.modalCtrl.dismiss();
  }

  get username() {
    return this.credentials.get('username');
  }
  
  get password() {
    return this.credentials.get('password');
  }

}
