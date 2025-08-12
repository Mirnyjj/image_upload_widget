import { headers } from "next/headers";
import ClientPage from "./client.page";

export default async function DynamicPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token: string; authority: string }>;
}) {
  const { id } = await params;
  const { token, authority } = await searchParams;

  // Получаем host из заголовков
  const headersList = await headers();
  const host = headersList.get("host"); // "192.168.63.200:3000" (если есть порт)
  const protocol = headersList.get("x-forwarded-proto") || "http";

  // Формируем базовый URL (без пути и параметров)
  const baseUrl = `${protocol}://${host?.split(":")[0]}`; // "http://192.168.63.200"

  const authorityRes = authority?.split("_")[0].toLowerCase();

  return (
    <ClientPage
      id={id}
      token={token}
      authority={authorityRes}
      baseUrl={baseUrl} // Передаём в клиентский компонент
    />
  );
}
