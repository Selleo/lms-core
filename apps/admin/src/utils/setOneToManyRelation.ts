import {
  owningRelationSettingsFeature,
  RelationType,
} from "@adminjs/relations";
import { FeatureType } from "adminjs";
import { componentLoader } from "../components/index.js";

type SetRelationsType = {
  resourceId: string;
  joinKey: string;
};

export const setOneToManyRelation = ({
  resourceId,
  joinKey,
}: SetRelationsType): FeatureType =>
  owningRelationSettingsFeature({
    licenseKey: process.env.LICENSE_KEY || "",
    componentLoader,
    relations: {
      [resourceId]: {
        type: RelationType.OneToMany,
        target: {
          resourceId,
          joinKey,
        },
      },
    },
  });
