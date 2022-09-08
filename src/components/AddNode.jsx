function AddNode({ addNode, addCrossroad }) {
  return (
    <div className="nodeActions">
      <button onClick={addNode}>Add Tool</button>
      <button onClick={addCrossroad}>Add Crossroad</button>
    </div>
  );
}

export default AddNode;
