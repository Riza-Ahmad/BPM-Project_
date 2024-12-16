export const useFetch = async (url, param = {}, method = "POST") => {
  let response;
  let activeUser = "User Sementara";

  try {
    if (method === "POST") {
      const paramToSend = {
        ...param,
        activeUser: activeUser,
      };

      response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(paramToSend),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else if (method === "GET") {
      response = await fetch(url);
    }

    const result = await response.json();
    if (response.ok) {
      return result;
    } else {
      return "ERROR";
    }
  } catch (err) {
    console.error("Fetch error:", err);
    return "ERROR";
  }
};
