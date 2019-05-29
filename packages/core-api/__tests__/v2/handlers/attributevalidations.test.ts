import "@arkecosystem/core-test-utils";
import { utils } from "../utils";
import sleep from "sleep";
import { messages } from "../../../src/versions/2/messages";
import { delegates } from "../data";
import { secrets } from "../data";

var globalTimestamp = 0;

const ATTRIBUTES = "attributes";
const ATTRIBUTE_TYPES = "attribute_types";
const COUNT = "count";
const SUCCESS = "success";
const MESSAGE = 'message';
const TRANSACTION_ID = "transactionId";
const FALSE = false;
const TRUE = true;
const ERROR = "error";
const TRUST_POINTS = "trust_points";
const ATTRIBUTE_VALIDATIONS = "attribute_validations";
const OWNER_PROP = "owner";
const TYPE_PROP = "type";
const VALUE_PROP = "value";
const EXPIRE_TIMESTAMP_PROP = "expire_timestamp";

const SLEEP_TIME = 7001;
const ATTRIBUTE_VALIDATION_REQUESTS = 'attribute_validation_requests';

// DATA

const OWNER = delegates[2].senderId;
const SECRET = secrets[2];
const PUBLIC_KEY = delegates[2].senderPublicKey;

const OTHER_OWNER = delegates[3].senderId;
const OTHER_SECRET = secrets[3];
const OTHER_PUBLIC_KEY = delegates[3].senderPublicKey;

const VALIDATOR = delegates[0].senderId;
const VALIDATOR_SECRET = secrets[0];
const VALIDATOR_PUBLIC_KEY = delegates[0].senderPublicKey;

const VALIDATOR_2 = delegates[4].senderId;
const VALIDATOR_SECRET_2 = secrets[4];
const VALIDATOR_PUBLIC_KEY_2 = delegates[4].senderPublicKey;

const FIRST_NAME = "first_name";
const PHONE_NUMBER = "phone_number";
const BIRTHPLACE = "birthplace";
const ADDRESS = "address";
const SSN = "ssn";
const EMAIL = "email";
const IDENTITY_CARD = "identity_card";
const INCORRECT_TYPE = "whatevs";

const ADDRESS_VALUE = "Denver";
const NAME_VALUE = "JOE";
const SECOND_NAME_VALUE = "QUEEN";
const THIRD_ID_VALUE = "QUEENS";
const EMAIL_VALUE = "yeezy@gmail.com";
const PHONE_NUMBER_VALUE = "345654321";
const BIRTHPLACE_VALUE = "Calgary";
const NEW_ADDRESS = "Edmonton";
const NEW_ADDRESS2 = "Toronto";
const INCORRECT_ADDRESS = "ABC";

const REASON_FOR_DECLINE_1024_GOOD =
    '1000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000001';
const REASON_FOR_DECLINE_1025_TOO_LONG =
    '10000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000001';
const REASON_FOR_REJECT_1024_GOOD =
    '1000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000001';
const REASON_FOR_REJECT_1025_TOO_LONG =
    '10000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000001';

