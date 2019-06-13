const crypto = require("@arkecosystem/crypto/dist/index");
const axios = require("axios");

import { IRepository } from "../interfaces";
import { Repository } from "./repository";
import { buildFilterQuery } from "./utils/build-filter-query";

export class IdentityUsesRepository extends Repository implements IRepository {
    constructor() {
        super();
    }

    public getModel(): any {
        return (this.databaseService.connection as any).models.identityuse;
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
     * Search all attribute validation requests.
     * @param  {Object} parameters
     * @return {Object}
     */
    public async search(parameters): Promise<any> {
        const selectQuery = this.query.select().from(this.query);

        const conditions = buildFilterQuery(this._formatConditions(parameters), {
            exact: ["id", "attribute_id", "serviceName", "serviceProvider"],
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

    /**
     * Create Identity Use request.
     * @param  {Object}  parameters
     * @return {Object}
     */
    async createIdentityUseRequest(parameters = <any>{}) {

        try {
            let identityUse = parameters.asset.identityuse[0];
            const transaction = crypto.transactionBuilder
                .requestIdentityUse()
                .identityUseAsset(parameters.asset.identityuse)
                .amount(0)
                .recipientId(identityUse.owner)
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
                identityUse.timestamp = transaction.timestamp;
                if (!identityUse.reason) {
                    identityUse.reason = null;
                }
                if (!identityUse.attributes) {
                    identityUse.attributes = null;
                } else {
                    identityUse.attributes = JSON.stringify(identityUse.attributes)
                }
                identityUse.status = 'PENDING_APPROVAL';
                await this.databaseService.connection.saveIdentityUseRequest(identityUse);
                return { "transactionId": transaction.id };
            } else {
                return { "error": "Invalid Transaction" }
            }

        } catch (err) {
            console.log(err);
            return { "error": err };
        }
    }

    /**
     * Approve Identity Use Request.
     * @param  {Object}  parameters
     * @return {Object}
     */
    async approveIdentityUseRequest(parameters = <any>{}) {

        try {
            let identityUse = parameters.asset.identityuse[0];
            const transaction = crypto.transactionBuilder
                .approveIdentityUseRequest()
                .identityUseAsset(parameters.asset.identityuse)
                .amount(0)
                .recipientId(identityUse.serviceProvider)
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
                identityUse.timestamp = transaction.timestamp;
                if (!identityUse.reason) {
                    identityUse.reason = null;
                }
                if (!identityUse.attributes) {
                    identityUse.attributes = null;
                }
                identityUse.status = 'ACTIVE';
                await this.databaseService.connection.updateIdentityUseRequest(identityUse);
                await this.databaseService.connection.addIdentityUseRequestAction({
                    id: identityUse.id,
                    action: 'APPROVE',
                    timestamp: transaction.timestamp
                });
                return { "transactionId": transaction.id };
            } else {
                return { "error": "Invalid Transaction" }
            }

        } catch (err) {
            console.log(err);
            return { "error": err };
        }
    }

    /**
     * Decline Identity Use Request.
     * @param  {Object}  parameters
     * @return {Object}
     */
    async declineIdentityUseRequest(parameters = <any>{}) {

        try {
            let identityUse = parameters.asset.identityuse[0];
            const transaction = crypto.transactionBuilder
                .declineIdentityUseRequest()
                .identityUseAsset(parameters.asset.identityuse)
                .amount(0)
                .recipientId(identityUse.serviceProvider)
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
                identityUse.timestamp = transaction.timestamp;
                if (!identityUse.reason) {
                    identityUse.reason = null;
                }
                identityUse.status = 'DECLINED';
                await this.databaseService.connection.updateIdentityUseRequest(identityUse);
                await this.databaseService.connection.addIdentityUseRequestAction({
                    id: identityUse.id,
                    action: 'DECLINE',
                    timestamp: transaction.timestamp
                });
                return { "transactionId": transaction.id };
            } else {
                return { "error": "Invalid Transaction" }
            }

        } catch (err) {
            console.log(err);
            return { "error": err };
        }
    }

    /**
     * Cancel Identity Use Request.
     * @param  {Object}  parameters
     * @return {Object}
     */
    async cancelIdentityUseRequest(parameters = <any>{}) {

        try {
            let identityUse = parameters.asset.identityuse[0];
            const transaction = crypto.transactionBuilder
                .cancelIdentityUseRequest()
                .identityUseAsset(parameters.asset.identityuse)
                .amount(0)
                .recipientId(identityUse.owner)
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
                identityUse.timestamp = transaction.timestamp;
                if (!identityUse.reason) {
                    identityUse.reason = null;
                }
                identityUse.status = 'CANCELED';
                await this.databaseService.connection.updateIdentityUseRequest(identityUse);
                await this.databaseService.connection.addIdentityUseRequestAction({
                    id: identityUse.id,
                    action: 'CANCEL',
                    timestamp: transaction.timestamp
                });
                return { "transactionId": transaction.id };
            } else {
                return { "error": "Invalid Transaction" }
            }

        } catch (err) {
            console.log(err);
            return { "error": err };
        }
    }

    /**
     * End Identity Use Request.
     * @param  {Object}  parameters
     * @return {Object}
     */
    async endIdentityUseRequest(parameters = <any>{}) {

        try {
            let identityUse = parameters.asset.identityuse[0];
            const transaction = crypto.transactionBuilder
                .endIdentityUseRequest()
                .identityUseAsset(parameters.asset.identityuse)
                .amount(0)
                .recipientId(identityUse.owner)
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
                identityUse.timestamp = transaction.timestamp;
                if (!identityUse.reason) {
                    identityUse.reason = null;
                }
                identityUse.status = 'ENDED';
                await this.databaseService.connection.updateIdentityUseRequest(identityUse);
                await this.databaseService.connection.addIdentityUseRequestAction({
                    id: identityUse.id,
                    action: 'END',
                    timestamp: transaction.timestamp
                });
                return { "transactionId": transaction.id };
            } else {
                return { "error": "Invalid Transaction" }
            }

        } catch (err) {
            console.log(err);
            return { "error": err };
        }
    }

    /**
     * getIdentityUseRequests.
     * @param  {Object}  parameters
     * @return {Object}
     */
    async getIdentityUseRequest(parameters = <any>{}) {

        try {
            return await this.databaseService.connection.getIdentityUseRequests(parameters);

        } catch (err) {
            console.log(err);
            return { "error": err };
        }
    }

    /**
     * getIdentityUseRequestWithValidationDetails.
     * @param  {Object}  parameters
     * @return {Object}
     */
    async getIdentityUseRequestWithValidationDetails(parameters = <any>{}) {

        try {
            return await this.databaseService.connection.getIdentityUseRequestWithValidationDetails(parameters);

        } catch (err) {
            console.log(err);
            return { "error": err };
        }
    }



}
