import React, { useState } from "react";
import Icon from "./Icon";

export default function Table({
  arrHeader,
  data,
  linkColumns = [],
  FILE_LINK = "",
  aksiIs = true,
  enableCheckbox = false,
  actions = [],
  onToggle = () => {},
  onDelete = () => {},
  onDetail = () => {},
  onEdit = () => {},
  onFinal = () => {},
  onPrint = () => {},
  onPrintHistory = () => {},
  onUpdateHistory = () => {},
  onSurveyor = () => {},
  onResponden = () => {},
  onUpload = () => {},
  onPreview = () => {},
  onChoose = () => {},
  onSelect = () => {},
  onSend = () => {},
  onSelfAssessment = () => {},
  onRiwayatTemuan = () => {},
  onAnalisaTemuan = () => {},
}) {
  const [selectedKeys, setSelectedKeys] = useState([]);

  const handleCheckboxChange = (key, isChecked) => {
    const updatedKeys = isChecked
      ? [...selectedKeys, key]
      : selectedKeys.filter((k) => k !== key);
    setSelectedKeys(updatedKeys);
    onSelect(updatedKeys); // Kirim daftar key yang dipilih ke parent
  };

  const handleSelectAll = (isChecked) => {
    const allKeys = isChecked ? data.map((row) => row.Key) : [];
    setSelectedKeys(allKeys);
    onSelect(allKeys); // Kirim daftar key yang dipilih ke parent
  };

  function generateActionButton(actionType, id, status = "Aktif") {
    switch (actionType) {
      case "Toggle": {
        return status === "Aktif" ? (
          <Icon
            name="toggle-on"
            type="Bold"
            cssClass="btn px-1 py-0 text-primary"
            title="Nonaktifkan"
            onClick={() => onToggle(id)}
          />
        ) : (
          <Icon
            name="toggle-off"
            type="Bold"
            cssClass="btn px-1 py-0 text-secondary"
            title="Aktifkan"
            onClick={() => onToggle(id)}
          />
        );
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
            name="user-time"
            cssClass="btn px-1 py-0 text-warning"
            title="Riwayat Unduhan"
            onClick={() => onPrintHistory(id)}
          />
        );
      case "UpdateHistory":
        return (
          <Icon
            type="Reguler"
            name="file-circle-info"
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
      case "Upload":
        return (
          <Icon
            type="Reguler"
            name="upload"
            cssClass="btn px-1 py-0 text-secondary"
            title="Upload File"
            onClick={() => onUpload(id)}
          />
        );
      case "Choose":
        return (
          <Icon
            type="full"
            name="interactive"
            cssClass="btn px-1 py-0 text-primary"
            title="Pilih"
            onClick={() => onChoose(id)}
          />
        );
      case "Send":
        return (
          <Icon
            type="Bold"
            name="paper-plane-top"
            cssClass="btn px-1 py-0 text-primary"
            title="Kirim"
            onClick={() => onSend(id)}
          />
        );
      case "Self Assessment":
        return (
          <Icon
            type="Bold"
            name="member-list"
            cssClass="btn px-1 py-0 text-primary"
            title="Self Assessment"
            onClick={() => onSelfAssessment(id)}
          />
        );
      case "Temuan":
        return (
          <Icon
            type="Bold"
            name="time-past"
            cssClass="btn px-1 py-0 text-info"
            title="Riwayat Temuan"
            onClick={() => onRiwayatTemuan(id)}
          />
        );
      case "AnalisaTemuan":
        return (
          <Icon
            type="Bold"
            name="bulb"
            cssClass="btn px-1 py-0 text-warning"
            title="Analisa Temuan"
            onClick={() => onAnalisaTemuan(id)}
          />
        );
      case "Choose":
        return (
          <button
            className="btn btn-primary px-3"
            title="Pilih"
            onClick={() => onChoose(id)}
          >
            <span style={{ fontWeight: 600 }}>PILIH</span>
            
          </button>
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
            {enableCheckbox && (
              <th
                className="text-center align-middle"
                style={{
                  backgroundColor: "#2654A1",
                  color: "#fff",
                  maxWidth: "70px",
                  minWidth: "50px",
                }}
              >
                <input
                  type="checkbox"
                  checked={
                    selectedKeys.length === data.length && data.length > 0
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
            )}
            {arrHeader.map((header, index) => (
              <th
                key={`header-${index}`}
                className="text-center align-middle"
                style={{
                  backgroundColor: "#2654A1",
                  color: "#fff",
                  maxWidth: index === 0 ? "70px" : "none",
                  minWidth: index === 0 ? "50px" : "none",
                }}
              >
                {header}
              </th>
            ))}
            {aksiIs && ( // Render kolom aksi hanya jika aksiIs adalah false
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
            )}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`}>
                {enableCheckbox && (
                  <td className="text-center align-middle">
                    <input
                      type="checkbox"
                      checked={selectedKeys.includes(row.Key)}
                      onChange={(e) =>
                        handleCheckboxChange(row.Key, e.target.checked)
                      }
                    />
                  </td>
                )}
                {arrHeader.map((column, colIndex) => (
                  <td
                    key={`cell-${rowIndex}-${colIndex}`}
                    className={`align-middle ${
                      column === "No" ? "text-center" : "text-start"
                    }`}
                  >
                    {/* Periksa apakah kolom ini harus memiliki hyperlink */}
                    {linkColumns.includes(column) && row[column] ? (
                      <a
                        href={`${FILE_LINK}${row[column]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-decoration-underline"
                      >
                        {row[column]}
                      </a>
                    ) : (
                      row[column] || ""
                    )}
                  </td>
                ))}
                {aksiIs && ( // Render kolom aksi hanya jika aksiIs adalah false
                  <td
                    className="text-center align-middle"
                    style={{ minWidth: "5rem" }}
                  >
                    {typeof actions === "function"
                      ? actions(row).map((action, actionIndex) => (
                          <React.Fragment
                            key={`${action}-${row.Key || rowIndex}`}
                          >
                            {generateActionButton(action, row, row.status)}
                          </React.Fragment>
                        ))
                      : Array.isArray(actions) && actions.length > 0
                      ? actions.map((action, actionIndex) => (
                          <React.Fragment
                            key={`${action}-${row.Key || rowIndex}`}
                          >
                            {generateActionButton(action, row, row.status)}
                          </React.Fragment>
                        ))
                      : null}
                  </td>
                )}
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
