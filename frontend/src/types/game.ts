export type GameModeId = 'online' | 'ai' | 'join';

export interface GameModeCardInfo {
  id: GameModeId;
  badgeKey: string;
  titleKey: string;
  descriptionKey: string;
  actionKey: string;
  route: string;
  accentColor: string;
}
