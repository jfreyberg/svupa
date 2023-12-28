export class primaryKeys {
    keys: Array<string> // Array of primary keys

    constructor(keys: Array<string> | string) {
        this.keys = typeof keys === "string" ? [keys] : keys as string[];
        this.keys.sort();
    }

    getKeys(): Array<string> {
        return this.keys;
    }

    getNumberOfKeys(): number {
        return this.keys.length;
    }

    getKeysstring(): string {
        return this.keys.join("&");
    }

    generateRowID(row: Object): string {
        return this.keys.map(key => row[key]).join("&");
    }

}