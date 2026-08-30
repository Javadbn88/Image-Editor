import * as fabric from 'fabric';

export type ImageFilterId =
  | 'brightness'
  | 'contrast'
  | 'saturation'
  | 'blur'
  | 'grayscale'
  | 'sepia'
  | 'invert';

interface RangeFilterConfig {
  id: 'brightness' | 'contrast' | 'saturation' | 'blur';
  label: string;
  kind: 'range';
  min: number;
  max: number;
  step: number;
}

interface ToggleFilterConfig {
  id: 'grayscale' | 'sepia' | 'invert';
  label: string;
  kind: 'toggle';
}

export type ImageFilterConfig = RangeFilterConfig | ToggleFilterConfig;

export const IMAGE_FILTERS: ImageFilterConfig[] = [
  { id: 'brightness', label: 'Brightness', kind: 'range', min: -1, max: 1, step: 0.05 },
  { id: 'contrast', label: 'Contrast', kind: 'range', min: -1, max: 1, step: 0.05 },
  { id: 'saturation', label: 'Saturation', kind: 'range', min: -1, max: 1, step: 0.05 },
  { id: 'blur', label: 'Blur', kind: 'range', min: 0, max: 1, step: 0.02 },
  { id: 'grayscale', label: 'Grayscale', kind: 'toggle' },
  { id: 'sepia', label: 'Sepia', kind: 'toggle' },
  { id: 'invert', label: 'Invert', kind: 'toggle' },
];

const findFilterIndex = (image: fabric.FabricImage, id: ImageFilterId) => {
  return image.filters.findIndex((filter) => (filter as any).__filterId === id);
};

const buildFilter = (id: ImageFilterId, value: number) => {
  switch (id) {
    case 'brightness':
      return new fabric.filters.Brightness({ brightness: value });
    case 'contrast':
      return new fabric.filters.Contrast({ contrast: value });
    case 'saturation':
      return new fabric.filters.Saturation({ saturation: value });
    case 'blur':
      return new fabric.filters.Blur({ blur: value });
    case 'grayscale':
      return new fabric.filters.Grayscale();
    case 'sepia':
      return new fabric.filters.Sepia();
    case 'invert':
      return new fabric.filters.Invert();
  }
};

export const getImageFilterValue = (image: fabric.FabricImage, id: ImageFilterId): number => {
  const index = findFilterIndex(image, id);
  if (index === -1) return 0;
  const filter = image.filters[index] as any;
  if (id === 'brightness') return filter.brightness;
  if (id === 'contrast') return filter.contrast;
  if (id === 'saturation') return filter.saturation;
  if (id === 'blur') return filter.blur;
  return 1;
};

export const isImageFilterActive = (image: fabric.FabricImage, id: ImageFilterId): boolean => {
  return findFilterIndex(image, id) !== -1;
};

export const setImageFilterValue = (
  image: fabric.FabricImage,
  id: ImageFilterId,
  value: number
) => {
  const filters = image.filters.slice();
  const index = findFilterIndex(image, id);

  if (value === 0) {
    if (index !== -1) filters.splice(index, 1);
  } else {
    const filter = buildFilter(id, value);
    (filter as any).__filterId = id;
    if (index !== -1) filters[index] = filter;
    else filters.push(filter);
  }

  image.filters = filters;
  image.applyFilters();
};

export const toggleImageFilter = (image: fabric.FabricImage, id: ImageFilterId) => {
  const filters = image.filters.slice();
  const index = findFilterIndex(image, id);

  if (index !== -1) {
    filters.splice(index, 1);
  } else {
    const filter = buildFilter(id, 1);
    (filter as any).__filterId = id;
    filters.push(filter);
  }

  image.filters = filters;
  image.applyFilters();
};

export const resetImageFilters = (image: fabric.FabricImage) => {
  image.filters = [];
  image.applyFilters();
};