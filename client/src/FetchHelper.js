async function Call(baseUri, useCase, dtoIn, method, headers = {}) {
  const useMock = process.env.REACT_APP_USE_MOCK;

  if (useMock === "true") {
    const mockBaseUri = "/mock"; // Mock data base URI in the public directory
    const mockUrl = `${mockBaseUri}/${useCase}${
      dtoIn?.id ? `_${dtoIn.id}` : ""
    }.json`;
    console.log(`Fetching mock data from: ${mockUrl}`); // Debugging log
    const response = await fetch(mockUrl);
    let data;
    try {
      data = await response.json();
    } catch (error) {
      console.error("Failed to parse mock response as JSON:", error);
      data = null;
    }
    return { ok: response.ok, data };
  } else {
    let response;
    const url = `${baseUri}/${useCase}${dtoIn ? `?id=${dtoIn.id}` : ""}`;
    console.log(`Fetching real data from: ${url} with method: ${method}`); // Debugging log
    if (!method || method === "get") {
      response = await fetch(url, { headers });
    } else {
      response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify(dtoIn),
      });
    }
    const text = await response.text();
    console.log(`Response text: ${text}`); // Debugging log
    try {
      const data = JSON.parse(text);
      return { ok: response.ok, data };
    } catch (error) {
      console.error("Failed to parse response as JSON:", error);
      return { ok: false, data: text };
    }
  }
}

function FetchHelper() {
  const baseUri = "http://localhost:8000";

  return {
    shoppingList: {
      get: async (dtoIn, userId) => {
        return await Call(baseUri, "shopL/get", dtoIn, "get", {
          "x-user-id": userId,
        });
      },
      create: async (dtoIn, userId) => {
        return await Call(baseUri, "shopL/create", dtoIn, "post", {
          "x-user-id": userId,
        });
      },
      update: async (dtoIn, userId) => {
        return await Call(baseUri, "shopL/update", dtoIn, "post", {
          "x-user-id": userId,
        });
      },
      delete: async (dtoIn, userId) => {
        return await Call(baseUri, "shopL/delete", dtoIn, "post", {
          "x-user-id": userId,
        });
      },
      list: async () => {
        return await Call(baseUri, "shopL/list", null, "get");
      },
      archive: async (dtoIn, userId) => {
        return await Call(baseUri, "shopL/archive", dtoIn, "post", {
          "x-user-id": userId,
        });
      },
      addItem: async (dtoIn, userId) => {
        return await Call(baseUri, "shopL/item/create", dtoIn, "post", {
          "x-user-id": userId,
        });
      },
      deleteItem: async (dtoIn, userId) => {
        return await Call(baseUri, "shopL/item/delete", dtoIn, "post", {
          "x-user-id": userId,
        });
      },
      updateItem: async (dtoIn, userId) => {
        return await Call(baseUri, "shopL/item/update", dtoIn, "post", {
          "x-user-id": userId,
        });
      },
      listItem: async (dtoIn) => {
        return await Call(baseUri, "shopL/item/list", dtoIn, "get");
      },
      statusItem: async (dtoIn, userId) => {
        return await Call(baseUri, "shopL/item/status", dtoIn, "post", {
          "x-user-id": userId,
        });
      },
      addMember: async (dtoIn, userId) => {
        return await Call(baseUri, "shopL/addMember", dtoIn, "post", {
          "x-user-id": userId,
        });
      },
      removeMember: async (dtoIn, userId) => {
        return await Call(baseUri, "shopL/removeMember", dtoIn, "post", {
          "x-user-id": userId,
        });
      },
    },
  };
}

export default FetchHelper;
