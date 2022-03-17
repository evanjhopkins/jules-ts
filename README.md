# Jules

A simple modular functional rules engine for TypeScript

## Simple Examples

Define a simple engine and use it to test some criteria.

```
const result = Jules.engine<TestCriteria>([
    ({age}) => age >= 21 && age < 60,
    ({age}) => age >= 60),
]).test(personA)

// result === [1] (the index of the rule)
```

Test multiple criteria at once

```
const [resultA, resultB, resultC, resultD] = Jules.engine<TestCriteria>([
    ({age}) => age >= 21 && age < 60,
    ({age}) => age >= 60),
]).testAll([personA, personB, personC, personD])

// result === [0, 1, 1, 0]
```

Define and test separately.

```
export const engine = Jules.engine<TestCriteria>([
    ({age}) => age >= 21 && age < 60,
    ({age}) => age >= 60),
])

const resultA = engine.test(personA)
const resultB = engine.test(personB)
```

Specify the expected result (view options here). By default, the expected result is ZERO_OR_MANY. If the expected result is not met, it will throw an error OR trigger your (optionally) specified error handling & fallback. The expected result can be specified when defining the engine, but also at test execution time (which takes precedence).

```
const engine = Jules.engine<TestCriteria>([
    ({age}) => age >= 21 && age < 60,
    ({age}) => age >= 60),
]).expect(ResultType.ONE)

const resultA = engine.test(personA)
// resultA === [0]

const resultB = engine.expect(ResultType.ZERO_OR_ONE).test(personB) // override the expected result type on a particular test
// result B === []
```

## Advanced Examples

Below we will walk through examples of gradually increasing complexity. Each example will introduce a new feature of Jules. Simple engines simply take in an array of 'test' functions. As you will see in the first example below, more complex engines are initialized with an object of which 'rules' is a child. Jules allows for multiple ways of initializing an engine to keep the engine code as simple as possobile for the given usecase.

### Assing ID to rules

By default, rules are identified by their index in the rules array. While rule IDs are optionl, all rule definition must be consistent (either all have IDs or none have IDs). Also by default, the engine returns the IDs of the 'winning' rules in the results array. This means if you set Rule IDs, those IDs will be the default Result for the winning Rules.

```
const engine = Jules.engine<TestCriteria>({
    expectedResult: ResultType.ONE,
    rules: [
    {
        id: 'JUNIOR',
        test: ({age}) => age >= 21 && age < 30
    },
    {
        id: 'STANDARD',
        test: ({age}) => age >= 30 && age < 60
    },
]})

const result = engine.test(personA)
// result === 'STANDARD'
```

### Interdependent rules with 'and' & 'andNots'

Conditions allow you to make rules dependent on the rusult of other rules. Conditions rely on Rule IDs when defining conditions.

```
const engine = Jules.engine<TestCriteria, Result>({
    expectedResult: ResultType.ONE,
    rules: [
    {
        id: 'RULE_A',
        test: ({age}) => age >= 21,
        conditions: [
            { expect: true, for: 'JUNIOR' },
            { expect: false, for: 'JUNIOR' },
            { expect: false. for: {if: 'RULE_B', than: 'RULE_A', else: 'RULE_C'}}
        ]
    },
    ...other rules...
]})
```

### Custom rule result

By default, a rule will return its ID as its result. You can optionally specify what you want this result to be. It can be a fixed value (such as a string or object), OR it can be a function that returns the result. When defining a result function, you have access to the same criteria as the test function.

```
const engine = Jules.engine<TestCriteria, Result>({
    expectedResult: ResultType.ONE,
    rules: [
    {
        id: 'JUNIOR',
        test: ({age}) => age >= 21 && age < 30,
        // No 'result' key specified, so will default to ID (JUNIOR)
    },
    {
        id: 'STANDARD',
        test: ({age}) => age >= 30 && age < 60,
        result: 'Standard Membership' // Specify a result value
    },
    {
        id: 'SENIOR',
        test: ({age, location}) => age >= 60),
        result: (person) => getBillingCode(person.location, Membership.Senior) // Specify a function that produces the result. Has access to criteria.

    },
]})

// Rule 'JUNIOR' will return 'JUNIOR' as its result
// Rule 'STANDARD' will return 'Standard Membership' as its result
// Rule 'SENIOR' will return the return value of getBillingCode(...) for its result.
```

### Define 'Facts'

Facts allow you to isolate key flags for your engine. Facts are functions that have access to the same criteria test functions have access to. Facts can be used in conditions via their ID in exactly the same way you use rule IDs in conditions. Facts can also be accessed in your test functions. Lastly, Facts allow you to clearly define shared logic that rules will consume.

```
const engine = Jules.engine<TestCriteria, Result>({
    expectedResult: ResultType.ONE,
    facts: [
        {id: 'IN_US', test: ({location}) => states.includes(location)},
    ],
    rules: [
        {
            id: 'JUNIOR',
            test: ({age}, facts) => age >= 21 && age < 30,
        },
        {
            id: 'STANDARD',
            test: ({age}, facts) => age >= 30 && age < 60 && facts['IN_US'],
        },
        {
            id: 'SENIOR',
            test: ({age, location}, facts) => age >= (location === 'FL' ? 55 : 60),
            conditions: [
                {expect: true, for: 'IN_US'},
            ]
        },
    ]
})

```

### Error Handling and Fallbacks

Optionally specify an `onError` handler for your rules engine. You can optionally return a fallback result for the rules engine if an error occurs. If you do not specify an onError handler and return a fallback result, an error will throw when the rules engine encounters an error.

```
const engine = Jules.engine<TestCriteria>({
    onError: (id, criteria, error) => {
        Logger.log(`${id} rule threw an error during test execution.`, error).
        console.error(error)

        // optionally return a fallback result for the engine
        return 'STANDARD'
    },
    rules: [...],
})
```
