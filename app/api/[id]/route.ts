import { NextRequest, NextResponse } from "next/server";
import { deleteAttribute, getAttribute, updateAttribute } from "../actions";
import { Attribute } from "@/app/service/types";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, params: RouteParams) {
  const { id } = await params.params;
  const { searchParams } = new URL(request.url);
  const attribute_key = searchParams.get("attribute_key");
  if (!id && !attribute_key) {
    return NextResponse.json(
      { error: "Attribute ID is required" },
      { status: 400 }
    );
  }
  try {
    const attribute = await getAttribute(id, attribute_key || "");
    if (!attribute) {
      return NextResponse.json(
        { error: "Attribute not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(attribute, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Error fetching attribute:", err?.message); // Используем message для детализации ошибки
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  params: RouteParams
): Promise<NextResponse> {
  try {
    const { id } = await params.params;

    if (!id) {
      return NextResponse.json(
        { error: "Attribute ID is required" },
        { status: 400 }
      );
    }

    const data: Attribute = await request.json();

    // Базовая валидация данных
    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "No data provided for update" },
        { status: 400 }
      );
    }

    const updatedAttribute = await updateAttribute(id, data);
    return NextResponse.json(updatedAttribute, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("UPDATE attribute Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  params: RouteParams
): Promise<NextResponse> {
  try {
    const { id } = await params.params;
    const { searchParams } = new URL(request.url);
    const attribute_key = searchParams.get("attribute_key");
    console.log(id, attribute_key, "params");
    if (!id && !attribute_key) {
      return NextResponse.json(
        { error: "Attribute ID is required" },
        { status: 400 }
      );
    }

    await deleteAttribute(id, attribute_key || "");
    return NextResponse.json(
      { success: true },
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("DELETE Attribute Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Обработка недопустимых методов
export async function POST(): Promise<NextResponse> {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
