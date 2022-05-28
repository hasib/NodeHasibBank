 
const Bank = require('./app')
const args = process.argv.slice(2); 
const filepath = args.length > 0 ? args.toString() : "input.json";
let myBank= new Bank(filepath);
myBank.processTransationData();
test('string with a single number should result in the number itself', () => {
    expect(myBank.processTransationDataTest().length()).toBe(9);
  });