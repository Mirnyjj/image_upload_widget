import { sql } from "@/app/service/connectSQL";
import { getConvertID } from "@/app/service/getConvertID";
import { Attribute } from "@/app/service/types";


export async function updateAttribute(id: string, attribute: Attribute) {
  try {
     const entity_id = getConvertID(id);
    const [updatedAttribute] = await sql<
      Attribute[]
    >`UPDATE attribute_kv SET attribute_key = ${attribute.attribute_key},
        str_v = ${attribute.str_v},
        attribute_type = ${attribute.attribute_type},
        entity_type = ${attribute.entity_type} WHERE entity_id = ${entity_id} AND attribute_key = ${attribute.attribute_key} RETURNING *`;
    return updatedAttribute;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to update attribute.");
  }
}

export async function getAttribute(id: string, attribute_key: string) {
  
  try {
    const entity_id = getConvertID(id);
    const [attribute] = await sql<
      Attribute[]
    >`SELECT * FROM attribute_kv WHERE entity_id = ${entity_id} AND attribute_key = ${attribute_key}`;
    return attribute;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch attribute.");
  }
}

export async function deleteAttribute(id: string, attribute_key: string) {
  try {
    const entity_id = getConvertID(id);
    await sql`DELETE FROM categories WHERE entity_id = ${entity_id} AND attribute_key = ${attribute_key}`;
    return { id };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete attribute.");
  }
}