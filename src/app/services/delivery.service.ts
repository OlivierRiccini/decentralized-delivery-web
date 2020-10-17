import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  constructor(private http: HttpClient) { }

  public addressesToDuration(deliveryData: any): Observable<number> {
    const from = deliveryData.fromAddress;
    const to = deliveryData.toAddress;
    const url = environment.mapbox.directions + from + ';' + to + '?access_token=' + environment.mapbox.access_token;
    return this.http.get(url).pipe(
      map((res: any) => res.routes[0].duration * 1000)
    );
  }

  public formatFromAddress(deliveryData: any): Observable<string> {
    const from = deliveryData.fromAddress;
    const to = deliveryData.toAddress;
    const url = environment.mapbox.geocodingBaseUrl + from + '.json?access_token=' + environment.mapbox.access_token;
    return this.http.get(url).pipe(
      map((res: any) => res.features[0].place_name)
    );
  }
}
