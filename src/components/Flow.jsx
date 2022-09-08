import { useState, useCallback, useRef } from 'react';
import AddNode from './AddNode';

import ReactFlow, { MiniMap, Controls } from 'react-flow-renderer';

// import initialNodes from '../initialElements';

const initialNodes = [
  {
    id: "1",
    data: {
      label: (
        // <AddNode addNode={addNode} addCrossroad={addCrossroad}/>
        <h1>Initial Node</h1>
      ),
    },
    position: { x: 0, y: 0 },
    style: {
      width: "270px",
    },
  },
];

function Flow() {
  const  [nodes, setNodes] = useState(initialNodes);
  const yPos = useRef(0);

  const addNode = useCallback(() => {
    yPos.current += 50;
    setNodes((nodes) => {
      console.log(nodes);
      return [
        ...nodes, 
        {
          id: Math.random(),
          position: { x: 100, y: yPos.current },
          data: {
            label: <AddNode />
          }
        }
      ];
    });
  }, []);
  
  const addCrossroad = () => {
    console.log('crossroad');
  }


  return (
    <>
      <button onClick={addNode}>Add Tool</button>
      <button onClick={addCrossroad}>Add Crossroad</button>
      <div style={{ height: 300 }}>

      <ReactFlow
        style={{width: '100%', height: '100vh'}}
        nodes={nodes}
        />
      </div>
    </>
  )
}

export default Flow