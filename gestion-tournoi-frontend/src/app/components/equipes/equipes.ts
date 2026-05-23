import { Component, OnInit } from '@angular/core';
import { EquipeService } from '../../services/equipe';

@Component({
  selector: 'app-equipes',
  imports: [],
  templateUrl: './equipes.html',
  styleUrl: './equipes.css',
})
export class EquipesComponent implements OnInit {

  private equipes: any[] = [];
  nom = '';

  constructor(private service: EquipeService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.service.getMyTeams().subscribe(res => this.equipes = res);
  }

  create() {
    this.service.create({ nom: this.nom })
      .subscribe(() => this.load());
  }

  delete(id: number) {
    this.service.delete(id).subscribe(() => this.load());
  }
}
