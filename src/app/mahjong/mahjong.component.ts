import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface HonorTile {
  name: string;
  imagePath: string;
  count: number;
}

interface HandRow {
  main: string[];
  tsumoImg: string;
}

@Component({
  selector: 'app-mahjong',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './mahjong.component.html',
  styleUrl: './mahjong.component.css'
})
export class MahjongComponent {
  m = '';
  p = '';
  s = '';

  tsumo = false;
  tsumoM = '';
  tsumoP = '';
  tsumoS = '';
  tsumoHonor = '';

  shuffle = false;
  generatedHands: HandRow[] = [];
  view: 'input' | 'result' = 'input';

  private readonly manzu = Array.from({length: 9}, (_, i) => `assets/${i + 1}m.png`);
  private readonly pinzu = Array.from({length: 9}, (_, i) => `assets/${i + 1}p.png`);
  private readonly souzu = Array.from({length: 9}, (_, i) => `assets/${i + 1}s.png`);

  honors: HonorTile[] = [
    { name: '東', imagePath: 'assets/dong.png',  count: 0 },
    { name: '南', imagePath: 'assets/nan.png',   count: 0 },
    { name: '西', imagePath: 'assets/xi.png',    count: 0 },
    { name: '北', imagePath: 'assets/bei.png',   count: 0 },
    { name: '中', imagePath: 'assets/zhong.png', count: 0 },
    { name: '發', imagePath: 'assets/fa.png',    count: 0 },
    { name: '白', imagePath: 'assets/bai.png',   count: 0 },
  ];

  get tsumoSelected(): boolean {
    return !!(this.tsumoM || this.tsumoP || this.tsumoS || this.tsumoHonor);
  }

  get maxTiles(): number { return this.tsumo ? 13 : 14; }

  private buildTiles(manzuSrc: string, pinzuSrc: string, souzuSrc: string): string[] {
    const result: string[] = [];
    for (const ch of manzuSrc) { const n = +ch; if (n >= 1 && n <= 9) result.push(this.manzu[n - 1]); }
    for (const ch of pinzuSrc) { const n = +ch; if (n >= 1 && n <= 9) result.push(this.pinzu[n - 1]); }
    for (const ch of souzuSrc) { const n = +ch; if (n >= 1 && n <= 9) result.push(this.souzu[n - 1]); }
    for (const h of this.honors) { for (let i = 0; i < h.count; i++) result.push(h.imagePath); }
    return result;
  }

  private getTsumoImg(mImg: string[], pImg: string[], sImg: string[], mirrored = false): string {
    const d = (ch: string) => ch ? (mirrored ? String(10 - +ch) : ch) : '';
    const tm = d(this.tsumoM), tp = d(this.tsumoP), ts = d(this.tsumoS);
    if (tm) { const n = +tm; return n >= 1 && n <= 9 ? mImg[n - 1] : ''; }
    if (tp) { const n = +tp; return n >= 1 && n <= 9 ? pImg[n - 1] : ''; }
    if (ts) { const n = +ts; return n >= 1 && n <= 9 ? sImg[n - 1] : ''; }
    if (this.tsumoHonor) return this.honors.find(h => h.name === this.tsumoHonor)?.imagePath ?? '';
    return '';
  }

  private buildIntegrated(
    rotManzu: 'm'|'p'|'s', rotPinzu: 'm'|'p'|'s', rotSouzu: 'm'|'p'|'s',
    mirrored: boolean
  ): string[] {
    const field = (f: 'm'|'p'|'s') => mirrored ? this.mirror(this[f]) : this[f];
    let manzu = field(rotManzu), pinzu = field(rotPinzu), souzu = field(rotSouzu);

    const rawDigit = this.tsumoM || this.tsumoP || this.tsumoS;
    if (rawDigit) {
      const tsumoField: 'm'|'p'|'s' = this.tsumoM ? 'm' : this.tsumoP ? 'p' : 's';
      const digit = mirrored ? String(10 - +rawDigit) : rawDigit;
      const addSorted = (base: string, d: string) => (base + d).split('').sort().join('');
      if      (rotManzu === tsumoField) manzu = addSorted(manzu, digit);
      else if (rotPinzu === tsumoField) pinzu = addSorted(pinzu, digit);
      else                               souzu = addSorted(souzu, digit);
    }

    const result = this.buildTiles(manzu, pinzu, souzu);
    if (this.tsumoHonor) {
      const h = this.honors.find(h => h.name === this.tsumoHonor);
      if (h) result.push(h.imagePath);
    }
    return result;
  }

  private mirror(src: string): string {
    return src.split('').map(ch => String(10 - +ch)).sort().join('');
  }

