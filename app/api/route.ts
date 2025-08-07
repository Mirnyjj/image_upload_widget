import { sql } from "@/app/service/connectSQL";
import { Attribute } from "@/app/service/types";
import { NextRequest, NextResponse } from "next/server";

const date = new Date().getTime();

export async function GET() {
  try {
    const data = await sql<Attribute[]>`SELECT * FROM attribute_kv`;
    return NextResponse.json(data);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Получаем данные из тела запроса
    const attributeData: Attribute = await request.json();
    // Валидация данных
    if (
      !attributeData.attribute_key ||
      !attributeData.str_v ||
      !attributeData.attribute_type ||
      !attributeData.entity_type ||
      !attributeData.entity_id
    ) {
      return NextResponse.json(
        {
          error:
            "Получены не все ключи для записи в БД. Необходимы ключи: attribute_key, str_v, attribute_type, entity_type, entity_id",
        },
        { status: 400 }
      );
    }
    //SUBSTRING(${id}, 8, 8) || '-' || SUBSTRING(${id}, 4, 4) || '-1' || SUBSTRING(${id}, 1, 3) || '-' || SUBSTRING(${id}, 16, 4) || '-' || SUBSTRING(${id}, 20, 12)//
    // Вставляем данные в БД
    const id = attributeData.entity_id;
    const [newAttribute] = await sql<
      Attribute[]
    >`INSERT INTO attribute_kv (entity_type, attribute_type, attribute_key, str_v, entity_id, last_update_ts) VALUES (${attributeData.entity_type}, ${attributeData.attribute_type}, ${attributeData.attribute_key}, ${attributeData.str_v},  SUBSTRING(REPLACE(${id}, '-', ''), 14, 3) || SUBSTRING(REPLACE(${id}, '-', ''), 9, 4) || SUBSTRING(REPLACE(${id}, '-', ''), 1, 8) || SUBSTRING(REPLACE(${id}, '-', ''), 17), ${date})
      RETURNING *
    `;

    // Возвращаем созданный атрибут
    const newAttr = {
      ...newAttribute,
      entity_id: id,
    };

    return NextResponse.json(newAttr, { status: 201 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Ошибка при создании атрибута" },
      { status: 500 }
    );
  }
}

interface RouteParams {
  params: Promise<{
    id: string;
    attribute_key: string;
  }>;
}

export async function PUT(
  request: NextRequest,
  params: RouteParams
): Promise<NextResponse> {
  try {
    // Получаем ID из параметров маршрута
    const { id, attribute_key } = await params.params;

    // Получаем данные из тела запроса
    const attributeData: Attribute = await request.json();

    // Валидация данных
    if (
      !id ||
      !attributeData.attribute_key ||
      !attributeData.str_v ||
      !attributeData.attribute_type ||
      !attributeData.entity_type
    ) {
      return NextResponse.json(
        {
          error:
            "Получены не все ключи для записи в БД. Необходимы ключи: attribute_key, str_v, attribute_type, entity_type",
        },
        { status: 400 }
      );
    }

    // Обновляем данные в БД
    const [updatedAttribute] = await sql<Attribute[]>`
      UPDATE attribute_kv 
      SET 
        attribute_key = ${attributeData.attribute_key},
        str_v = ${attributeData.str_v},
        attribute_type = ${attributeData.attribute_type},
        entity_type = ${attributeData.entity_type}
        last_update_ts = ${date}
      WHERE entity_id = SUBSTRING(REPLACE(${id}, '-', ''), 14, 3) || SUBSTRING(REPLACE(${id}, '-', ''), 9, 4) || SUBSTRING(REPLACE(${id}, '-', ''), 1, 8) || SUBSTRING(REPLACE(${id}, '-', ''), 17) AND attribute_key = ${attribute_key}
      RETURNING *
    `;

    // Возвращаем обновленный атрибут
    return NextResponse.json(
      { ...updatedAttribute, entity_id: attributeData.entity_id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Ошибка при обновлении атрибута" },
      { status: 500 }
    );
  }
}
