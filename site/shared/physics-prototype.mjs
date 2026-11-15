/** One-dimensional toy dynamics. Inputs in CGS units; NOT species-calibrated. */
export function accelerationCmS2({massG, thrustDyn, dragGPerCm}, velocityCmS) {
  if (!(massG > 0) || dragGPerCm < 0 || ![massG,thrustDyn,dragGPerCm,velocityCmS].every(Number.isFinite)) throw new RangeError('Invalid toy physics parameters');
  return (thrustDyn - dragGPerCm * velocityCmS * Math.abs(velocityCmS)) / massG;
}
export function swimAfter({massG,thrustDyn,dragGPerCm}, seconds, stepSeconds=1/120) {
  if (!Number.isFinite(seconds) || seconds < 0 || !(stepSeconds > 0)) throw new RangeError('time');
  let positionCm = 0, velocityCmS = 0;
  for(let time=0; time<seconds;) {
    const dt=Math.min(stepSeconds,seconds-time);
    velocityCmS += accelerationCmS2({massG,thrustDyn,dragGPerCm},velocityCmS)*dt;
    positionCm += velocityCmS*dt;
    time+=dt;
  }
  return {positionCm,velocityCmS};
}
