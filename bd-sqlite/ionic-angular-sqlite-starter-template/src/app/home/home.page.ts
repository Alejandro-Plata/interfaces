import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../services/task.service';
import { Item } from '../models/item';
import { ModalComponent } from '../modal/modal.component';
import { Category } from '../models/category';
import { ModalNewCategorieComponent } from '../modal-new-categorie/modal-new-categorie.component';
import { CategoriesComponent } from "../categories/categories.component";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [CommonModule, IonicModule, FormsModule, ModalNewCategorieComponent, CategoriesComponent],
  standalone: true
})
export class HomePage implements OnInit {

  selectedTag = 'inventario';
  categories: Category[] = [];

  constructor(public taskService: TaskService, public modalController: ModalController) { }

  async ngOnInit() {
    this.categories = await this.taskService.getCategories();
  }

  async addItem(name: string, stock: number, category_name: string) {
    const categoryId = await this.taskService.getCategoryIdByName(category_name);

    if (name.trim().length > 0 && stock > 0 && categoryId) {
      await this.taskService.addItem(name, stock, categoryId);
    }
  }

  async removeItem(item: Item) {
    await this.taskService.deleteItem(item.id);
  }

  async updateItem(item: Item) {
    await this.taskService.updateItem(item);
  }

  async increaseStock(item: Item) {
    item.stock++;
    await this.taskService.updateItem(item);
  }

  async decreaseStock(item: Item) {

    if (item.stock > 0) {
      item.stock--;
    }

    await this.taskService.updateItem(item);
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: ModalComponent,
      componentProps: {
        categories: this.categories
      }
    });
    modal.present();

    const { data, role } = await modal.onDidDismiss();
    if (role === 'confirm' && data) {
      this.addItem(data.name, data.stock, data.category_name);
    }
  }

  async addCategory() {
    const modal = await this.modalController.create({
      component: ModalNewCategorieComponent,
      componentProps: {
        categories: this.categories
      }
    });
    modal.present();

    const { data, role } = await modal.onDidDismiss();
    if (role === 'confirm' && data) {
      await this.taskService.addCategory(data.name);
    }
  }
}
