import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { Suministro, Categoria, Rango } from '../../models/suministro.model';

@Component({
  selector: 'app-formulario-suministro',
  templateUrl: './formulario-suministro.component.html',
  styleUrls: ['./formulario-suministro.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon,
  ],
})
export class FormularioSuministroComponent implements OnInit {
  @Input() suministro: Suministro | null = null;
  @Input() idSugerido = '';

  esNuevo = false;
  form: Suministro = this.formVacio();

  readonly categorias: Categoria[] = ['Armamento', 'Médico', 'Sigilo', 'Herramientas'];
  readonly rangos: Rango[] = ['Genin', 'Chunin', 'Jonin', 'Anbu'];

  constructor(private modalCtrl: ModalController) {
    addIcons({ closeOutline });
  }

  ngOnInit() {
    this.esNuevo = !this.suministro;
    this.form = this.suministro
      ? { ...this.suministro }
      : { ...this.formVacio(), id: this.idSugerido };
  }

  private formVacio(): Suministro {
    return {
      id: '',
      nombre: '',
      categoria: 'Armamento',
      stock: 0,
      precioUnitario: 0,
      rangoRequerido: 'Genin',
      ultimaActualizacion: new Date().toISOString().split('T')[0],
    };
  }

  get titulo() { return this.esNuevo ? 'Nuevo Suministro' : 'Editar Suministro'; }

  valido(): boolean {
    return !!(this.form.id.trim() && this.form.nombre.trim() &&
              this.form.stock >= 0 && this.form.precioUnitario >= 0);
  }

  guardar() {
    if (!this.valido()) return;
    this.modalCtrl.dismiss({ ...this.form }, 'confirm');
  }

  cancelar() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
