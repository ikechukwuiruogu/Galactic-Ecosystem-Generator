import { describe, it, expect, beforeEach } from 'vitest';

// Simulated contract state
let simulationCount = 0;
const simulations = new Map();

// Simulated contract functions
function startSimulation(planetId: number, speciesIds: number[], duration: number) {
  const simulationId = ++simulationCount;
  simulations.set(simulationId, {
    planetId,
    speciesIds,
    startTime: Date.now(),
    duration,
    status: 'in-progress',
    result: ''
  });
  return simulationId;
}

function endSimulation(simulationId: number, result: string, ender: string) {
  const simulation = simulations.get(simulationId);
  if (!simulation) throw new Error('Invalid simulation');
  if (ender !== 'CONTRACT_OWNER') throw new Error('Not authorized');
  simulation.status = 'completed';
  simulation.result = result;
  simulations.set(simulationId, simulation);
  return true;
}

describe('Ecosystem Simulation Contract', () => {
  beforeEach(() => {
    simulationCount = 0;
    simulations.clear();
  });
  
  it('should start a new simulation', () => {
    const simulationId = startSimulation(1, [1, 2, 3], 1000);
    expect(simulationId).toBe(1);
    expect(simulations.size).toBe(1);
    const simulation = simulations.get(simulationId);
    expect(simulation.planetId).toBe(1);
    expect(simulation.status).toBe('in-progress');
  });
  
  it('should end a simulation', () => {
    const simulationId = startSimulation(2, [4, 5, 6], 2000);
    const result = 'Species 4 dominated the ecosystem';
    expect(endSimulation(simulationId, result, 'CONTRACT_OWNER')).toBe(true);
    const simulation = simulations.get(simulationId);
    expect(simulation.status).toBe('completed');
    expect(simulation.result).toBe(result);
  });
  
  it('should not allow unauthorized simulation ending', () => {
    const simulationId = startSimulation(3, [7, 8, 9], 3000);
    expect(() => endSimulation(simulationId, 'Unauthorized result', 'unauthorized_user')).toThrow('Not authorized');
  });
  
  it('should maintain correct simulation information', () => {
    const planetId = 4;
    const speciesIds = [10, 11, 12];
    const duration = 5000;
    const simulationId = startSimulation(planetId, speciesIds, duration);
    const simulation = simulations.get(simulationId);
    expect(simulation.planetId).toBe(planetId);
    expect(simulation.speciesIds).toEqual(speciesIds);
    expect(simulation.duration).toBe(duration);
    expect(simulation.startTime).toBeLessThanOrEqual(Date.now());
  });
});
