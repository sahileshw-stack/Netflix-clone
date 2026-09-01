import axiosInstance from "./axios";

export async function GET(url, config = {}) {
  const response = await axiosInstance.get(
    url,
    config
  );

  return response.data;
}

export async function POST(
  url,
  data = {},
  config = {}
) {
  const response = await axiosInstance.post(
    url,
    data,
    config
  );

  return response.data;
}

export async function PUT(
  url,
  data = {},
  config = {}
) {
  const response = await axiosInstance.put(
    url,
    data,
    config
  );

  return response.data;
}

export async function DELETE(
  url,
  data = {},
  config = {}
) {
  const response = await axiosInstance.delete(
    url,
    {
      data,
      ...config,
    }
  );

  return response.data;
}