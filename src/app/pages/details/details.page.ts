import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  profileForm: FormGroup;
  avatar = null;
  birthday = null;

  constructor(private route: ActivatedRoute, private apiService: ApiService, private fb: FormBuilder) { }

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
    this.profileForm.disable();

    this.loadUser();
  }

  loadUser() {
    const id = this.route.snapshot.paramMap.get('id');

    this.apiService.getUserById(id).subscribe((res: any) => {
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

}