  private shuffleArr<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  private get computedHands(): HandRow[] {
    const tiles = this.buildTiles(this.m, this.p, this.s);
    if (!tiles.length) return [];
    const t = this.tsumo;

    const first6: HandRow[] = [
      { main: this.buildTiles(this.m, this.p, this.s),                                                              tsumoImg: t ? this.getTsumoImg(this.manzu, this.pinzu, this.souzu)       : '' },
      { main: this.buildTiles(this.mirror(this.m), this.mirror(this.p), this.mirror(this.s)),                       tsumoImg: t ? this.getTsumoImg(this.manzu, this.pinzu, this.souzu, true) : '' },
      { main: this.buildTiles(this.s, this.m, this.p),                                                              tsumoImg: t ? this.getTsumoImg(this.pinzu, this.souzu, this.manzu)       : '' },
      { main: this.buildTiles(this.mirror(this.s), this.mirror(this.m), this.mirror(this.p)),                       tsumoImg: t ? this.getTsumoImg(this.pinzu, this.souzu, this.manzu, true) : '' },
      { main: this.buildTiles(this.p, this.s, this.m),                                                              tsumoImg: t ? this.getTsumoImg(this.souzu, this.manzu, this.pinzu)       : '' },
      { main: this.buildTiles(this.mirror(this.p), this.mirror(this.s), this.mirror(this.m)),                       tsumoImg: t ? this.getTsumoImg(this.souzu, this.manzu, this.pinzu, true) : '' },
    ];

    if (!t || !this.tsumoSelected) return first6;

    const last6: HandRow[] = [
      { main: this.buildIntegrated('m', 'p', 's', false), tsumoImg: '' },
      { main: this.buildIntegrated('m', 'p', 's', true),  tsumoImg: '' },
      { main: this.buildIntegrated('s', 'm', 'p', false), tsumoImg: '' },
      { main: this.buildIntegrated('s', 'm', 'p', true),  tsumoImg: '' },
      { main: this.buildIntegrated('p', 's', 'm', false), tsumoImg: '' },
      { main: this.buildIntegrated('p', 's', 'm', true),  tsumoImg: '' },
    ];

    return [...first6, ...last6];
  }

  get totalCount(): number {
    return this.buildTiles(this.m, this.p, this.s).length;
  }

  generate(): void {
    const raw = this.computedHands;
    this.generatedHands = this.shuffle ? this.shuffleArr(raw) : raw;
    if (this.generatedHands.length) this.view = 'result';
  }

  back(): void {
    this.view = 'input';
  }

  get tsumoDisabled(): boolean {
    return this.totalCount >= 14;
  }

  // 每种牌最多4张：reserveDigit 为自摸占用的数字（需预先计入）
  private limitPerTile(str: string, reserveDigit = ''): string {
    const counts: Record<string, number> = {};
    if (reserveDigit) counts[reserveDigit] = 1;
    return str.split('').filter(ch => {
      counts[ch] = (counts[ch] || 0) + 1;
      return counts[ch] <= 4;
    }).join('');
  }

  filterInput(field: 'm' | 'p' | 's', event: Event): void {
    const input = event.target as HTMLInputElement;
    let filtered = input.value.replace(/[^1-9]/g, '');
    const otherCount = this.totalCount - this[field].length;
    filtered = filtered.slice(0, this.maxTiles - otherCount).split('').sort().join('');
    // 同种牌最多4张（自摸同花色同数字也计入）
    const tsumoDigit = field === 'm' ? this.tsumoM : field === 'p' ? this.tsumoP : this.tsumoS;
    filtered = this.limitPerTile(filtered, tsumoDigit);
    input.value = filtered;
    this[field] = filtered;
    if (this.totalCount >= 14 && this.tsumo) {
      this.tsumo = false;
      this.onTsumoChange();
    }
  }

  onTsumoInput(field: 'm' | 'p' | 's', event: Event): void {
    const input = event.target as HTMLInputElement;
    const val = input.value.replace(/[^1-9]/g, '').slice(-1);
    // 检查该数字在主手牌中是否已有4张
    if (val) {
      const src = field === 'm' ? this.m : field === 'p' ? this.p : this.s;
      const count = src.split('').filter(ch => ch === val).length;
      if (count >= 4) { input.value = ''; return; }
    }
    input.value = val;
    this.tsumoM = ''; this.tsumoP = ''; this.tsumoS = ''; this.tsumoHonor = '';
    if (field === 'm') this.tsumoM = val;
    else if (field === 'p') this.tsumoP = val;
    else this.tsumoS = val;
  }

  selectTsumoHonor(name: string): void {
    this.tsumoM = ''; this.tsumoP = ''; this.tsumoS = '';
    if (this.tsumoHonor === name) {
      this.tsumoHonor = '';
    } else {
      const h = this.honors.find(h => h.name === name);
      if (h && h.count >= 4) return; // 已有4张，不可选为自摸
      this.tsumoHonor = name;
    }
  }

  onTsumoChange(): void {
    if (!this.tsumo) {
      this.tsumoM = ''; this.tsumoP = ''; this.tsumoS = ''; this.tsumoHonor = '';
    }
  }

  add(h: HonorTile): void {
    const tsumoBonus = this.tsumoHonor === h.name ? 1 : 0;
    if (this.totalCount < this.maxTiles && h.count + tsumoBonus < 4) h.count++;
  }
  remove(h: HonorTile): void { if (h.count > 0) h.count--; }
}
