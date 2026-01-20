import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TaskService } from '../services/task.service';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Category } from '../models/category';


@Component({
  standalone: true,
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  imports: [IonicModule, FormsModule, CommonModule],
})
export class ModalComponent implements OnInit {

  itemName: string = '';
  itemStock: number = 1;
  selectedCategory: Category | null = null;

  categories: Category[] = [];

  constructor(
    private modalCtrl: ModalController,
    private taskService: TaskService
  ) { }

  async ngOnInit() {
    this.categories = await this.taskService.getCategories();
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    if (!this.itemName || !this.selectedCategory) {
      return;
    }

    return this.modalCtrl.dismiss({
      name: this.itemName,
      stock: this.itemStock,
      category_name: this.selectedCategory
    }, 'confirm');
  }

}
