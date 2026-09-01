import axiosInstance from "./axios";


export async function GET(
  url,
  config = {}
) {
  const response =
    await axiosInstance.get(
      url,
      config
    );

  return response.data;
}


export async function POST(
  url,
  body = {},
  config = {}
) {
  const response =
    await axiosInstance.post(
      url,
      body,
      config
    );

  return response.data;
}


export async function PUT(
  url,
  body = {},
  config = {}
) {
  const response =
    await axiosInstance.put(
      url,
      body,
      config
    );

  return response.data;
}


export async function PATCH(
  url,
  body = {},
  config = {}
) {
  const response =
    await axiosInstance.patch(
      url,
      body,
      config
    );

  return response.data;
}


export async function DELETE(
  url,
  config = {}
) {
  const response =
    await axiosInstance.delete(
      url,
      config
    );

  return response.data;
}