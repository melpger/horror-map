import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ScreenID } from 'src/app/constants/constants';
import { LoadingService } from 'src/app/services/loading.service';
import { LoginService } from 'src/app/services/login.service';
import { RouterDataService } from 'src/app/services/router-data.service';
import { UserAPIService } from 'src/app/services/user-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @Input() formLogin: FormGroup;
  isSubmitted = false;

  constructor(
    private routeData: RouterDataService,
    private formBuilder: FormBuilder,
    private loading: LoadingService,
    private userApi: UserAPIService,
    private loginSrvc: LoginService
  ) {
  }

  ngOnInit() {
    this.formLogin = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get errorControl() {
    return this.formLogin.controls;
  }

  doLogin() {
    this.isSubmitted = true;
    if (!this.formLogin.valid) {
      console.log('Please provide all the required values!');
      return false;
    } else {
      this.loading.present();
      console.log(this.formLogin.value);

      this.userApi.issueToken(this.formLogin.value.email, this.formLogin.value.password).subscribe((response) => {
        this.loading.dismiss();
        console.log('issueToken response received', response);
      }, err => {
        this.loading.dismiss();
        console.log('error on login', err);
        this.loginSrvc.showError(err);
      });

      //this.routeData.setRoot(ScreenID.pageTabs);
    }
  }

}
