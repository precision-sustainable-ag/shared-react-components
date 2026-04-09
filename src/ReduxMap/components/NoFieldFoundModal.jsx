const NoFieldFoundModal = () => (
  <dialog id="NoFieldFound">
    <h3 style={{ marginTop: 0 }}>No Field Found</h3>
    <p>We could not automatically detect a field boundary at this location.</p>

    <div>
      <button
        onClick={(event) => event.target.closest('dialog').close()}
        style={{
          padding: '8px 16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        OK
      </button>
    </div>
  </dialog>
);

export default NoFieldFoundModal;
