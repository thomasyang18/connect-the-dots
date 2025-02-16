class CompetencyState {
    constructor() {
      this.numbersSolved = new Set();

      for (let i = 3; i <= 3; i+=1) {
        this.numbersSolved.add(i);
      }
    }
  }

  // Create a global instance
const globalState = new CompetencyState();

export {globalState};
