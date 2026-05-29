import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonIcon, AlertController, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cloudDownloadOutline } from 'ionicons/icons';
import { Suministro, Categoria, Rango, OrdenCampo, OrdenDir } from '../../models/suministro.model';
import { ExportacionService } from '../../services/exportacion.service';
import { InventarioService } from '../../services/inventario.service';
import { FormularioSuministroComponent } from '../formulario-suministro/formulario-suministro.component';

@Component({
  selector: 'app-tabla-inventario',
  templateUrl: './tabla-inventario.component.html',
  styleUrls: ['./tabla-inventario.component.scss'],
  standalone: true,
  imports: [FormsModule, IonButton, IonIcon],
})
export class TablaInventarioComponent implements OnInit, OnChanges {
  @Input() suministros: Suministro[] = [];
  @Output() dataChanged = new EventEmitter<void>();

  filtroTexto = '';
  filtroCategoria: '' | Categoria = '';
  filtroRango: '' | Rango = '';
  stockMin: number | null = null;
  stockMax: number | null = null;

  ordenCampo: OrdenCampo = 'nombre';
  ordenDir: OrdenDir = 'asc';

  pagina = 1;
  tamanoPagina = 5;
  totalPaginas = 1;

  seleccionados = new Set<string>();
  filasVisibles: Suministro[] = [];
  filtrados: Suministro[] = [];

  readonly categorias: Categoria[] = ['Armamento', 'Médico', 'Sigilo', 'Herramientas'];
  readonly rangos: Rango[] = ['Genin', 'Chunin', 'Jonin', 'Anbu'];
  readonly tamanos = [5, 10, 25, 50];

  constructor(
    private exportacion: ExportacionService,
    private inventario: InventarioService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
  ) {
    addIcons({ cloudDownloadOutline });
  }

  ngOnInit() { this.recalcular(); }
  ngOnChanges() { this.recalcular(); }

  async abrirFormulario(suministro?: Suministro) {
    const modal = await this.modalCtrl.create({
      component: FormularioSuministroComponent,
      componentProps: {
        suministro: suministro ?? null,
        idSugerido: suministro ? suministro.id : this.inventario.generarId(),
      },
      cssClass: 'anbu-modal',
    });
    await modal.present();
    const { data, role } = await modal.onDidDismiss<Suministro>();
    if (role !== 'confirm' || !data) return;

    if (suministro) {
      this.inventario.updateSuministro(data);
    } else {
      this.inventario.addSuministro(data);
    }
    this.sincronizar();
  }

  async confirmarEliminar(s: Suministro) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar Suministro',
      message: `¿Eliminar ${s.nombre} (${s.id}) del inventario?`,
      cssClass: 'anbu-alert',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'confirm',
          cssClass: 'alert-btn-danger',
          handler: () => {
            this.inventario.deleteSuministro(s.id);
            this.seleccionados.delete(s.id);
            this.sincronizar();
          },
        },
      ],
    });
    await alert.present();
  }

  private sincronizar() {
    this.suministros = this.inventario.getSuministros();
    this.recalcular();
    this.dataChanged.emit();
  }

  recalcular() {
    let resultado = [...this.suministros];

    if (this.filtroTexto.trim()) {
      const txt = this.filtroTexto.toLowerCase();
      resultado = resultado.filter(s => s.nombre.toLowerCase().includes(txt));
    }
    if (this.filtroCategoria) {
      resultado = resultado.filter(s => s.categoria === this.filtroCategoria);
    }
    if (this.filtroRango) {
      resultado = resultado.filter(s => s.rangoRequerido === this.filtroRango);
    }
    if (this.stockMin !== null) {
      resultado = resultado.filter(s => s.stock >= this.stockMin!);
    }
    if (this.stockMax !== null) {
      resultado = resultado.filter(s => s.stock <= this.stockMax!);
    }

    resultado.sort((a, b) => {
      const va = a[this.ordenCampo] as any;
      const vb = b[this.ordenCampo] as any;
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return this.ordenDir === 'asc' ? cmp : -cmp;
    });

    this.filtrados = resultado;
    this.totalPaginas = Math.max(1, Math.ceil(resultado.length / this.tamanoPagina));
    if (this.pagina > this.totalPaginas) this.pagina = this.totalPaginas;
    const inicio = (this.pagina - 1) * this.tamanoPagina;
    this.filasVisibles = resultado.slice(inicio, inicio + this.tamanoPagina);
  }

  ordenarPor(campo: OrdenCampo) {
    if (this.ordenCampo === campo) {
      this.ordenDir = this.ordenDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.ordenCampo = campo;
      this.ordenDir = 'asc';
    }
    this.recalcular();
  }

  irPagina(p: number) { this.pagina = p; this.recalcular(); }

  onFiltroChange() { this.pagina = 1; this.recalcular(); }

  toggleSeleccion(id: string) {
    this.seleccionados.has(id) ? this.seleccionados.delete(id) : this.seleccionados.add(id);
  }

  get todosPaginaSeleccionados(): boolean {
    return this.filasVisibles.length > 0 && this.filasVisibles.every(s => this.seleccionados.has(s.id));
  }

  toggleTodos() {
    if (this.todosPaginaSeleccionados) {
      this.filasVisibles.forEach(s => this.seleccionados.delete(s.id));
    } else {
      this.filasVisibles.forEach(s => this.seleccionados.add(s.id));
    }
  }

  get paginasArray(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  indicador(campo: OrdenCampo): string {
    if (this.ordenCampo !== campo) return '';
    return this.ordenDir === 'asc' ? ' ▲' : ' ▼';
  }

  exportar(formato: 'excel' | 'pdf') {
    const datos = this.seleccionados.size > 0
      ? this.filtrados.filter(s => this.seleccionados.has(s.id))
      : this.filtrados;
    this.exportacion.exportarInventario(formato, datos);
  }
}
