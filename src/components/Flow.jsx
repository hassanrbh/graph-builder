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
    console.log(String.fromCharCode((65 + r)));
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
          // For connecting edges , 'source' is the current node added and 'target' is the previous node
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

  const addCrossroad = useCallback((prev) => {
    const node = [
      {
        id: getRandomUppercaseChar(),
        position: { x: 100, y: yPos.current },
        data: {
          label: faker.name.fullName(),
        },
        style: {
          width: 100,
        },
      },
      {
        id: getRandomUppercaseChar(),
        position: { x: 200, y: yPos.current },
        data: {
          label: faker.name.fullName(),
        },
        style: {
          width: 100,
        },
      },
    ]
    yPos.current += 50;
    setNodes((nodes) => {
      return [...nodes, ...node]
    })
    if (prev) {
      const _prevNode_id = prev.getAttribute("data-id");
      console.log(_prevNode_id);
      setEdges((edges) => {
        return [
          ...edges,
          // For connecting edges , 'source' is the current node added and 'target' is the previous node
          {
            id: `${node.id}-${_prevNode_id}`,
            source: `${node.id}`,
            target: `${_prevNode_id}`,
          },
        ];
      });
    }

  }, []);

  const TrackNode = (e) => {
    if (e.target.getAttribute("data-id")) {
      setPrevNode(e.target);
      SetopenModalForNodes((prev) => !prev);
    }
  };

  return (
    <div style={rfStyle}>
      {/* if open modal is true open add tool and add crossroad */}
      {openModal ? (
        <div className="actionsModal">
          <button onClick={() => addNode(prevNode)}>Add Tool</button>
          <button onClick={() => addCrossroad(prevNode)}>Add Crossroad</button>
        </div>
      ) : null}
      {/* Starting point of program */}
      <div onClick={() => setOpenModal((prev) => !prev)}>+</div>

      {openModalForNodes ? (
        <div className="actionsModal">
          <button onClick={() => addNode(prevNode)}>Add Tool </button>
          <button onClick={() => addCrossroad(prevNode)}>Add Crossroad</button>
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
