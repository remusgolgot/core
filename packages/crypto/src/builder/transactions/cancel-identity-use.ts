import { TransactionTypes } from "../../constants";
import { feeManager } from "../../managers";
import { IIdentityUseElement, ITransactionAsset, ITransactionData } from "../../transactions";
import { TransactionBuilder } from "./transaction";

export class CancelIdentityUseBuilder extends TransactionBuilder<CancelIdentityUseBuilder> {
    constructor() {
        super();

        this.data.type = TransactionTypes.CancelIdentityUseRequest;
        this.data.fee = feeManager.get(TransactionTypes.CancelIdentityUseRequest);
        this.data.amount = 0;
        this.data.recipientId = null;
        this.data.senderPublicKey = null;
        this.data.asset = { identityuse: [] } as ITransactionAsset;
    }

    /**
     * Establish the attributes on the asset.
     */
    public identityUseAsset(identityuse: IIdentityUseElement[]): CancelIdentityUseBuilder {
        this.data.asset.identityuse = identityuse;
        return this;
    }

    public getStruct(): ITransactionData {
        const struct = super.getStruct();
        struct.amount = this.data.amount;
        struct.recipientId = this.data.recipientId;
        struct.asset = this.data.asset;
        return struct;
    }

    protected instance(): CancelIdentityUseBuilder {
        return this;
    }
}
