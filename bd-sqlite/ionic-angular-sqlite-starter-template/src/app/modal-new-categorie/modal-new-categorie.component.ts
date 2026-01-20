import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { TaskService } from '../services/task.service';
import { Category } from '../models/category';
import { AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-new-categorie',
  templateUrl: './modal-new-categorie.component.html',
  styleUrls: ['./modal-new-categorie.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule]
})
export class ModalNewCategorieComponent implements OnInit {

  newCategoryName: string = '';
  categories: Category[] = [];

  constructor(
    private modalCtrl: ModalController,
    private taskService: TaskService,
    private alertCtrl: AlertController
  ) { }

  async ngOnInit() {
    this.categories = await this.taskService.getCategories();
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  async confirm() {
    if (!this.newCategoryName) {
      return;
    }

    if (this.categories.find(cat => cat.name === this.newCategoryName)) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'La categoría ya existe',
        buttons: ['Entendido']
      });
      await alert.present();
      return;
    }

    return this.modalCtrl.dismiss({
      name: this.newCategoryName,
    }, 'confirm');
  }

}
