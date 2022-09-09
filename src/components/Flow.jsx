import { useState, useCallback, useRef } from "react";
import ReactFlow, {
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
  Background,
} from "react-flow-renderer";
import { faker } from "@faker-js/faker";

const initialEdges = [];
const initialNodes = [];

function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [nodeId, setNodeId] = useState('');
  const yPos = useRef(0);
  const [openModal, setOpenModal] = useState(false);
  const [openModalForNodes, SetopenModalForNodes] = useState(false);
  const [prevNode, setPrevNode] = useState(false);

  // React flow controlled node functions 
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );
    // Get clicked node id
  const onNodeClick = useCallback(e => {
    console.log(e.target.getAttribute('data-id'))
    setNodeId(prevId => {
      return prevId = e.target.getAttribute('data-id')
    });
    console.log(nodeId);
  }, [setNodeId])
  
  // Generate random character ID for Node
  function getRandomUppercaseChar() {
    var r = Math.floor(Math.random() * 26);
    return String.fromCharCode(65 + r);
  }

  const addNode = useCallback((prev) => {
    yPos.current += 50;
    const node = {
      id: `${getRandomUppercaseChar()}-${getRandomUppercaseChar()}`,
      position: { x: 100, y: yPos.current },
      
      data: {
        label: faker.name.fullName(),
      },
      style: {
        width: 100,
      },
    };
    setNodes((nodes) => {
      return [...nodes, node];
    });

    if (prev) {
      const _prevNode_id = prev.getAttribute("data-id");
      setEdges((edges) => {
        return [
          ...edges,
          // For connecting edges , 'source' is the current node added and 'target' is the previous node
          {
            id: `${node.id}-${_prevNode_id}`,
            source: `${node.id}`,
            target: `${_prevNode_id}`,
            type: 'step',
          },
        ];
      });
    }
    setOpenModal(false);
  }, []);

  const addCrossroad = useCallback((prev) => {
    yPos.current += 50;
    const node = [
      {
        id: `${getRandomUppercaseChar()}-${getRandomUppercaseChar()}`,
        position: { x: 100, y: yPos.current },
        data: { label: faker.name.fullName()},
        style: { width: 100 },
      },
      {
        id: `${getRandomUppercaseChar()}-${getRandomUppercaseChar()}`,
        position: { x: 200, y: yPos.current },
        data: {
          label: faker.name.fullName(),
        },
        style: {
          width: 100,
        },
      },
    ]
    setNodes((nodes) => {
      return [...nodes, ...node]
    })
    if (prev) {
      setEdges((edges) => {
        return [
          ...edges,
          // For connecting edges , 'source' is the current node added and 'target' is the previous node
          {
            id: `${node.id}-${nodeId}`,
            source: `${node.id}`,
            target: `${nodeId}`,
          },
          {
            id: `${node.id}-${nodeId}`,
            source: `${node.id}`,
            target: `${nodeId}`,
          },
        ];
      });
    }
    setOpenModal(false);
  }, []);

  const TrackNode = (e) => {
    if (e.target.getAttribute("data-id")) {
      setPrevNode(e.target);
      SetopenModalForNodes((prev) => !prev);
    }
  };

  return (
    <div>
      <div className="plusIcon" onClick={() => setOpenModal((prev) => !prev)}><span>+</span></div>
        
      {openModal ? (
        <div className="actionsModal">
          <button className="tool" onClick={() => addNode(prevNode)}>Add Tool</button>
          <button className="crossroad" onClick={() => addCrossroad(prevNode)}>Add Crossroad</button>
        </div>
      ) : null}

      {openModalForNodes ? (
        <div className="actionsModal">
          <button className="tool" onClick={() => addNode(prevNode)}>Add Tool </button>
          <button className="crossroad" onClick={() => addCrossroad(prevNode)}>Add Crossroad</button>
        </div>
      ) : null}

      <div style={{ height: '100vh' }}>
        <ReactFlow
          nodes={nodes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onConnect={onConnect}
          // onClick={(e) => TrackNode(e)}
          edges={edges}
          fitView
          defaultZoom={1}
          minZoom={0.2}
          maxZoom={4}
        >
          <Background />
          </ReactFlow>
      </div>
      
    </div>
  );
}

export default Flow;
