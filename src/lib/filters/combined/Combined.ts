// Pure function: get the factorial of a number
import { facts as myFacts } from '$lib/filters/';
import { reverseInput as peerReverseInput } from "rwm-p0-c00284421/src/lib/filters";


export function Combined(xs: number[]): string {
    // Apply factorial, then reverse order as a string
    const afterMine = myFacts(xs).toString();
    return peerReverseInput(afterMine);
}
