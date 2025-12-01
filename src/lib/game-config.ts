import type { TowerData, EnemyData, LevelData, TowerId, EnemyId } from './types';
import placeholderData from './placeholder-images.json';

const towerPlaceholders = new Map(placeholderData.placeholderImages.map(p => [p.id, p]));

const getTowerIcon = (id: string) => {
  const placeholder = towerPlaceholders.get(id);
  return {
    iconUrl: placeholder?.imageUrl || `https://picsum.photos/seed/${id}/64/64`,
    iconHint: placeholder?.imageHint || 'icon'
  };
};

export const GAME_CONFIG = {
  GRID_WIDTH: 1200,
  GRID_HEIGHT: 800,
  GRID_COLS: 30,
  GRID_ROWS: 20,
  CELL_WIDTH: 40,
  CELL_HEIGHT: 40,
  STARTING_LIVES: 20,
  STARTING_MONEY: 250,
  WAVE_TIMER_DURATION: 30,
};

export const TOWERS: Record<TowerId, TowerData> = {
  // Budget
  turret: { id: 'turret', name: 'Turret', cost: 50, range: 120, damage: 10, rate: 40, ...getTowerIcon('turret_icon') },
  rapid_fire: { id: 'rapid_fire', name: 'Rapid Fire', cost: 75, range: 100, damage: 3, rate: 8, ...getTowerIcon('rapid_fire_icon') },
  blaster: { id: 'blaster', name: 'Blaster', cost: 150, range: 90, damage: 5, rate: 10, ...getTowerIcon('blaster_icon') },
  bomber: { id: 'bomber', name: 'Bomber', cost: 200, range: 140, damage: 20, rate: 60, splash: 50, ...getTowerIcon('bomber_icon') },
  // Infantry
  m4_trooper: { id: 'm4_trooper', name: 'M4 Trooper', cost: 100, range: 120, damage: 15, rate: 30, ...getTowerIcon('m4_trooper_icon') },
  m2_browning: { id: 'm2_browning', name: 'M2 Browning', cost: 250, range: 180, damage: 25, rate: 10, ...getTowerIcon('m2_browning_icon') },
  barrett_50: { id: 'barrett_50', name: 'Barrett .50', cost: 350, range: 400, damage: 150, rate: 120, ...getTowerIcon('barrett_50_icon') },
  // Armored
  m1_abrams: { id: 'm1_abrams', name: 'M1 Abrams', cost: 600, range: 250, damage: 80, rate: 80, splash: 60, ...getTowerIcon('m1_abrams_icon') },
  bradley_ifv: { id: 'bradley_ifv', name: 'Bradley IFV', cost: 900, range: 220, damage: 40, rate: 15, ...getTowerIcon('bradley_ifv_icon') },
  stryker: { id: 'stryker', name: 'Stryker', cost: 700, range: 200, damage: 25, rate: 10, ...getTowerIcon('stryker_icon') },
  // Air Support
  apache: { id: 'apache', name: 'Apache', cost: 800, range: 300, damage: 40, rate: 15, splash: 30, ...getTowerIcon('apache_icon') },
  f35: { id: 'f35', name: 'F-35', cost: 3000, range: 500, damage: 1000, rate: 300, ...getTowerIcon('f35_icon') },
  f22: { id: 'f22', name: 'F-22 Raptor', cost: 4000, range: 500, damage: 1500, rate: 180, ...getTowerIcon('f22_icon') },
  ac130: { id: 'ac130', name: 'AC-130', cost: 5000, range: 400, damage: 50, rate: 5, ...getTowerIcon('ac130_icon') },
  // Specialized
  ciws: { id: 'ciws', name: 'CIWS Phalanx', cost: 1500, range: 220, damage: 8, rate: 1, ...getTowerIcon('ciws_icon') },
  javelin: { id: 'javelin', name: 'Javelin Team', cost: 500, range: 300, damage: 200, rate: 120, ...getTowerIcon('javelin_icon') },
  m109_paladin: { id: 'm109_paladin', name: 'M109 Paladin', cost: 1500, range: 600, damage: 400, rate: 240, splash: 80, ...getTowerIcon('m109_paladin_icon') },
  himars: { id: 'himars', name: 'HIMARS', cost: 1800, range: 400, damage: 300, rate: 180, splash: 100, ...getTowerIcon('himars_icon') },
  patriot: { id: 'patriot', name: 'Patriot System', cost: 1200, range: 500, damage: 300, rate: 200, splash: 100, ...getTowerIcon('patriot_icon') },
  missile_silo: { id: 'missile_silo', name: 'Missile Silo', cost: 2000, range: 800, damage: 1000, rate: 400, splash: 150, ...getTowerIcon('missile_silo_icon') },
  a10_warthog: { id: 'a10_warthog', name: 'A-10 Strike', cost: 2500, range: 1000, damage: 500, rate: 600, ...getTowerIcon('a10_warthog_icon') },
  // Support
  barracks: { id: 'barracks', name: 'Barracks', cost: 500, range: 100, damage: 0, rate: 600, effect: 'spawn', ...getTowerIcon('barracks_icon') },
};

