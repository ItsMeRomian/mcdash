export default defineEventHandler(async (event) => {
  try {
    const serverFetch = await fetch(
      `${useRuntimeConfig().API_URL}/v1/server/exec`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          key: useRuntimeConfig().API_KEY,
        },
        body: new URLSearchParams(await readBody<{ command: string }>(event)),
      }
    );
    return serverFetch.status === 200;
  } catch (error: any) {
    console.log(error);
    return {
      error: true,
      errormessage: error.message,
    };
  }
});
