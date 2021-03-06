// import { app } from "@arkecosystem/core-container";
// import { Database } from "@arkecosystem/core-interfaces";

export function transformIdentityUseRequest(identityUseRequest) {
    if (!identityUseRequest.reason) {
        identityUseRequest.reason = null;
    }
    return {
        id: identityUseRequest.id,
        reason: identityUseRequest.reason,
        timestamp: identityUseRequest.timestamp,
        name: identityUseRequest.name,
        provider: identityUseRequest.provider,
        description: identityUseRequest.description,
        owner: identityUseRequest.owner,
        attribute_types: identityUseRequest.attributeTypes,
        attributes: identityUseRequest.attributes,
        status: identityUseRequest.status,
        service_status: identityUseRequest.serviceStatus,
    };
}