const baseHp = (wave: number) => 10 + wave * 2;

export const ENEMIES: Record<EnemyId, EnemyData> = {
  troop: { id: 'troop', name: 'Troop', speed: 1.0, baseHp: 10, hp: baseHp, color: 'red', flying: false, size: { width: 10, height: 10 } },
  scout_bike: { id: 'scout_bike', name: 'Scout Bike', speed: 3.0, baseHp: 6, hp: (w) => baseHp(w) * 0.6, color: 'orange', flying: false, size: { width: 15, height: 10 } },
  technical: { id: 'technical', name: 'Technical', speed: 2.8, baseHp: 12, hp: (w) => baseHp(w) * 1.2, color: 'white', flying: false, size: { width: 20, height: 15 } },
  jeep: { id: 'jeep', name: 'Jeep', speed: 2.5, baseHp: 18, hp: (w) => baseHp(w) * 1.8, color: 'lightgreen', flying: false, size: { width: 22, height: 16 } },
  humvee: { id: 'humvee', name: 'Humvee', speed: 2.0, baseHp: 25, hp: (w) => baseHp(w) * 2.5, color: 'blue', flying: false, size: { width: 25, height: 18 } },
  btr80: { id: 'btr80', name: 'BTR-80', speed: 1.5, baseHp: 40, hp: (w) => baseHp(w) * 4.0, color: 'darkgreen', flying: false, size: { width: 30, height: 20 } },
  bmp2: { id: 'bmp2', name: 'BMP-2', speed: 1.8, baseHp: 30, hp: (w) => baseHp(w) * 3.0, color: 'darkgreen', flying: false, size: { width: 28, height: 20 } },
  apc: { id: 'apc', name: 'APC', speed: 1.2, baseHp: 50, hp: (w) => baseHp(w) * 5.0, color: 'blue-grey', flying: false, size: { width: 32, height: 22 } },
  tank: { id: 'tank', name: 'Tank', speed: 0.6, baseHp: 80, hp: (w) => baseHp(w) * 8.0, color: 'green', flying: false, size: { width: 35, height: 25 } },
  t72: { id: 't72', name: 'T-72', speed: 0.8, baseHp: 60, hp: (w) => baseHp(w) * 6.0, color: 'green', flying: false, size: { width: 35, height: 25 } },
  t90: { id: 't90', name: 'T-90', speed: 0.7, baseHp: 100, hp: (w) => baseHp(w) * 10.0, color: 'darkgreen', flying: false, size: { width: 38, height: 28 } },
  heavy_tank: { id: 'heavy_tank', name: 'Heavy Tank', speed: 0.4, baseHp: 150, hp: (w) => baseHp(w) * 15.0, color: 'darkgreen', flying: false, size: { width: 45, height: 35 } },
  mi24_hind: { id: 'mi24_hind', name: 'Mi-24 Hind', speed: 3.5, baseHp: 60, hp: (w) => baseHp(w) * 6.0, color: 'brown', flying: true, size: { width: 40, height: 30 } },
  su25_frogfoot: { id: 'su25_frogfoot', name: 'Su-25 Frogfoot', speed: 4.2, baseHp: 30, hp: (w) => baseHp(w) * 3.0, color: 'blue-grey', flying: true, size: { width: 35, height: 20 } },
  jet: { id: 'jet', name: 'Jet', speed: 4.0, baseHp: 20, hp: (w) => baseHp(w) * 2.0, color: 'grey', flying: true, size: { width: 30, height: 15 } },
  boss: { id: 'boss', name: 'Boss', speed: 0.3, baseHp: 500, hp: (w) => baseHp(w) * 50.0, color: 'darkred', flying: false, size: { width: 60, height: 50 } },
  scud_launcher: { id: 'scud_launcher', name: 'Scud Launcher', speed: 0.4, baseHp: 400, hp: (w) => baseHp(w) * 40.0, color: 'darkgreen', flying: false, size: { width: 70, height: 30 } },
};

