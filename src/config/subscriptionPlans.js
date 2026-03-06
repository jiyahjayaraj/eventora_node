const PLANS = {
  basic: { price: 0, days: 30 ,maxEvents: 3},
  professional: { price: 2999, days: 30,maxEvents: 10 },
  enterprise: { price: 7999, days: 365,maxEvents: -1 } // yearly
};

module.exports = PLANS;