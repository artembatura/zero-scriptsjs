import { ScriptData } from './ScriptData';

export type ScriptHandler = (data: ScriptData) => Promise<any>;
