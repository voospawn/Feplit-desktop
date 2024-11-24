import './style.css';
import { Editor } from './components/Editor';

document.querySelector('#root').innerHTML = `
  <div class="min-h-screen bg-gray-900 text-white p-4">
    <h1 class="text-3xl font-bold mb-4">C++ Web Editor</h1>
    ${Editor()}
  </div>
`;