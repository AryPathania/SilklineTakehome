import { Stoplight } from './components/Stoplight';
import './App.css';
import { LIGHT_SEQUENCE2, LIGHT_SEQUENCE3, LIGHT_SEQUENCE4 } from './hooks/useStoplightCycle';
// green yellow red purple

function App() {
  return (
    <div className="app-container">
      <Stoplight />
      <Stoplight sequenceOrder={LIGHT_SEQUENCE2}/>
      <Stoplight sequenceOrder={LIGHT_SEQUENCE3}/>
      <Stoplight displayOrder={['green', 'yellow', 'red', 'purple']}/>
      <Stoplight displayOrder={['red', 'red', 'red', 'red']} sequenceOrder={LIGHT_SEQUENCE4}/>
    </div>
  );
}

export default App;
