import Button from "./Button";

export default function Paging({
  pageSize,
  pageCurrent,
  totalData,
  navigation,
}) {
  function generatePageButton(pageSize, pageCurrent, totalData) {
    const totalPage = Math.ceil(totalData / pageSize);
    let pageButtons = [];

    // Tombol "Sebelumnya"
    pageButtons.push(
      <Button
        key="previous"
        label="Sebelumnya"
        classType={pageCurrent > 1 ? "light border" : "light border disabled"}
        onClick={() => pageCurrent > 1 && navigation(pageCurrent - 1)}
      />
    );

    // Menampilkan halaman
    if (totalPage <= 2) {
      // Jika total halaman kurang dari atau sama dengan 2, tampilkan semua
      for (let i = 1; i <= totalPage; i++) {
        pageButtons.push(
          <Button
            key={`page${i}`}
            label={i}
            classType={pageCurrent === i ? "primary" : "light border"}
            onClick={() => navigation(i)}
          />
        );
      }
    } else {
      // Untuk halaman saat ini 1
      if (pageCurrent === 1) {
        pageButtons.push(<Button key="page1" label="1" classType="primary" />);
        pageButtons.push(
          <Button
            key="page2"
            label="2"
            classType="light border"
            onClick={() => navigation(2)}
          />
        );
        pageButtons.push(
          <Button key="dots1" label="..." classType="light border disabled" />
        );
      }

      // Untuk halaman saat ini 2
      else if (pageCurrent === 2) {
        pageButtons.push(
          <Button
            key="page1"
            label="1"
            classType="light border"
            onClick={() => navigation(1)}
          />
        );
        pageButtons.push(<Button key="page2" label="2" classType="primary" />);
        pageButtons.push(
          <Button key="dots1" label="..." classType="light border disabled" />
        );
      }

      // Untuk halaman saat ini 3 atau lebih
      else {
        pageButtons.push(
          <Button key="dots1" label="..." classType="light border disabled" />
        );
        pageButtons.push(
          <Button
            key={`page${pageCurrent - 1}`}
            label={pageCurrent - 1}
            classType="light border"
            onClick={() => navigation(pageCurrent - 1)}
          />
        );
        pageButtons.push(
          <Button
            key={`page${pageCurrent}`}
            label={pageCurrent}
            classType="primary"
          />
        );

        // Jika tidak berada di halaman terakhir
        if (pageCurrent < totalPage - 1) {
          pageButtons.push(
            <Button
              key={`page${pageCurrent + 1}`}
              label={pageCurrent + 1}
              classType="light border"
              onClick={() => navigation(pageCurrent + 1)}
            />
          );

          // Jika tidak berada di halaman terakhir, tampilkan "..."
          if (pageCurrent < totalPage - 2) {
            pageButtons.push(
              <Button
                key="dots2"
                label="..."
                classType="light border disabled"
              />
            );
          }
        }
      }
    }

    // Tombol "Selanjutnya"
    pageButtons.push(
      <Button
        key="next"
        label="Selanjutnya"
        classType={
          pageCurrent < totalPage ? "light border" : "light border disabled"
        }
        onClick={() => pageCurrent < totalPage && navigation(pageCurrent + 1)}
      />
    );

    return pageButtons;
  }

  return (
    <div className="mt-lg-0 mt-md-0 mt-sm-3 mt-3">
      <div className="input-group">
        {generatePageButton(pageSize, pageCurrent, totalData)}
      </div>
    </div>
  );
}
