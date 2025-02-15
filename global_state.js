
class CompetencyState {
    constructor() {
      this.hasHitZeroOnce = false;
      this.numbersSolved = new Set([3]); 
    }
  }
  
  // Create a global instance
const globalState = new CompetencyState();

export {globalState};