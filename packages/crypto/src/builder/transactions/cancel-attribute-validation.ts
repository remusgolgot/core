import { TransactionTypes } from "../../constants";
import { feeManager } from "../../managers";
import { IAttributeValidationElement, ITransactionAsset, ITransactionData } from "../../transactions";
import { TransactionBuilder } from "./transaction";

export class CancelAttributeValidationBuilder extends TransactionBuilder<CancelAttributeValidationBuilder> {
    constructor() {
        super();

        this.data.type = TransactionTypes.CancelAttributeValidationRequest;
        this.data.fee = feeManager.get(TransactionTypes.CancelAttributeValidationRequest);
        this.data.amount = 0;
        this.data.recipientId = null;
        this.data.senderPublicKey = null;
        this.data.asset = { attribute: [] } as ITransactionAsset;
    }

    /**
     * Establish the attributes on the asset.
     */
    public validationAsset(validation: IAttributeValidationElement[]): CancelAttributeValidationBuilder {
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

    protected instance(): CancelAttributeValidationBuilder {
        return this;
    }
}
