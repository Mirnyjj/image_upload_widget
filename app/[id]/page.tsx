import ClientPage from "./client.page";

export default function DynamicPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {

const { id } = params;
const token = searchParams.token as string;
const authorityParams = searchParams.authority as string;
const authority = authorityParams?.split('_')[0].toLowerCase()

return <ClientPage id={id} token={token} authority={authority}/>


}