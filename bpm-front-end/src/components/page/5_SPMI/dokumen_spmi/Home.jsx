import { useState } from "react";
import Index from "./Index";
import Add from "./Add";
import Edit from "./Edit";

export default function Home() {
  const [pageMode, setPageMode] = useState("index");
  const [dataID, setDataID] = useState("");
  const [breadcrumbs, setBreadcrumbs] = useState([
    { label: "SPMI" },
    { label: "Dokumen SPMI" },
  ]);

  function getPageMode() {
    switch (pageMode) {
      case "index":
        return <Index onChangePage={handleSetPageMode} />;
      case "add":
        return (
          <Add onChangePage={handleSetPageMode} breadcrumbs={breadcrumbs} />
        );
      case "edit":
        return (
          <Edit
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

  function handleSetPageMode(mode, breadcrumb) {
    setBreadcrumbs(breadcrumb);
    setPageMode(mode);
  }

  function handleSetPageMode(mode, breadcrumb, obj) {
    setDataID(obj);
    setBreadcrumbs(breadcrumb);
    setPageMode(mode);
  }

  return <div>{getPageMode()}</div>;
}
