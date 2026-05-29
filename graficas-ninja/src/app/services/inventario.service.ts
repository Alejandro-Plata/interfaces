import { Injectable } from '@angular/core';
import { Suministro, SUMINISTROS_MOCK } from '../models/suministro.model';

@Injectable({ providedIn: 'root' })
export class InventarioService {
  public suministros: Suministro[] = [...SUMINISTROS_MOCK];

  getSuministros() { return this.suministros; }

  getStats() {
    return {
      totalStock: this.suministros.reduce((acc, s) => acc + s.stock, 0),
      totalValor: this.suministros.reduce((acc, s) => acc + (s.stock * s.precioUnitario), 0),
      bajoStock: this.suministros.filter(s => s.stock < 10).length,
      categoriaPrincipal: this.suministros.length
        ? this.getMostFrequent(this.suministros.map(s => s.categoria))
        : '—',
    };
  }

  getStockPorCategoria(): { categoria: string; stock: number; valor: number }[] {
    const categorias = ['Armamento', 'Médico', 'Sigilo', 'Herramientas'];
    return categorias.map(cat => ({
      categoria: cat,
      stock: this.suministros.filter(s => s.categoria === cat).reduce((a, s) => a + s.stock, 0),
      valor: this.suministros.filter(s => s.categoria === cat).reduce((a, s) => a + s.stock * s.precioUnitario, 0),
    }));
  }

  addSuministro(s: Suministro) {
    this.suministros = [...this.suministros, s];
  }

  updateSuministro(s: Suministro) {
    this.suministros = this.suministros.map(x => x.id === s.id ? { ...s } : x);
  }

  deleteSuministro(id: string) {
    this.suministros = this.suministros.filter(s => s.id !== id);
  }

  generarId(): string {
    const max = this.suministros.reduce((acc, s) => {
      const n = parseInt(s.id.replace(/\D/g, ''), 10);
      return isNaN(n) ? acc : Math.max(acc, n);
    }, 0);
    return 'S' + String(max + 1).padStart(3, '0');
  }

  private getMostFrequent(arr: string[]) {
    const counts = arr.reduce((acc: any, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  }
}
