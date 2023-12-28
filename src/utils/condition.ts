import type { PostgrestFilterBuilder } from "@supabase/postgrest-js";

enum ConditionType {
    EQ = "eq",
    NEQ = "neq",
    GT = "gt",
    LT = "lt",
    GTE = "gte",
    LTE = "lte"
}

export class Condition {
    type: ConditionType;
    column: string;
    value: unknown;
    constructor(type: ConditionType, column: string, value: unknown) {
        this.type = type;
        this.column = column;
        this.value = value;
    }

    getName(condition: Condition) {
        return `${condition.column}:${condition.type}.${condition.value},`;
    }
}

export class EQ extends Condition {
    constructor(column: string, value: unknown) {
        super(ConditionType.EQ, column, value);
    }
}

export class NEQ extends Condition {
    constructor(column: string, value: unknown) {
        super(ConditionType.NEQ, column, value);
    }
}

export class GT extends Condition {
    constructor(column: string, value: unknown) {
        super(ConditionType.GT, column, value);
    }
}
export class LT extends Condition {
    constructor(column: string, value: unknown) {
        super(ConditionType.LT, column, value);
    }
}

export class GTE extends Condition {
    constructor(column: string, value: unknown) {
        super(ConditionType.GTE, column, value);
    }
}
export class LTE extends Condition {
    constructor(column: string, value: unknown) {
        super(ConditionType.LTE, column, value);
    }
}

export class Conditions {
    conditions: Array<Condition>;
    constructor() {
        this.conditions = [];
    }

    add(conditions: Condition | Conditions) {
        if (conditions instanceof Conditions) {
            this.conditions = this.conditions.concat(conditions.get());
        }
        else {
            this.conditions.push(conditions);
        }
        return this;
    }

    get(): Array<Condition> {
        return this.conditions;
    }

    toQuery(query: PostgrestFilterBuilder<any, any, any[], unknown>) {
        this.conditions.forEach((condition: Condition) => {
            switch (condition.type) {
                case ConditionType.EQ:
                    query = query.eq(condition.column, condition.value);
                    break;
                case ConditionType.GT:
                    query = query.gt(condition.column, condition.value);
                    break;
                case ConditionType.GTE:
                    query = query.gte(condition.column, condition.value);
                    break;
                case ConditionType.LT:
                    query = query.lt(condition.column, condition.value);
                    break;
                case ConditionType.LTE:
                    query = query.lte(condition.column, condition.value);
                    break;
                case ConditionType.NEQ:
                    query = query.neq(condition.column, condition.value);
                    break;
                default:
                    throw new Error(`Unsupported condition type: ${condition.type}`);
            }
        });
        return query;
    }

    toFilterString() {
        if (this.conditions.length > 0) {
            const condition = this.conditions[0];
            return `${condition.column}=${condition.type}.${condition.value}`;
        }
        return "";
    }
}

export type OptionalConditions = Conditions | undefined;