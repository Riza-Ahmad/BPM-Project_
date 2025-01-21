import React from "react";
import Button from "./Button";

const ScrollToTop = () => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return null;
};

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
        onClick={() => {
          if (pageCurrent > 1) {
            navigation(pageCurrent - 1);
            window.scrollTo(0, 0);
          }
        }}
      />
    );

    if (totalPage <= 2) {
      for (let i = 1; i <= totalPage; i++) {
        pageButtons.push(
          <Button
            key={`page${i}`}
            label={i}
            classType={pageCurrent === i ? "primary" : "light border"}
            onClick={() => {
              navigation(i);
              window.scrollTo(0, 0);
            }}
          />
        );
      }
    } else {
      if (pageCurrent === 1) {
        pageButtons.push(<Button key="page1" label="1" classType="primary" />);
        pageButtons.push(
          <Button
            key="page2"
            label="2"
            classType="light border"
            onClick={() => {
              navigation(2);
              window.scrollTo(0, 0);
            }}
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
            onClick={() => {
              navigation(1);
              window.scrollTo(0, 0);
            }}
          />
        );
        pageButtons.push(<Button key="page2" label="2" classType="primary" />);
        pageButtons.push(
          <Button key="dots1" label="..." classType="light border disabled" />
        );
      } else {
        pageButtons.push(
          <Button key="dots1" label="..." classType="light border disabled" />
        );
        pageButtons.push(
          <Button
            key={`page${pageCurrent - 1}`}
            label={pageCurrent - 1}
            classType="light border"
            onClick={() => {
              navigation(pageCurrent - 1);
              window.scrollTo(0, 0);
            }}
          />
        );
        pageButtons.push(
          <Button
            key={`page${pageCurrent}`}
            label={pageCurrent}
            classType="primary"
          />
        );

        if (pageCurrent < totalPage - 1) {
          pageButtons.push(
            <Button
              key={`page${pageCurrent + 1}`}
              label={pageCurrent + 1}
              classType="light border"
              onClick={() => {
                navigation(pageCurrent + 1);
                window.scrollTo(0, 0); // Scroll to top on page change
              }}
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
        onClick={() => {
          if (pageCurrent < totalPage) {
            navigation(pageCurrent + 1);
            window.scrollTo(0, 0); // Scroll to top on page change
          }
        }}
      />
    );

    return pageButtons;
  }

  return (
    <div className="mt-lg-0 mt-md-0 mt-sm-3 mt-3">
      <ScrollToTop /> {/* Ensure ScrollToTop is included */}
      <div className="input-group">
        {generatePageButton(pageSize, pageCurrent, totalData)}
      </div>
    </div>
  );
}
