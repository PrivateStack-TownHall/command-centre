import { APPLICATION_CONFIG } from "./application.config";

import {
  listPublicFeatureApplications,
  type PublicFeature,
} from "../utils/public-endpoints";

/** Applications for a cross-app page, read from APPLICATION_CONFIG. */
export function getPublicFeatureApplications(feature: PublicFeature) {
  return listPublicFeatureApplications(APPLICATION_CONFIG, feature);
}
