import { useState, useCallback, useRef } from "react";
import ReactFlow, {
  ReactFlowProvider,
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
  Background,
  useStoreApi,
} from "react-flow-renderer";
import { faker } from "@faker-js/faker";
import Sidebar from "./Sidebar";

import AddNode from "./AddNode";

const initialEdges = [];
const initialNodes = [];

function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [nodeId, setNodeId] = useState(undefined);
  const [ nodePos , setNodePos ] = useState({});
  const yPos = useRef(0);
  const [openModal, setOpenModal] = useState(false);
  const [openModalForNodes, SetopenModalForNodes] = useState(false);
  const [prevNode, setPrevNode] = useState(false);

  const store = useStoreApi();
  
  console.log(store.getState())

  // Controlled component react node functions
  const onNodesChange = useCallback(
    (changes) => {
      // setNodePos({ x: changes[0]?.position?.x, y:changes[0]?.position?.y});
      // setNodePos(changes[0]?.position);
      setNodes((nds) => applyNodeChanges(changes, nds))
    },
    [setNodes]
  );

  // Get node position on drag end ( when dropping node )
  const onNodeDragStop = (_, node) => {
    // console.log(node);
    setNodePos(node.position);
  }
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );
  // Get clicked node ids
  const onNodeClick = (e) => {
    const _nodeId_ = e.target.getAttribute("data-id");
    setNodeId(_nodeId_);
  };
  
  // Generate random character ID for Node
  function getRandomUppercaseChar() {
    var r = Math.floor(Math.random() * 26);
    return String.fromCharCode(65 + r);
  }

  console.log(nodePos);

  // Add 1 node
  const addNode = useCallback((prev) => {
    yPos.current += 50;

    console.log(-Math.abs(nodePos.x),  -Math.abs(nodePos.y), nodePos.x, nodePos.y, 'node posiition here');
    const node = {
      id: `${getRandomUppercaseChar()}`,
      position: {
        x: -Math.abs(nodePos.x),
        y: -Math.abs(nodePos.y)
      } && {
        x: 100,
        y: yPos.current
      },

      data: {
        label: <AddNode />,
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
            type: "step",
          },
        ];
      });
    }
    setOpenModal(false);
  }, []);

  const addCrossroad = useCallback(
    (prev) => {
      console.log(prev);
      yPos.current += 50;
      const node = [
        {
          id: `${getRandomUppercaseChar()}-${getRandomUppercaseChar()}`,
          position: { x: 50, y: yPos.current },
          data: { label: faker.name.fullName() },
          style: { width: 100 },
        },
        {
          id: `${getRandomUppercaseChar()}-${getRandomUppercaseChar()}`,
          position: { x: 150, y: yPos.current },
          data: {
            label: faker.name.fullName(),
          },
          style: {
            width: 100,
          },
        },
      ];
      setNodes((nodes) => {
        return [...nodes, ...node];
      });
      if (prev) {
        setEdges((edges) => {
          return [
            ...edges,
            // For connecting edges , 'source' is the current node added and 'target' is the previous node
            {
              id: `${node[0].id}-${nodeId}`,
              source: `${node[0].id}`,
              target: `${nodeId}`,
              type: "step",
              animated: true,
            },
            {
              id: `${node[1].id}-${nodeId}`,
              source: `${node[1].id}`,
              target: `${nodeId}`,
              type: "step",
              animated: true,
            },
          ];
        });
      }
      setOpenModal(false);
    },
    [nodeId]
  );

  // Track node 
  const TrackNode = (e) => {
    if (e.target.getAttribute("data-id")) {
      setPrevNode(e.target); 
      SetopenModalForNodes((prev) => !prev);
    }
  };

  return (
    <div>
      {!nodes.length ? <div className="plusIcon" onClick={() => setOpenModal((prev) => !prev)}>
        <span>+</span>
      </div> : null}

      {openModal && !nodes?.length ? (
        <div className="actionsModal">
          <button className="tool" onClick={() => addNode(prevNode)}>
            Add Tool
          </button>
          <button className="crossroad" onClick={() => addCrossroad(prevNode)}>
            Add Crossroad
          </button>
        </div>
      ) : null}

      {openModalForNodes ? (
        <div className="actionsModal">
          <button className="tool" onClick={() => addNode(prevNode)}>
            Add Tool{" "}
          </button>
          <button className="crossroad" onClick={() => addCrossroad(prevNode)}>
            Add Crossroad
          </button>
        </div>
      ) : null}

      <div style={{ height: "100vh" }}>
        <ReactFlowProvider>
        <Sidebar />
          <ReactFlow
            nodes={nodes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeDragStop={onNodeDragStop}
            onNodeClick={onNodeClick}
            onConnect={onConnect}
            onClick={(e) => TrackNode(e)}
            edges={edges}
            fitView
            >
            <Background />
          </ReactFlow>
          
        </ReactFlowProvider>
      </div>
    </div>
  );
}

export default Flow;
