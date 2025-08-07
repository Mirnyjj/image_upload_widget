import Link from "next/link";


export default function Home() {
  const API_BASE_URL = 'http://localhost:8080';


 
  return (
    <Link href={API_BASE_URL}><h1>Вернитесь на страницу ThingsBoard</h1></Link>
  );
}
