const crypto = require("@arkecosystem/crypto/dist/index");
const axios = require("axios");


import { IRepository } from "../interfaces";
import { Repository } from "./repository";
import { buildFilterQuery } from "./utils/build-filter-query";
import { models } from "../../../crypto/dist";

export class AttributesRepository extends Repository implements IRepository {
    constructor() {
        super();
    }

    public getModel(): any {
        return (this.databaseService.connection as any).models.attribute;
    }

    /**
     * Get all attributes for the given parameters.
     * @param  {Object}  parameters
     * @return {Object}
     */
    public async findByCriteria(parameters: any = {}): Promise<any> {
        const selectQuery = this.query.select().from(this.query);

        const conditions = Object.entries(this._formatConditions(parameters));

        if (conditions.length) {
            const first = conditions.shift();

            selectQuery.where(this.query[first[0]].equals(first[1]));

            for (const condition of conditions) {
                selectQuery.and(this.query[condition[0]].equals(condition[1]));
            }
        }
    }

    /**
     * Search all attributes.
     * @param  {Object} parameters
     * @return {Object}
     */
    public async search(parameters): Promise<any> {
        const selectQuery = this.query.select().from(this.query);

        const conditions = buildFilterQuery(this._formatConditions(parameters), {
            exact: ["id", "type", "owner"],
            between: [
                "expire_timestamp",
                "timestamp"
            ],
        });

        if (conditions.length) {
            const first = conditions.shift();

            selectQuery.where(this.query[first.column][first.method](first.value));

            for (const condition of conditions) {
                selectQuery.and(this.query[condition.column][condition.method](condition.value));
            }
        }

        return this._findManyWithCount(selectQuery, {
            limit: parameters.limit,
            offset: parameters.offset,
            orderBy: this.__orderBy(parameters),
        });
    }

    /**
     * Create an attribute with the given parameters.
     * @param  {Object}  parameters
     * @return {Object}
     */
    async postAttribute(parameters = <any>{}) {

        try {
            let attribute = parameters.asset.attribute[0]
            const transaction = crypto.transactionBuilder
                .createAttribute()
                .attributesAsset(parameters.asset.attribute)
                .amount(0)
                .recipientId(attribute.owner)
                .sign(parameters.secret)
                .getStruct();
            // console.log('TRANSACTION = ' + JSON.stringify(transaction))

            let response = await axios.post(
                "http://127.0.0.1:4003/api/v2/transactions",
                {
                    transactions: [transaction],
                },
                {
                    headers: { "Content-Type": "application/json" },
                },
            );

            if (response.data.data.invalid.length === 0) {
                attribute.timestamp = transaction.timestamp;
                const repo1 = await this.databaseService.connection.saveAttribute(attribute);
                return {"transactionId" : transaction.id};
            } else {
                return {"error" : "Invalid Transaction"}
            }

        } catch (err) {
            console.log(err);
            return {"error" : err};
        }
    }

    /**
     * Update an attribute with the given parameters.
     * @param  {Object}  parameters
     * @return {Object}
     */
    public async putAttribute(parameters: any = {}): Promise<any> {
        try {
            let attribute = parameters.asset.attribute[0]
            const transaction = crypto.transactionBuilder
                .updateAttribute()
                .attributesAsset(parameters.asset.attribute)
                .amount(0)
                .recipientId(attribute.owner)
                .sign(parameters.secret)
                .getStruct();

            let response = await axios.post(
                "http://127.0.0.1:4003/api/v2/transactions",
                {
                    transactions: [transaction],
                },
                {
                    headers: { "Content-Type": "application/json" },
                },
            );

            if (response.data.data.invalid.length === 0) {
                attribute.timestamp = transaction.timestamp;
                // @ts-ignore
                const repo1 = await this.databaseService.connection.updateOrCreate(attribute);
                return {"transactionId" : transaction.id};
            } else {
                return {"error" : "Invalid Transaction"}
            }

        } catch (err) {
            console.log(err);
            return {"error" : err};
        }
    }

    public async getAttributesWithValidationDetails(attribute: any = {}): Promise<any> {
        return await this.databaseService.connection.getAttributesWithValidationDetails(attribute);
    }

    public __orderBy(parameters): string[] {
        if (!parameters.orderBy) {
            return ["id", "asc"];
        }

        const orderBy = parameters.orderBy.split(":").map(p => p.toLowerCase());
        if (orderBy.length !== 2 || ["desc", "asc"].includes(orderBy[1]) !== true) {
            return ["id", "asc"];
        }

        return orderBy;
    }
}
