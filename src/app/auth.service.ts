import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly TOKEN_KEY = 'token';
  private readonly apiUrl = 'https://demo.seminalsoftwarepvt.in/eoasis17/api/kiosk/Authenticate_User';
  private readonly encryptionKey = 'OasisWeb';

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService,) { }

  login(UserId: any, password: string): Observable<boolean> {
    const userIdInt = parseInt(UserId, 10); 
    const params = { UID: userIdInt, PWD: password };
  
    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map((response) => {
        if (response?.UserPassword) {
          const decryptedPassword = this.decrypt(response.UserPassword, this.encryptionKey);
          const resuserid = response.UserId;
          const superuser = response.SuperUser;
          const params = { UID: UserId, PWD: password };
        if (resuserid === userIdInt && decryptedPassword === password && superuser === true) {
            console.log('Login successful');
            this.toastr.success('Login Successfully', 'Success');
            localStorage.setItem("FullName", response.FullName);
            localStorage.setItem("ContactMobile", response.ContactMobile);
            localStorage.setItem("UserId", response.UserId);
            localStorage.setItem("Password", decryptedPassword);
            localStorage.setItem(this.TOKEN_KEY, 'dummy-token');
            return true;
          } else {
            return false;
          }
        } else {
          console.log('Invalid response from server');

        }
        return false;
      }),
      catchError((error) => {
        console.error('Error during login:', error);
        return of(false); // Return false in case of an error
      })
    );
  }
  


  private decrypt(encryptedText: string, key: string): string {

    const hashedKey = CryptoJS.MD5(key).toString();

    const decrypted = CryptoJS.TripleDES.decrypt(
      encryptedText,
      CryptoJS.enc.Hex.parse(hashedKey),
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    return decrypted.toString(CryptoJS.enc.Utf8).trim();
  }


  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('An error occurred while trying to log in. Please try again later.');
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigateByUrl('/login');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }
}
