import BigNumber from "bignumber.js";
import { TransactionTypes } from "../../../enums";
import { IAttributeValidationElement, ITransactionAsset, ITransactionData } from "../../../interfaces";
import { feeManager } from "../../../managers";
import { TransactionBuilder } from "./transaction";

export class DeclineAttributeValidationBuilder extends TransactionBuilder<DeclineAttributeValidationBuilder> {
    constructor() {
        super();

        this.data.type = TransactionTypes.DeclineAttributeValidationRequest;
        this.data.fee = feeManager.get(TransactionTypes.DeclineAttributeValidationRequest);
        this.data.amount = new BigNumber(0);
        this.data.recipientId = undefined;
        this.data.senderPublicKey = undefined;
        this.data.asset = { validation: [] } as ITransactionAsset;
    }

    /**
     * Establish the attributes on the asset.
     */
    public validationAsset(validation: IAttributeValidationElement[]): DeclineAttributeValidationBuilder {
        this.data.asset.validation = validation;
        return this;
    }

    public getStruct(): ITransactionData {
        const struct = super.getStruct();
        struct.amount = this.data.amount;
        struct.recipientId = this.data.recipientId;
        struct.asset = this.data.asset;
        return struct;
    }

    protected instance(): DeclineAttributeValidationBuilder {
        return this;
    }
}
