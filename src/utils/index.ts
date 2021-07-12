export const checkLogin = (permits: any) =>
    (process.env.NODE_ENV === 'production' && !!permits) || process.env.NODE_ENV === 'development';
