export default function OfflinePage() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <h1 style={{ fontSize: 24 }}>Offline</h1>
      <p>Sorry, you are offline.</p>
    </div>
  );
}
