import React, { useState, useEffect } from "react";
import { useFetch } from "../../../../util/useFetch";

const TabContainer = ({ idKategori }) => {
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
      const fetchKategori = async () => {
        setLoading(true);
        try {
          const result = await useFetch(
            `${API_LINK}/MasterKategoriDokumen/GetDataKategoriDokumenHeaderByIdMenu`,
            { idMenu: location.state?.idMenu },
            "POST"
          );
  
          if (result === "ERROR" || result.length === 0) {
            setTabs([]);
          } else {
            const arrResult = Object.values(result);
            setTabs({
              idKdo: arrResult[0].idKdo,
              idMen: arrResult[0].idMen,
              namaKdo: arrResult[0].namaKdo,
              urutanKdo: arrResult[0].urutanKdo,
              parentKdo: arrResult[0].parentKdo,
              statusKdo: arrResult[0].statusKdo,
              createdByKdo: arrResult[0].createdByKdo,
              createdDateKdo: arrResult[0].createdDateKdo,
              modifByKdo: arrResult[0].modifByKdo,
              modifDateKdo: arrResult[0].modifDateKdo,
            });
            setActiveTab(arrResult[0].idKdo);
          }
        } catch (err) {
          setError("Gagal mengambil data: " + err);
        } finally {
          setLoading(false);
        }
      };
      fetchKategori();
    }, [location.state?.idMenu]);


  return (
    <div>
      {/* Tab Navigation with Scrollable Container */}
      <div
        style={{
          maxWidth: "100%",
          overflowX: "auto",
          whiteSpace: "nowrap",
          display: "flex",
        }}
      >
        <ul
          className="nav nav-tabs"
          role="tablist"
          style={{ display: "inline-flex", flexShrink: 0 }}
        >
          {tabs.map((tab) => (
            <li className="nav-item" key={tab.id} style={{ flexShrink: 0 }}>
              <button
                className={`nav-link ${activeTab === tab.id ? "bg-success text-white" : ""}`}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
              >
                {tab.title}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Tab Content */}
      <div className="tab-content mt-3">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab-pane fade ${
              activeTab === tab.id ? "show active" : ""
            }`}
            role="tabpanel"
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabContainer;