export const LEVELS: LevelData[] = [
  { level: 1, name: "Winding Path", path: [ {x:0,y:4},{x:1,y:4},{x:2,y:4},{x:3,y:4},{x:4,y:4},{x:4,y:5},{x:4,y:6},{x:3,y:6},{x:2,y:6},{x:2,y:7},{x:2,y:8},{x:2,y:9},{x:3,y:9},{x:4,y:9},{x:5,y:9},{x:6,y:9},{x:6,y:8},{x:6,y:7},{x:6,y:6},{x:7,y:6},{x:8,y:6},{x:9,y:6},{x:10,y:6},{x:11,y:6},{x:12,y:6},{x:12,y:7},{x:12,y:8},{x:12,y:9},{x:12,y:10},{x:12,y:11},{x:13,y:11},{x:14,y:11},{x:15,y:11},{x:16,y:11},{x:17,y:11},{x:18,y:11},{x:19,y:11},{x:20,y:11},{x:21,y:11},{x:22,y:11},{x:22,y:10},{x:22,y:9},{x:22,y:8},{x:21,y:8},{x:20,y:8},{x:19,y:8},{x:18,y:8},{x:18,y:7},{x:18,y:6},{x:18,y:5},{x:18,y:4},{x:19,y:4},{x:20,y:4},{x:21,y:4},{x:22,y:4},{x:23,y:4},{x:24,y:4},{x:25,y:4},{x:26,y:4},{x:27,y:4},{x:28,y:4},{x:29,y:4} ]},
  { level: 2, name: "Zig Zag", path: [ {x:2,y:0},{x:2,y:1},{x:2,y:2},{x:3,y:2},{x:4,y:2},{x:4,y:3},{x:4,y:4},{x:3,y:4},{x:2,y:4},{x:2,y:5},{x:2,y:6},{x:3,y:6},{x:4,y:6},{x:4,y:7},{x:4,y:8},{x:5,y:8},{x:6,y:8},{x:7,y:8},{x:8,y:8},{x:8,y:7},{x:8,y:6},{x:8,y:5},{x:8,y:4},{x:9,y:4},{x:10,y:4},{x:11,y:4},{x:12,y:4},{x:13,y:4},{x:14,y:4},{x:14,y:5},{x:14,y:6},{x:14,y:7},{x:14,y:8},{x:15,y:8},{x:16,y:8},{x:17,y:8},{x:18,y:8},{x:18,y:9},{x:18,y:10},{x:18,y:11},{x:18,y:12},{x:17,y:12},{x:16,y:12},{x:16,y:13},{x:16,y:14},{x:17,y:14},{x:18,y:14},{x:19,y:14},{x:20,y:14},{x:21,y:14},{x:22,y:14},{x:23,y:14},{x:24,y:14},{x:24,y:13},{x:24,y:12},{x:24,y:11},{x:24,y:10},{x:24,y:9},{x:25,y:9},{x:26,y:9},{x:27,y:9},{x:27,y:8},{x:27,y:7},{x:27,y:6},{x:27,y:5},{x:27,y:4},{x:27,y:3},{x:27,y:2},{x:28,y:2},{x:29,y:2}, ]},
  { level: 3, name: "Spiral", path: [ {x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0},{x:4,y:0},{x:5,y:0},{x:6,y:0},{x:7,y:0},{x:8,y:0},{x:9,y:0},{x:10,y:0},{x:11,y:0},{x:12,y:0},{x:13,y:0},{x:14,y:0},{x:15,y:0},{x:16,y:0},{x:17,y:0},{x:18,y:0},{x:19,y:0},{x:20,y:0},{x:21,y:0},{x:22,y:0},{x:23,y:0},{x:24,y:0},{x:25,y:0},{x:26,y:0},{x:27,y:0},{x:28,y:0},{x:29,y:0},{x:29,y:1},{x:29,y:2},{x:29,y:3},{x:29,y:4},{x:29,y:5},{x:29,y:6},{x:29,y:7},{x:29,y:8},{x:29,y:9},{x:29,y:10},{x:29,y:11},{x:29,y:12},{x:29,y:13},{x:29,y:14},{x:29,y:15},{x:29,y:16},{x:29,y:17},{x:29,y:18},{x:29,y:19},{x:28,y:19},{x:27,y:19},{x:26,y:19},{x:25,y:19},{x:24,y:19},{x:23,y:19},{x:22,y:19},{x:21,y:19},{x:20,y:19},{x:19,y:19},{x:18,y:19},{x:17,y:19},{x:16,y:19},{x:15,y:19},{x:14,y:19},{x:13,y:19},{x:12,y:19},{x:11,y:19},{x:10,y:19},{x:9,y:19},{x:8,y:19},{x:7,y:19},{x:6,y:19},{x:5,y:19},{x:4,y:19},{x:3,y:19},{x:2,y:19},{x:1,y:19},{x:1,y:18},{x:1,y:17},{x:1,y:16},{x:1,y:15},{x:1,y:14},{x:1,y:13},{x:1,y:12},{x:1,y:11},{x:1,y:10},{x:1,y:9},{x:1,y:8},{x:1,y:7},{x:1,y:6},{x:1,y:5},{x:1,y:4},{x:1,y:3},{x:1,y:2},{x:2,y:2},{x:3,y:2},{x:4,y:2},{x:5,y:2},{x:6,y:2},{x:7,y:2},{x:8,y:2},{x:9,y:2},{x:10,y:2},{x:11,y:2},{x:12,y:2},{x:13,y:2},{x:14,y:2},{x:15,y:2},{x:16,y:2},{x:17,y:2},{x:18,y:2},{x:19,y:2},{x:20,y:2},{x:21,y:2},{x:22,y:2},{x:23,y:2},{x:24,y:2},{x:25,y:2},{x:26,y:2},{x:27,y:2},{x:27,y:3},{x:27,y:4},{x:27,y:5},{x:27,y:6},{x:27,y:7},{x:27,y:8},{x:27,y:9},{x:27,y:10},{x:27,y:11},{x:27,y:12},{x:27,y:13},{x:27,y:14},{x:27,y:15},{x:27,y:16},{x:27,y:17},{x:26,y:17},{x:25,y:17},{x:24,y:17},{x:23,y:17},{x:22,y:17},{x:21,y:17},{x:20,y:17},{x:19,y:17},{x:18,y:17},{x:17,y:17},{x:16,y:17},{x:15,y:17},{x:14,y:17},{x:13,y:17},{x:12,y:17},{x:11,y:17},{x:10,y:17},{x:9,y:17},{x:8,y:17},{x:7,y:17},{x:6,y:17},{x:5,y:17},{x:4,y:17},{x:3,y:17},{x:3,y:16},{x:3,y:15},{x:3,y:14},{x:3,y:13},{x:3,y:12},{x:3,y:11},{x:3,y:10},{x:3,y:9},{x:3,y:8},{x:3,y:7},{x:3,y:6},{x:3,y:5},{x:3,y:4},{x:4,y:4},{x:5,y:4},{x:6,y:4},{x:7,y:4},{x:8,y:4},{x:9,y:4},{x:10,y:4},{x:11,y:4},{x:12,y:4},{x:13,y:4},{x:14,y:4},{x:15,y:4},{x:16,y:4},{x:17,y:4},{x:18,y:4},{x:19,y:4},{x:20,y:4},{x:21,y:4},{x:22,y:4},{x:23,y:4},{x:24,y:4},{x:25,y:4},{x:25,y:5},{x:25,y:6},{x:25,y:7},{x:25,y:8},{x:25,y:9},{x:25,y:10},{x:25,y:11},{x:25,y:12},{x:25,y:13},{x:25,y:14},{x:25,y:15},{x:24,y:15},{x:23,y:15},{x:22,y:15},{x:21,y:15},{x:20,y:15},{x:19,y:15},{x:18,y:15},{x:17,y:15},{x:16,y:15},{x:15,y:15},{x:14,y:15},{x:13,y:15},{x:12,y:15},{x:11,y:15},{x:10,y:15},{x:9,y:15},{x:8,y:15},{x:7,y:15},{x:6,y:15},{x:5,y:15},{x:5,y:14},{x:5,y:13},{x:5,y:12},{x:5,y:11},{x:5,y:10},{x:5,y:9},{x:5,y:8},{x:5,y:7},{x:5,y:6},{x:6,y:6},{x:7,y:6},{x:8,y:6},{x:9,y:6},{x:10,y:6},{x:11,y:6},{x:12,y:6},{x:13,y:6},{x:14,y:6},{x:15,y:6},{x:16,y:6},{x:17,y:6},{x:18,y:6},{x:19,y:6},{x:20,y:6},{x:21,y:6},{x:22,y:6},{x:23,y:6},{x:23,y:7},{x:23,y:8},{x:23,y:9},{x:23,y:10},{x:23,y:11},{x:23,y:12},{x:23,y:13},{x:22,y:13},{x:21,y:13},{x:20,y:13},{x:19,y:13},{x:18,y:13},{x:17,y:13},{x:16,y:13},{x:15,y:13},{x:14,y:13},{x:13,y:13},{x:12,y:13},{x:11,y:13},{x:10,y:13},{x:9,y:13},{x:8,y:13},{x:7,y:13},{x:7,y:12},{x:7,y:11},{x:7,y:10},{x:7,y:9},{x:7,y:8},{x:8,y:8},{x:9,y:8},{x:10,y:8},{x:11,y:8},{x:12,y:8},{x:13,y:8},{x:14,y:8},{x:15,y:8},{x:16,y:8},{x:17,y:8},{x:18,y:8},{x:19,y:8},{x:20,y:8},{x:21,y:8},{x:21,y:9},{x:21,y:10},{x:21,y:11},{x:20,y:11},{x:19,y:11},{x:18,y:11},{x:17,y:11},{x:16,y:11},{x:15,y:11},{x:14,y:11},{x:13,y:11},{x:12,y:11},{x:11,y:11},{x:10,y:11},{x:9,y:11},{x:9,y:10},{x:10,y:10},{x:11,y:10},{x:12,y:10},{x:13,y:10},{x:14,y:10},{x:15,y:10},{x:16,y:10},{x:17,y:10},{x:18,y:10},{x:19,y:10} ]},
];


export const ENEMIES_BY_WAVE: Record<number, EnemyId[]> = {
    1: ['troop', 'troop', 'troop', 'troop', 'troop'],
    2: ['troop', 'troop', 'scout_bike', 'troop', 'scout_bike'],
    3: ['scout_bike', 'scout_bike', 'technical'],
    4: ['technical', 'technical', 'humvee'],
    5: ['jeep', 'jeep', 'humvee', 'boss'],
    6: ['btr80', 'btr80', 'humvee'],
    7: ['bmp2', 'bmp2', 'btr80'],
    8: ['apc', 'apc', 'bmp2'],
    9: ['apc', 'tank', 'apc'],
    10: ['tank', 'tank', 'scud_launcher'],
    11: ['t72', 't72', 'tank'],
    12: ['t90', 't72', 't90'],
    13: ['t90', 'heavy_tank'],
    14: ['heavy_tank', 'heavy_tank'],
    15: ['heavy_tank', 'heavy_tank', 'boss'],
    18: ['mi24_hind', 'mi24_hind'],
    19: ['su25_frogfoot', 'su25_frogfoot', 'mi24_hind'],
    20: ['jet', 'jet', 'su25_frogfoot', 'scud_launcher'],
};
