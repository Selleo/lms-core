import {
  owningRelationSettingsFeature,
  RelationType,
} from "@adminjs/relations";
import { FeatureType } from "adminjs";
import { componentLoader } from "../components/index.js";

type SetRelationsType = {
  resourceId: string;
  joinKey: string;
  inverseJoinKey: string;
  throughResourceId: string;
  enableDeleteRelation: boolean;
  enableDeleteRelatedRecord: boolean;
};

export const setManyToManyRelation = ({
  resourceId,
  joinKey,
  inverseJoinKey,
  throughResourceId,
  enableDeleteRelation,
  enableDeleteRelatedRecord,
}: SetRelationsType): FeatureType =>
  owningRelationSettingsFeature({
    componentLoader,
    licenseKey: process.env.LICENSE_KEY ?? "",
    relations: {
      [resourceId]: {
        type: RelationType.ManyToMany,
        junction: {
          joinKey,
          inverseJoinKey,
          throughResourceId,
        },
        target: {
          resourceId,
        },
        deleteOptions: {
          enableDeleteRelation,
          enableDeleteRelatedRecord,
        },
      },
    },
  });
