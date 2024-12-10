import React from "react";
import Icon from "./Icon";

export default function Table({
  arrHeader,
  headerToDataMap,
  data,
  actions = [],
  onDelete = () => {},
  onDetail = () => {},
  onEdit = () => {},
  onFinal = () => {},
  onPrint = () => {},
  onPrintHistory = () => {},
  onUpdateHistory = () => {},
  onSurveyor = () => {},
  onResponden = () => {},
}) {
  function generateActionButton(actionType, id) {
    switch (actionType) {
      case "Delete":
        return (
          <Icon
            type="Reguler"
            name="trash"
            cssClass="btn px-1 py-0 text-danger"
            title="Hapus"
            onClick={() => onDelete(id)}
          />
        );
      case "Detail":
        return (
          <Icon
            type="Reguler"
            name="eye"
            cssClass="btn px-1 py-0 text-info"
            title="Lihat Detail"
            onClick={() => onDetail(id)}
          />
        );
      case "Edit":
        return (
          <Icon
            type="Reguler"
            name="edit"
            cssClass="btn px-1 py-0 text-success"
            title="Ubah"
            onClick={() => onEdit(id)}
          />
        );
      case "Final":
        return (
          <Icon
            type="Reguler"
            name="flag"
            cssClass="btn px-1 py-0 text-primary"
            title="Finalkan"
            onClick={() => onFinal(id)}
          />
        );
      case "Print":
        return (
          <Icon
            type="Reguler"
            name="download"
            cssClass="btn px-1 py-0 text-secondary"
            title="Unduh File"
            onClick={() => onPrint(id)}
          />
        );
      case "PrintHistory":
        return (
          <Icon
            type="Reguler"
            name="file-circle-info"
            cssClass="btn px-1 py-0 text-warning"
            title="Riwayat Unduhan"
            onClick={() => onPrintHistory(id)}
          />
        );
      case "UpdateHistory":
        return (
          <Icon
            type="Reguler"
            name="user-time"
            cssClass="btn px-1 py-0 text-primary"
            title="Riwayat Pembaruan"
            onClick={() => onUpdateHistory(id)}
          />
        );
      case "Surveyor":
        return (
          <Icon
            type="Reguler"
            name="meeting"
            cssClass="btn px-1 py-0 text-info"
            title="Edit Surveyor"
            onClick={() => onSurveyor(id)}
          />
        );
      case "Responden":
        return (
          <Icon
            type="Reguler"
            name="users"
            cssClass="btn px-1 py-0 text-warning"
            title="Edit Responden"
            onResponden={() => onResponden(id)}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className="table-responsive">
      <table
        className="table table-hover table-striped table-bordered"
        style={{ borderCollapse: "collapse", minWidth: "1000px" }}
      >
        <thead>
          <tr>
            {arrHeader.map((header, index) => (
              <th
                key={header}
                className="text-center align-middle"
                style={{
                  backgroundColor: "#2654A1",
                  color: "#fff",
                }}
              >
                {header}
              </th>
            ))}
            <th
              className="text-center align-middle"
              style={{
                backgroundColor: "#2654A1",
                color: "#fff",
                width: "250px",
              }}
            >
              Aksi
            </th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`}>
                {arrHeader.map((column, colIndex) => (
                  <td
                    key={`cell-${row.Key}-${colIndex}`}
                    className={`align-middle ${
                      column === "No" ? "text-center" : "text-start"
                    }`}
                  >
                    {row[headerToDataMap[column]]}
                  </td>
                ))}
                <td
                  className="text-center align-middle"
                  style={{ width: "250px" }}
                >
                  {typeof actions === "function"
                    ? actions(row).map((action, actionIndex) => (
                        <React.Fragment
                          key={`${action}-${row.Key || rowIndex}`}
                        >
                          {generateActionButton(action, row)}
                        </React.Fragment>
                      ))
                    : Array.isArray(actions) && actions.length > 0
                    ? actions.map((action, actionIndex) => (
                        <React.Fragment
                          key={`${action}-${row.Key || rowIndex}`}
                        >
                          {generateActionButton(action, row)}
                        </React.Fragment>
                      ))
                    : null}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={arrHeader.length + 1} className="text-center">
                Tidak ada data.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
