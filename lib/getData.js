export async function getData(endpoint) {
  try {
    const response = await fetch(`/api/${endpoint}`, {
      cache: "no-cache",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
