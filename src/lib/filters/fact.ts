// Pure function: get the factorial of a number
function fact(x: number): number {
    if(x<0){throw new Error("Cannot be negitive");}

    let sum = 1;
    for (let i = 1; i <= x; i++) {
        sum = sum * i;
    }

    return sum;
}

// Map over a sequence
export function facts(xs: number[]): number[] {
    return xs.map(fact);
}