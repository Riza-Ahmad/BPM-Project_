import React from "react";
import Icon from "./Icon";

export default function Table({
  arrHeader,
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
  onPreview = () => {}
}) {
  function generateActionButton(actionType, id, status = "Aktif") {
    switch (actionType) {
      case "Toggle": {
        if (status === "Aktif") {
          return (
            <Icon
              name="toggle-on"
              type="Bold"
              cssClass="btn px-1 py-0 text-primary"
              title="Nonaktifkan"
              onClick={() => onToggle(id)}
            />
          );
        } else if (status === "Tidak Aktif") {
          return (
            <Icon
              name="toggle-off"
              type="Bold"
              cssClass="btn px-1 py-0 text-secondary"
              title="Aktifkan"
              onClick={() => onToggle(id)}
            />
          );
        }
      }
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
            onClick={() => onResponden(id)}
          />
        );
      case "Preview":
        return (
          <Icon
            type="Reguler"
            name="search-alt"
            cssClass="btn px-1 py-0 text-info"
            title="Preview"
            onClick={() => onPreview(id)}
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
                    key={`cell-${rowIndex}-${colIndex}`}
                    className={`align-middle ${
                      column === "No" ? "text-center" : "text-start"
                    }`}
                  >
                    {row[column] || ""}
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
