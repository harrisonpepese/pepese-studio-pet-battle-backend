import { Battle } from 'pepese-core/dist/battle/class';

export type MatchCreateProps = Pick<Battle, 'blueTeam' | 'redTeam' | 'type'>;
