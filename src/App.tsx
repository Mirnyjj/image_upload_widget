// import {useState} from 'react';
import DropzoneComponent from './components/Upload';
import './styles.css';
// import img from './assets/no-img.webp';

function App() {
  // const [count, setCount] = useState(0);

  return (
    <section className='section'>
      <div className='borderImg'>
        <div className='App'>
          <DropzoneComponent />
        </div>
      </div>
    </section>
  );
}

export default App;
