# jules-ts

Jules - A simple modular functional rules engine for TypeScript

### Simple Usecases

Define a simple engine and use it to test some criteria.

```
const result = Jules.engine<Person>([
    ({age}) => age >= 21 && age < 60,
    ({age}) => age >= 60),
]).test(personA)

// result === 1 (the index of the rule)
```

Test multiple criteria at once

```
const [resultA, resultB, resultC, resultD] = Jules.engine<Person>([
    ({age}) => age >= 21 && age < 60,
    ({age}) => age >= 60),
]).testAll([personA, personB, personC, personD])
```

Specify the expected result (view options here). By default, the expected result is ZERO_OR_MANY.

```
const result = Jules.engine<Person>([
    ({age}) => age >= 21 && age < 60,
    ({age}) => age >= 60),
]).expect(ResultType.ZERO_OR_ONE).test(personA)
```

```
// Define and test separately
const engine = Jules.engine<Person>([
    ({age}) => age >= 21 && age < 30,
    ({age}) => age >= 30 && age < 60,
    ({age, location}) => age >= (location === 'FL' ? 55 : 60),
])

const resultA = engine.test(personA)
const resultB = engine.test(personB)


const [resultA, resultB, resultC, resultD] = Jules.engine<Person>([
    ({age}) => age >= 21 && age < 30,
    ({age}) => age >= 30 && age < 60,
    ({age, location}) => age >= (location === 'FL' ? 55 : 60),
]).testAll([personA, personB, personC, personD])

const engine = Jules.engine<Person>([
    ({age}) => age >= 21 && age < 30,
    ({age}) => age >= 30 && age < 60,
    ({age, location}) => age >= (location === 'FL' ? 55 : 60),
])

const engine1 = new Engine<{age: number, location: string}>([
    ({age}) => age >= 21 && age < 30,
    ({age}) => age >= 30 && age < 60,
    ({age, location}) => age >= (location === 'FL' ? 55 : 60),
])

const result1 = engine1.run({age: 26, location: 'PA'})
// => 0

const engine2 = new Engine<{age: number, location: string}>([
    {
        id: 'JUNIOR',
        test: ({age}) => age >= 21 && age < 30
    },
    {
        id: 'STANDARD',
        test: ({age}) => age >= 30 && age < 60
    },
    {
        id: 'SENIOR',
        test: ({age, location}) => age >= (location === 'FL' ? 55 : 60)
    },
])
const result2 = engine2.run({age: 26, location: 'PA'})
// => JUNIOR

const engine3 = new Engine<{age: number, location: string}>([
    {
        id: 'JUNIOR',
        test: ({age}) => age >= 21 && age < 30,
        result: 'Junior Membership'
    },
    {
        id: 'STANDARD',
        test: ({age}) => age >= 30 && age < 60,
        result: 'Standard Membership'
    },
    {
        id: 'SENIOR',
        test: ({age, location}) => age >= (location === 'FL' ? 55 : 60),
        result: 'Senior Membership'

    },
])

const result3 = engine3.run({age: 26, location: 'PA'})
// => Junior Membership

const engine4 = new Engine<{age: number, location: string}>([
    {
        id: 'JUNIOR',
        test: ({age}) => age >= 21 && age < 30,
        result: ({location}) => getBillingCode({location, level: Level.JUNIOR}),
    },
    {
        id: 'STANDARD',
        test: ({age}) => age >= 30 && age < 60,
        result: ({location}) => getBillingCode({location, level: Level.STANDARD}),
    },
    {
        id: 'SENIOR',
        test: ({age, location}) => age >= (location === 'FL' ? 55 : 60),
        result: ({location}) => getBillingCode({location, level: Level.SENIOR}),
    },
])

const result4 = engine4.run({age: 26, location: 'PA'})
// => PA576

const engine5 = new Engine<{age: number, location: string}>([
    {
        id: 'JUNIOR',
        test: ({age}) => age >= 21 && age < 30,
        result: ({location}) => getBillingCode({location, level: Level.JUNIOR}),
        andNot: ['CALIFORNIA'],
    },
    {
        id: 'STANDARD',
        test: ({age}) => age >= 30 && age < 60,
        result: ({location}) => getBillingCode({location, level: Level.STANDARD}),
        andNot: ['CALIFORNIA'],
    },
    {
        id: 'SENIOR',
        test: ({age, location}) => age >= (location === 'FL' ? 55 : 60),
        result: ({location}) => getBillingCode({location, level: Level.SENIOR}),
        andNot: ['CALIFORNIA'],
    },
    {
        id: 'CALIFORNIA',
        test: ({location}) => location === 'CA',
        result: ({location}) => getBillingCode({location, level: Level.CALIFORNIA}),
    },
])

const result5 = engine5.run({age: 26, location: 'CA'})
// => CA102


const engine6 = new Engine<{age: number, location: string}>({
    facts: [
        {id: 'IN_US', test: ({location}) => states.includes(location)},
    ],
    rules: [
        {
            id: 'JUNIOR',
            test: ({age}, facts) => age >= 21 && age < 30,
            andNot: ['CALIFORNIA'],
            and: ['IN_US'],// you can simply refence rules in and / andNots
        },
        {
            id: 'STANDARD',
            test: ({age}, facts) => age >= 30 && age < 60 && facts['IN_US'],// you also have access to facts in your test fn
            andNot: ['CALIFORNIA'],
        },
        {
            id: 'SENIOR',
            test: ({age, location}, facts) => age >= (location === 'FL' ? 55 : 60),
            andNot: ['CALIFORNIA'],
            and: ['IN_US'],
        },
        {
            id: 'CALIFORNIA',
            test: ({location}, facts) => location === 'CA',
        },
    ]
})

const result6 = engine5.run({age: 26, location: 'Cabo'})
// => undefined
```
