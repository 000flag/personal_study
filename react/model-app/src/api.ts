import { Model, ModelSearchResponse, Photo } from './types';

export async function fetchModels(page: number = 0): Promise<ModelSearchResponse> {
  const res = await fetch(`/api/model/search?page=${page}`);
  const data = await res.json();
  data.data.content = data.data.content.map((item: any) => ({
    ...item,
    picSubmission: JSON.parse(item.picSubmission)
  }));
  return data;
}

export async function updateModelStatus(model: Model): Promise<void> {
  await fetch('/api/model', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(model),
  });
}

export async function fetchPhotos(ids: string[]): Promise<Photo[]> {
  const photos: Photo[] = [];
  for (const id of ids) {
    const res = await fetch(`/api/search?id=${id}`);
    const d = await res.json();
    if (d.data && d.data.content) {
      photos.push(...d.data.content);
    }
  }
  return photos;
}