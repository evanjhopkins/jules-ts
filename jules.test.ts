import { Engine } from './jules'

const states: string[] = []
const getBillingCode = (...args: any) => 'x'
enum Level {
    CALIFORNIA="CALIFORNIA",
    JUNIOR="JUNIOR",
    SENIOR="SENIOR",
    STANDARD="STANDARD"
}
type Person = {
    age: number,
    location: string,
}

const personA: Person = { age: 16, location: 'NJ'}
const personB: Person = { age: 26, location: 'PA'}
const personC: Person = { age: 42, location: 'NY'}
const personD: Person = { age: 65, location: 'FL'}


// Inline engine definition and test
const result = Jules.engine<Person>([
    ({age}) => age >= 21 && age < 30,
    ({age}) => age >= 30 && age < 60,
    ({age, location}) => age >= (location === 'FL' ? 55 : 60),
]).expect(RESULT.ONE).test(personA)