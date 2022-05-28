// Configuration for cashin cash out 
export default class Configuration {
    static CashIn = {
        percents: 0.03,
        max: {
            amount: 5,
            currency: "EUR"
        }
    };

    static CashOutNatural = {
        percents: 0.3,
        week_limit: {
            amount: 1000,
            currency: "EUR"
        }
    };
    static CashOutJuridical = {
        percents: 0.3,
        min: {
            amount: 0.5,
            currency: "EUR"
        }

    };
}