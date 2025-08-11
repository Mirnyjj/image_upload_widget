import ClientPage from "./client.page";

export default async function DynamicPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token: string; authority: string }>;
}) {
  const { id } = await params;
  const { token, authority }: { token: string; authority: string } =
    await searchParams;

  const authorityRes = authority?.split("_")[0].toLowerCase();

  return <ClientPage id={id} token={token} authority={authorityRes} />;
}
