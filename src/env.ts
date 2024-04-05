export const defaultRevalidate = () => {
  const revalidateEnv = process.env.DEFAULT_REVALIDATE;
  return revalidateEnv ? parseInt(revalidateEnv) : 86400;
};
