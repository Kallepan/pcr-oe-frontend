import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CONSTANTS } from '../config/constants';
import { ExportData } from '../sample-analysis/sample-analysis-form/sample-analysis-form.component';

const SAMPLE_ANALYSES_API_ENDPOINT = `${CONSTANTS.GLOBAL_API_ENDPOINT}/samplespanels`;
const PRINTER_API_ENDPOINT = `${CONSTANTS.GLOBAL_API_ENDPOINT}/printer`;
const RESET_SAMPLE_PANEL_ENDPOINT = `${SAMPLE_ANALYSES_API_ENDPOINT}/reset`;

@Injectable({
  providedIn: 'root'
})
export class SamplesAnalysesAPIService {

  constructor(private http: HttpClient) { }

  getStatistics(): Observable<HttpResponse<any>> {
    const url = `${SAMPLE_ANALYSES_API_ENDPOINT}/stats`;

    const httpOptions = {
      observe: 'response' as const,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.get(url, httpOptions);
  }

  printLabels(elements: any[]): Observable<HttpResponse<any>> {
    const url = PRINTER_API_ENDPOINT;

    const data = {
      elements: elements,
    };

    const httpOptions = {
      observe: 'response' as const,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    };

    return this.http.post(url, data, httpOptions);
  }

  getSamplesAnalyses(): Observable<HttpResponse<any>> {
    const url = `${SAMPLE_ANALYSES_API_ENDPOINT}`;
    const httpOptions = {
      observe: 'response' as const,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.get(url, httpOptions);
  }

  postSamplesAnalyses(sample_id: string, panel_id: string): Observable<HttpResponse<any>> {
    const url = `${SAMPLE_ANALYSES_API_ENDPOINT}`;
    const data = {
      sample_id: sample_id,
      panel_id: panel_id
    }
    const httpOptions = {
      observe: 'response' as const,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(url, data, httpOptions);
  }

  deleteSamplesAnalyses(sample_id: string, panel_id: string): Observable<HttpResponse<any>> {
    const url = `${SAMPLE_ANALYSES_API_ENDPOINT}/${sample_id}/${panel_id}`;
    const httpOptions = {
      observe: 'response' as const,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    };

    return this.http.delete(url, httpOptions);
  }

  createRun(exportData: ExportData): Observable<HttpResponse<any>> {
    const url = `${SAMPLE_ANALYSES_API_ENDPOINT}/create-run`;

    const data = {
      device: exportData.device,
      run: exportData.run,
      date: exportData.date,
      elements: exportData.elements,
    };

    const httpOptions = {
      observe: 'response' as const,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'blob' as const,
    };

    return this.http.post(url, data, httpOptions);
  }

  getSamplesAnalysesForSample(sample_id: string): Observable<HttpResponse<any>> {
    const url = `${SAMPLE_ANALYSES_API_ENDPOINT}`;

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

    return this.http.get(url, httpOptions);
  }

  getSamplesAnalysesForRun(run_date: string, run: string, device: string): Observable<HttpResponse<any>> {
    const url = `${SAMPLE_ANALYSES_API_ENDPOINT}`;

    const httpOptions = {
      observe: 'response' as const,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      params: new HttpParams({
        fromObject: {
          run_date: run_date,
          run: run,
          device: device
        }
      }),
    };

    return this.http.get(url, httpOptions);
  }

  resetSamplePanel(sampleId: string, panelId: string): Observable<HttpResponse<any>> {
    const url = `${RESET_SAMPLE_PANEL_ENDPOINT}`;

    const data = {
      sample_id: sampleId,
      panel_id: panelId
    };

    const httpOptions = {
      observe: 'response' as const,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    };

    return this.http.post(url, data, httpOptions);
  }
}
