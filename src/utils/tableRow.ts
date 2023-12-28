import type { primaryKeys } from "./primaryKeys.js";
import type { Conditions, Condition } from "./condition.js";

export class TableRow {
    data: Record<string, any>;
    id: string;
    constructor(data: Record<string, any>, keys: primaryKeys) {
        this.data = data;
        this.id = keys.generateRowID(data);
    }

    checkConditions(conditions: Conditions): boolean {
        for (let condition of conditions.conditions) {
            if (!this.checkCondition(condition)) {
                return false;
            }
        }
        return true;
    }

    checkCondition(condition: Condition): boolean {
        switch (condition.type) {
            case "eq":
                return this.data[condition.column] === condition.value;
            case "neq":
                return this.data[condition.column] !== condition.value;
            case "gt":
                return this.data[condition.column] > condition.value;
            case "lt":
                return this.data[condition.column] < condition.value;
            case "gte":
                return this.data[condition.column] >= condition.value;
            case "lte":
                return this.data[condition.column] <= condition.value;
            default:
                return false;
        }
    }
}