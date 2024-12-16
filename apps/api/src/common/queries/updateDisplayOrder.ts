import { sql } from "drizzle-orm";
import { eq, gte, lte } from "drizzle-orm/expressions";

import type { UUIDType } from "src/common";

type UpdateDisplayOrderParams = {
  table: any;
  fieldId: any;
  orderField: any;
  parentFieldId: any;
  parentId: UUIDType;
  targetId: UUIDType;
  oldOrder: number;
  newOrder: number;
};

export async function updateDisplayOrder(
  {
    table,
    fieldId,
    orderField,
    parentFieldId,
    parentId,
    targetId,
    oldOrder,
    newOrder,
  }: UpdateDisplayOrderParams,
  trx: any,
) {
  await trx
    .update(table)
    .set({
      [orderField]: sql`
        CASE
          WHEN ${eq(fieldId, targetId)}
            THEN ${newOrder}
          WHEN ${newOrder < oldOrder} 
              AND ${gte(orderField, newOrder)} 
              AND ${lte(orderField, oldOrder)}
            THEN ${orderField} + 1
          WHEN ${newOrder > oldOrder} 
              AND ${lte(orderField, newOrder)}
              AND ${gte(orderField, oldOrder)}
            THEN ${orderField} - 1
          ELSE ${orderField}
        END
      `,
    })
    .where(eq(parentFieldId, parentId));
}
