import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { EquipesComponent } from './components/equipes/equipes';
import { AuthGuard } from './guards/auth-guard';
import { Layout } from './responsable/layout/layout';
import { Registre } from './registre/registre';
import { JoueurCardComponent } from './admin/joueur-card/joueur-card';
import { GestionTournoi } from './admin/gestion-tournoi/gestion-tournoi';
import { LayoutA } from './admin/layout/layout';
import { MesParticipations } from './responsable/mes-participations/mes-participations';
import { TournoisDisponibles } from './responsable/tournois-disponible/tournois-disponible';
import { HomeComponent } from './home/home';
import { StadeCardComponent } from './responsable/stade/stade';
import { ListeMatchst } from './responsable/liste-matchs/liste-matchs';
import { PlanifierMatchComponent } from './admin/planifier-match/planifier-match';
import { MatchDashboardComponent } from './admin/match-dashboard/match-dashboard';
import { Classement } from './admin/classement/classement';
import { DIR_DOCUMENT } from '@angular/cdk/bidi';
import { DashboardComponent } from './admin/dashboard/dashboard';
import { MatchesParEquipeComponent } from './responsable/equipe-match/equipe-match';
import { ClassementEquipeComponent } from './responsable/classement-equipe/classement-equipe';
import { GestionUtilisateursComponent } from './admin/gestion-utilisateur/gestion-utilisateur';



export const routes: Routes = [
  {path:'', component: HomeComponent},
  { path: 'login', component: LoginComponent },


  { path: 'register', component: Registre },

  {
    path: 'responsable',
    component: Layout,
    canActivate: [AuthGuard],children: [
       { path: '', component: JoueurCardComponent },
      { path: 'joueur', component: JoueurCardComponent },{
        path: 'mes-participations', component: MesParticipations
      },{path: 'tournoi', component: TournoisDisponibles},{
        path: 'equipe-match', component: MatchesParEquipeComponent
      },{ path: 'classement', component: ClassementEquipeComponent }
    ]
  },  {
    path: 'admin',
    component: LayoutA,
    canActivate: [AuthGuard],children: [
      { path: '', component: DashboardComponent},
      { path: 'tournois', component: GestionTournoi },
       { path: 'stade', component: StadeCardComponent },
       { path: 'match', component: ListeMatchst },
       { path: 'planifier/:id', component: PlanifierMatchComponent },
       {path: 'score/:id', component:MatchDashboardComponent },
       {path: 'classement', component:Classement},
       {path:'dashboard', component:DashboardComponent},
       {path: 'gestion-utilisateurs', component: GestionUtilisateursComponent}
    ]
  },

  {
    path: '',
    redirectTo: 'register',
    pathMatch: 'full'
  }
];