describe("API 2.0", () => {

    describe("Preparations - Create Attributes", () => {
        describe.each([["Accept", "requestWithAcceptHeader"]])(
            "Create Attribute",
            (header, request) => {

                it("Create a non file attribute (OWNER, FIRST_NAME). " +
                    "EXPECTED : SUCCESS. RESULT : Transaction ID", async () => {
                    let body = createAttributeBody(<any>{});
                    const response = await utils[request]("POST", "v2/attributes", body);
                    sleep.msleep(SLEEP_TIME);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data).toHaveProperty(TRANSACTION_ID);
                    expect(response.data.success).toBe(TRUE);
                });

                it("Create a non file attribute (OWNER, PHONE_NUMBER). " +
                    "EXPECTED : SUCCESS. RESULT : Transaction ID", async () => {
                    let param = <any>{};
                    param.value = PHONE_NUMBER_VALUE;
                    param.type = PHONE_NUMBER;

                    let body = createAttributeBody(param);
                    const response = await utils[request]("POST", "v2/attributes", body);
                    sleep.msleep(SLEEP_TIME);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data).toHaveProperty(TRANSACTION_ID);
                    expect(response.data.success).toBe(TRUE);
                });

                it("Create a non file attribute (OWNER, BIRTHPLACE). " +
                    "EXPECTED : SUCCESS. RESULT : Transaction ID", async () => {
                    let param = <any>{};
                    param.value = BIRTHPLACE_VALUE;
                    param.type = BIRTHPLACE;

                    let body = createAttributeBody(param);
                    const response = await utils[request]("POST", "v2/attributes", body);
                    sleep.msleep(SLEEP_TIME);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data).toHaveProperty(TRANSACTION_ID);
                    expect(response.data.success).toBe(TRUE);
                });

                it("Create a non file attribute (OWNER, ADDRESS). " +
                    "EXPECTED : SUCCESS. RESULT : Transaction ID", async () => {
                    let param = <any>{};
                    param.value = ADDRESS_VALUE;
                    param.type = ADDRESS;

                    let body = createAttributeBody(param);
                    const response = await utils[request]("POST", "v2/attributes", body);
                    sleep.msleep(SLEEP_TIME);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data).toHaveProperty(TRANSACTION_ID);
                    expect(response.data.success).toBe(TRUE);
                });

                it("Create a non file attribute (OWNER, EMAIL), which does not require associations. " +
                    "EXPECTED : SUCCESS. RESULT : Transaction ID", async () => {
                    let param = <any>{};
                    param.value = EMAIL_VALUE;
                    param.type = EMAIL;
                    param.expire_timestamp = 555555555;

                    let body = createAttributeBody(param);
                    const response = await utils[request]("POST", "v2/attributes", body);
                    sleep.msleep(SLEEP_TIME);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data).toHaveProperty(TRANSACTION_ID);
                    expect(response.data.success).toBe(TRUE);
                });

                it("Create a non file attribute (OTHER_OWNER, FIRST_NAME). " +
                    "EXPECTED : SUCCESS. RESULT : Transaction ID", async () => {
                    let param = <any>{};
                    param.owner = OTHER_OWNER;
                    param.secret = OTHER_SECRET;
                    param.publicKey = OTHER_PUBLIC_KEY;
                    let body = createAttributeBody(param);
                    const response = await utils[request]("POST", "v2/attributes", body);
                    sleep.msleep(SLEEP_TIME);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data).toHaveProperty(TRANSACTION_ID);
                    expect(response.data.success).toBe(TRUE);
                });
            });
    });

    describe("Attribute Validation Requests", () => {
        describe.each([["Accept", "requestWithAcceptHeader"]])(
            "Attribute Validation Requests",
            (header, request) => {
                it('As a PUBLIC user, I want to Get the validation requests for a given validator VALIDATOR, with no validation requests. ' +
                    'EXPECTED : SUCCESS. RESULT : No Results (empty attribute_validation_requests array)', async () => {

                    const response = await utils[request]("GET", "v2/attribute-validations/validationrequest?validator=" + VALIDATOR);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data).toHaveProperty(ATTRIBUTE_VALIDATION_REQUESTS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data.attribute_validation_requests).toHaveLength(0);
                });

                it('As a PUBLIC user, I want to Get the validation requests for a given attribute (OWNER, ADDRESS), with no validation requests. ' +
                    'EXPECTED : SUCCESS. RESULT : No Results (empty attribute_validation_requests array)', async () => {

                    const attribute = await utils[request]("GET", "v2/attributes?owner=" + OWNER + "&type=" + ADDRESS);
                    const response = await utils[request]("GET", "v2/attribute-validations/validationrequest?attributeId=" + attribute.data.attributes[0].id);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data).toHaveProperty(ATTRIBUTE_VALIDATION_REQUESTS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data.attribute_validation_requests).toHaveLength(0);
                });

                it('As a VALIDATOR, I want to Approve a validation request that does not exist (attribute exists). ' +
                    'EXPECTED : FAILURE. ERROR : VALIDATION_REQUEST_MISSING_FOR_ACTION', async () => {
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = ADDRESS;
                    params.secret = VALIDATOR_SECRET;
                    params.publicKey = VALIDATOR_PUBLIC_KEY;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/approve", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.VALIDATION_REQUEST_MISSING_FOR_ACTION);
                });

                it('As a VALIDATOR, I want to Decline a validation request that does not exist (attribute exists). ' +
                    'EXPECTED : FAILURE. ERROR : VALIDATION_REQUEST_MISSING_FOR_ACTION', async () => {
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = ADDRESS;
                    params.secret = VALIDATOR_SECRET;
                    params.publicKey = VALIDATOR_PUBLIC_KEY;
                    params.reason = REASON_FOR_DECLINE_1024_GOOD;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/decline", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.VALIDATION_REQUEST_MISSING_FOR_ACTION);
                });

                it('As a VALIDATOR, I want to Cancel a validation request that does not exist (attribute exists). ' +
                    'EXPECTED : FAILURE. ERROR : VALIDATION_REQUEST_MISSING_FOR_ACTION', async () => {
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = ADDRESS;
                    params.secret = VALIDATOR_SECRET;
                    params.publicKey = VALIDATOR_PUBLIC_KEY;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/cancel", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.VALIDATION_REQUEST_MISSING_FOR_ACTION);
                });

                it('As a VALIDATOR, I want to Reject a validation request that does not exist (attribute exists). ' +
                    'EXPECTED : FAILURE. ERROR : VALIDATION_REQUEST_MISSING_FOR_ACTION', async () => {
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = ADDRESS;
                    params.secret = VALIDATOR_SECRET;
                    params.publicKey = VALIDATOR_PUBLIC_KEY;
                    params.reason = REASON_FOR_REJECT_1024_GOOD;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/reject", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.VALIDATION_REQUEST_MISSING_FOR_ACTION);
                });

                it('As a VALIDATOR, I want to Notarize a validation request that does not exist (attribute exists). ' +
                    'EXPECTED : FAILURE. ERROR : VALIDATION_REQUEST_MISSING_FOR_ACTION', async () => {
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = ADDRESS;
                    params.secret = VALIDATOR_SECRET;
                    params.publicKey = VALIDATOR_PUBLIC_KEY;
                    params.validationType = 'FACE_TO_FACE';
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/notarize", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.VALIDATION_REQUEST_MISSING_FOR_ACTION);
                });

                it('As an OWNER, I want to Create a validation request for a non-file attribute (FIRST_NAME), by providing an incorrect Owner Address. ' +
                    'EXPECTED : FAILURE. ERROR : INVALID_OWNER_ADDRESS', async () => {
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.type = FIRST_NAME;
                    params.owner = INCORRECT_ADDRESS;
                    params.secret = SECRET;
                    params.publicKey = PUBLIC_KEY;
                    let body = createAttributeValidationRequestBody(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/validationrequest", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.INVALID_OWNER_ADDRESS);
                });

                it('As an OWNER, I want to Create a validation request for a non-file attribute (FIRST_NAME), by providing an incorrect Validator Address. ' +
                    'EXPECTED : FAILURE. ERROR : INVALID_VALIDATOR_ADDRESS', async () => {
                    let params = <any>{};
                    params.validator = INCORRECT_ADDRESS;
                    params.type = FIRST_NAME;
                    params.owner = OWNER;
                    params.secret = SECRET;
                    params.publicKey = PUBLIC_KEY;
                    let body = createAttributeValidationRequestBody(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/validationrequest", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.INVALID_VALIDATOR_ADDRESS);
                });

                it('As an OWNER, I want to Create a validation request for a non existing attribute (OWNER, SSN). ' +
                    'EXPECTED : FAILURE. ERROR : ATTRIBUTE_NOT_FOUND', async () => {
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.type = SSN;
                    params.owner = OWNER;
                    params.secret = SECRET;
                    params.publicKey = PUBLIC_KEY;
                    let body = createAttributeValidationRequestBody(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/validationrequest", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.ATTRIBUTE_NOT_FOUND);
                });

                it('As an OWNER, I want to Create a validation request, with myself as VALIDATOR. ' +
                    'EXPECTED : FAILURE. ERROR : OWNER_IS_VALIDATOR_ERROR', async () => {

                    let params = <any>{};
                    params.validator = OWNER;
                    params.type = FIRST_NAME;
                    params.owner = OWNER;
                    params.secret = SECRET;
                    params.publicKey = PUBLIC_KEY;
                    let body = createAttributeValidationRequestBody(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/validationrequest", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.OWNER_IS_VALIDATOR_ERROR);
                });

                it('As an OWNER, I want to Create a validation request for an attribute (ADDRESS) with no associations, but which requires a documented attribute. ' +
                    'EXPECTED : FAILURE. ERROR : ATTRIBUTE_WITH_NO_ASSOCIATIONS_CANNOT_BE_VALIDATED', async () => {
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.type = ADDRESS;
                    params.owner = OWNER;
                    params.secret = SECRET;
                    params.publicKey = PUBLIC_KEY;
                    let body = createAttributeValidationRequestBody(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/validationrequest", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.ATTRIBUTE_WITH_NO_ASSOCIATIONS_CANNOT_BE_VALIDATED);
                })

                it("As an OWNER, I want to Create a validation request for a non-file attribute (PHONE_NUMBER, VALIDATOR). " +
                    "EXPECTED : SUCCESS. RESULT : Transaction ID", async () => {

                    let params = <any>{};
                    params.owner = OWNER;
                    params.validator = VALIDATOR;
                    params.type = PHONE_NUMBER;

                    let body = createAttributeValidationRequestBody(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/validationrequest", body);
                    sleep.msleep(SLEEP_TIME);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data).toHaveProperty(TRANSACTION_ID);
                });

                it("As an OWNER, I want to Create a validation request for a non-file attribute (BIRTHPLACE, VALIDATOR). " +
                    "EXPECTED : SUCCESS. RESULT : Transaction ID", async () => {

                    let params = <any>{};
                    params.owner = OWNER;
                    params.validator = VALIDATOR;
                    params.type = BIRTHPLACE;

                    let body = createAttributeValidationRequestBody(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/validationrequest", body);
                    sleep.msleep(SLEEP_TIME);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data).toHaveProperty(TRANSACTION_ID);
                });

                it('As an OWNER, I want to Create a validation request for an attribute (EMAIL, VALIDATOR) with no associations, which does not require an association. ' +
                    'EXPECTED : SUCCESS. RESULT : Transaction ID', async () => {
                    let params = <any>{};
                    params.owner = OWNER;
                    params.validator = VALIDATOR;
                    params.type = EMAIL;

                    let body = createAttributeValidationRequestBody(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/validationrequest", body);
                    sleep.msleep(SLEEP_TIME);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data).toHaveProperty(TRANSACTION_ID);
                });

                it("Create a validation request for a non file type attribute (BIRTHPLACE), and another validator (VALIDATOR_2). " +
                    "EXPECTED : SUCCESS. RESULT : Transaction ID", async () => {
                    let params = <any>{};
                    params.owner = OWNER;
                    params.validator = VALIDATOR_2;
                    params.type = BIRTHPLACE;

                    let body = createAttributeValidationRequestBody(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/validationrequest", body);
                    sleep.msleep(SLEEP_TIME);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data).toHaveProperty(TRANSACTION_ID);
                });

                it("Create a validation request for a non file type attribute (PHONE_NUMBER), and another validator (VALIDATOR_2). " +
                    "EXPECTED : SUCCESS. RESULT : Transaction ID", async () => {
                    let params = <any>{};
                    params.owner = OWNER;
                    params.validator = VALIDATOR_2;
                    params.type = PHONE_NUMBER;

                    let body = createAttributeValidationRequestBody(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/validationrequest", body);
                    sleep.msleep(SLEEP_TIME);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data).toHaveProperty(TRANSACTION_ID);
                });

                it("As a PUBLIC user, I want to Get the List of validation requests given an attribute (OWNER, PHONE_NUMBER) and a VALIDATOR. " +
                    "EXPECTED : SUCCESS. RESULT : 1 Validation Request, in PENDING_APPROVAL status", async () => {

                    const attribute = await utils[request]("GET", "v2/attributes?owner=" + OWNER + "&type=" + PHONE_NUMBER);
                    const response = await utils[request](
                        "GET", "v2/attribute-validations/validationrequest?attributeId=" + attribute.data.attributes[0].id + "&validator=" + VALIDATOR);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data).toHaveProperty(ATTRIBUTE_VALIDATION_REQUESTS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data.attribute_validation_requests).toHaveLength(1);
                    expect(response.data.attribute_validation_requests[0].status).toBe("PENDING_APPROVAL");
                    expect(response.data.attribute_validation_requests[0].attribute_id).toBe(attribute.data.attributes[0].id);
                });

                it("As a PUBLIC user, I want to Get the validation requests for a given user (OWNER), with multiple validation requests " +
                    "EXPECTED : SUCCESS. RESULT : 5 Validation Requests, all in PENDING_APPROVAL status", async () => {

                    const response = await utils[request](
                        "GET", "v2/attribute-validations/validationrequest?owner=" + OWNER);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data).toHaveProperty(ATTRIBUTE_VALIDATION_REQUESTS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data.attribute_validation_requests).toHaveLength(5);
                    expect(response.data.attribute_validation_requests[0].status).toBe("PENDING_APPROVAL");
                    expect(response.data.attribute_validation_requests[1].status).toBe("PENDING_APPROVAL");
                    expect(response.data.attribute_validation_requests[2].status).toBe("PENDING_APPROVAL");
                    expect(response.data.attribute_validation_requests[3].status).toBe("PENDING_APPROVAL");
                    expect(response.data.attribute_validation_requests[4].status).toBe("PENDING_APPROVAL");
                });

                it("As a PUBLIC user, I want to Get the validation requests for a given validator (VALIDATOR) " +
                    "EXPECTED : SUCCESS. RESULT : 3 Validation Requests, all in PENDING_APPROVAL status", async () => {

                    const response = await utils[request](
                        "GET", "v2/attribute-validations/validationrequest?validator=" + VALIDATOR);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data).toHaveProperty(ATTRIBUTE_VALIDATION_REQUESTS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data.attribute_validation_requests).toHaveLength(3);
                    expect(response.data.attribute_validation_requests[0].status).toBe("PENDING_APPROVAL");
                    expect(response.data.attribute_validation_requests[1].status).toBe("PENDING_APPROVAL");
                    expect(response.data.attribute_validation_requests[2].status).toBe("PENDING_APPROVAL");
                });

    });
    });

    describe("Attribute Validation Request Actions", () => {
        describe.each([["Accept", "requestWithAcceptHeader"]])(
            "Attribute Validation Request Actions",
            (header, request) => {

                it('As an OWNER, I want to Create a validation request for an attribute (PHONE_NUMBER), ' +
                    'but a PENDING_APPROVAL validation request already exists for the provided attribute and VALIDATOR. ' +
                    'EXPECTED : FAILURE. ERROR : PENDING_APPROVAL_VALIDATION_REQUEST_ALREADY_EXISTS', async () => {
                    let params = <any>{};
                    params.owner = OWNER;
                    params.validator = VALIDATOR;
                    params.type = PHONE_NUMBER;

                    let body = createAttributeValidationRequestBody(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/validationrequest", body);
                    sleep.msleep(SLEEP_TIME);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.PENDING_APPROVAL_VALIDATION_REQUEST_ALREADY_EXISTS);
                });

                it('As an OWNER, I want to Approve a PENDING_APPROVAL validation request that belongs to me. ' +
                    'EXPECTED : FAILURE. ERROR : VALIDATION_REQUEST_ANSWER_SENDER_IS_NOT_VALIDATOR_ERROR', async () => {
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = PHONE_NUMBER;
                    params.secret = SECRET;
                    params.publicKey = PUBLIC_KEY;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/approve", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.VALIDATION_REQUEST_ANSWER_SENDER_IS_NOT_VALIDATOR_ERROR);

                });

                it('As an OWNER, I want to Decline a PENDING_APPROVAL validation request that belongs to me. ' +
                    'EXPECTED : FAILURE. ERROR : VALIDATION_REQUEST_ANSWER_SENDER_IS_NOT_VALIDATOR_ERROR', async () => {

                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = PHONE_NUMBER;
                    params.secret = SECRET;
                    params.publicKey = PUBLIC_KEY;
                    params.reason = REASON_FOR_DECLINE_1024_GOOD;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/decline", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.VALIDATION_REQUEST_ANSWER_SENDER_IS_NOT_VALIDATOR_ERROR);
                });

                it('As a VALIDATOR, I to Cancel a PENDING_APPROVAL validation request that is assigned to me. ' +
                    'EXPECTED : FAILURE. ERROR : VALIDATION_REQUEST_ANSWER_SENDER_IS_NOT_OWNER_ERROR', async () => {

                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = PHONE_NUMBER;
                    params.secret = VALIDATOR_SECRET;
                    params.publicKey = VALIDATOR_PUBLIC_KEY;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/cancel", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.VALIDATION_REQUEST_ANSWER_SENDER_IS_NOT_OWNER_ERROR);
                });

                // Notarize/Reject when PENDING_APPROVAL

                it('As a VALIDATOR, I want to Notarize a validation request that is still PENDING_APPROVAL. ' +
                    'EXPECTED : FAILURE. ERROR : ATTRIBUTE_VALIDATION_REQUEST_NOT_IN_PROGRESS', async () => {
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = PHONE_NUMBER;
                    params.secret = VALIDATOR_SECRET;
                    params.publicKey = VALIDATOR_PUBLIC_KEY;
                    params.validationType = 'FACE_TO_FACE';
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/notarize", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.ATTRIBUTE_VALIDATION_REQUEST_NOT_IN_PROGRESS);
                });

                it('As a PUBLIC user, I want to Get the validation requests for an attribute (OWNER, PHONE_NUMBER) ' +
                    'which was unsuccessfully notarized. ' +
                    'EXPECTED : SUCCESS. RESULT : 1 Result, with PENDING_APPROVAL status', async () => {
                    const attribute = await utils[request]("GET", "v2/attributes?owner=" + OWNER + "&type=" + PHONE_NUMBER);
                    const response = await utils[request](
                        "GET", "v2/attribute-validations/validationrequest?attributeId=" + attribute.data.attributes[0].id + "&validator=" + VALIDATOR);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data).toHaveProperty(ATTRIBUTE_VALIDATION_REQUESTS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data.attribute_validation_requests).toHaveLength(1);
                    expect(response.data.attribute_validation_requests[0].status).toBe("PENDING_APPROVAL");
                    expect(response.data.attribute_validation_requests[0].attribute_id).toBe(attribute.data.attributes[0].id);

                });

                it('As a VALIDATOR, I want to Reject a validation request that is still PENDING_APPROVAL. ' +
                    'EXPECTED : FAILURE. ERROR : ATTRIBUTE_VALIDATION_REQUEST_NOT_IN_PROGRESS', async () => {
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = PHONE_NUMBER;
                    params.secret = VALIDATOR_SECRET;
                    params.publicKey = VALIDATOR_PUBLIC_KEY;
                    params.reason = REASON_FOR_REJECT_1024_GOOD;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/reject", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.ATTRIBUTE_VALIDATION_REQUEST_NOT_IN_PROGRESS);
                });

                it('As a PUBLIC user, I want to Get the validation requests for an attribute (OWNER, PHONE_NUMBER) ' +
                    'which was unsuccessfully rejected. ' +
                    'EXPECTED : SUCCESS. RESULT : 1 Result, with PENDING_APPROVAL status', async () => {
                    const attribute = await utils[request]("GET", "v2/attributes?owner=" + OWNER + "&type=" + PHONE_NUMBER);
                    const response = await utils[request](
                        "GET", "v2/attribute-validations/validationrequest?attributeId=" + attribute.data.attributes[0].id + "&validator=" + VALIDATOR);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data).toHaveProperty(ATTRIBUTE_VALIDATION_REQUESTS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data.attribute_validation_requests).toHaveLength(1);
                    expect(response.data.attribute_validation_requests[0].status).toBe("PENDING_APPROVAL");
                    expect(response.data.attribute_validation_requests[0].attribute_id).toBe(attribute.data.attributes[0].id);

                });

                // Successful Approve

                it("As a VALIDATOR, I want to Approve a validation request (OWNER, PHONE_NUMBER) that is in PENDING_APPROVAL. " +
                    "EXPECTED : SUCCESS. RESULT : Transaction ID", async () => {
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = PHONE_NUMBER;
                    params.secret = VALIDATOR_SECRET;
                    params.publicKey = VALIDATOR_PUBLIC_KEY;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/approve", body);
                    sleep.msleep(SLEEP_TIME);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data).toHaveProperty(TRANSACTION_ID);
                });

                it("Approve a validation request (OWNER, BIRTHPLACE, VALIDATOR_2) that is in PENDING_APPROVAL. " +
                    "EXPECTED : SUCCESS. RESULT : Transaction ID", async () => {
                    let params = <any>{};
                    params.validator = VALIDATOR_2;
                    params.owner = OWNER;
                    params.type = BIRTHPLACE;
                    params.secret = VALIDATOR_SECRET_2;
                    params.publicKey = VALIDATOR_PUBLIC_KEY_2;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/approve", body);
                    sleep.msleep(SLEEP_TIME);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data).toHaveProperty(TRANSACTION_ID);
                });

                it('Approve a validation request (OWNER, BIRTHPLACE, VALIDATOR) that is in PENDING_APPROVAL. ' +
                    'EXPECTED : SUCCESS. RESULT : Transaction ID', async () => {
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = BIRTHPLACE;
                    params.secret = VALIDATOR_SECRET;
                    params.publicKey = VALIDATOR_PUBLIC_KEY;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/approve", body);
                    sleep.msleep(SLEEP_TIME);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data).toHaveProperty(TRANSACTION_ID);
                });

                it('As a PUBLIC user, I want to Get the details for a validation request (OWNER, PHONE_NUMBER, VALIDATOR) that was approved. ' +
                    'EXPECTED : SUCCESS. RESULT : 1 Result, with status IN_PROGRESS', async () => {
                    const attribute = await utils[request]("GET", "v2/attributes?owner=" + OWNER + "&type=" + PHONE_NUMBER);
                    const response = await utils[request](
                        "GET", "v2/attribute-validations/validationrequest?attributeId=" + attribute.data.attributes[0].id + "&validator=" + VALIDATOR);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data).toHaveProperty(ATTRIBUTE_VALIDATION_REQUESTS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data.attribute_validation_requests).toHaveLength(1);
                    expect(response.data.attribute_validation_requests[0].status).toBe("IN_PROGRESS");
                    expect(response.data.attribute_validation_requests[0].attribute_id).toBe(attribute.data.attributes[0].id);
                });

                it('Get the details for a validation request (OWNER, BIRTHPLACE, VALIDATOR_2) that was approved. ' +
                    'EXPECTED : SUCCESS. RESULT : 1 Result, with status IN_PROGRESS', async () => {
                    const attribute = await utils[request]("GET", "v2/attributes?owner=" + OWNER + "&type=" + BIRTHPLACE);
                    const response = await utils[request](
                        "GET", "v2/attribute-validations/validationrequest?attributeId=" + attribute.data.attributes[0].id + "&validator=" + VALIDATOR_2);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data).toHaveProperty(ATTRIBUTE_VALIDATION_REQUESTS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data.attribute_validation_requests).toHaveLength(1);
                    expect(response.data.attribute_validation_requests[0].status).toBe("IN_PROGRESS");
                    expect(response.data.attribute_validation_requests[0].attribute_id).toBe(attribute.data.attributes[0].id);
                });

                it('Get the details for a validation request (OWNER, BIRTHPLACE, VALIDATOR) that was approved. ' +
                    'EXPECTED : SUCCESS. RESULT : 1 Result, with status IN_PROGRESS',async () => {
                    const attribute = await utils[request]("GET", "v2/attributes?owner=" + OWNER + "&type=" + BIRTHPLACE);
                    const response = await utils[request](
                        "GET", "v2/attribute-validations/validationrequest?attributeId=" + attribute.data.attributes[0].id + "&validator=" + VALIDATOR);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data).toHaveProperty(ATTRIBUTE_VALIDATION_REQUESTS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data.attribute_validation_requests).toHaveLength(1);
                    expect(response.data.attribute_validation_requests[0].status).toBe("IN_PROGRESS");
                    expect(response.data.attribute_validation_requests[0].attribute_id).toBe(attribute.data.attributes[0].id);
                });

                it('As an OWNER, I want to Create a validation request for an attribute (PHONE_NUMBER), but an IN_PROGRESS ' +
                    'request already exists for this attribute. EXPECTED : FAILURE. ERROR : IN_PROGRESS_VALIDATION_REQUEST_ALREADY_EXISTS', async () => {
                    let params = <any>{};
                    params.owner = OWNER;
                    params.validator = VALIDATOR;
                    params.type = PHONE_NUMBER;

                    let body = createAttributeValidationRequestBody(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/validationrequest", body);
                    sleep.msleep(SLEEP_TIME);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.IN_PROGRESS_VALIDATION_REQUEST_ALREADY_EXISTS);
                })

                it('As an OWNER, I want to Notarize a validation request that belongs to me. ' +
                    'EXPECTED : FAILURE. ERROR : VALIDATION_REQUEST_ANSWER_SENDER_IS_NOT_VALIDATOR_ERROR', async () => {
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = PHONE_NUMBER;
                    params.secret = SECRET;
                    params.publicKey = PUBLIC_KEY;
                    params.validationType = 'FACE_TO_FACE';
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/notarize", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.VALIDATION_REQUEST_ANSWER_SENDER_IS_NOT_VALIDATOR_ERROR);
                });

                it('As an OWNER, I want to Reject a validation request that belongs to me. ' +
                    'EXPECTED : FAILURE. ERROR : VALIDATION_REQUEST_ANSWER_SENDER_IS_NOT_VALIDATOR_ERROR', async () => {
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = PHONE_NUMBER;
                    params.secret = SECRET;
                    params.publicKey = PUBLIC_KEY;
                    params.reason = REASON_FOR_REJECT_1024_GOOD;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/reject", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.VALIDATION_REQUEST_ANSWER_SENDER_IS_NOT_VALIDATOR_ERROR);
                })

                // Actions on a IN_PROGRESS validation request

                it('As a VALIDATOR, I want to Approve a validation request (OWNER, BIRTHPLACE) that is already IN_PROGRESS. ' +
                    'EXPECTED : FAILURE. ERROR : ATTRIBUTE_VALIDATION_REQUEST_NOT_PENDING_APPROVAL', async () => {
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = BIRTHPLACE;
                    params.secret = VALIDATOR_SECRET;
                    params.publicKey = VALIDATOR_PUBLIC_KEY;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/approve", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.ATTRIBUTE_VALIDATION_REQUEST_NOT_PENDING_APPROVAL);
                })

                it('As a PUBLIC user, I want to Get the details for a validation request (OWNER, BIRTHPLACE, VALIDATOR) that was approved twice. ' +
                    'EXPECTED : SUCCESS. RESULT : 1 Result, with status IN_PROGRESS', async () => {
                    const attribute = await utils[request]("GET", "v2/attributes?owner=" + OWNER + "&type=" + BIRTHPLACE);
                    const response = await utils[request](
                        "GET", "v2/attribute-validations/validationrequest?attributeId=" + attribute.data.attributes[0].id + "&validator=" + VALIDATOR);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data).toHaveProperty(ATTRIBUTE_VALIDATION_REQUESTS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data.attribute_validation_requests).toHaveLength(1);
                    expect(response.data.attribute_validation_requests[0].status).toBe("IN_PROGRESS");
                    expect(response.data.attribute_validation_requests[0].attribute_id).toBe(attribute.data.attributes[0].id);
                })

                it('As a VALIDATOR, I want to Decline a validation request (OWNER, BIRTHPLACE) that is already IN_PROGRESS. ' +
                    'EXPECTED : FAILURE. ERROR : ATTRIBUTE_VALIDATION_REQUEST_NOT_PENDING_APPROVAL', async () => {
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = BIRTHPLACE;
                    params.secret = VALIDATOR_SECRET;
                    params.publicKey = VALIDATOR_PUBLIC_KEY;
                    params.reason = REASON_FOR_DECLINE_1024_GOOD;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/decline", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.ATTRIBUTE_VALIDATION_REQUEST_NOT_PENDING_APPROVAL);
                })

                it('As a PUBLIC user, I want to Get the details for a validation request (OWNER, BIRTHPLACE, VALIDATOR) that was approved and then declined. ' +
                    'EXPECTED : SUCCESS. RESULT : 1 Result, with status IN_PROGRESS', async () => {
                    const attribute = await utils[request]("GET", "v2/attributes?owner=" + OWNER + "&type=" + BIRTHPLACE);
                    const response = await utils[request](
                        "GET", "v2/attribute-validations/validationrequest?attributeId=" + attribute.data.attributes[0].id + "&validator=" + VALIDATOR);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data).toHaveProperty(ATTRIBUTE_VALIDATION_REQUESTS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data.attribute_validation_requests).toHaveLength(1);
                    expect(response.data.attribute_validation_requests[0].status).toBe("IN_PROGRESS");
                    expect(response.data.attribute_validation_requests[0].attribute_id).toBe(attribute.data.attributes[0].id);
                })

                it('As an OWNER, I want to Cancel a validation request that is already IN_PROGRESS. ' +
                    'EXPECTED : FAILURE. ERROR : ATTRIBUTE_VALIDATION_REQUEST_NOT_PENDING_APPROVAL', async () => {
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = BIRTHPLACE;
                    params.secret = SECRET;
                    params.publicKey = PUBLIC_KEY;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/cancel", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.ATTRIBUTE_VALIDATION_REQUEST_NOT_PENDING_APPROVAL);
                })

                it('As a PUBLIC user, I want to Get the details for a validation request (OWNER, BIRTHPLACE, VALIDATOR) that was approved and then canceled. ' +
                    'EXPECTED : SUCCESS. RESULT : 1 Result, with status IN_PROGRESS', async () => {
                    const attribute = await utils[request]("GET", "v2/attributes?owner=" + OWNER + "&type=" + BIRTHPLACE);
                    const response = await utils[request](
                        "GET", "v2/attribute-validations/validationrequest?attributeId=" + attribute.data.attributes[0].id + "&validator=" + VALIDATOR);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data).toHaveProperty(ATTRIBUTE_VALIDATION_REQUESTS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data.attribute_validation_requests).toHaveLength(1);
                    expect(response.data.attribute_validation_requests[0].status).toBe("IN_PROGRESS");
                    expect(response.data.attribute_validation_requests[0].attribute_id).toBe(attribute.data.attributes[0].id);
                })

                // Decline

                it('As a VALIDATOR, I want to Decline a validation request (OWNER, EMAIL) by providing a reason that is too long (1025 characters). ' +
                    'EXPECTED : FAILURE. ERROR : REASON_TOO_BIG_DECLINE', async () => {
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = EMAIL;
                    params.reason = REASON_FOR_DECLINE_1025_TOO_LONG;
                    params.secret = VALIDATOR_SECRET;
                    params.publicKey = VALIDATOR_PUBLIC_KEY;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/decline", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.REASON_TOO_BIG_DECLINE);
                })

                it('As a VALIDATOR, I want to Decline a validation request (OWNER, EMAIL) without providing a reason for the decline. ' +
                    'EXPECTED : FAILURE. ERROR : DECLINE_ATTRIBUTE_VALIDATION_REQUEST_NO_REASON', async () => {
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = EMAIL;
                    params.secret = VALIDATOR_SECRET;
                    params.publicKey = VALIDATOR_PUBLIC_KEY;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/decline", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.DECLINE_ATTRIBUTE_VALIDATION_REQUEST_NO_REASON);
                })

                it('As a VALIDATOR, I want to Decline a validation request (OWNER, EMAIL) by providing a reason that has maximum length (1024 characters). ' +
                    'EXPECTED : SUCCESS. RESULT : Transaction ID', async () => {
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = EMAIL;
                    params.reason = REASON_FOR_DECLINE_1024_GOOD;
                    params.secret = VALIDATOR_SECRET;
                    params.publicKey = VALIDATOR_PUBLIC_KEY;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/decline", body);
                    sleep.msleep(SLEEP_TIME);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data).toHaveProperty(TRANSACTION_ID);
                });

                it('As a PUBLIC user, I want to Get the details for a validation request (OWNER, EMAIL, VALIDATOR) that was correctly declined. ' +
                    'EXPECTED : SUCCESS. RESULT : 1 Result, with status DECLINED', async () => {
                    const attribute = await utils[request]("GET", "v2/attributes?owner=" + OWNER + "&type=" + EMAIL);
                    const response = await utils[request](
                        "GET", "v2/attribute-validations/validationrequest?attributeId=" + attribute.data.attributes[0].id + "&validator=" + VALIDATOR);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data).toHaveProperty(ATTRIBUTE_VALIDATION_REQUESTS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data.attribute_validation_requests).toHaveLength(1);
                    expect(response.data.attribute_validation_requests[0].status).toBe("DECLINED");
                    expect(response.data.attribute_validation_requests[0].attribute_id).toBe(attribute.data.attributes[0].id);

                });

                // Actions on a DECLINED validation request

                it('As a VALIDATOR, I want to Decline a validation request (OWNER, EMAIL) that is already declined. ' +
                    'EXPECTED : FAILURE. ERROR : VALIDATION_REQUEST_MISSING_IN_STATUS_FOR_ACTION', async () => {
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = EMAIL;
                    params.reason = REASON_FOR_DECLINE_1024_GOOD;
                    params.secret = VALIDATOR_SECRET;
                    params.publicKey = VALIDATOR_PUBLIC_KEY;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/decline", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.VALIDATION_REQUEST_MISSING_IN_STATUS_FOR_ACTION);

                });

                it('As a PUBLIC user, I want to Get the details for a validation request (OWNER, EMAIL, VALIDATOR) that was declined twice. ' +
                    'EXPECTED : SUCCESS. RESULT : 1 Result, with status DECLINED', async () => {
                    const attribute = await utils[request]("GET", "v2/attributes?owner=" + OWNER + "&type=" + EMAIL);
                    const response = await utils[request](
                        "GET", "v2/attribute-validations/validationrequest?attributeId=" + attribute.data.attributes[0].id + "&validator=" + VALIDATOR);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data).toHaveProperty(ATTRIBUTE_VALIDATION_REQUESTS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data.attribute_validation_requests).toHaveLength(1);
                    expect(response.data.attribute_validation_requests[0].status).toBe("DECLINED");
                    expect(response.data.attribute_validation_requests[0].attribute_id).toBe(attribute.data.attributes[0].id);

                });

                it('As a VALIDATOR, I want to Approve a validation request (OWNER, EMAIL) that is already declined. ' +
                    'EXPECTED : FAILURE. ERROR : VALIDATION_REQUEST_MISSING_IN_STATUS_FOR_ACTION', async () => {
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = EMAIL;
                    params.secret = VALIDATOR_SECRET;
                    params.publicKey = VALIDATOR_PUBLIC_KEY;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/approve", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.VALIDATION_REQUEST_MISSING_IN_STATUS_FOR_ACTION);

                });

                it('As a PUBLIC user, I want to Get the details for a validation request (OWNER, EMAIL, VALIDATOR) that was declined and then approved. ' +
                    'EXPECTED : SUCCESS. RESULT : 1 Result, with status DECLINED', async () => {
                    const attribute = await utils[request]("GET", "v2/attributes?owner=" + OWNER + "&type=" + EMAIL);
                    const response = await utils[request](
                        "GET", "v2/attribute-validations/validationrequest?attributeId=" + attribute.data.attributes[0].id + "&validator=" + VALIDATOR);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data).toHaveProperty(ATTRIBUTE_VALIDATION_REQUESTS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data.attribute_validation_requests).toHaveLength(1);
                    expect(response.data.attribute_validation_requests[0].status).toBe("DECLINED");
                    expect(response.data.attribute_validation_requests[0].attribute_id).toBe(attribute.data.attributes[0].id);

                });

                it('As a VALIDATOR, I want to Notarize a validation request (OWNER, EMAIL) that is already declined. ' +
                    'EXPECTED : FAILURE. ERROR : VALIDATION_REQUEST_MISSING_IN_STATUS_FOR_ACTION', async () => {
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = EMAIL;
                    params.secret = VALIDATOR_SECRET;
                    params.publicKey = VALIDATOR_PUBLIC_KEY;
                    params.validationType = 'FACE_TO_FACE';
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/notarize", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.VALIDATION_REQUEST_MISSING_IN_STATUS_FOR_ACTION);

                });

                it('As a PUBLIC user, I want to Get the details for a validation request (OWNER, EMAIL, VALIDATOR) that was declined and then notarized. ' +
                    'EXPECTED : SUCCESS. RESULT : 1 Result, with status DECLINED', async () => {
                    const attribute = await utils[request]("GET", "v2/attributes?owner=" + OWNER + "&type=" + EMAIL);
                    const response = await utils[request](
                        "GET", "v2/attribute-validations/validationrequest?attributeId=" + attribute.data.attributes[0].id + "&validator=" + VALIDATOR);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data).toHaveProperty(ATTRIBUTE_VALIDATION_REQUESTS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data.attribute_validation_requests).toHaveLength(1);
                    expect(response.data.attribute_validation_requests[0].status).toBe("DECLINED");
                    expect(response.data.attribute_validation_requests[0].attribute_id).toBe(attribute.data.attributes[0].id);

                });

                it('As a VALIDATOR, I want to Reject a validation request (OWNER, EMAIL) that is already declined. ' +
                    'EXPECTED : FAILURE. ERROR : VALIDATION_REQUEST_MISSING_IN_STATUS_FOR_ACTION', async () => {
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = EMAIL;
                    params.secret = VALIDATOR_SECRET;
                    params.publicKey = VALIDATOR_PUBLIC_KEY;
                    params.reason = REASON_FOR_REJECT_1024_GOOD;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/reject", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.VALIDATION_REQUEST_MISSING_IN_STATUS_FOR_ACTION);

                });

                it('As a PUBLIC user, I want to Get the details for a validation request (OWNER, EMAIL, VALIDATOR) that was declined and then rejected. ' +
                    'EXPECTED : SUCCESS. RESULT : 1 Result, with status DECLINED', async () => {
                    const attribute = await utils[request]("GET", "v2/attributes?owner=" + OWNER + "&type=" + EMAIL);
                    const response = await utils[request](
                        "GET", "v2/attribute-validations/validationrequest?attributeId=" + attribute.data.attributes[0].id + "&validator=" + VALIDATOR);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data).toHaveProperty(ATTRIBUTE_VALIDATION_REQUESTS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data.attribute_validation_requests).toHaveLength(1);
                    expect(response.data.attribute_validation_requests[0].status).toBe("DECLINED");
                    expect(response.data.attribute_validation_requests[0].attribute_id).toBe(attribute.data.attributes[0].id);

                });

                it('As a OWNER, I want to Cancel a validation request (OWNER, EMAIL) that is already declined. ' +
                    'EXPECTED : FAILURE. ERROR : VALIDATION_REQUEST_MISSING_IN_STATUS_FOR_ACTION', async () => {
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = EMAIL;
                    params.secret = SECRET;
                    params.publicKey = PUBLIC_KEY;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/cancel", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.VALIDATION_REQUEST_MISSING_IN_STATUS_FOR_ACTION);

                });

                it('As a PUBLIC user, I want to Get the details for a validation request (OWNER, EMAIL, VALIDATOR) that was declined and then canceled. ' +
                    'EXPECTED : SUCCESS. RESULT : 1 Result, with status DECLINED', async () => {
                    const attribute = await utils[request]("GET", "v2/attributes?owner=" + OWNER + "&type=" + EMAIL);
                    const response = await utils[request](
                        "GET", "v2/attribute-validations/validationrequest?attributeId=" + attribute.data.attributes[0].id + "&validator=" + VALIDATOR);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data).toHaveProperty(ATTRIBUTE_VALIDATION_REQUESTS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data.attribute_validation_requests).toHaveLength(1);
                    expect(response.data.attribute_validation_requests[0].status).toBe("DECLINED");
                    expect(response.data.attribute_validation_requests[0].attribute_id).toBe(attribute.data.attributes[0].id);

                });

                // Cancel

                it('As an OWNER, I want to Cancel a validation request (OWNER, PHONE_NUMBER, VALIDATOR_2) that is PENDING_APPROVAL. ' +
                    'EXPECTED : SUCCESS. RESULT : Transaction ID', async () =>{
                    let params = <any>{};
                    params.validator = VALIDATOR_2;
                    params.owner = OWNER;
                    params.type = PHONE_NUMBER;
                    params.secret = SECRET;
                    params.publicKey = PUBLIC_KEY;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/cancel", body);
                    sleep.msleep(SLEEP_TIME);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data).toHaveProperty(TRANSACTION_ID);

                });

                it('As a PUBLIC user, I want to Get the details for a validation request (OWNER, PHONE_NUMBER, VALIDATOR_2) that was correctly canceled. ' +
                    'EXPECTED : SUCCESS. RESULT : 1 Result, with status CANCELED', async () => {
                    const attribute = await utils[request]("GET", "v2/attributes?owner=" + OWNER + "&type=" + PHONE_NUMBER);
                    const response = await utils[request](
                        "GET", "v2/attribute-validations/validationrequest?attributeId=" + attribute.data.attributes[0].id + "&validator=" + VALIDATOR_2);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data).toHaveProperty(ATTRIBUTE_VALIDATION_REQUESTS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data.attribute_validation_requests).toHaveLength(1);
                    expect(response.data.attribute_validation_requests[0].status).toBe("CANCELED");
                    expect(response.data.attribute_validation_requests[0].attribute_id).toBe(attribute.data.attributes[0].id);

                });

                // Actions on a CANCELED validation request

                it('As a VALIDATOR, I want to Approve a validation request (OWNER, PHONE_NUMBER, VALIDATOR_2) which is already canceled. ' +
                    'EXPECTED : FAILURE. ERROR : VALIDATION_REQUEST_MISSING_IN_STATUS_FOR_ACTION', async () =>{
                    let params = <any>{};
                    params.validator = VALIDATOR_2;
                    params.owner = OWNER;
                    params.type = PHONE_NUMBER;
                    params.secret = VALIDATOR_SECRET_2;
                    params.publicKey = VALIDATOR_PUBLIC_KEY_2;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/approve", body);
                    sleep.msleep(SLEEP_TIME);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.VALIDATION_REQUEST_MISSING_IN_STATUS_FOR_ACTION);
                });

                it('As a PUBLIC user, I want to Get the details for a validation request (OWNER, PHONE_NUMBER, VALIDATOR_2) that was canceled and then approved. ' +
                    'EXPECTED : SUCCESS. RESULT : 1 Result, with status CANCELED', async () =>{
                    const attribute = await utils[request]("GET", "v2/attributes?owner=" + OWNER + "&type=" + PHONE_NUMBER);
                    const response = await utils[request](
                        "GET", "v2/attribute-validations/validationrequest?attributeId=" + attribute.data.attributes[0].id + "&validator=" + VALIDATOR_2);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data).toHaveProperty(ATTRIBUTE_VALIDATION_REQUESTS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data.attribute_validation_requests).toHaveLength(1);
                    expect(response.data.attribute_validation_requests[0].status).toBe("CANCELED");
                    expect(response.data.attribute_validation_requests[0].attribute_id).toBe(attribute.data.attributes[0].id);
                });

                it('As a VALIDATOR, I want to Decline a validation request (OWNER, PHONE_NUMBER, VALIDATOR_2) which is already canceled. ' +
                    'EXPECTED : FAILURE. ERROR : VALIDATION_REQUEST_MISSING_IN_STATUS_FOR_ACTION', async () =>{
                    let params = <any>{};
                    params.validator = VALIDATOR_2;
                    params.owner = OWNER;
                    params.type = PHONE_NUMBER;
                    params.secret = VALIDATOR_SECRET_2;
                    params.publicKey = VALIDATOR_PUBLIC_KEY_2;
                    params.reason = REASON_FOR_DECLINE_1024_GOOD;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/decline", body);
                    sleep.msleep(SLEEP_TIME);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.VALIDATION_REQUEST_MISSING_IN_STATUS_FOR_ACTION);

                });

                it('As a PUBLIC user, I want to Get the details for a validation request (OWNER, PHONE_NUMBER, VALIDATOR_2) that was canceled and then declined. ' +
                    'EXPECTED : SUCCESS. RESULT : 1 Result, with status CANCELED', async () =>{
                    const attribute = await utils[request]("GET", "v2/attributes?owner=" + OWNER + "&type=" + PHONE_NUMBER);
                    const response = await utils[request](
                        "GET", "v2/attribute-validations/validationrequest?attributeId=" + attribute.data.attributes[0].id + "&validator=" + VALIDATOR_2);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data).toHaveProperty(ATTRIBUTE_VALIDATION_REQUESTS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data.attribute_validation_requests).toHaveLength(1);
                    expect(response.data.attribute_validation_requests[0].status).toBe("CANCELED");
                    expect(response.data.attribute_validation_requests[0].attribute_id).toBe(attribute.data.attributes[0].id);
                });

                it('As a VALIDATOR, I want to Notarize a validation request (OWNER, PHONE_NUMBER, VALIDATOR_2) which is already canceled. ' +
                    'EXPECTED : FAILURE. ERROR : VALIDATION_REQUEST_MISSING_IN_STATUS_FOR_ACTION', async () =>{
                    let params = <any>{};
                    params.validator = VALIDATOR_2;
                    params.owner = OWNER;
                    params.type = PHONE_NUMBER;
                    params.secret = VALIDATOR_SECRET_2;
                    params.publicKey = VALIDATOR_PUBLIC_KEY_2;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/notarize", body);
                    sleep.msleep(SLEEP_TIME);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.VALIDATION_REQUEST_MISSING_IN_STATUS_FOR_ACTION);
                });

                it('As a PUBLIC user, I want to Get the details for a validation request (OWNER, PHONE_NUMBER, VALIDATOR_2) that was canceled and then notarized. ' +
                    'EXPECTED : SUCCESS. RESULT : 1 Result, with status CANCELED', async () =>{
                    const attribute = await utils[request]("GET", "v2/attributes?owner=" + OWNER + "&type=" + PHONE_NUMBER);
                    const response = await utils[request](
                        "GET", "v2/attribute-validations/validationrequest?attributeId=" + attribute.data.attributes[0].id + "&validator=" + VALIDATOR_2);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data).toHaveProperty(ATTRIBUTE_VALIDATION_REQUESTS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data.attribute_validation_requests).toHaveLength(1);
                    expect(response.data.attribute_validation_requests[0].status).toBe("CANCELED");
                    expect(response.data.attribute_validation_requests[0].attribute_id).toBe(attribute.data.attributes[0].id);
                });

                it('As a VALIDATOR, I want to Reject a validation request (OWNER, PHONE_NUMBER, VALIDATOR_2) which is already canceled. ' +
                    'EXPECTED : FAILURE. ERROR : VALIDATION_REQUEST_MISSING_IN_STATUS_FOR_ACTION', async () =>{
                    let params = <any>{};
                    params.validator = VALIDATOR_2;
                    params.owner = OWNER;
                    params.type = PHONE_NUMBER;
                    params.secret = VALIDATOR_SECRET_2;
                    params.publicKey = VALIDATOR_PUBLIC_KEY_2;
                    params.reason = REASON_FOR_REJECT_1024_GOOD;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/reject", body);
                    sleep.msleep(SLEEP_TIME);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data.error).toBe(messages.VALIDATION_REQUEST_MISSING_IN_STATUS_FOR_ACTION);

                });

                it('As a PUBLIC user, I want to Get the details for a validation request (OWNER, PHONE_NUMBER, VALIDATOR_2) that was canceled and then rejected. ' +
                    'EXPECTED : SUCCESS. RESULT : 1 Result, with status CANCELED', async () =>{
                    const attribute = await utils[request]("GET", "v2/attributes?owner=" + OWNER + "&type=" + PHONE_NUMBER);
                    const response = await utils[request](
                        "GET", "v2/attribute-validations/validationrequest?attributeId=" + attribute.data.attributes[0].id + "&validator=" + VALIDATOR_2);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data).toHaveProperty(ATTRIBUTE_VALIDATION_REQUESTS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data.attribute_validation_requests).toHaveLength(1);
                    expect(response.data.attribute_validation_requests[0].status).toBe("CANCELED");
                    expect(response.data.attribute_validation_requests[0].attribute_id).toBe(attribute.data.attributes[0].id);
                });

                it('As an OWNER, I want to Cancel a validation request (OWNER, PHONE_NUMBER, VALIDATOR_2) which is already canceled. ' +
                    'EXPECTED : FAILURE. ERROR : VALIDATION_REQUEST_MISSING_IN_STATUS_FOR_ACTION', async () =>{
                    let params = <any>{};
                    params.validator = VALIDATOR_2;
                    params.owner = OWNER;
                    params.type = PHONE_NUMBER;
                    params.secret = SECRET;
                    params.publicKey = PUBLIC_KEY;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/cancel", body);
                    sleep.msleep(SLEEP_TIME);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.VALIDATION_REQUEST_MISSING_IN_STATUS_FOR_ACTION);

                });

                it('As a PUBLIC user, I want to Get the details for a validation request (OWNER, PHONE_NUMBER, VALIDATOR_2) that was canceled twice. ' +
                    'EXPECTED : SUCCESS. RESULT : 1 Result, with status CANCELED', async () =>{
                    const attribute = await utils[request]("GET", "v2/attributes?owner=" + OWNER + "&type=" + PHONE_NUMBER);
                    const response = await utils[request](
                        "GET", "v2/attribute-validations/validationrequest?attributeId=" + attribute.data.attributes[0].id + "&validator=" + VALIDATOR_2);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data).toHaveProperty(ATTRIBUTE_VALIDATION_REQUESTS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data.attribute_validation_requests).toHaveLength(1);
                    expect(response.data.attribute_validation_requests[0].status).toBe("CANCELED");
                    expect(response.data.attribute_validation_requests[0].attribute_id).toBe(attribute.data.attributes[0].id);
                });

                // Unsuccessful Notarization

                it('As a VALIDATOR, I want to Notarize a validation request (OWNER, PHONE_NUMBER, VALIDATOR) without providing a validation type. ' +
                    'EXPECTED : FAILURE. ERROR : MISSING_VALIDATION_TYPE', async () => {
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = PHONE_NUMBER;
                    params.secret = VALIDATOR_SECRET;
                    params.publicKey = VALIDATOR_PUBLIC_KEY;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/notarize", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.MISSING_VALIDATION_TYPE);
                });

                it('As a VALIDATOR, I want to Notarize a validation request (OWNER, PHONE_NUMBER, VALIDATOR) by providing an incorrect validation type. ' +
                    'EXPECTED : FAILURE. ERROR : INCORRECT_VALIDATION_TYPE', async () => {
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = PHONE_NUMBER;
                    params.secret = VALIDATOR_SECRET;
                    params.publicKey = VALIDATOR_PUBLIC_KEY;
                    params.validationType = 'MAN#BAD'
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/notarize", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.INCORRECT_VALIDATION_TYPE);
                });

                it('As a PUBLIC user, I want to Get the details for a validation request (OWNER, PHONE_NUMBER, VALIDATOR) that was incorrectly notarized. ' +
                    'EXPECTED : SUCCESS. RESULT : 1 Result, with status IN_PROGRESS', async () => {
                    const attribute = await utils[request]("GET", "v2/attributes?owner=" + OWNER + "&type=" + PHONE_NUMBER);
                    const response = await utils[request](
                        "GET", "v2/attribute-validations/validationrequest?attributeId=" + attribute.data.attributes[0].id + "&validator=" + VALIDATOR);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data).toHaveProperty(ATTRIBUTE_VALIDATION_REQUESTS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data.attribute_validation_requests).toHaveLength(1);
                    expect(response.data.attribute_validation_requests[0].status).toBe("IN_PROGRESS");
                    expect(response.data.attribute_validation_requests[0].attribute_id).toBe(attribute.data.attributes[0].id);


                });

                //Notarization

                it('As a VALIDATOR, I want to Notarize a validation request (OWNER, PHONE_NUMBER, VALIDATOR) correctly. ' +
                    'EXPECTED : SUCCESS. RESULT : Transaction ID' , async () => {
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = PHONE_NUMBER;
                    params.secret = VALIDATOR_SECRET;
                    params.publicKey = VALIDATOR_PUBLIC_KEY;
                    params.validationType = 'FACE_TO_FACE';
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/notarize", body);
                    sleep.msleep(SLEEP_TIME);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data).toHaveProperty(TRANSACTION_ID);

                });

                it('As a PUBLIC user, I want to Get the details for a validation request (OWNER, PHONE_NUMBER, VALIDATOR) that was correctly notarized. ' +
                    'EXPECTED : SUCCESS. RESULT : 1 Result, with status COMPLETED', async () => {

                    const attribute = await utils[request]("GET", "v2/attributes?owner=" + OWNER + "&type=" + PHONE_NUMBER);
                    const response = await utils[request](
                        "GET", "v2/attribute-validations/validationrequest?attributeId=" + attribute.data.attributes[0].id + "&validator=" + VALIDATOR);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data).toHaveProperty(ATTRIBUTE_VALIDATION_REQUESTS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data.attribute_validation_requests).toHaveLength(1);
                    expect(response.data.attribute_validation_requests[0].status).toBe("COMPLETED");
                    expect(response.data.attribute_validation_requests[0].attribute_id).toBe(attribute.data.attributes[0].id);
                });

                it('As an OWNER, I want to Create a validation request for an attribute (PHONE_NUMBER, VALIDATOR) which already has a COMPLETED validation request. ' +
                    'EXPECTED : FAILURE. ERROR : COMPLETED_VALIDATION_REQUEST_ALREADY_EXISTS', async () => {
                        let params = <any>{};
                        params.owner = OWNER;
                        params.validator = VALIDATOR;
                        params.type = PHONE_NUMBER;

                        let body = createAttributeValidationRequestBody(params);
                        const response = await utils[request]("POST", "v2/attribute-validations/validationrequest", body);
                        sleep.msleep(SLEEP_TIME);
                        expect(response.data).toHaveProperty(SUCCESS);
                        expect(response.data.success).toBe(FALSE);
                        expect(response.data).toHaveProperty(ERROR);
                        expect(response.data.error).toBe(messages.COMPLETED_VALIDATION_REQUEST_ALREADY_EXISTS);
                });

                // Actions on a COMPLETED validation request

                it('As a VALIDATOR, I want to Approve a validation request (OWNER, PHONE_NUMBER, VALIDATOR) which is already completed. ' +
                    'EXPECTED : FAILURE. ERROR : VALIDATION_REQUEST_MISSING_IN_STATUS_FOR_ACTION', async () =>{
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = PHONE_NUMBER;
                    params.secret = VALIDATOR_SECRET;
                    params.publicKey = VALIDATOR_PUBLIC_KEY;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/approve", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.VALIDATION_REQUEST_MISSING_IN_STATUS_FOR_ACTION);
                });

                it('As a PUBLIC user, I want to Get the details for a validation request (OWNER, PHONE_NUMBER, VALIDATOR) that was notarized and then approved. ' +
                    'EXPECTED : SUCCESS. RESULT : 1 Result, with status COMPLETED', async () =>{
                    const attribute = await utils[request]("GET", "v2/attributes?owner=" + OWNER + "&type=" + PHONE_NUMBER);
                    const response = await utils[request](
                        "GET", "v2/attribute-validations/validationrequest?attributeId=" + attribute.data.attributes[0].id + "&validator=" + VALIDATOR);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data).toHaveProperty(ATTRIBUTE_VALIDATION_REQUESTS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data.attribute_validation_requests).toHaveLength(1);
                    expect(response.data.attribute_validation_requests[0].status).toBe("COMPLETED");
                    expect(response.data.attribute_validation_requests[0].attribute_id).toBe(attribute.data.attributes[0].id);
                });

                it('As a VALIDATOR, I want to Decline a validation request (OWNER, PHONE_NUMBER, VALIDATOR) which is already completed. ' +
                    'EXPECTED : FAILURE. ERROR : VALIDATION_REQUEST_MISSING_IN_STATUS_FOR_ACTION', async () =>{
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = PHONE_NUMBER;
                    params.secret = VALIDATOR_SECRET;
                    params.publicKey = VALIDATOR_PUBLIC_KEY;
                    params.reason = REASON_FOR_DECLINE_1024_GOOD;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/decline", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.VALIDATION_REQUEST_MISSING_IN_STATUS_FOR_ACTION);

                });

                it('As a PUBLIC user, I want to Get the details for a validation request (OWNER, PHONE_NUMBER, VALIDATOR) that was notarized and then declined. ' +
                    'EXPECTED : SUCCESS. RESULT : 1 Result, with status COMPLETED', async () =>{
                    const attribute = await utils[request]("GET", "v2/attributes?owner=" + OWNER + "&type=" + PHONE_NUMBER);
                    const response = await utils[request](
                        "GET", "v2/attribute-validations/validationrequest?attributeId=" + attribute.data.attributes[0].id + "&validator=" + VALIDATOR);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data).toHaveProperty(ATTRIBUTE_VALIDATION_REQUESTS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data.attribute_validation_requests).toHaveLength(1);
                    expect(response.data.attribute_validation_requests[0].status).toBe("COMPLETED");
                    expect(response.data.attribute_validation_requests[0].attribute_id).toBe(attribute.data.attributes[0].id);
                });

                it('As a VALIDATOR, I want to Notarize a validation request (OWNER, PHONE_NUMBER, VALIDATOR) which is already completed. ' +
                    'EXPECTED : FAILURE. ERROR : VALIDATION_REQUEST_MISSING_IN_STATUS_FOR_ACTION', async () =>{
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = PHONE_NUMBER;
                    params.secret = VALIDATOR_SECRET;
                    params.publicKey = VALIDATOR_PUBLIC_KEY;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/notarize", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.VALIDATION_REQUEST_MISSING_IN_STATUS_FOR_ACTION);
                });

                it('As a PUBLIC user, I want to Get the details for a validation request (OWNER, PHONE_NUMBER, VALIDATOR) that was notarized twice. ' +
                    'EXPECTED : SUCCESS. RESULT : 1 Result, with status COMPLETED', async () =>{
                    const attribute = await utils[request]("GET", "v2/attributes?owner=" + OWNER + "&type=" + PHONE_NUMBER);
                    const response = await utils[request](
                        "GET", "v2/attribute-validations/validationrequest?attributeId=" + attribute.data.attributes[0].id + "&validator=" + VALIDATOR);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data).toHaveProperty(ATTRIBUTE_VALIDATION_REQUESTS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data.attribute_validation_requests).toHaveLength(1);
                    expect(response.data.attribute_validation_requests[0].status).toBe("COMPLETED");
                    expect(response.data.attribute_validation_requests[0].attribute_id).toBe(attribute.data.attributes[0].id);
                });

                it('As a VALIDATOR, I want to Reject a validation request (OWNER, PHONE_NUMBER, VALIDATOR) which is already completed. ' +
                    'EXPECTED : FAILURE. ERROR : VALIDATION_REQUEST_MISSING_IN_STATUS_FOR_ACTION', async () =>{
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = PHONE_NUMBER;
                    params.secret = VALIDATOR_SECRET;
                    params.publicKey = VALIDATOR_PUBLIC_KEY;
                    params.reason = REASON_FOR_REJECT_1024_GOOD;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/reject", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data.error).toBe(messages.VALIDATION_REQUEST_MISSING_IN_STATUS_FOR_ACTION);

                });

                it('As a PUBLIC user, I want to Get the details for a validation request (OWNER, PHONE_NUMBER, VALIDATOR) that was notarized and then rejected. ' +
                    'EXPECTED : SUCCESS. RESULT : 1 Result, with status COMPLETED', async () =>{
                    const attribute = await utils[request]("GET", "v2/attributes?owner=" + OWNER + "&type=" + PHONE_NUMBER);
                    const response = await utils[request](
                        "GET", "v2/attribute-validations/validationrequest?attributeId=" + attribute.data.attributes[0].id + "&validator=" + VALIDATOR);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data).toHaveProperty(ATTRIBUTE_VALIDATION_REQUESTS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data.attribute_validation_requests).toHaveLength(1);
                    expect(response.data.attribute_validation_requests[0].status).toBe("COMPLETED");
                    expect(response.data.attribute_validation_requests[0].attribute_id).toBe(attribute.data.attributes[0].id);
                });

                it('As an OWNER, I want to Cancel a validation request (OWNER, PHONE_NUMBER, VALIDATOR) which is already completed. ' +
                    'EXPECTED : FAILURE. ERROR : VALIDATION_REQUEST_MISSING_IN_STATUS_FOR_ACTION', async () =>{
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = PHONE_NUMBER;
                    params.secret = SECRET;
                    params.publicKey = PUBLIC_KEY;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/cancel", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.VALIDATION_REQUEST_MISSING_IN_STATUS_FOR_ACTION);

                });

                it('As a PUBLIC user, I want to Get the details for a validation request (OWNER, PHONE_NUMBER, VALIDATOR) that was notarized and then canceled. ' +
                    'EXPECTED : SUCCESS. RESULT : 1 Result, with status COMPLETED', async () =>{
                    const attribute = await utils[request]("GET", "v2/attributes?owner=" + OWNER + "&type=" + PHONE_NUMBER);
                    const response = await utils[request](
                        "GET", "v2/attribute-validations/validationrequest?attributeId=" + attribute.data.attributes[0].id + "&validator=" + VALIDATOR);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data).toHaveProperty(ATTRIBUTE_VALIDATION_REQUESTS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data.attribute_validation_requests).toHaveLength(1);
                    expect(response.data.attribute_validation_requests[0].status).toBe("COMPLETED");
                    expect(response.data.attribute_validation_requests[0].attribute_id).toBe(attribute.data.attributes[0].id);
                });

                // Reject

                it('As a VALIDATOR, I want to Reject a validation request (OWNER, BIRTHPLACE) by providing a reason that is too long (1025 characters). ' +
                    'EXPECTED : FAILURE. ERROR : REASON_TOO_BIG_REJECT', async () => {
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = BIRTHPLACE;
                    params.reason = REASON_FOR_REJECT_1025_TOO_LONG;
                    params.secret = VALIDATOR_SECRET;
                    params.publicKey = VALIDATOR_PUBLIC_KEY;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/reject", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.REASON_TOO_BIG_REJECT);

                });

                it('As a VALIDATOR, I want to Reject a validation request (OWNER, BIRTHPLACE) without providing a reason for the rejection. ' +
                    'EXPECTED : FAILURE. ERROR : REJECT_ATTRIBUTE_VALIDATION_REQUEST_NO_REASON', async () => {
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = BIRTHPLACE;
                    params.secret = VALIDATOR_SECRET;
                    params.publicKey = VALIDATOR_PUBLIC_KEY;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/reject", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.REJECT_ATTRIBUTE_VALIDATION_REQUEST_NO_REASON);
                });

                it('As a VALIDATOR, I want to Reject a validation request (OWNER, BIRTHPLACE) by providing a reason that is of maximum length (1024 characters). ' +
                    'EXPECTED : SUCCESS. RESULT : Transaction ID', async () => {
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = BIRTHPLACE;
                    params.reason = REASON_FOR_REJECT_1024_GOOD;
                    params.secret = VALIDATOR_SECRET;
                    params.publicKey = VALIDATOR_PUBLIC_KEY;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/reject", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data).toHaveProperty(TRANSACTION_ID);
                });

                it('As a PUBLIC user, I want to Get the details for a validation request (OWNER, BIRTHPLACE, VALIDATOR) that was correctly rejected. ' +
                    'EXPECTED : SUCCESS. RESULT : 1 Result, with status REJECTED', async () => {

                    const attribute = await utils[request]("GET", "v2/attributes?owner=" + OWNER + "&type=" + BIRTHPLACE);
                        const response = await utils[request](
                            "GET", "v2/attribute-validations/validationrequest?attributeId=" + attribute.data.attributes[0].id + "&validator=" + VALIDATOR);
                        expect(response.data).toHaveProperty(SUCCESS);
                        expect(response.data).toHaveProperty(ATTRIBUTE_VALIDATION_REQUESTS);
                        expect(response.data.success).toBe(TRUE);
                        expect(response.data.attribute_validation_requests).toHaveLength(1);
                        expect(response.data.attribute_validation_requests[0].status).toBe("REJECTED");
                        expect(response.data.attribute_validation_requests[0].attribute_id).toBe(attribute.data.attributes[0].id);
                });

                // Actions on a REJECTED validation request

                it('As a VALIDATOR, I want to Approve a validation request (OWNER, BIRTHPLACE, VALIDATOR) which is already rejected. ' +
                    'EXPECTED : FAILURE. ERROR : VALIDATION_REQUEST_MISSING_IN_STATUS_FOR_ACTION', async () =>{
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = BIRTHPLACE;
                    params.secret = VALIDATOR_SECRET;
                    params.publicKey = VALIDATOR_PUBLIC_KEY;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/approve", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.VALIDATION_REQUEST_MISSING_IN_STATUS_FOR_ACTION);
                });

                it('As a PUBLIC user, I want to Get the details for a validation request (OWNER, BIRTHPLACE, VALIDATOR) that was rejected and then approved. ' +
                    'EXPECTED : SUCCESS. RESULT : 1 Result, with status REJECTED', async () =>{
                    const attribute = await utils[request]("GET", "v2/attributes?owner=" + OWNER + "&type=" + BIRTHPLACE);
                    const response = await utils[request](
                        "GET", "v2/attribute-validations/validationrequest?attributeId=" + attribute.data.attributes[0].id + "&validator=" + VALIDATOR);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data).toHaveProperty(ATTRIBUTE_VALIDATION_REQUESTS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data.attribute_validation_requests).toHaveLength(1);
                    expect(response.data.attribute_validation_requests[0].status).toBe("REJECTED");
                    expect(response.data.attribute_validation_requests[0].attribute_id).toBe(attribute.data.attributes[0].id);
                });

                it('As a VALIDATOR, I want to Decline a validation request (OWNER, BIRTHPLACE, VALIDATOR) which is already rejected. ' +
                    'EXPECTED : FAILURE. ERROR : VALIDATION_REQUEST_MISSING_IN_STATUS_FOR_ACTION', async () =>{
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = BIRTHPLACE;
                    params.secret = VALIDATOR_SECRET;
                    params.publicKey = VALIDATOR_PUBLIC_KEY;
                    params.reason = REASON_FOR_DECLINE_1024_GOOD;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/decline", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.VALIDATION_REQUEST_MISSING_IN_STATUS_FOR_ACTION);

                });

                it('As a PUBLIC user, I want to Get the details for a validation request (OWNER, BIRTHPLACE, VALIDATOR) that was rejected and then declined. ' +
                    'EXPECTED : SUCCESS. RESULT : 1 Result, with status REJECTED', async () =>{
                    const attribute = await utils[request]("GET", "v2/attributes?owner=" + OWNER + "&type=" + BIRTHPLACE);
                    const response = await utils[request](
                        "GET", "v2/attribute-validations/validationrequest?attributeId=" + attribute.data.attributes[0].id + "&validator=" + VALIDATOR);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data).toHaveProperty(ATTRIBUTE_VALIDATION_REQUESTS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data.attribute_validation_requests).toHaveLength(1);
                    expect(response.data.attribute_validation_requests[0].status).toBe("REJECTED");
                    expect(response.data.attribute_validation_requests[0].attribute_id).toBe(attribute.data.attributes[0].id);
                });

                it('As a VALIDATOR, I want to Notarize a validation request (OWNER, BIRTHPLACE, VALIDATOR) which is already rejected. ' +
                    'EXPECTED : FAILURE. ERROR : VALIDATION_REQUEST_MISSING_IN_STATUS_FOR_ACTION', async () =>{
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = BIRTHPLACE;
                    params.secret = VALIDATOR_SECRET;
                    params.publicKey = VALIDATOR_PUBLIC_KEY;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/notarize", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.VALIDATION_REQUEST_MISSING_IN_STATUS_FOR_ACTION);
                });

                it('As a PUBLIC user, I want to Get the details for a validation request (OWNER, BIRTHPLACE, VALIDATOR) that was rejected and then notarized. ' +
                    'EXPECTED : SUCCESS. RESULT : 1 Result, with status REJECTED', async () =>{
                    const attribute = await utils[request]("GET", "v2/attributes?owner=" + OWNER + "&type=" + BIRTHPLACE);
                    const response = await utils[request](
                        "GET", "v2/attribute-validations/validationrequest?attributeId=" + attribute.data.attributes[0].id + "&validator=" + VALIDATOR);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data).toHaveProperty(ATTRIBUTE_VALIDATION_REQUESTS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data.attribute_validation_requests).toHaveLength(1);
                    expect(response.data.attribute_validation_requests[0].status).toBe("REJECTED");
                    expect(response.data.attribute_validation_requests[0].attribute_id).toBe(attribute.data.attributes[0].id);
                });

                it('As a VALIDATOR, I want to Reject a validation request (OWNER, BIRTHPLACE, VALIDATOR) which is already rejected. ' +
                    'EXPECTED : FAILURE. ERROR : VALIDATION_REQUEST_MISSING_IN_STATUS_FOR_ACTION', async () =>{
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = BIRTHPLACE;
                    params.secret = VALIDATOR_SECRET;
                    params.publicKey = VALIDATOR_PUBLIC_KEY;
                    params.reason = REASON_FOR_REJECT_1024_GOOD;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/reject", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data.error).toBe(messages.VALIDATION_REQUEST_MISSING_IN_STATUS_FOR_ACTION);

                });

                it('As a PUBLIC user, I want to Get the details for a validation request (OWNER, BIRTHPLACE, VALIDATOR) that was rejected twice. ' +
                    'EXPECTED : SUCCESS. RESULT : 1 Result, with status REJECTED', async () =>{
                    const attribute = await utils[request]("GET", "v2/attributes?owner=" + OWNER + "&type=" + BIRTHPLACE);
                    const response = await utils[request](
                        "GET", "v2/attribute-validations/validationrequest?attributeId=" + attribute.data.attributes[0].id + "&validator=" + VALIDATOR);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data).toHaveProperty(ATTRIBUTE_VALIDATION_REQUESTS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data.attribute_validation_requests).toHaveLength(1);
                    expect(response.data.attribute_validation_requests[0].status).toBe("REJECTED");
                    expect(response.data.attribute_validation_requests[0].attribute_id).toBe(attribute.data.attributes[0].id);
                });

                it('As an OWNER, I want to Cancel a validation request (OWNER, BIRTHPLACE, VALIDATOR) which is already rejected. ' +
                    'EXPECTED : FAILURE. ERROR : VALIDATION_REQUEST_MISSING_IN_STATUS_FOR_ACTION', async () =>{
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = BIRTHPLACE;
                    params.secret = SECRET;
                    params.publicKey = PUBLIC_KEY;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/cancel", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.VALIDATION_REQUEST_MISSING_IN_STATUS_FOR_ACTION);

                });

                it('As a PUBLIC user, I want to Get the details for a validation request (OWNER, BIRTHPLACE, VALIDATOR) that was rejected and then canceled. ' +
                    'EXPECTED : SUCCESS. RESULT : 1 Result, with status REJECTED', async () =>{
                    const attribute = await utils[request]("GET", "v2/attributes?owner=" + OWNER + "&type=" + BIRTHPLACE);
                    const response = await utils[request](
                        "GET", "v2/attribute-validations/validationrequest?attributeId=" + attribute.data.attributes[0].id + "&validator=" + VALIDATOR);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data).toHaveProperty(ATTRIBUTE_VALIDATION_REQUESTS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data.attribute_validation_requests).toHaveLength(1);
                    expect(response.data.attribute_validation_requests[0].status).toBe("REJECTED");
                    expect(response.data.attribute_validation_requests[0].attribute_id).toBe(attribute.data.attributes[0].id);
                });

                // Validation Actions on an attribute that does not exist

                it('As a VALIDATOR, I want to Approve a validation request (OWNER, SSN) for an attribute that does not exist. ' +
                    'EXPECTED : FAILURE. ERROR : ATTRIBUTE_NOT_FOUND', async () =>{
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = SSN;
                    params.secret = VALIDATOR_SECRET;
                    params.publicKey = VALIDATOR_PUBLIC_KEY;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/approve", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.ATTRIBUTE_NOT_FOUND);

                });

                it('As an VALIDATOR, I want to Decline a validation request (OWNER, SSN) for an attribute that does not exist. ' +
                    'EXPECTED : FAILURE. ERROR : ATTRIBUTE_NOT_FOUND', async () =>{
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = SSN;
                    params.secret = VALIDATOR_SECRET;
                    params.publicKey = VALIDATOR_PUBLIC_KEY;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/decline", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.ATTRIBUTE_NOT_FOUND);

                });

                it('As an VALIDATOR, I want to Notarize a validation request (OWNER, SSN) for an attribute that does not exist. ' +
                    'EXPECTED : FAILURE. ERROR : ATTRIBUTE_NOT_FOUND', async () =>{
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = SSN;
                    params.secret = VALIDATOR_SECRET;
                    params.publicKey = VALIDATOR_PUBLIC_KEY;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/notarize", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.ATTRIBUTE_NOT_FOUND);

                });

                it('As an VALIDATOR, I want to Reject a validation request (OWNER, SSN) for an attribute that does not exist. ' +
                    'EXPECTED : FAILURE. ERROR : ATTRIBUTE_NOT_FOUND', async () =>{
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = SSN;
                    params.secret = VALIDATOR_SECRET;
                    params.publicKey = VALIDATOR_PUBLIC_KEY;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/reject", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.ATTRIBUTE_NOT_FOUND);

                });

                it('As an OWNER, I want to Cancel a validation request (OWNER, SSN) for an attribute that does not exist. ' +
                    'EXPECTED : FAILURE. ERROR : ATTRIBUTE_NOT_FOUND', async () =>{
                    let params = <any>{};
                    params.validator = VALIDATOR;
                    params.owner = OWNER;
                    params.type = SSN;
                    params.secret = SECRET;
                    params.publicKey = PUBLIC_KEY;
                    let body = createAnswerAttributeValidationRequest(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/cancel", body);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.ATTRIBUTE_NOT_FOUND);

                });
            });
    });

    describe("Attribute Validation Score", () => {
        describe.each([["Accept", "requestWithAcceptHeader"]])(
            "Attribute Validation Score",
            (header, request) => {
                it('As a PUBLIC user, I want to Get the validation score for an attribute that does not exist. ' +
                    'EXPECTED : FAILURE. ERROR : ATTRIBUTE_NOT_FOUND', async () => {

                    const response = await utils[request]("GET", "v2/attribute-validations/validationscore?type=mothers_name&owner=" + OWNER);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.ATTRIBUTE_NOT_FOUND);
                });

                it('As a PUBLIC user, I want to Get the validation score for an attribute that has no completed validations. ' +
                    'EXPECTED : SUCCESS. RESULT : 1 Result, with "attribute_validations" = 0', async () => {

                    const response = await utils[request]("GET", "v2/attribute-validations/validationscore?type=address&owner=" + OWNER);
                    console.log(response.data)
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data).toHaveProperty(ATTRIBUTE_VALIDATIONS);
                    expect(response.data.attribute_validations).toBe(0);
                    sleep.msleep(SLEEP_TIME);
                });

                it('As a PUBLIC user, I want to Get the validation score for an attribute that has 1 completed validation. ' +
                    'EXPECTED : SUCCESS. RESULT : 1 Result, with "attribute_validations" = 1', async () => {

                    const response = await utils[request]("GET", "v2/attribute-validations/validationscore?type=phone_number&owner=" + OWNER);
                    console.log(response.data)
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data).toHaveProperty(ATTRIBUTE_VALIDATIONS);
                    expect(response.data.attribute_validations).toBe(1);
                    sleep.msleep(SLEEP_TIME);
                });
            })
    })

    describe("Attribute Credibility", () => {
        describe.each([["Accept", "requestWithAcceptHeader"]])(
            "Attribute Credibility",
            (header, request) => {

                it('As a PUBLIC user, I want to Get the credibility/trust points by only providing the months parameter. ' +
                    'EXPECTED : FAILURE. ERROR : INCORRECT_CREDIBILITY_PARAMETERS', async () => {
                    const response = await utils[request]("GET", "v2/attribute-validations/credibility?months=1");
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.INCORRECT_CREDIBILITY_PARAMETERS);
                });

                it('As a PUBLIC user, I want to Get the credibility/trust points by providing both the owner and the attributeId. ' +
                    'EXPECTED : FAILURE. ERROR : INCORRECT_CREDIBILITY_PARAMETERS', async () => {
                    const response = await utils[request]("GET", "v2/attribute-validations/credibility?months=1&attributeId=1&owner=" + OWNER);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.INCORRECT_CREDIBILITY_PARAMETERS);
                });

                it('As a PUBLIC user, I want to Get the credibility/trust points for an attribute without providing the months parameter. ' +
                        'EXPECTED : FAILURE. ERROR : MISSING_MONTHS', async () => {
                    const response = await utils[request]("GET", "v2/attribute-validations/credibility?attributeId=1&owner=" + OWNER);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.MISSING_MONTHS);
                });

                it('As a PUBLIC user, I want to Get the credibility/trust points for an attribute by providing a negative value for the months parameter. ' +
                        'EXPECTED : FAILURE. ERROR : INCORRECT_MONTHS_VALUE', async () => {
                    const response = await utils[request]("GET", "v2/attribute-validations/credibility?months=-1&attributeId=1");
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.INCORRECT_MONTHS_VALUE);
                });

                it('As a PUBLIC user, I want to Get the credibility/trust points for an attribute by providing 0 as value for the months parameter. ' +
                    'EXPECTED : FAILURE. ERROR : INCORRECT_MONTHS_VALUE', async () => {
                    const response = await utils[request]("GET", "v2/attribute-validations/credibility?months=0&attributeId=1");
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.INCORRECT_MONTHS_VALUE);
                });

                it('As a PUBLIC user, I want to Get the attribute credibility for an attribute that does not exist. ' +
                    'EXPECTED : FAILURE. ERROR : ATTRIBUTE_NOT_FOUND', async () => {

                    const response = await utils[request]("GET", "v2/attribute-validations/credibility?months=1&type=mothers_name&owner=" + OWNER);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(FALSE);
                    expect(response.data).toHaveProperty(ERROR);
                    expect(response.data.error).toBe(messages.ATTRIBUTE_NOT_FOUND);
                });

                it('As a PUBLIC user, I want to Get the credibility/trust points for an attribute (OWNER, ADDRESS) that has no completed validations. ' +
                    'EXPECTED : SUCCESS. RESULT : 1 Result, with "trust_points" = 0', async () => {
                    const response = await utils[request]("GET", "v2/attribute-validations/credibility?months=1&type=address&owner=" + OWNER);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data).toHaveProperty(TRUST_POINTS);
                    expect(response.data.trust_points).toBe(0);
                });

                it('As a PUBLIC user, I want to Get the credibility/trust points for an attribute (OWNER, PHONE_NUMBER) that has 1 completed validation. ' +
                    'EXPECTED : SUCCESS. RESULT : 1 Result, with "trust_points" =  1', async () => {
                    const response = await utils[request]("GET", "v2/attribute-validations/credibility?months=1&type=phone_number&owner=" + OWNER);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data).toHaveProperty(TRUST_POINTS);
                    expect(response.data.trust_points).toBe(1);
                });

            })
    })

    describe("Existing requests", () => {
        describe.each([["Accept", "requestWithAcceptHeader"]])(
            "Existing requests",
            (header, request) => {

                it('As an OWNER, I want to Create a validation request (OWNER, BIRTHPLACE), even though a rejected request already exists. ' +
                    'EXPECTED : SUCCESS. RESULT : Transaction ID', async () => {
                    let params = <any>{};
                    params.owner = OWNER;
                    params.validator = VALIDATOR;
                    params.type = BIRTHPLACE;

                    let body = createAttributeValidationRequestBody(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/validationrequest", body);
                    sleep.msleep(SLEEP_TIME);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data).toHaveProperty(TRANSACTION_ID);
                })

                it('As an OWNER, I want to Create a validation request (OWNER, EMAIL), even though a declined request already exists. ' +
                    'EXPECTED : SUCCESS. RESULT : Transaction ID', async () => {
                    let params = <any>{};
                    params.owner = OWNER;
                    params.validator = VALIDATOR;
                    params.type = EMAIL;

                    let body = createAttributeValidationRequestBody(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/validationrequest", body);
                    sleep.msleep(SLEEP_TIME);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data).toHaveProperty(TRANSACTION_ID);

                });

                it('Create a validation request (OWNER, PHONE_NUMBER, VALIDATOR_2) even though a canceled request already exists. ' +
                    'EXPECTED : SUCCESS. RESULT : Transaction ID', async () => {
                    let params = <any>{};
                    params.owner = OWNER;
                    params.validator = VALIDATOR_2;
                    params.type = PHONE_NUMBER;

                    let body = createAttributeValidationRequestBody(params);
                    const response = await utils[request]("POST", "v2/attribute-validations/validationrequest", body);
                    sleep.msleep(SLEEP_TIME);
                    expect(response.data).toHaveProperty(SUCCESS);
                    expect(response.data.success).toBe(TRUE);
                    expect(response.data).toHaveProperty(TRANSACTION_ID);
                })


            })
    })

});

