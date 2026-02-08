import { Injectable } from '@angular/core';
import { Rank, MissionReport, Ninja, MissionData } from 'src/app/types/types';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/utils/consts';

@Injectable({
  providedIn: 'root',
})
export class MissionService {

  private readonly URL = API_URL;

  constructor(private http: HttpClient) { }

  canAcceptMission(missionRank: Rank, currentNinja: Ninja): boolean {
    const userRank = currentNinja.rank;

    switch (userRank) {
      case 'Academy':
        return missionRank === 'D';
      case 'D':
        return missionRank === 'D';
      case 'C':
        return missionRank === 'D' || missionRank === 'C';
      case 'B':
        return missionRank === 'D' || missionRank === 'C' || missionRank === 'B';
      case 'A':
        return missionRank === 'D' || missionRank === 'C' || missionRank === 'B' || missionRank === 'A';
      case 'S':
        return missionRank === 'D' || missionRank === 'C' || missionRank === 'B' || missionRank === 'A' || missionRank === 'S';
      default:
        return false;
    }

  }

  getMissions(rank?: Rank, status?: string): Observable<{ total: number; page: number; limit: number; data: MissionData[] }> {
    const params: any = {};

    if (rank && rank !== 'ALL') {
      params.rank = rank;
    }

    if (status) {
      params.status = status;
    }

    return this.http.get<{ total: number; page: number; limit: number; data: MissionData[] }>(`${this.URL}/missions`, { params });
  }

  updateMissionReport(id: string, report: MissionReport): Observable<any> {
    return this.http.post(`${this.URL}/missions/${id}/report`, report);
  }

  acceptMission(id: string): Observable<any> {
    return this.http.patch(`${this.URL}/missions/${id}/accept`, {});
  }

  abandonMission(id: string): Observable<any> {
    return this.http.delete(`${this.URL}/missions/${id}/abandon`);
  }

}
