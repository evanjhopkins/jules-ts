export enum ResultType {
  ZERO_OR_ONE = "ZERO_OR_ONE",
  ZERO_OR_MANY = "ZERO_OR_MANY",
  ONE = "ONE",
  MANY = "MANY",
}

type Condition = ({}: { if: string; then: string; else: string }) => boolean;

type TestFn<Criteria> = (
  criteria: Criteria,
  facts: { [key: string]: boolean }
) => boolean;

type Rule<Criteria, Result> = {
  id?: string;
  test: TestFn<Criteria>;
  result?: Result | ((criteria: Criteria) => Result);
  andNot?: Array<string | Condition>;
  and?: Array<string | Condition>;
};

type Fact<Criteria> = {
  id: string;
  test: (criteria: Criteria) => boolean;
};

type EngineArguments<Criteria, Result> = {
  resultType?: ResultType;
  rules: Rule<Criteria, Result>[];
  facts?: Fact<Criteria>[];
  onError?: () => void;
  fallback?: Result;
};

class Engine<Criteria, Result = string> {
  rules: Rule<Criteria, Result>[];
  resultType?: ResultType;

  constructor(
    config:
      | EngineArguments<Criteria, Result>
      | TestFn<Criteria>[]
      | Rule<Criteria, Result>[]
  ) {
    // Initialize via an array of test functions
    if ((config as EngineArguments<Criteria, Result>).rules) {
      const fullConfig = config as EngineArguments<Criteria, Result>;
      this.rules = fullConfig.rules;
      this.resultType = fullConfig.resultType;

      // Initialize via an array of Rules
    } else if ((config as Rule<Criteria, Result>[])[0].test) {
      this.rules = config as Rule<Criteria, Result>[];

      // Initialize via a full engine configuration
    } else if (typeof (config as TestFn<Criteria>[]) === "function") {
      const testArray = config as TestFn<Criteria>[];
      this.rules = testArray.map((test) => ({ test }));

      // Failed to initialize engine
    } else {
      throw new Error(
        "Failed to initialize Jules rules engine because the initializaiton object was not in an expeected format."
      );
    }

    this.validateEngineConfiguration();
  }

  validateEngineConfiguration() {
    // check for circular nots/alsos
    // check for valid conditions
    // check all id references
  }

  test(criteria: Criteria): Result {
    return null as Result;
  }
}

const Jules = {
  engine: function engine<Criteria, Result>(
    config: EngineArguments<Criteria, Result> | TestFn<Criteria>[]
  ) {
    const engine = new Engine(config);
    return {
      test: (criteria: Criteria): Result[] => [] as any,
      testAll: (criteria: Criteria[]): Result[][] => [],
      expect: (resultType: ResultType) => (engine.resultType = resultType),
    };
  },
};

export default Jules;
