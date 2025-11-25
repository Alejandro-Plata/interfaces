import { Routes } from '@angular/router';
import { ChampionListComponent } from './champion-list-component/champion-list-component';
import { ChampionDetailComponent } from './champion-detail-component/champion-detail-component';

export const routes: Routes = [
    { path: '', component: ChampionListComponent }, // Ruta por defecto
    { path: 'champions/:id', component: ChampionDetailComponent }, // Ruta para ver el detalle de un campeón (usando param id)
    { path: '**', component: ChampionListComponent } // Ruta comodín para URLs no encontradas
];
