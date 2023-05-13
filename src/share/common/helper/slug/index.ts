import slugify from 'slugify';

export const generateSlug = (data: string) => {
  const strData = String(data);

  return slugify(strData, {
    replacement: '',
    remove: undefined,
    // lower: true,
    strict: true,
    locale: 'vi',
    trim: true,
  });
};
