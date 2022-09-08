import { useState, useCallback, useRef } from "react";
import ReactFlow, {
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
} from "react-flow-renderer";
import { faker } from "@faker-js/faker";

const initialEdges = [];
const initialNodes = [];

function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const yPos = useRef(0);
  const [openModal, setOpenModal] = useState(false);
  const [openModalForNodes, SetopenModalForNodes] = useState(false);
  const [prevNode, setPrevNode] = useState(false);
  const rfStyle = {
    backgroundColor: "#D0C0F7",
  };

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

  function getRandomUppercaseChar() {
    var r = Math.floor(Math.random() * 26);
    return String.fromCharCode(65 + r);
  }

  const addNode = useCallback((prev) => {
    const node = {
      id: getRandomUppercaseChar(),
      position: { x: 100, y: yPos.current },
      data: {
        label: faker.name.fullName(),
      },
      style: {
        width: 100,
      },
    };
    yPos.current += 50;
    setNodes((nodes) => {
      return [...nodes, node];
    });

    if (prev) {
      const _prevNode_id = prev.getAttribute("data-id");
      setEdges((edges) => {
        return [
          ...edges,
          {
            id: `${node.id}-${_prevNode_id}`,
            source: `${node.id}`,
            target: `${_prevNode_id}`,
          },
        ];
      });
    }
  }, []);

  console.log(nodes);

  const addCrossroad = () => {
    console.log("crossroad");
  };

  const TrackNode = (e) => {
    if (e.target.getAttribute("data-id")) {
      setPrevNode(e.target);
      SetopenModalForNodes((prev) => !prev);
    }
  };

  return (
    <div style={rfStyle}>
      {openModal ? (
        <>
          <button onClick={() => addNode(prevNode)}>Add Tool</button>
          <button onClick={addCrossroad}>Add Crossroad</button>
        </>
      ) : null}

      <div onClick={() => setOpenModal((prev) => !prev)}>+</div>

      {openModalForNodes ? (
        <div>
          <button onClick={() => addNode(prevNode)}>Add Tool </button>
          <button onClick={addCrossroad}>Add Crossroad</button>
        </div>
      ) : null}

      <div style={{ height: "100vh" }}>
        <ReactFlow
          nodes={nodes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onClick={(e) => TrackNode(e)}
          edges={edges}
          fitView
          attributionPosition="top-right"
        />
      </div>
    </div>
  );
}

export default Flow;
