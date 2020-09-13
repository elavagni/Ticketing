//This is an abstract class and not an interface for a couple of reasons:
//When translating TypeScript code into JavaSript all interfaces fall away, as there is not such thing in Javascript
//however if we use an abstract class, the class definition is persisted after being translated to Javascript, and executing code like
//instanceof Baseclass is valid, which is relevant to the code in this class
export abstract class CustomError extends Error {
    abstract statusCode: number;

    constructor(message: string) {
        super(message);

        //Only because we are extending a built in class (Error)
        Object.setPrototypeOf(this, CustomError.prototype);
    }

    abstract serializeErrors(): { message: string; field?: string }[];

}