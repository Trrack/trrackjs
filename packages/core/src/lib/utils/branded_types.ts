type Brand<TBrand> = {
  _brand?: TBrand;
};

export type BrandedId<TBase, TBrand> = TBase & Brand<TBrand>;
