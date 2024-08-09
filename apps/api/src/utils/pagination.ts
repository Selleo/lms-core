import { HttpException, HttpStatus } from "@nestjs/common";
import { asc, count, desc, like, sql } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";
import { CategoriesQuery } from "src/categories/api/types";
import { DatabasePg } from "src/common";

type TProps = {
  model: PgTable;
  query: CategoriesQuery;
  db: DatabasePg;
};

const createLikeFilter = (filter: string, model: PgTable, sortField: string) =>
  //@ts-ignore
  like(model[`${sortField}`], `%${filter}%`);

const validateSortField = (model: PgTable, sortField: string) => {
  if (!(sortField in model)) {
    throw new HttpException(
      `Invalid query param: ${sortField}`,
      HttpStatus.BAD_REQUEST,
    );
  }
};

export const getDataPagination = async ({ model, query, db }: TProps) => {
  const { sort = "", limit = 50, offset = 0, filter = "" } = query;

  const sortOrder = sort.startsWith("-") ? desc : asc;
  const sortField = sort.replace(/^-/, "");
  console.log({ query });

  //if there is sorting but there is no column in model throw an error
  if (sort) {
    validateSortField(model, sortField);
  }

  //if there is filtering must be sorting field
  if (filter && !sort) {
    throw new HttpException(
      `There is filter param and no sort param in the query`,
      HttpStatus.BAD_REQUEST,
    );
  }

  //if no filtering
  if (!filter && !sort) {
    const [totalItems] = await db.select({ count: count() }).from(model);
    const queryDB = db.select().from(model).limit(limit).offset(offset);
    const data = await queryDB;
    return { categories: data, totalItems: totalItems.count };
  }

  //@ts-ignore
  const filterCondition = createLikeFilter(filter, model, sortField);

  const [totalItems] = await db
    .select({ count: count() })
    .from(model)
    .where(filterCondition);

  //if no sort params skip orderBy
  if (!sort) {
    console.log("no sorting");
    const queryDB = db
      .select()
      .from(model)
      //@ts-ignore
      .where(filterCondition)
      .limit(limit)
      .offset(offset);

    const data = await queryDB;
    return { categories: data, totalItems: totalItems.count };
  }

  const queryDB = db
    .select()
    .from(model)
    //@ts-ignore
    .where(filterCondition)
    //@ts-ignore
    .orderBy(sortOrder(sql`LOWER(${model[`${sortField}`]})`))
    .limit(limit)
    .offset(offset);

  const data = await queryDB;

  return { categories: data, totalItems: totalItems.count };
};
