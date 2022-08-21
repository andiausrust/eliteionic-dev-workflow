import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, IonRouterOutlet, LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { RegisterPage } from '../register/register.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;

  constructor(private modalCtrl: ModalController, private routerOutlet: IonRouterOutlet,
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private apiService: ApiService,
    private alertCtrl: AlertController,
    private router: Router) { }

  ngOnInit() {
    this.credentials = this.fb.group({
      username: ['simon2', Validators.required],
      password: ['111111', [Validators.required, Validators.minLength(6)]],
    });
  }

  async login() {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    this.apiService.login(this.credentials.value).subscribe(
      async (res) => {
        await loading.dismiss();
        this.router.navigateByUrl('/inside', { replaceUrl: true });
      }, async (err) => {
        await loading.dismiss();

        const alert = await this.alertCtrl.create({
          header: 'Login failed',
          message: err.error.msg,
          buttons: ['OK'],
        });
 
        await alert.present();
      }
    )
  }

  get username() {
    return this.credentials.get('username');
  }
  
  get password() {
    return this.credentials.get('password');
  }

  async openRegister() {
    const modal = await this.modalCtrl.create({
      component: RegisterPage,
      presentingElement: this.routerOutlet.nativeEl
    });

    await modal.present();
  }

}
