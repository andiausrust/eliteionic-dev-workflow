import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ModalController, IonRouterOutlet } from '@ionic/angular';
import { ProfilePage } from '../profile/profile.page';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-inside',
  templateUrl: './inside.page.html',
  styleUrls: ['./inside.page.scss'],
})
export class InsidePage implements OnInit {
  users: Observable<any>;

  constructor(private apiService: ApiService, private modalCtrl: ModalController,
    private routerOtlet: IonRouterOutlet) { }

  ngOnInit() {
    this.users = this.apiService.getUsers();
  }

  logout() {
    this.apiService.logout();
  }

  getSecret() {
    this.apiService.getSecretTest().subscribe(res => {
      console.log('secret result: ', res);
    });
  }

  doRefresh(ev) {
    this.users = this.apiService.getUsers();
    this.users.pipe(
      take(1)
    ).subscribe(_ => {
      ev.target.complete();
    });
  }

  async editProfile() {
    const modal = await this.modalCtrl.create({
      component: ProfilePage,
      presentingElement: this.routerOtlet.nativeEl
    });

    await modal.present();
  }
}
