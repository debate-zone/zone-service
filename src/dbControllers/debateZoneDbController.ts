import { BaseDbController } from '../../../../debate-zone-micro-service-common-library/src/mongoose/baseDbController';
import {DebateZone} from "../types";
import {debateZoneMongooseModel} from "../mongooseSchemas/debateZoneMongooseSchema";

class DebateZoneDbController extends BaseDbController<DebateZone> {}

export const debateZoneDbController = new DebateZoneDbController(debateZoneMongooseModel);
