import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CONSTANTS } from '../config/constants';
import { Observable, catchError, map } from 'rxjs';
import { APIResponse } from '../types';

const SAMPLES_API_ENDPOINT = `${CONSTANTS.GLOBAL_API_ENDPOINT}/samples`;
const PANEL_API_ENDPOINT = `${CONSTANTS.GLOBAL_API_ENDPOINT}/panels`;
const SAMPLES_PANELS_API_ENDPOINT = `${CONSTANTS.GLOBAL_API_ENDPOINT}/samplespanels`;

@Injectable({
  providedIn: 'root'
})
export class SamplesAPIService {

  constructor(private http: HttpClient) { }

  // Samples
  getSampleById(sample_id: string): Observable<HttpResponse<APIResponse>> {
    const url = `${SAMPLES_API_ENDPOINT}/${sample_id}`;
    const httpOptions = {
      observe: 'response' as const,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.get(url, httpOptions).pipe(
      map(resp => resp as HttpResponse<APIResponse>),
    );
  }

  getSamples(): Observable<HttpResponse<APIResponse>> {
    const url = `${SAMPLES_API_ENDPOINT}`;

    const httpOptions = {
      observe: 'response' as const,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.get(url, httpOptions).pipe(
      map(resp => resp as HttpResponse<APIResponse>),
    );
  }

  deleteSample(sample_id: string): Observable<HttpResponse<APIResponse>> {
    const url = `${SAMPLES_API_ENDPOINT}/${sample_id}`;
    const httpOptions = {
      observe: 'response' as const,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.delete(url, httpOptions).pipe(
      map(resp => resp as HttpResponse<APIResponse>),
    );
  }

  postSample(sample: any): Observable<HttpResponse<APIResponse>> {
    const url = `${SAMPLES_API_ENDPOINT}`;
    const httpOptions = {
      observe: 'response' as const,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(url, sample, httpOptions).pipe(
      map(resp => resp as HttpResponse<APIResponse>),
    )
  }

  putSample(sample: any): Observable<HttpResponse<APIResponse>> {
    const url = `${SAMPLES_API_ENDPOINT}/${sample.sample_id}`;
    const data = {
      full_name: sample.full_name,
      sputalysed: sample.sputalysed,
      comment: sample.comment,
    };

    const httpOptions = {
      observe: 'response' as const,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.put(url, data, httpOptions).pipe(
      map(resp => resp as HttpResponse<APIResponse>),
    );
  }

  // Panels
  getPanels(): Observable<HttpResponse<APIResponse>> {
    const url = `${PANEL_API_ENDPOINT}`;
    const httpOptions = {
      observe: 'response' as const,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.get(url, httpOptions).pipe(
      map(resp => resp as HttpResponse<APIResponse>),
    );
  }

  getPanelsBySampleId(sample_id: string): Observable<HttpResponse<APIResponse>> {
    const url = `${SAMPLES_PANELS_API_ENDPOINT}`;
    const httpOptions = {
      observe: 'response' as const,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      params: new HttpParams({
        fromObject: {
          sample_id: sample_id
        }
      }),
    };

    return this.http.get(url, httpOptions).pipe(
      map(resp => resp as HttpResponse<APIResponse>),
    );
  }

  addPanelToSample(sample_id: string, panel_id: string): Observable<HttpResponse<APIResponse>> {
    const url = `${SAMPLES_PANELS_API_ENDPOINT}`;

    const data = {
      sample_id: sample_id,
      panel_id: panel_id
    };

    const httpOptions = {
      observe: 'response' as const,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    };

    return this.http.post(url, data, httpOptions).pipe(
      map(resp => resp as HttpResponse<APIResponse>),
    );
  }

  removePanelFromSample(sample_id: string, panel_id: string): Observable<HttpResponse<APIResponse>> {
    const url = `${SAMPLES_PANELS_API_ENDPOINT}/${sample_id}/${panel_id}`;

    const data = {
      deleted: true
    };

    const httpOptions = {
      observe: 'response' as const,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    };

    return this.http.patch(url, data, httpOptions).pipe(
      map(resp => resp as HttpResponse<APIResponse>),
    );
  }
}
