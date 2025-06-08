import { StateMachineInput, Rive } from '@rive-app/react-canvas';

export type RiveInputs = Record<string, StateMachineInput>;

export function setupRiveInputs(rive: Rive, stateMachineName: string): RiveInputs {
  const inputs = rive.stateMachineInputs(stateMachineName);
  
  console.log("🎛 Available inputs:", inputs.map(i => i.name));

  const map = Object.fromEntries(
    inputs.map(i => {
      console.log(`📥 Found input: ${i.name}`);
      return [i.name, i];
    })
  ) as RiveInputs;

  return map;
}
