import { Battle } from '../battle.model';

export type MatchCreateProps = Pick<Battle, 'blueTeam' | 'redTeam' | 'type'>;
