import { useState } from "react";
import Index from "./Index";
import Add from "./Add";
import AddChild from "./AddChild";
import Edit from "./Edit";
import EditChild from "./EditChild";

export default function Home() {
  const [pageMode, setPageMode] = useState("read");
  const [dataID, setDataID] = useState("");
  const [breadcrumbs, setBreadcrumbs] = useState([
    { label: "SPMI" },
    { label: "Dokumen SPMI" },
  ]);

  function getPageMode() {
    switch (pageMode) {
      case "read":
        return <Index onChangePage={handleSetPageMode} />;
      case "addKat":
        return (
          <Add onChangePage={handleSetPageMode} breadcrumbs={breadcrumbs} />
        );
      case "addKatChild":
        return (
          <AddChild onChangePage={handleSetPageMode} breadcrumbs={breadcrumbs} />
        );
      case "edit":
        return (
          <Edit
            onChangePage={handleSetPageMode}
            breadcrumbs={breadcrumbs}
            idData={dataID}
          />
        );
      case "editChild":
        return (
          <EditChild
            onChangePage={handleSetPageMode}
            breadcrumbs={breadcrumbs}
            idData={dataID}
          />
        );
    }
  }

  function handleSetPageMode(mode) {
    setPageMode(mode);
  }

  function handleSetPageMode(mode, breadcrumb, obj) {
    setDataID(obj);
    setBreadcrumbs(breadcrumb);
    setPageMode(mode);
  }

  return <div>{getPageMode()}</div>;
}
