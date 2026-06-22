import Phaser from 'phaser';
import { GC } from '../data/GameConfig';
import { Resources, WaveState } from '../data/GameState';
import { EventBus, EV } from '../utils/EventBus';
import { AdManager } from '../utils/AdManager';

export class UIScene extends Phaser.Scene {
  private txtGold!: Phaser.GameObjects.Text;
  private txtWood!: Phaser.GameObjects.Text;
  private txtFood!: Phaser.GameObjects.Text;
  private txtScrap!: Phaser.GameObjects.Text;
  private txtWave!: Phaser.GameObjects.Text;
  private txtTimer!: Phaser.GameObjects.Text;
  private hpBar!: Phaser.GameObjects.Rectangle;
  private barBar!: Phaser.GameObjects.Rectangle;

  constructor() { super({ key: 'UIScene' }); }

  create(): void {
    const W = GC.W;

    // ── Top resource bar ─────────────────────────────────────────────
    this.add.rectangle(W / 2, 22, W, 44, 0x000000, 0.55).setDepth(90);

    const iconStyle = { fontSize: '13px', color: '#ffffff', fontFamily: 'Arial' };
    const valStyle  = { fontSize: '13px', color: '#fbbf24', fontFamily: 'Arial Black, Arial', fontStyle: 'bold' };

    this.add.text(8,   10, '🪙', iconStyle).setDepth(91);
    this.txtGold  = this.add.text(28,  10, '0', valStyle).setDepth(91);
    this.add.text(90,  10, '🪵', iconStyle).setDepth(91);
    this.txtWood  = this.add.text(110, 10, '0', valStyle).setDepth(91);
    this.add.text(170, 10, '🍖', iconStyle).setDepth(91);
    this.txtFood  = this.add.text(190, 10, '0', valStyle).setDepth(91);
    this.add.text(250, 10, '⚙️', iconStyle).setDepth(91);
    this.txtScrap = this.add.text(270, 10, '0', valStyle).setDepth(91);

    // ── Wave & timer (top-right) ──────────────────────────────────────
    this.txtWave  = this.add.text(W - 8,  8, 'Ola 1',   { fontSize: '12px', color: '#4ade80', fontFamily: 'Arial Black, Arial', align: 'right' }).setOrigin(1, 0).setDepth(91);
    this.txtTimer = this.add.text(W - 8, 22, '⏱ 60s',  { fontSize: '11px', color: '#d1d5db', fontFamily: 'Arial', align: 'right' }).setOrigin(1, 0).setDepth(91);

    // ── HP bars (bottom) ─────────────────────────────────────────────
    const barY = GC.H - 14;
    this.add.rectangle(W / 2, barY - 14, W - 20, 9, 0x1a1a1a).setDepth(90);
    this.hpBar  = this.add.rectangle(10, barY - 14, W - 20, 7, 0xef4444).setOrigin(0, 0.5).setDepth(91);
    this.add.rectangle(W / 2, barY + 2,  W - 20, 6, 0x1a1a1a).setDepth(90);
    this.barBar = this.add.rectangle(10, barY + 2,  W - 20, 4, 0xf59e0b).setOrigin(0, 0.5).setDepth(91);
    this.add.text(10, barY - 22, '🏠 Cabaña',    { fontSize: '10px', color: '#ef4444', fontFamily: 'Arial' }).setDepth(91);
    this.add.text(10, barY - 6,  '🛡 Barricada', { fontSize: '10px', color: '#f59e0b', fontFamily: 'Arial' }).setDepth(91);

    // ── Action buttons ────────────────────────────────────────────────
    this.createBtn(W / 2 - 95, GC.H - 54, '⬆️ Mejoras', '#3b82f6', () => this.openPanel('panel-upgrade'));
    this.createBtn(W / 2,      GC.H - 54, '🛒 Tienda',  '#8b5cf6', () => this.openPanel('panel-shop'));
    this.createBtn(W / 2 + 95, GC.H - 54, '🗺 Mapa',    '#10b981', () => this.openPanel('panel-map'));

    // ── Ad reward button ─────────────────────────────────────────────
    this.createBtn(W / 2, GC.H - 90, '📺 Ver Anuncio (+1000🪙)', '#ca8a04', () => {
      AdManager.watchAd('gold', () => EventBus.emit(EV.AD_REWARD_REQUESTED, 'gold'));
    });

    // ── EventBus listeners ────────────────────────────────────────────
    EventBus.on(EV.RESOURCES_CHANGED, this.onResources, this);
    EventBus.on(EV.WAVE_CHANGED,      this.onWave,      this);

    (window as any).closePanel = () => this.closeAllPanels();
  }

  private createBtn(x: number, y: number, label: string, color: string, cb: () => void): void {
    const btn = this.add.text(x, y, label, {
      fontSize: '12px', fontFamily: 'Arial Black, Arial',
      color: '#ffffff', backgroundColor: color,
      padding: { x: 10, y: 6 },
    }).setOrigin(0.5).setDepth(92).setInteractive({ useHandCursor: true });
    btn.on('pointerover',  () => btn.setAlpha(0.85));
    btn.on('pointerout',   () => btn.setAlpha(1));
    btn.on('pointerdown',  cb);
  }

  private onResources(res: Resources): void {
    this.txtGold.setText(String(Math.floor(res.gold)));
    this.txtWood.setText(String(Math.floor(res.wood)));
    this.txtFood.setText(String(Math.floor(res.food)));
    this.txtScrap.setText(String(Math.floor(res.scrap)));

    const gs = this.scene.get('GameScene') as any;
    if (!gs?.state) return;
    const st = gs.state;
    const cabinPct = Math.max(0, st.cabinHp / GC.CABIN_MAX_HP);
    const barHp    = st.upgrades.barricade.hp ?? 0;
    const barMax   = st.upgrades.barricade.maxHp ?? GC.BARRICADE_BASE_HP;
    const barPct   = Math.max(0, barHp / barMax);
    this.hpBar.width  = Math.max(2, (GC.W - 20) * cabinPct);
    this.barBar.width = Math.max(2, (GC.W - 20) * barPct);
  }

