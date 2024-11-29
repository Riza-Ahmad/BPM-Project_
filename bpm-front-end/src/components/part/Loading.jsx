import { SyncLoader } from "react-spinners";

export default function Loading() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center", 
        backgroundColor: "white", 
        minHeight: "95vh",
        margin: 0,
      }}
    >
      <SyncLoader color="#0d6efd" loading={true} />
    </div>
  );
}
