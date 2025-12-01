export type TowerId =
  | 'turret' | 'rapid_fire' | 'blaster' | 'bomber'
  | 'm4_trooper' | 'm2_browning' | 'barrett_50'
  | 'm1_abrams' | 'bradley_ifv' | 'stryker'
  | 'apache' | 'f35' | 'f22' | 'ac130'
  | 'ciws' | 'javelin' | 'm109_paladin' | 'himars'
  | 'patriot' | 'missile_silo' | 'a10_warthog'
  | 'barracks';

export interface TowerData {
  id: TowerId;
  name: string;
  cost: number;
  range: number;
  damage: number;
  rate: number; // in frames
  splash?: number; // splash radius
  effect?: string;
  iconUrl: string;
  iconHint: string;
}

export interface PlacedTower extends TowerData {
  idInGame: string; // unique id for each placed tower
  x: number;
  y: number;
  gridX: number;
  gridY: number;
  cooldown: number;
  target?: string; // enemy id
}

export type EnemyId =
  | 'troop' | 'scout_bike' | 'technical' | 'jeep'
  | 'humvee' | 'btr80' | 'bmp2' | 'apc'
  | 'tank' | 't72' | 't90' | 'heavy_tank'
  | 'mi24_hind' | 'su25_frogfoot' | 'jet'
  | 'boss' | 'scud_launcher';

export interface EnemyData {
  id: EnemyId;
  name: string;
  speed: number;
  baseHp: number;
  hp: (wave: number) => number;
  color: string;
  flying: boolean;
  size: { width: number, height: number };
}

export interface ActiveEnemy extends EnemyData {
  idInGame: string; // unique id for each active enemy
  x: number;
  y: number;
  currentHp: number;
  totalHp: number;
  pathIndex: number;
}

export type LevelData = {
  level: number;
  name: string;
  path: { x: number; y: number }[];
};

export interface Decoration {
    type: 'tree' | 'cane' | 'ornament';
    x: number;
    y: number;
    size: number;
    color?: string;
    rotation?: number;
}

export interface Projectile {
    id: string;
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    speed: number;
    damage: number;
    splash: number;
}

export type GameStatus = 'playing' | 'paused' | 'game-over' | 'level-complete';

export type GameState = {
  status: GameStatus;
  lives: number;
  money: number;
  wave: number;
  currentLevel: number;
  waveTimer: number; // countdown to next wave
  towers: PlacedTower[];
  enemies: ActiveEnemy[];
  projectiles: Projectile[];
  decorations: Decoration[];
};
