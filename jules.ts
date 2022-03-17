enum ResultType {
    ZERO_OR_ONE="ZERO_OR_ONE",
    ZERO_OR_MANY="ZERO_OR_MANY",
    ONE="ONE",
    MANY="MANY",
}

type Condition = ({}: {if: string, then: string, else: string}) => boolean

type TestFn<Criteria> = (criteria: Criteria, facts: {[key: string]: boolean}) => boolean

type Rule<Criteria, Result> = {
    id?: string,
    test: TestFn<Criteria>,
    result?: (Result | ((criteria: Criteria) => Result)),
    andNot?: Array<string | Condition>
    and?: Array<string | Condition>
}

type Fact<Criteria> = {
    id: string,
    test: (criteria: Criteria) => boolean,
}

type EngineArguments<Criteria, Result> = {
    resultType?: ResultType,
    rules: Rule<Criteria, Result>[],
    facts?: Fact<Criteria>[]
}

export class Engine<Criteria, Result=string> {
    rules: Rule<Criteria, Result>[]
    resultType?: ResultType

    constructor(rules: Rule<Criteria, Result>[] | TestFn<Criteria>[]) {
        this.rules = (typeof rules[0] === 'function' ? rules.map(test => {test}) : rules) as Rule<Criteria, Result>[]
        // this.resultType = args.resultType || ResultType.ONE
    }

    validateEngineConfiguration() {
        // check for circular nots/alsos

        // check for valid conditions

        // check all id references
    }

    run(criteria: Criteria): Result {
        const result
        for(const rule of this.rules) {
            const initialResult = rule.test(criteria)



            return rule.result && typeof rule.result === 'function' ? rule.result(criteria) : rule.result || rule.id
        }
    }
}