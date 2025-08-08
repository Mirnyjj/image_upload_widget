import { sql } from "@/app/service/connectSQL";
import { Attribute } from "@/app/service/types";

export async function updateAttribute(id: string, attribute: Attribute) {
  try {
    const [updatedAttribute] = await sql<
      Attribute[]
    >`UPDATE attribute_kv SET attribute_key = ${attribute.attribute_key},
        str_v = ${attribute.str_v},
        attribute_type = ${attribute.attribute_type},
        entity_type = ${attribute.entity_type} WHERE entity_id = SUBSTRING(REPLACE(${id}, '-', ''), 14, 3) || SUBSTRING(REPLACE(${id}, '-', ''), 9, 4) || SUBSTRING(REPLACE(${id}, '-', ''), 1, 8) || SUBSTRING(REPLACE(${id}, '-', ''), 17) AND attribute_key = ${attribute.attribute_key} RETURNING *`;
    return updatedAttribute;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to update attribute.");
  }
}

export async function getAttribute(id: string, attribute_key: string) {
  try {
    const [attribute] = await sql<
      Attribute[]
    >`SELECT * FROM attribute_kv WHERE entity_id = SUBSTRING(REPLACE(${id}, '-', ''), 14, 3) || SUBSTRING(REPLACE(${id}, '-', ''), 9, 4) || SUBSTRING(REPLACE(${id}, '-', ''), 1, 8) || SUBSTRING(REPLACE(${id}, '-', ''), 17) AND attribute_key = ${attribute_key}`;
    return attribute;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch attribute.");
  }
}

export async function deleteAttribute(id: string, attribute_key: string) {
  try {
    const responce =
      await sql`DELETE FROM attribute_kv WHERE entity_id = SUBSTRING(REPLACE(${id}, '-', ''), 14, 3) || SUBSTRING(REPLACE(${id}, '-', ''), 9, 4) || SUBSTRING(REPLACE(${id}, '-', ''), 1, 8) || SUBSTRING(REPLACE(${id}, '-', ''), 17) AND attribute_key = ${attribute_key}`;
    return { responce };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete attribute.");
  }
}