  private onWave(wave: WaveState): void {
    this.txtWave.setText(`Ola ${wave.number}`);
    if (wave.active) {
      this.txtTimer.setText(`⚔️ ${wave.zombiesAlive} zombies`);
    } else {
      this.txtTimer.setText(`⏱ ${Math.ceil(wave.countdown)}s`);
    }
  }

  private openPanel(id: string): void {
    this.closeAllPanels();
    const panel    = document.getElementById(id);
    const backdrop = document.getElementById('panel-backdrop');
    if (panel)    panel.classList.add('open');
    if (backdrop) { backdrop.classList.add('open'); backdrop.onclick = () => this.closeAllPanels(); }

    if (id === 'panel-upgrade') this.populateUpgrades();
    if (id === 'panel-shop')    this.populateShop();
    if (id === 'panel-map')     this.populateMap();
  }

  private closeAllPanels(): void {
    document.querySelectorAll('.ui-panel').forEach(p => p.classList.remove('open'));
    const bd = document.getElementById('panel-backdrop');
    if (bd) bd.classList.remove('open');
  }

  private getState(): any {
    return (this.scene.get('GameScene') as any)?.state;
  }

  private populateUpgrades(): void {
    const st = this.getState();
    if (!st) return;
    const container = document.getElementById('upgrade-list');
    if (!container) return;

    const defs: { key: string; name: string; desc: string; icon: string }[] = [
      { key: 'barricade',  name: 'Barricada',   desc: 'Muro de defensa exterior',   icon: '🛡' },
      { key: 'watchtower', name: 'Torre Vigía',  desc: 'Daño automático a zombies',  icon: '🗼' },
      { key: 'traps',      name: 'Trampas',      desc: 'Ralentiza y daña al entrar', icon: '🪤' },
      { key: 'sawmill',    name: 'Aserradero',   desc: 'Produce madera pasiva',      icon: '🪵' },
      { key: 'farm',       name: 'Granja',       desc: 'Produce comida pasiva',      icon: '🌽' },
      { key: 'workshop',   name: 'Taller',       desc: 'Produce chatarra pasiva',    icon: '⚙️' },
    ];

    container.innerHTML = defs.map(d => {
      const upg = st.upgrades[d.key];
      const cost = upg.cost;
      const parts: string[] = [];
      if (cost.gold  > 0) parts.push(`🪙${cost.gold}`);
      if (cost.wood  > 0) parts.push(`🪵${cost.wood}`);
      if (cost.scrap > 0) parts.push(`⚙️${cost.scrap}`);
      const costStr   = parts.join(' ');
      const canAfford = st.resources.gold >= cost.gold && st.resources.wood >= cost.wood && st.resources.scrap >= cost.scrap;
      return `
        <div class="upgrade-card" onclick="window.doUpgrade('${d.key}')">
          <div class="upgrade-icon">${d.icon}</div>
          <div class="upgrade-info">
            <div class="upgrade-name">${d.name} <span class="lvl">Nv${upg.level}</span></div>
            <div class="upgrade-desc">${d.desc}</div>
          </div>
          <div class="upgrade-cost ${canAfford ? '' : 'cant-afford'}">${costStr}</div>
        </div>`;
    }).join('');

    (window as any).doUpgrade = (key: string) => {
      EventBus.emit(EV.UPGRADE_REQUESTED, key);
      this.time.delayedCall(50, () => this.populateUpgrades());
    };
  }

  private populateShop(): void {
    const container = document.getElementById('shop-list');
    if (!container) return;
    const items = [
      { id: 'gold',      icon: '🪙', name: 'Boost de Oro',    desc: '+1000 oro'   },
      { id: 'hp',        icon: '🏠', name: 'Reparar Cabaña',  desc: 'HP completo' },
      { id: 'resources', icon: '📦', name: 'Pack Recursos',   desc: '+200 de todo'},
    ];
    container.innerHTML = items.map((item, i) =>
      `<div class="shop-item" onclick="window.shopBuy(${i})">
        <span class="shop-icon">${item.icon}</span>
        <div>
          <div class="shop-name">${item.name}</div>
          <div class="shop-desc">${item.desc}</div>
        </div>
        <div class="shop-action">📺 Ver Anuncio</div>
      </div>`
    ).join('');

    (window as any).shopBuy = (idx: number) => {
      AdManager.watchAd(items[idx].id, () => EventBus.emit(EV.AD_REWARD_REQUESTED, items[idx].id));
    };
  }

  private populateMap(): void {
    const st = this.getState();
    if (!st) return;
    const container = document.getElementById('map-list');
    if (!container) return;

    container.innerHTML = (st.world as any[]).map((z: any) => {
      const status = z.level >= z.maxLevel ? '✅ Conquistada' : z.unlocked ? `⚔️ Nv${z.level}/${z.maxLevel}` : '🔒 Bloqueada';
      return `<div class="zone-row ${z.unlocked ? 'unlocked' : 'locked'}">
        <span>${z.icon}</span>
        <span>${z.name}</span>
        <span>${status}</span>
      </div>`;
    }).join('');
  }

  shutdown(): void {
    EventBus.off(EV.RESOURCES_CHANGED, this.onResources, this);
    EventBus.off(EV.WAVE_CHANGED,      this.onWave,      this);
  }
}