function createAttributeBody(param) {
    let request = <any>{};
    if (!param) {
        param = {};
    }
    request.secret = param.secret ? param.secret : SECRET;
    request.publicKey = param.publicKey ? param.publicKey : PUBLIC_KEY;
    request.asset = {};
    request.asset.attribute = [];
    request.asset.attribute[0] = {};
    request.asset.attribute[0].type = param.type ? param.type : FIRST_NAME;
    request.asset.attribute[0].owner = param.owner ? param.owner : OWNER;
    request.asset.attribute[0].value = param.value ? param.value : NAME_VALUE;
    if (param.associations) {
        request.asset.attribute[0].associations = param.associations;
    }
    if (param.expire_timestamp) {
        request.asset.attribute[0].expire_timestamp = param.expire_timestamp;
    }

    return request;
}

function createAttributeValidationRequestBody(param) {

    let request = <any>{};
    if (!param) {
        param = {}
    }
    request.secret = param.secret ? param.secret : SECRET;
    request.publicKey = param.publicKey ? param.publicKey : PUBLIC_KEY;
    request.asset = {};
    request.asset.validation = [];
    request.asset.validation[0] = {};
    if (param.type) {
        request.asset.validation[0].type = param.type;
    }
    if (param.attributeId) {
        request.asset.validation[0].attributeId = param.attributeId;
    }
    request.asset.validation[0].owner = param.owner ? param.owner : OWNER;
    request.asset.validation[0].validator = param.validator ? param.validator : VALIDATOR;

    console.log(request);
    return request;
}

function createAnswerAttributeValidationRequest(param) {
    let request = <any>{};
    if (!param) {
        param = {}
    }
    request.secret = param.secret ? param.secret : SECRET;
    request.publicKey = param.publicKey ? param.publicKey : PUBLIC_KEY;
    request.asset = {};
    request.asset.validation = [];
    request.asset.validation[0] = {};
    request.asset.validation[0].owner = param.owner ? param.owner : OWNER;
    request.asset.validation[0].validator = param.validator ? param.validator : VALIDATOR;
    if (param.type) {
        request.asset.validation[0].type = param.type;
    }
    if (param.attributeId) {
        request.asset.validation[0].attributeId = param.attributeId;
    }
    if (param.validationType){
        request.asset.validation[0].validationType = param.validationType;
    }
    if (param.reason){
        request.asset.validation[0].reason = param.reason;
    }

    console.log(request);
    return request;
}

