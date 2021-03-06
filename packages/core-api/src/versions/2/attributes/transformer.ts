// import { app } from "@arkecosystem/core-container";
// import { Database } from "@arkecosystem/core-interfaces";

export function transformAttribute(attribute) {
    return {
        id: attribute.id,
        type: attribute.type,
        value: attribute.value,
        owner: attribute.owner,
        associations: attribute.associations,
        timestamp: attribute.timestamp,
        expire_timestamp: attribute.expireTimestamp,
        redFlags: attribute.redFlags,
        yellowFlags: attribute.yellowFlags,
        active: attribute.active,
        rejected: attribute.rejected,
        dangerOfRejection: attribute.dangerOfRejection,
        completed: attribute.completed,
    };
}

export function transformAttributeType(attributeType) {
    return {
        id: attributeType.id,
        name: attributeType.name,
        validation: attributeType.validation,
        data_type: attributeType.dataType,
        options: attributeType.options,
    };
}
