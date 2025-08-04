import { useState, useTransition } from "react";
import DropzoneComponent from "./Upload";

export default  function Converter(){
const [base64Img, setBase64Img] = useState<string | ArrayBuffer>('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const handleSubmit = (formData: string | ArrayBuffer) => {
    if (typeof formData === 'string')
      startTransition(async () => {
        // const resolve = () => setTimeout(() => console.log(formData), 1000);

        const responce = await fetch('http://localhost:5173/' + formData);
        // const responce = await new Promise(resolve);
        if (responce.status >= 400) {
          setError('Ошибка отправки данных, попробуйте позже.');
          return;
        }
      });
  };

  //  const resolve = () => setTimeout(() => console.log(formData), 1000);
  //     const error = await new Promise(resolve);
  return (
    <section className='section'>
      <DropzoneComponent setBase64Img={setBase64Img} />
      <button onClick={() => handleSubmit(base64Img)} type='submit' disabled={isPending}>
        Загрузить на сервер
      </button>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </section>
  );
}