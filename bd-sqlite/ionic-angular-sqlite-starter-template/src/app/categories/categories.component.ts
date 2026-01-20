import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Category } from '../models/category';
import { TaskService } from '../services/task.service';
import { AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class CategoriesComponent implements OnInit {

  selectedTag = 'inventario';
  categories: Category[] = [];

  constructor(private taskService: TaskService, private alertCtrl: AlertController) { }

  async ngOnInit() {
    this.categories = await this.taskService.getCategories();
  }

  async confirmDelete(cat: Category) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar borrado',
      message: `¿Estás seguro de que quieres borrar la categoría "${cat.name}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Borrar',
          handler: async () => {
            await this.taskService.deleteCategory(cat.id);
            this.categories = await this.taskService.getCategories();
          },
        },
      ],
    });

    await alert.present();
  }



}
